<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Map</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div class="map-container">
      <div class="map-grid-item">
          <client-only>
          <l-map class="map" ref="map" 
            :zoom="zoom" 
            :center="center" 
            :maxZoom="maxZoom"
            :zoomSnap="zoomSnap"
            :zoomDelta="zoomDelta"
            :crs="crs">
            <l-control ref="timer" position="topright" class="alert-timer-container">
              <div class="alert-timer-icon">
                <img src="/img/alert-icon.png" class="alert-timer-icon-bg"/>
                <img src="/img/alert-icon.png" class="alert-timer-icon-fg"/>
              </div>
              <remaining-time class="alert-timer"
                :started="alert.timeStarted" 
                :duration="alert.duration"
              ></remaining-time>
            </l-control>
          </l-map>
          </client-only>
      </div>
      <div class="timeline">
        <client-only>
        <v-subheader dark>Alert Capture Timeline (Base, Capturing Outfit, Overall Territory Control)</v-subheader>
        <v-card dark class="timeline-item"
          v-for="(captureIndex, index) in captureIndices.slice().reverse()"
          :key="index"
          @click="historyIndexCallback(captureIndices.length - index)"
          >
          <div :class="controlData(captureIndex).bgClass">
            <span style="position: absolute; left: 8px; top: 8px; color: rgba(255, 255, 255, 0.7); font-size: 12px;">{{historyCache[historyCache.length - captureIndex - 1].timestamp | dateTimeFormatShort }}</span>
            <span style="position: absolute; right: 8px; top: 8px;" v-html="facilityIconSvg(captureIndex)"></span>
            <v-card-subtitle 
              style="padding-bottom: 4px;
                      padding-top: 24px;
                      padding-right: 38px;
                      padding-left: 38px;">
                {{ regionName(captureIndex) }}
            </v-card-subtitle>
            <v-card-text style="padding-left: 8px; padding-right: 8px;" class="captureOutfit">
              Captured by {{capturingOutfitTag(captureIndex)}} from {{controlData(captureIndex).loser}}
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
          </div>
        </v-card>
        </client-only>
      </div>
      <div class="map-slider">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { LControl, LMap } from 'vue2-leaflet';
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface';
import { worldToMap, LatLng } from '~/interfaces/mapping/MapDrawingInterface';
import { MAP_FACTION_COLORS, MAP_LINK_COLORS } from '@/constants/FactionMapColors';
import { Zone, zoneToWarpgateArray } from '@/constants/Zone';
import ApiRequest from '@/api-request';
import MapRegionDataRequest from '@/libraries/MapRegionDataRequest';
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface';
import { Endpoints } from '~/constants/Endpoints';
import zoneNameFilter from '~/filters/ZoneName';
import { FacilityType } from '~/constants/FacilityType';
import { MapRegion } from '~/libraries/MapRegion';
import { Faction } from '~/constants/Faction';
import { FacilityBadge } from '~/interfaces/FacilityBadge';
import factionShortName from '~/filters/FactionShortName';
import factionCircleEmoji from '~/filters/FactionCircleEmoji';
import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface';
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface';
import { FactionBgClassString } from '~/constants/FactionBgClass';
import RemainingTime from '../RemainingTime.vue';

export default Vue.extend({
  components: { RemainingTime },
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
      prevZoom: 2,
      center: [-128, 128],
      url: "https://assets.ps2alerts.com/zones/" + zoneNameFilter(this.alert.zone).toLowerCase() + "/{z}/tile_{x}_{y}.png",
      minZoom: 2,
      maxZoom: 7,
      zoomSnap: 1,
      zoomDelta: 1,
      bounds: [[0, 0], [-256, 256]],
      maxBounds: [[0, 0], [-250, 250]],
      viscosity: 0.1,
      noWrap: true,
      mapRegions: new Map<number, MapRegion>(),
      map: {} as L.Map,
      remaining: {} as LControl,
      crs: this.$L.CRS.Simple, //this.$L.extend({}, this.$L.CRS.Simple, {wrapLng: [0, 256]}),
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
      zoomInSound: new Audio('/audio/UI_INTERFACE_MAP_ZOOM_IN.wav'),
      zoomOutSound: new Audio('/audio/UI_INTERFACE_MAP_ZOOM_OUT.wav'),
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
        this.remaining.$el.remove();
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
      this.remaining = (<LControl>this.$refs["timer"]);
      this.map.attributionControl.addAttribution('Tiles extracted from <a title="Planetside 2® Public Test Server" href="https://forums.daybreakgames.com/ps2/index.php?threads/read-first-test-server-policies-download-link.114038/">PTS client</a>')
      this.map.attributionControl.addAttribution('Hex and region data from <a href="https://census.daybreakgames.com">Census</a>');
      this.map.attributionControl.addAttribution('Oshur region data from <a title="Planetside 2 API developers\' Discord channel on the unofficial Planetside 2 Discord server" href="https://discord.com/channels/251073753759481856/451032574538547201">#api-dev</a>');
      this.map.attributionControl.addAttribution('Oshur hex data from RiderAnton');
      this.map.createPane("hexPane", this.map.getPane("overlayPane"));
      this.map.createPane("linkPane", this.map.getPane("overlayPane"));
      this.map.createPane("badgePane", this.map.getPane("overlayPane"));
      this.map.createPane("badgeTextPane", this.map.getPane("overlayPane"));
      this.map.on('drag', () => {
        this.map.fitBounds(this.map.getBounds());
      });
      this.$L.tileLayer(this.url, {
        bounds: [[0, 0], [-256, 256]],
        minNativeZoom: 2,
        maxNativeZoom: 5
      }).addTo(this.map);

      this.zoomInSound.loop = false;
      this.zoomOutSound.loop = false;
      this.zoomInSound.volume = 0.1;
      this.zoomOutSound.volume = 0.1;
      this.map.on('zoom', () => {
        if(Math.abs(this.prevZoom - this.map.getZoom()) < 0.1){
          return;
        }
        const direction = this.prevZoom - this.map.getZoom();
        // current zoom > previous zoom means we zoomed in
        if(direction < 0 && this.zoomInSound.paused){
          this.zoomOutSound.pause();
          this.zoomInSound.currentTime = 0;
          this.zoomInSound.play();
        } else if(this.zoomOutSound.paused) {
          this.zoomInSound.pause();
          this.zoomOutSound.currentTime = 0;
          this.zoomOutSound.play();
        }
        this.prevZoom = this.map.getZoom();
      });
      this.setTimers();
      if(this.alert.state === Ps2alertsEventState.ENDED){
        this.remaining.$el.remove();
      }
    },
    factionColor(faction: Faction){
      return MAP_FACTION_COLORS[faction].toString();
    },
    facilityIconSvg(captureIndex: number): string {
      var reverseIndex = this.historyCache.length - captureIndex - 1;
      var controlEvent = this.historyCache[reverseIndex];
      var faction = controlEvent.newFaction;
      var region = this.mapRegions.get(controlEvent.facility);
      if(!region)
        return '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" width="38" height="38"></svg>';
      return region.badge().getIcon(faction, 30).outerHTML;
    },
    capturingOutfitTag(captureIndex: number): string {
      var reverseIndex = this.historyCache.length - captureIndex - 1;
      var controlEvent = this.historyCache[reverseIndex];
      var outfitId = controlEvent.outfitCaptured;
      if(outfitId){
        var outfitAggregate = this.outfitData.get(outfitId);
        if(outfitAggregate && outfitAggregate.outfit.tag){
          return "[" + outfitAggregate.outfit.tag + "]";
        } else if(outfitAggregate && outfitAggregate.outfit.name) {
          return outfitAggregate.outfit.name
        } else {
          return factionShortName(controlEvent.newFaction);
        }
      }
      return factionShortName(controlEvent.newFaction);
    },
    controlData(captureIndex: number): InstanceFacilityControlEntriesResponseInterface & { loser: string, bgClass: string } {
      var reverseIndex = this.historyCache.length - captureIndex - 1;
      var controlEvent = this.historyCache[reverseIndex];
      var loser = factionShortName(controlEvent.oldFaction);
      var bgClass = FactionBgClassString(controlEvent.newFaction);
      return { ...controlEvent, loser: loser, bgClass: bgClass};
    },
    mapControlData(captureIndex: number): MapControlInterface {
      var reverseIndex = this.historyCache.length - captureIndex - 1;
      var mapControl = this.historyCache[reverseIndex].mapControl
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
    regionName(captureIndex: number): string {
      var reverseIndex = this.historyCache.length - captureIndex - 1;
      var facility_id = this.historyCache[reverseIndex].facility;
      var name = this.mapRegions.get(facility_id)?.name;
      if(name){
        return name;
      }
      return "";
    },
    createRegionBadge(region: MapRegion): FacilityBadge {
      // If the facility type is not given or the badge is already built, just return it
      if(region.badge().ready()){
        return region.badge();
      }
      var markerOptions = {
        pane: "badgePane",
        bubblingMouseEvents: true,
        riseOnHover: true
      };

      var textMarkerOptions = {
        pane: "badgeTextPane",
        bubblingMouseEvents: true,
        riseOnHover: true,
      };

      var indicator = this.$L.marker(region.mapLocation(), markerOptions);
      var indicatorText = this.$L.marker(region.mapLocation(), textMarkerOptions);

      var badge = region.badge(this.$L.stamp(indicator), this.$L.stamp(indicatorText));
      var icon = this.$L.divIcon(badge.divOptions());
      var text = this.$L.divIcon(badge.textDivOptions());

      indicator.setIcon(icon).addTo(this.badges);
      indicator.once('add', (event) => {
        var el = indicator.getElement();
        if(el){
          el.style.width = 'max(' + badge.minSize().toString() + 'px, max(' + badge.widthVW().toString() + 'vw' + ',' + badge.widthVW().toString() + 'vh))';
          el.style.height = 'max(' + badge.minSize().toString() + 'px, max(' + badge.heightVW().toString() + 'vw' + ',' + badge.heightVW().toString() + 'vh))';
          el.style.marginTop = 'min(' + (-badge.minSize() / 2).toString() + 'px, min(' + (-badge.heightVW() / 2).toString() + 'vw' + ',' + (-badge.heightVW() / 2).toString() + 'vh))';
          el.style.marginLeft = 'min(' + (-badge.minSize() / 2).toString() + 'px, min(' + (-badge.widthVW() / 2).toString() + 'vw' + ',' + (-badge.widthVW() / 2).toString() + 'vh))';
        }
      });
      indicatorText.setIcon(text).addTo(this.textBadges);
      return badge;
    },
    outline(facility_id: number): LatLng[] {
      var to_return: LatLng[] = [];
      this.mapRegions.get(facility_id)?.outline().forEach((point: number[]) => {
        to_return.push(worldToMap(point));
      });
      return to_return;
    },
    warpgate(faction: Faction): MapRegion | undefined {
      var zone = this.alert.zone;
      if(!zone){
        console.error("Unable to find warpgate of undefined zone!");
        return undefined;
      }
      var warpgates: number[] | undefined = zoneToWarpgateArray.get(zone);
      if(warpgates == undefined){
        return undefined;
      }
      var region: MapRegion | undefined = undefined;
      warpgates.forEach((facilityId: number) => {
        if(region) {
          return;
        }
        if(this.mapRegions.get(facilityId)?.faction === faction){
          region = this.mapRegions.get(facilityId);
        }
      });
      return region;
    },
    cutoff(facility: MapRegion): boolean {
      // This could use improvement, probably should be moved to MapRegion as well (Need to record all links in MapRegion first)
      // Currently this performs a depth first search of all connected territories starting at the faction's warpgate
      //    and returns true if it finds *facility* during the search.
      if(facility.facilityType == FacilityType.WARPGATE){
        return false;
      }
      // This array is being treated as a stack
      var frontier = [this.warpgate(facility.faction)];
      // Easy improvement here - don't use an array for the visited data structure
      var visited: MapRegion[] = [];
      while(frontier.length !== 0){
        var curr = frontier.pop();
        if(!curr){
          return false;
        }
        if(curr.id === facility.id){
          return false;
        }
        // Linkstamps is a record of the shape { "1234 2345": <leaflet Layer id>, ... }, 
        //    the keys are two facility ids concatenated with a space. Not every permutation is present
        //    since most (but not all of course) facilities in the census do not reciprocate their map links
        //    (AKA this describes something that is close to (but is not) a directed graph)
        Object.keys(this.linkStamps).forEach((pair) => {
          if(pair.includes("bg")){
            return;
          }
          var facilities = pair.split(" ").map((val) => parseInt(val));
          if(!(facilities[0] === curr?.id || facilities[1] === curr?.id))
            return;
          var connection = facilities[0] === curr?.id ? this.mapRegions.get(facilities[1]) : this.mapRegions.get(facilities[0]);
          var wasVisited = visited.find((region) => { return region.id === connection?.id; });
          if (wasVisited){
            return;
          }
          if(connection?.faction === facility.faction){
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
    updateTerritory(result: InstanceFacilityControlEntriesResponseInterface[], indexLimit?: number, force = false, reverse = false): boolean {
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

        // This basically checks to see if we are either:
        //    1. Seeing a new capture come in while we are auto updating, or
        //    2. Resetting the map to a capture event further along the alert than this one
        // and applies the capture event if either of those are true
        if((this.currentIndex == -1 && indexLimit === undefined) || (indexLimit !== undefined && index < this.captureIndices[indexLimit])){
          var region = this.mapRegions.get(controlEvent.facility);
          if(!region){
            return;
          }
          // Capture is used by callers to check whether we need to update hex colors in updateCutoffs or not
          capture = true;

          // Update map region (TODO: Update links should probably be refactored into something the region can do)
          // This does not immediately set the hex color, but instead waits for updateCutoffs to be called
          region.faction = controlEvent.newFaction;
          region.badge().update(this.map.getZoom());
          this.updateLinks(controlEvent.facility);

          // If we've reached the final region we're updating, apply the "captured" class to the hex to animate the color change
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
        // If this is a brand new capture event, add it to our list
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
      for(var region of this.mapRegions.values()) {
        region.setCutoff(this.cutoff(region));
        var polygon = (<L.Polygon | undefined>this.polys.getLayer(this.polyStamps[region.id]));
        polygon?.setStyle({
            fillColor: region.color().toString(),
            fillOpacity: region.color().a + (region.isCutoff() ? 0.4 : 0),
        });
      }
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
        var regions = [this.mapRegions.get(facility_ids[0]), this.mapRegions.get(facility_ids[1])];

        if(!(regions[0] && regions[1])){
          return;
        }

        // Both factions match, set friendly color and hide bglink
        if(regions[0].faction === regions[1].faction){
          link?.setStyle({
            color: MAP_LINK_COLORS[regions[0].faction]?.toString(),
            opacity: MAP_LINK_COLORS[regions[0].faction]?.a,
            dashArray: [],
          });
          bglink?.setStyle({
            opacity: 0.0
          });
        }
        // Disabled, just put an NS link there since it doesn't make it seem capturable
        else if(regions[0].faction === Faction.NONE || regions[1].faction === Faction.NONE){
          link?.setStyle({
            color: MAP_LINK_COLORS[Faction.NONE].toString(),
            opacity: MAP_LINK_COLORS[Faction.NONE].a,
            dashArray: [],
          });
          bglink?.setStyle({
            opacity: 0.0
          });
        }
        // Warpgate's ain't capturable, make it look like capturable link with disabled link colors
        else if(regions[0].facilityType === FacilityType.WARPGATE || regions[1].facilityType === FacilityType.WARPGATE){
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
      // Taken from AlertMapCaptureHistory.vue
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
      if (this.mapRegions.size !== 0) {
        return;
      }

      const regions = await new MapRegionDataRequest()
        .pull(this.alert.zone ? this.alert.zone : Zone.INDAR);
      
      this.$L.Icon.Default.prototype.options.iconAnchor = [0, 0];
      this.$L.Icon.Default.prototype.options.tooltipAnchor = [0, 0];
      regions.forEach((region) => {
        this.mapRegions.set(region.id, region);
        var polygon = this.$L.polygon(this.outline(region.id), region.outlineOptions());
        
        // Set on hover colors and ensure the attached badge layers get the same event
        polygon.on("mouseover", (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: "#FFFFFF"
          });
          if(region.badge().ready()){
            region.badge().setHovered(true, this.map.getZoom());
            (<L.Marker | undefined>this.badges.getLayer(region.badge().indicatorStamp))?.fire("mouseover", e, false);
            (<L.Marker | undefined>this.textBadges.getLayer(region.badge().textStamp))?.fire("mouseover", e, false);
          }
          e.target.bringToFront();
        });
        
        // Set on hover colors and ensure the attached badge layers get the same event
        polygon.on("mouseout", (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: "#000000"
          });
          if(region.badge().ready()){
            region.badge().setHovered(false, this.map.getZoom());
            (<L.Marker | undefined>this.badges.getLayer(region.badge().indicatorStamp))?.fire("mouseout", e, false);
            (<L.Marker | undefined>this.textBadges.getLayer(region.badge().textStamp))?.fire("mouseout", e, false);
          }
        });
        
        // TODO: This should probably go on the region instead
        this.polyStamps[region.id] = this.$L.stamp(polygon);
        this.polys.addLayer(polygon);
      });

      // Build facility links
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
          // TODO: This should probably go on region and connection
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
          // TODO: This should probably go on region and connection
          this.linkStamps["bg" + region.id.toString() + " " + connection.id.toString()] = this.$L.stamp(bglink);

          this.links.addLayer(bglink);
          this.links.addLayer(link);
        });
        this.createRegionBadge(region);
      });

      this.map.on("zoom", (ev: L.LeafletEvent) => {
        for(var region of this.mapRegions.values()) {
          region.badge().update(this.map.getZoom())
        }
      });

      for(var region of this.mapRegions.values()) {
        var badge = this.badges.getLayer(region.badge().indicatorStamp);
        var text = this.textBadges.getLayer(region.badge().textStamp);
        var polygon = this.polys.getLayer(this.polyStamps[region.id]);
        if(badge === undefined || polygon === undefined || text === undefined){
          return;
        }
        badge.addEventParent(polygon);
        text.addEventParent(badge);
      }
    
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

  .alert-timer-container {
    display: grid;
    grid-template: 'icon timer';
    gap: 4px;
  }

  @keyframes alert {
    0% { filter: blur(2px); opacity: 0.5; width: 26px; left: -1px; }
    50% { filter: blur(4px); opacity: 1; width: 26px; left: -1px; }
    100% { filter: blur(0px); }
  }

  .alert-timer-icon-bg {
    position: absolute;
    left: 0px;
    width: 24px;
    animation-name: alert;
    animation-direction: alternate;
    animation-duration: 1s;
    animation-iteration-count: infinite;
  }

  .alert-timer-icon-fg {
    position: absolute;
    left: 0px;
    width: 24px;
  }

  .alert-timer-icon {
    grid-area: 'icon';
    width: 24px;
    margin-top: 25%;
  }

  .alert-timer {
    grid-area: 'timer';
    font-size: 24px;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 
      0px 0px 5px rgba(0, 194, 253, 0.7), 
      0px 0px 10px rgba(0, 194, 253, 0.7), 
      0px 0px 15px rgba(0, 194, 253, 0.7),
      0px 0px 20px rgba(0, 194, 253, 0.7);
  }

  .map-container {
    display: grid;
    gap: 8px 8px;

    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .map-grid-item {
    grid-column: 1 / span 3;
  }
  
  .map-slider {
    grid-column: 1 / span 4;
  }

  .map {
    background: #010707;
    height: 850px;
    max-height: min(70vw, 80vh);
  }

  .timeline {
    grid-column: 4 / 4;
    --scrollbar-foreground: #303a40;
    --scrollbar-background: rgba(55, 71, 79, 0.8);
    --radius: 10px;
    --size: 10px;
    overflow-y: scroll;
    scrollbar-color: var(--scrollbar-foreground) var(--scrollbar-background);
    scrollbar-width: thin;
    height: 850px;
    max-height: min(70vw, 80vh);
  }
  .timeline::-webkit-scrollbar {
    background: var(--scrollbar-background);
    border-radius: var(--radius);
    width: var(--size);
    height: var(--size);
  }
  .timeline::-webkit-scrollbar-thumb {
    background: var(--scrollbar-foreground); 
  }
  @media screen and (max-width: 1279px){
    .alert-timer {
      font-size: 12px;
    }

    .timeline {
      display: none;
      grid-column: auto;
    }

    .map-grid-item {
      grid-column: 1 / span 4;
    }
  }
  
  .timeline-item {
    margin: 8px;
  }
</style>