<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Map</div>
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
import { MapRegionInterface } from '~/interfaces/mapping/MapRegionInterface';
import { MapDrawingInterface, MAP_FACTION_COLORS, Color, worldToMap, LatLng } from '~/interfaces/mapping/MapDrawingInterface';
import { FacilityType } from '@/constants/FacilityType';
import { Zone } from '@/constants/Zone';
import ApiRequest from '@/api-request';
import MapRegionDataRequest from '@/libraries/MapRegionDataRequest';
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface';
import { Endpoints } from '~/constants/Endpoints';
import moment from 'moment';
import { Faction } from '~/constants/Faction';
import zoneNameFilter from '~/filters/ZoneName';
import { MapRegion } from '~/libraries/MapRegion';
// import { InstanceFactionCombatAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceFactionCombatAggregateResponseInterface'
// import { Endpoints } from '@/constants/Endpoints'

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
      map: null as any,
      crs: this.$L.extend({}, this.$L.CRS.Simple, {wrapLng: [0, 256]}),
      polys: {} as Record<number, any>,
      links: {} as Record<number, any>,
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
    /*this.map = this.$L.map("map").setView([this.center[0], this.center[1]], 2);
    console.log(this.map);
    
    this.$L.tileLayer(this.url, {
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      maxNativeZoom: this.maxZoom,
      minNativeZoom: this.minZoom,
      
    }).addTo(this.map);

    //this.loadRegions();
    //this.pull();*/
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
      this.map = this.$refs["map"]?.mapObject;
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
    alpha(facility_id: number): number {
      return MAP_FACTION_COLORS[this.mapDraw[facility_id].faction].a;
    },
    outline(facility_id: number): LatLng[] {
      var to_return: LatLng[] = [];
      this.mapDraw[facility_id].outline().forEach((point: number[]) => {
        to_return.push(worldToMap(point));
      });
      return to_return;
    },
    async pull(): Promise<void> {
        if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
          return
        }
      
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
            result.reverse().forEach((controlEvent) => {
              /*if (this.loaded && controlEvent.isInitial) {
                return;
              }
              
              if (this.loaded && this.lastUpdated > new Date(controlEvent.timestamp)){
                return;
              }

              if (controlEvent.isDefence) {
                return;
              }*/

              this.mapDraw[controlEvent.facility].faction = controlEvent.newFaction;
              this.polys[controlEvent.facility].setStyle({fillColor: this.color(controlEvent.facility), fillOpacity: this.alpha(controlEvent.facility)});
              this.polys[controlEvent.facility].redraw();
            })
            this.loaded = true
            this.lastUpdated = new Date();
            this.updateCountdown = this.updateRate / 1000
          })
          .catch((e) => {
            this.error = e.message
          });
        
    },
    async loadRegions(): Promise<void> {
      if (Object.keys(this.mapDraw).length !== 0) {
        return;
      }
      const regions = await new MapRegionDataRequest()
        .pull(this.alert.zone ? this.alert.zone : Zone.INDAR);
      
      regions.forEach((region) => {
        this.mapDraw[region.id] = region;
        var regionPoly = this.$L.polygon(this.outline(region.id), {
          fillColor: this.color(region.id),
          fillOpacity: this.alpha(region.id),
          color: "#000000",
          weight: 2,
          lineCap: 'butt',
        });
        regionPoly.addTo(this.map);
        this.polys[region.id] = regionPoly;
      });

      regions.forEach((region) => {
        region.connections.forEach((connection) => {
          this.links[region.id] = this.$L.polyline([
            worldToMap([region.badgeLocation.x, region.badgeLocation.y]), 
            worldToMap([connection.badgeLocation.x, connection.badgeLocation.y])
            ], {
              weight: 1,
              color: '#FFFFFF',
              opacity: 0.6
            }).addTo(this.map);
        });
      });
    },
  },
})
</script>
