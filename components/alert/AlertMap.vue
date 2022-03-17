<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Map</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <v-row style="height: 870px; flex-direction:row;" class="d-flex">
      <v-col cols="12" lg="9">
        <div class="flex items-center place-content-center">
          <client-only>
          <l-map class="map" ref="map" style="height: 768px" 
            :zoom="zoom" 
            :center="center" 
            :minZoom="minZoom" 
            :maxZoom="maxZoom"
            :zoomSnap="zoomSnap"
            :zoomDelta="zoomDelta"
            :crs="crs">
            <l-tile-layer :url="url">
            </l-tile-layer>
          </l-map>
          </client-only>
        </div>
      </v-col>
      <v-col lg="3" class="timeline">
        <client-only>
        <v-subheader dark>Alert Capture Timeline (Base, Capturing Outfit, Overall Territory Control)</v-subheader>
        <v-timeline dark dense>
          <v-timeline-item
            right
            v-for="(captureIndex, index) in captureIndices.slice().reverse()"
            :key="index"
            :color="factionColor(historyCache[historyCache.length - captureIndex - 1].newFaction)"
            fill-dot
            >
            <template v-slot:icon><div v-html="facilityIconSvg(captureIndex)"></div></template>
            <template v-slot:opposite>{{historyCache[historyCache.length - captureIndex - 1].timestamp | dateTimeFormatShort }}</template>
            <div>
            <v-card
            @click="historyIndexCallback(captureIndices.length - index)">
              <v-card-subtitle>
              {{ mapDraw[historyCache[historyCache.length - captureIndex - 1].facility].name }}
              </v-card-subtitle>
              <v-card-text class="captureOutfit">
                Captured by {{capturingOutfitTag(captureIndex)}}<br/>from {{controlData(captureIndex).loser}}
              </v-card-text>
              <div>
                <FactionSegmentBar
                  v-if="controlData(captureIndex).mapControl"
                    :vs="mapControlData(captureIndex).vs"
                    :nc="mapControlData(captureIndex).nc"
                    :tr="mapControlData(captureIndex).tr"
                    :other="mapControlData(captureIndex).cutoff"
                    :out-of-play="mapControlData(captureIndex).outOfPlay"
                    dropoff-percent="15"
                ></FactionSegmentBar>
                <span v-if="!controlData(captureIndex).mapControl">Awaiting data...</span>
              </div>
            </v-card>
            </div>
          </v-timeline-item>
        </v-timeline>
        </client-only>
      </v-col>
      <v-col cols="12">
      <v-slider 
        ref="history"
        tick-size="5"
        ticks="always"
        :tick-labels="tickLabels"
        append-icon="mdi-update"
        prepend-icon="mdi-history"
        :max="sliderMax"
        v-model="sliderVal"
        dark
        @change="historyCallback"
        @click:prepend="decrementSlider"
        @click:append="incrementSlider"
        ></v-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LMap } from 'vue2-leaflet';
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface';
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
import { MapRegion } from '~/libraries/MapRegion';
import { Faction } from '~/constants/Faction';
import { CubeHex } from '~/libraries/CubeHex';
import { FacilityBadge } from '~/interfaces/FacilityBadge';
import factionShortName from '~/filters/FactionShortName';
import factionCircleEmoji from '~/filters/FactionCircleEmoji';
import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface';
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface';

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
      center: [-128, 128],
      url: "https://assets.ps2alerts.com/zones/" + zoneNameFilter(this.alert.zone).toLowerCase() + "/{z}/tile_{x}_{y}.png",
      minZoom: 2,
      maxZoom: 5,
      zoomSnap: 1,
      zoomDelta: 1,
      bounds: [[0, 0], [-250, 250]],
      maxBounds: [[0, 0], [-250, 250]],
      viscosity: 0.1,
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
      textBadges: this.$L.featureGroup([], {
        pane: "badgeTextPane"
      }),
      currentIndex: -1,
      captureIndices: [] as number[],
      tickLabels: [] as string[],
      oldSliderVal: 0,
      sliderVal: 0,
      sliderMax: 0,
      historyCache: [] as InstanceFacilityControlEntriesResponseInterface[],
      outfitData: new Map<string, InstanceOutfitAggregateResponseInterface>(),
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
    setTimers() {
      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)
      
        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    init(): void {
      this.map = (<LMap>this.$refs["map"]).mapObject as L.Map;
      this.map.createPane("hexPane", this.map.getPane("overlayPane"));
      this.map.createPane("linkPane", this.map.getPane("overlayPane"));
      this.map.createPane("badgePane", this.map.getPane("overlayPane"));
      this.map.createPane("badgeTextPane", this.map.getPane("overlayPane"));
      this.map.on('drag', () => {
        this.map.fitBounds(this.map.getBounds());
      });
      this.setTimers();
    },
    color(facility_id: number): string {
      return MAP_FACTION_COLORS[this.mapDraw[facility_id].faction].toString();
    },
    factionColor(faction: Faction){
      return MAP_FACTION_COLORS[faction].toString();
    },
    cutoffColor(facility_id: number): string {
      return MAP_CUTOFF_COLORS[this.mapDraw[facility_id].faction].toString();
    },
    alpha(facility_id: number): number {
      return MAP_FACTION_COLORS[this.mapDraw[facility_id].faction].a;
    },
    facilityIconSvg(captureIndex: number): string {
      var reverseIndex = this.historyCache.length - captureIndex - 1;
      var controlEvent = this.historyCache[reverseIndex];
      var faction = controlEvent.newFaction;
      var badge = this.mapDraw[controlEvent.facility].badge;
      return badge.getIcon(faction).outerHTML;
    },
    capturingOutfitTag(captureIndex: number): string {
      var outfitId = this.historyCache[this.historyCache.length - captureIndex - 1].outfitCaptured;
      if(outfitId){
        var outfitAggregate = this.outfitData.get(outfitId);
        if(outfitAggregate && outfitAggregate.outfit.tag){
          return "[" + outfitAggregate.outfit.tag + "]";
        } else if(outfitAggregate) {
          return outfitAggregate.outfit.name
        }
      }
      return factionShortName(this.historyCache[this.historyCache.length - captureIndex - 1].newFaction);
    },
    controlData(captureIndex: number): InstanceFacilityControlEntriesResponseInterface & { loser: string } {
      var loser = factionShortName(this.historyCache[this.historyCache.length - captureIndex - 1].oldFaction)
      return { ...this.historyCache[this.historyCache.length - captureIndex - 1], loser: loser };
    },
    mapControlData(captureIndex: number): MapControlInterface {
      var mapControl = this.historyCache[this.historyCache.length - captureIndex - 1].mapControl
      if(!mapControl){
        return {
          vs: 33,
          nc: 33,
          tr: 33,
          cutoff: 0,
          outOfPlay: 0,
        }
      }
      return mapControl;
    },
    badge(region: MapRegion): FacilityBadge {
      // If the facility type is not given or the badge is already built, just return it
      if(region.badge.ready()){
        return region.badge;
      }

      var indicator = this.$L.marker(worldToMap(region.badgeLocation.asArray()), {
        pane: "badgePane",
        bubblingMouseEvents: true,
        riseOnHover: true
      });
      var indicatorText = this.$L.marker(worldToMap(region.badgeLocation.asArray()), {
        pane: "badgeTextPane",
        bubblingMouseEvents: true,
        riseOnHover: true
      });

      var badge = new FacilityBadge(region, this.$L.stamp(indicator), this.$L.stamp(indicatorText));
      var icon = this.$L.divIcon({
        html: badge.getSVG() as unknown as HTMLElement,
        className: "facility-badge",
        iconSize: [badge.getSize().x, badge.getSize().z],
        pane: "badgePane"
      });
      var text = this.$L.divIcon({
        html: badge.getText() as unknown as HTMLElement,
        className: "facility-badge",
        iconSize: [badge.getTextSize().x, badge.getTextSize().z],
        pane: "badgeTextPane"
      });

      indicator.setIcon(icon).addTo(this.badges);
      indicatorText.setIcon(text).addTo(this.textBadges);
      return badge;
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
    decrementSlider(){
      if(this.sliderVal == 0){
        return;
      }
      this.historyCallback(this.sliderVal - 1);
    },
    incrementSlider(){
      if(this.sliderVal == this.captureIndices.length){
        return;
      }
      this.historyCallback(this.sliderVal + 1);
    },
    resetLimit(): void {
      this.currentIndex = -1;
    },
    historyIndexCallback(captureIndex: number): void {
      if(!this.loaded){
        return;
      }
      this.oldSliderVal = captureIndex;
      this.historyCallback(captureIndex);
    },
    historyCallback(value: number): void {
      this.sliderVal = value;
      var reverse = this.oldSliderVal > this.sliderVal;
      this.oldSliderVal = this.sliderVal;
      if(value >= this.captureIndices.length){
        this.resetLimit();
      }
      //Force an update when returning to the latest capture
      var forceUpdate = false;
      if(value >= this.captureIndices.length){
        forceUpdate = true;
      }

      var capture = this.updateTerritory(
        // Copy the history since updateTerritory reverses the provided list
        Object.assign([], this.historyCache), 
        forceUpdate ? undefined : value, 
        forceUpdate,
        reverse
      );
      if(capture){
        this.updateCutoffs();
      }
    },
    updateTerritory(result: InstanceFacilityControlEntriesResponseInterface[], indexLimit: number | undefined, force = false, reverse = false): boolean {
      var capture = false;
      if(indexLimit){
        this.currentIndex = 0;
      }
      var lastCaptureEvent = result.find((event) => { return !event.isDefence });
      result.reverse().forEach((controlEvent, index, eventArray) => {

        // If the map has already loaded and we've already seen this event, return, unless we've limited the capture history.
        // If it is limited, we rerun the alert capture history to get to the requested capture.
        if (!force && this.loaded 
            && (controlEvent.isInitial || this.lastUpdated > new Date(controlEvent.timestamp)) 
            && (this.currentIndex === -1 || this.currentIndex > index)) {
          return;
        }
        
        if (controlEvent.isDefence) {
          return;
        }
        if((this.currentIndex == -1 && indexLimit === undefined) || (indexLimit !== undefined && index < this.captureIndices[indexLimit])){
          this.mapDraw[controlEvent.facility].faction = controlEvent.newFaction;
          capture = true;
          this.updateLinks(controlEvent.facility);
          var badge = this.mapDraw[controlEvent.facility].badge;
          badge.update(this.map.getZoom());
          if(indexLimit && (index == this.captureIndices[indexLimit - 1]) || controlEvent.timestamp == lastCaptureEvent?.timestamp){
            var facility = (reverse && indexLimit) ? eventArray[this.captureIndices[indexLimit]].facility : controlEvent.facility;
            var polygon = (<L.Polygon | undefined>this.polys.getLayer(this.polyStamps[facility]));
            polygon?.getElement()?.classList.add("captured");
            polygon?.bringToFront();
            setTimeout(() => {
              polygon?.getElement()?.classList.remove("captured");
            }, 1000);
          }
          if(indexLimit){
            this.currentIndex = index
          }
        }
        if(!controlEvent.isInitial && !this.captureIndices.includes(index)){
          if(this.captureIndices.length == 0 && index > 0){
            this.tickLabels.push(factionCircleEmoji(eventArray[index - 1].newFaction));
          }
          this.captureIndices.push(index);
          this.tickLabels.push(factionCircleEmoji(controlEvent.newFaction));
          this.sliderMax = this.captureIndices.length;
          if(this.currentIndex == -1){
            this.sliderVal = this.sliderMax;
            this.oldSliderVal = this.sliderVal;
          }
        }
      });
      return capture;
    },
    updateCutoffs(): void {
      Object.values(this.mapDraw).forEach((region: MapRegion) => {
        region.setCutoff(this.cutoff(region));
        var polygon = (<L.Polygon | undefined>this.polys.getLayer(this.polyStamps[region.id]));
        polygon?.setStyle({
            fillColor: region.isCutoff() ? this.cutoffColor(region.id) : this.color(region.id),
            fillOpacity: this.alpha(region.id) + (region.isCutoff() ? 0.4 : 0),
        });
        
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
            color: MAP_LINK_COLORS[Faction.NONE].toString(),
            opacity: MAP_LINK_COLORS[Faction.NONE].a,
            dashArray: [],
          });
          bglink?.setStyle({
            opacity: 0.0
          });
        }
        // Warpgate's ain't capturable
        else if(this.mapDraw[facility_ids[0]].facilityType === FacilityType.WARPGATE || this.mapDraw[facility_ids[1]].facilityType === FacilityType.WARPGATE){
          link?.setStyle({
            color: MAP_LINK_COLORS[0].toString(),
            dashArray: "5 5"
          });
          bglink?.setStyle({
            color: MAP_LINK_COLORS[6].toString(),
            opacity: MAP_LINK_COLORS[6].a,
            dashArray: "5 5",
            dashOffset: "5"
          });
        }
        // Enemy factions, set capturable color, dashes, and enable bglink
        else {
          link?.setStyle({
            color: MAP_LINK_COLORS[4].toString(),
            dashArray: "5 5"
          });
          bglink?.setStyle({
            color: MAP_LINK_COLORS[5].toString(),
            opacity: MAP_LINK_COLORS[5].a,
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

        this.outfitData = await this.pullOutfitData(
          this.alert.instanceId ?? "12345"
        )
      
        console.log('AlertMap.pull', this.alert.instanceId)
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
            // Copy the history since updateTerritory reverses the provided list
            this.historyCache = Object.assign([], result);
            var capture = this.updateTerritory(result, undefined);
            if(capture){
              this.updateCutoffs();
            }
            this.loaded = true
            var now = new Date();
            this.lastUpdated = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()));
            this.updateCountdown = this.updateRate / 1000
          })
          .catch((e) => {
            this.error = e.message
          });
        
    },
    async pullOutfitData(
      instanceId: string
    ): Promise<Map<string, InstanceOutfitAggregateResponseInterface>> {
      const newMap = new Map<string, InstanceOutfitAggregateResponseInterface>()

      console.log('AlertMap.pullOutfitData', instanceId)

      await new ApiRequest()
        .get<InstanceOutfitAggregateResponseInterface[]>(
          Endpoints.AGGREGATES_INSTANCE_OUTFIT.replace('{instance}', instanceId)
        )
        .then((outfitAggregate) => {
          outfitAggregate.forEach(
            (outfitData: InstanceOutfitAggregateResponseInterface) => {
              newMap.set(outfitData.outfit.id, outfitData)
            }
          )
        })

      return newMap
    },
    async loadRegions(): Promise<void> {
      if (Object.keys(this.mapDraw).length !== 0) {
        return;
      }

      const regions = await new MapRegionDataRequest()
        .pull(this.alert.zone ? this.alert.zone : Zone.INDAR);
      
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
          pane: "hexPane",
          noClip: true,
        }).on("mouseover", (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: "#FFFFFF"
          });
          if(region.badge.ready()){
            region.badge.setHovered(true, this.map.getZoom());
            (<L.Marker | undefined>this.badges.getLayer(region.badge.indicatorStamp))?.fire("mouseover", e, false);
            (<L.Marker | undefined>this.textBadges.getLayer(region.badge.textStamp))?.fire("mouseover", e, false);
          }
          e.target.bringToFront();
        }).on("mouseout", (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: "#000000"
          });
          if(region.badge.ready()){
            region.badge.setHovered(false, this.map.getZoom());
            (<L.Marker | undefined>this.badges.getLayer(region.badge.indicatorStamp))?.fire("mouseout", e, false);
            (<L.Marker | undefined>this.textBadges.getLayer(region.badge.textStamp))?.fire("mouseout", e, false);
          }
        });
        //polygon.bindTooltip(region.name);
        
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
              pane: "linkPane",
              interactive: false,
              bubblingMouseEvents: true
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

      this.map.on("zoom", (ev: L.LeafletEvent) => {
        Object.values(this.mapDraw).forEach((region: MapRegion) => {
          region.badge.update(this.map.getZoom())
        });
      });

      Object.values(this.mapDraw).forEach((region: MapRegion) => {
        var badge = this.badges.getLayer(region.badge.indicatorStamp);
        var text = this.textBadges.getLayer(region.badge.textStamp);
        var polygon = this.polys.getLayer(this.polyStamps[region.id]);
        if(badge === undefined || polygon === undefined || text === undefined){
          return;
        }
        badge.addEventParent(polygon);
        text.addEventParent(badge);
      });
    
      this.polys.addTo(this.map);
      this.links.addTo(this.map);
      this.badges.addTo(this.map);
      this.textBadges.addTo(this.map);
    },
  },
})
</script>

<style lang="scss" scoped>
 ::v-deep .v-slider__tick-label {
    font-size: x-small;
    left: calc(0% - 4.5px);
    width: 9px;
    height: 9px;
  }

  .map {
    background: #010707;
  }

  .timeline {
    --scrollbar-foreground: #303a40;
    --scrollbar-background: rgba(55, 71, 79, 0.8);
    --radius: 10px;
    --size: 10px;
    overflow-y: scroll;
    scrollbar-color: var(--scrollbar-foreground) var(--scrollbar-background);
    scrollbar-width: thin;
    height: 0px;
    min-height: 90%;
  }
  .timeline::-webkit-scrollbar {
    background: var(--scrollbar-background);
    border-radius: var(--radius);
    width: var(--size);
    height: var(--size);
  }
  @media screen and (max-width: 1263px){
    .timeline {
      display: none;
    }
  }
  .timeline::-webkit-scrollbar-thumb {
    background: var(--scrollbar-foreground); 
  }

  :root {
    --timeline-opposite-item-width: 64px;
    --timeline-line-width: 16px;
  }

  ::v-deep .v-timeline--dense .v-timeline-item__opposite {
    display: inline-block;
  }

  ::v-deep .v-timeline-item__opposite {
    flex: none;
    min-width: var(--timeline-opposite-item-width);
  }

  /* line: divider in the middle is 96px wide by default */
  ::v-deep .v-application--is-ltr .v-timeline--dense:not(.v-timeline--reverse):before {
    left: calc(
      var(--timeline-opposite-item-width) + 
      (96px - var(--timeline-line-width)) / 2
    );
    width: var(--timeline-line-width);
  }
  @media screen and (max-width: 1550px){
    ::v-deep .v-timeline--dense .v-timeline-item__opposite {
      display: none;
    }
  }
</style>