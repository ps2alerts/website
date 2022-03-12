<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Map</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div class="h-full flex items-center place-content-center">
      <client-only>
      <l-map ref="map" style="height: 768px" 
        :zoom="zoom" 
        :center="center" 
        :minZoom="minZoom" 
        :maxZoom="maxZoom"
        :bounds="bounds"
        :maxBounds="maxBounds"
        :maxBoundsViscosity="viscosity"
        :crs="crs">
        <l-tile-layer :url="url"></l-tile-layer>
      </l-map>
      </client-only>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { MapDrawingInterface, worldToMap, LatLng, mapToWorld,  } from '~/interfaces/mapping/MapDrawingInterface';
import { MAP_FACTION_COLORS, MAP_LINK_COLORS, MAP_CUTOFF_COLORS } from '@/constants/FactionMapColors';
import { Zone, ZoneHexSize } from '@/constants/Zone';
import ApiRequest from '@/api-request';
import MapRegionDataRequest from '@/libraries/MapRegionDataRequest';
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface';
import { Endpoints } from '~/constants/Endpoints';
import zoneNameFilter from '~/filters/ZoneName';
import { FacilityType } from '~/constants/FacilityType';
import factionName from '~/filters/FactionName';
import { MapRegion } from '~/libraries/MapRegion';
import { Faction } from '~/constants/Faction';
import { CubeHex } from '~/libraries/CubeHex';
import { FacilityBadge } from '~/interfaces/FacilityBadge';
// import { InstanceFactionCombatAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceFactionCombatAggregateResponseInterface'

export default Vue.extend({
  name: 'AlertMap',
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true,
    },
  },
  data() {
    return {
      error: null,
      loaded: false,
      updateRate: 10000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      lastUpdated: new Date(0),
      interval: undefined as undefined | number,
      zoom: 2,
      center: [0, 0],
      markerLatLng: [-256, 256],
      url: "https://assets.ps2alerts.com/zones/" + zoneNameFilter(this.alert.zone).toLowerCase() + "/{z}/tile_{x}_{y}.png",
      minZoom: 2,
      maxZoom: 5,
      bounds: [[0, 0], [-250, 250]],
      maxBounds: [[0, 0], [-250, 250]],
      viscosity: 1.0,
      noWrap: true,
      mapDraw: {} as MapDrawingInterface,
      map: {} as L.Map,
      crs: this.$L.extend({}, this.$L.CRS.Simple, {wrapLng: [0, 256]}),
      polys: this.$L.featureGroup([], {
        pane: "hexPane"
      }),
      polyStamps: {} as Record<number, number>,
      links: this.$L.featureGroup([], {
        pane: "linkPane"
      }),
      linkStamps: {} as Record<string, number>,
      badges: this.$L.featureGroup([], {
        pane: "badgePane"
      }),
      baseSVG: undefined as HTMLElement | SVGElement | undefined,
      // data: {} as InstanceFactionCombatAggregateResponseInterface,
    }
  },
  computed: {
    updateCountdownPercent(): number {
      return (100 / (this.updateRate / 1000)) * this.updateCountdown
    },
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
        this.clearTimers()
        this.pull()
      }
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
  },
  mounted(){
    this.$nextTick(() => {
      this.init()
      this.loadRegions().then(() => {
        this.pull()
      });
    });
  },
  methods: {
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    init(): void {
      this.map = this.$refs["map"]?.mapObject as L.Map;
      this.map.createPane("hexPane", this.map.getPane("overlayPane"));
      this.map.createPane("linkPane", this.map.getPane("overlayPane"));
      this.map.createPane("badgePane", this.map.getPane("overlayPane"));
      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)
      
        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    color(facility_id: number): string {
      return MAP_FACTION_COLORS[this.mapDraw[facility_id].faction].toString();
    },
    cutoffColor(facility_id: number): string {
      return MAP_CUTOFF_COLORS[this.mapDraw[facility_id].faction].toString();
    },
    alpha(facility_id: number): number {
      return MAP_FACTION_COLORS[this.mapDraw[facility_id].faction].a;
    },
    badge(region: MapRegion): FacilityBadge {
      if(!this.baseSVG || region.badge.type !== FacilityType.DEFAULT){
        return region.badge;
      }
      var badgeSVG = this.baseSVG.cloneNode(true) as HTMLElement;
      var badgeBackground = document.createElementNS("http://www.w3.org/2000/svg", "use");
      badgeBackground.setAttribute("href", "#facility-bg");
      badgeBackground.setAttribute("class", region.id.toString());
      badgeBackground.setAttribute("fill", MAP_FACTION_COLORS[region.faction].toString());
      badgeSVG.appendChild(badgeBackground);
      var badgeForeground = document.createElementNS("http://www.w3.org/2000/svg", "use");
      badgeForeground.setAttribute("href", FacilityBadge.SVGDefinitionName(region.facilityType));
      badgeSVG.appendChild(badgeForeground);
      var icon = this.$L.divIcon({
        html: badgeSVG,
        className: "facility-badge",
        iconSize: [
          FacilityBadge.radius(region.facilityType) * 2, 
          FacilityBadge.radius(region.facilityType) * 2
          ],
        pane: "badgePane"
      });
      var marker = this.$L.marker(worldToMap(region.badgeLocation.asArray()), {
        pane: "badgePane",
        icon: icon,
        
      }).addTo(this.badges);
      return new FacilityBadge(region.facilityType, this.$L.stamp(marker));
    },
    outline(facility_id: number): LatLng[] {
      var to_return: LatLng[] = [];
      this.mapDraw[facility_id].outline().forEach((point: number[]) => {
        to_return.push(worldToMap(point));
      });
      return to_return;
    },
    warpgate(faction: Faction): MapRegion {
      return Object.values(this.mapDraw).find((region: MapRegion) => {
        return region.facilityType === FacilityType.WARPGATE &&region.faction === faction;
      });
    },
    cutoff(facility: MapRegion): boolean {
      if(facility.facilityType == FacilityType.WARPGATE){
        return false;
      }
      var frontier = [this.warpgate(facility.faction)];
      var visited: MapRegion[] = [];
      while(frontier.length !== 0){
        var curr = frontier.pop();
        if(!curr){
          return false;
        }
        if(curr.id === facility.id){
          return false;
        }
        Object.keys(this.linkStamps).forEach((pair) => {
          if(pair.includes("bg")){
            return;
          }
          var facilities = pair.split(" ").map((val) => parseInt(val));
          if(!(facilities[0] === curr?.id || facilities[1] === curr?.id))
            return;
          var connection = facilities[0] === curr?.id ? this.mapDraw[facilities[1]] : this.mapDraw[facilities[0]];
          var wasVisited = visited.find((region) => { return region.id === connection.id; });
          if (wasVisited){
            return;
          }
          if(connection.faction === facility.faction){
            frontier.push(connection);
          }
        });
        visited.push(curr);
      }
      return true;
    },
    updateCutoffs(): void {
      Object.values(this.mapDraw).forEach((region: MapRegion) => {
        region.setCutoff(this.cutoff(region));
      });
    },
    updateLinks(facility: number){
      Object.entries(this.linkStamps).forEach((linkEntry) => {
        // Only look at foreground links
        if(linkEntry[0].includes("bg")){
          return;
        }

        // If this link isn't connected to the facility we're interested in, exit early
        var facility_ids = linkEntry[0].split(" ").map((num) => parseInt(num));
        if(!(facility_ids[0] == facility || facility_ids[1] == facility)){
          return;
        }
        
        var link = (<L.Polyline | undefined>this.links.getLayer(linkEntry[1]));
        var bglink = (<L.Polyline | undefined>this.links.getLayer(this.linkStamps["bg" + linkEntry[0]]));
        
        // Both factions match, set friendly color and hide bglink
        if(this.mapDraw[facility_ids[0]].faction === this.mapDraw[facility_ids[1]].faction){
          link?.setStyle({
            color: MAP_LINK_COLORS[this.mapDraw[facility_ids[0]].faction]?.toString(),
            opacity: MAP_LINK_COLORS[this.mapDraw[facility_ids[0]].faction]?.a,
            dashArray: [],
          });
          bglink?.setStyle({
            opacity: 0.0
          });
        }
        // Disabled, just put an NS link there since it doesn't make it seem capturable
        else if(this.mapDraw[facility_ids[0]].faction === Faction.NONE || this.mapDraw[facility_ids[1]].faction === Faction.NONE){
          link?.setStyle({
            color: MAP_LINK_COLORS[Faction.NONE]?.toString(),
            opacity: MAP_LINK_COLORS[Faction.NONE]?.a,
            dashArray: [],
          });
          bglink?.setStyle({
            opacity: 0.0
          });
        }
        // Enemy factions, set capturable color, dashes, and enable bglink
        else {
          link?.setStyle({
            color: MAP_LINK_COLORS[4]?.toString(),
            dashArray: "5 5"
          });
          bglink?.setStyle({
            opacity: MAP_LINK_COLORS[5]?.a,
            dashArray: "5 5",
            dashOffset: "5"
          });
        }
      });
    },
    async pull(): Promise<void> {
        if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
          return
        }
      
        console.log('AlertMap.pull', this.alert.instanceId)
        var capture = false;
        await new ApiRequest()
          .get<InstanceFacilityControlEntriesResponseInterface[]>(
            Endpoints.INSTANCE_FACILITY_CONTROL_ENTRIES.replace(
              '{instance}',
              this.alert.instanceId
                ? this.alert.instanceId.toString()
                : 'whatever'
            )
          )
          .then((result) => {
            result.reverse().forEach((controlEvent) => {
              if (this.loaded && controlEvent.isInitial) {
                return;
              }
              
              if (this.loaded && this.lastUpdated > new Date(controlEvent.timestamp)){
                return;
              }

              if (controlEvent.isDefence) {
                return;
              }

              this.mapDraw[controlEvent.facility].faction = controlEvent.newFaction;
              capture = true;
              this.updateLinks(controlEvent.facility);
              var badgeBackground = (<L.Marker | undefined>this.badges.getLayer(this.mapDraw[controlEvent.facility].badge.markerStamp));
              if(!badgeBackground)
                return;
              (<HTMLElement>(<L.DivIcon>badgeBackground.getIcon()).options.html).getElementsByClassName(controlEvent.facility.toString())[0].setAttribute("fill", MAP_FACTION_COLORS[controlEvent.newFaction].toString());
            });
            if(capture){
              this.updateCutoffs();
            }
            this.loaded = true
            var now = new Date();
            this.lastUpdated = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
            this.updateCountdown = this.updateRate / 1000
          })
          .then(() => {
            Object.values(this.mapDraw).forEach((region: MapRegion) => {
              var polygon = (<L.Polygon | undefined>this.polys.getLayer(this.polyStamps[region.id]));
              polygon?.setStyle({
                  fillColor: region.isCutoff() ? this.cutoffColor(region.id) : this.color(region.id),
                  fillOpacity: this.alpha(region.id) + (region.isCutoff() ? 0.4 : 0),
              });

              polygon?.setTooltipContent(
                this.mapDraw[region.id].name + "<br/>" + 
                factionName(this.mapDraw[region.id].faction) + 
                (this.mapDraw[region.id].isCutoff() ? "<br/>Cut Off!" : "")
              );
            });
          })
          .catch((e) => {
            this.error = e.message
          });
        
    },
    async loadRegions(): Promise<void> {
      if (Object.keys(this.mapDraw).length !== 0) {
        return;
      }

      this.map.on("click", (e: L.LeafletMouseEvent) => {
        var worldcoord = mapToWorld([e.latlng.lat, e.latlng.lng]);
        console.log(worldcoord);
        console.log(CubeHex.fromWorld(worldcoord.x, worldcoord.z, ZoneHexSize(this.alert.zone)));
      });

      const regions = await new MapRegionDataRequest()
        .pull(this.alert.zone ? this.alert.zone : Zone.INDAR);
      
      await this.$axios.get(require("~/assets/img/facility-icon.svg"), {baseURL: this.$config.baseUrl})
        .then((response) => {
          if(response.status < 200 || response.status > 299){
            console.error("Could not load facility icons!");
            console.error(response.status.toString() + " " + response.statusText);
            return;
          }
          var parser = new DOMParser();
          this.baseSVG = parser.parseFromString(response.data, "image/svg+xml").documentElement;
        }).catch((reason) => {
          console.error("Could not load facility icons!");
          console.error(reason);
        });

      this.$L.Icon.Default.prototype.options.iconAnchor = [0, 0];
      this.$L.Icon.Default.prototype.options.tooltipAnchor = [0, 0];
      regions.forEach((region) => {
        this.mapDraw[region.id] = region;
        var polygon = this.$L.polygon(this.outline(region.id), {
          fillColor: this.color(region.id),
          fillOpacity: this.alpha(region.id),
          color: "#000000",
          weight: 2,
          lineCap: 'butt',
          className: "map-region",
          pane: "hexPane"
        }).on("mouseover", (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: "#FFFFFF"
          });
          e.target.bringToFront();
        }).on("mouseout", (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: "#000000"
          });
          this.links.bringToFront();
        }).bindTooltip(region.name);

        this.polyStamps[region.id] = this.$L.stamp(polygon);

        this.polys.addLayer(polygon);
      });

      regions.forEach((region) => {
        region.connections.forEach((connection) => {
          var link = this.$L.polyline([
            worldToMap(region.badgeLocation.asArray()), 
            worldToMap(connection.badgeLocation.asArray())
            ], {
              weight: 2,
              color: '#FFFFFF',
              opacity: 0.6,
              pane: "linkPane"
            });
          this.linkStamps[region.id.toString() + " " + connection.id.toString()] = this.$L.stamp(link);
          
          var bglink = this.$L.polyline([
            worldToMap(region.badgeLocation.asArray()), 
            worldToMap(connection.badgeLocation.asArray())
            ], {
              weight: 2,
              color: MAP_LINK_COLORS[5]?.toString(),
              opacity: 0.0,
              pane: "linkPane",
            });
            this.linkStamps["bg" + region.id.toString() + " " + connection.id.toString()] = this.$L.stamp(bglink);

            this.links.addLayer(bglink);
            this.links.addLayer(link);
        });
        region.badge = this.badge(region);
      });
    
      this.polys.addTo(this.map);
      this.links.addTo(this.map);
      this.badges.addTo(this.map);
    },
  },
})
</script>
