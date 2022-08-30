<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Map</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <!-- Map container -->
    <div class="grid gap-2 grid-cols-12">
      <!-- Map -->
      <div class="col-start-1 col-span-12 xl:col-span-9">
        <client-only>
          <l-map
            ref="map"
            class="map"
            :options="{ zoomControl: false, zoomSnap, zoomDelta }"
            :zoom="zoom"
            :center="center"
            :max-zoom="maxZoom"
            :zoom-snap="zoomSnap"
            :zoom-delta="zoomDelta"
            :crs="crs"
          >
            <font-awesome-icon
              v-show="false"
              ref="centerIcon"
              icon="fa-solid fa-arrows-to-dot"
            />
            <l-control
              v-show="alert.state === 1"
              ref="timer"
              position="topright"
              class="grid grid-flow-col auto-cols-max gap-1"
            >
              <div class="w-3 mt-[3px] xl:w-6 xl:mt-1.5">
                <img
                  src="/img/alert-icon.png"
                  class="absolute left-0 w-3 xl:w-6 animate-alert"
                  alt="Alert Icon"
                />
                <img
                  src="/img/alert-icon.png"
                  class="absolute left-0 w-3 xl:w-6"
                  alt="Alert Icon"
                />
              </div>
              <remaining-time
                class="alert-timer text-xs xl:text-2xl"
                :started="alert.timeStarted"
                :duration="alert.duration"
              ></remaining-time>
            </l-control>
          </l-map>
        </client-only>
      </div>
      <!-- Timeline -->
      <div
        class="timeline overflow-y-auto col-span-12 xl:col-span-3 hidden xl:block"
      >
        <client-only>
          <v-card-title v-show="!loaded" class="text-gray-300 flex-col">
            Loading Map &amp; Timeline...
          </v-card-title>
          <v-card-title v-show="loaded" class="text-gray-300 flex-col">
            Alert Capture Timeline
          </v-card-title>
          <v-card-text
            v-show="loaded && captureIndices.length === 0"
            class="text-gray-300"
          >
            Awaiting first capture...
            <font-awesome-icon
              :icon="['fa', 'sync']"
              class="animate-spin"
            ></font-awesome-icon>
          </v-card-text>
          <!-- Timeline entries -->
          <v-card
            v-for="(captureIndex, index) in captureIndices.slice().reverse()"
            :key="index"
            ref="captureCards"
            dark
            class="m-2"
            @click="historyIndexCallback(captureIndices.length - index)"
          >
            <div :class="controlData(captureIndex).bgClass">
              <span class="text-gray-300 text-xs absolute top-2 left-2">{{
                historyCache[historyCache.length - captureIndex - 1].timestamp
                  | dateTimeFormatShort
              }}</span>
              <span
                class="absolute top-2 right-2"
                v-html="facilityIconSvg(captureIndex)"
              ></span>
              <div class="pb-1 pt-6 px-10 text-sm font-bold">
                {{ regionName(captureIndex) }}
              </div>
              <div class="px-2 pb-4 text-sm">
                {{ capturingOutfitTag(captureIndex) }} captured from the
                {{ controlData(captureIndex).loser }}
              </div>
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
                <span
                  v-if="
                    !controlData(captureIndex).mapControl &&
                    captureIndex === historyCache.length - 1
                  "
                  class="text-sm"
                  >Awaiting data...
                  <font-awesome-icon
                    :icon="['fa', 'sync']"
                    class="animate-spin"
                  ></font-awesome-icon
                ></span>
                <span
                  v-if="
                    !controlData(captureIndex).mapControl &&
                    captureIndex !== historyCache.length - 1
                  "
                  class="text-sm"
                  >Data not available
                  <font-awesome-icon
                    :icon="['fa', 'face-frown']"
                  ></font-awesome-icon>
                </span>
              </div>
            </div>
          </v-card>
        </client-only>
      </div>
      <div class="col-start-1 col-span-12">
        <v-slider
          ref="history"
          v-model="sliderVal"
          tick-size="5"
          ticks="always"
          :tick-labels="tickLabels"
          append-icon="mdi-update"
          prepend-icon="mdi-history"
          :max="sliderMax"
          min="1"
          dark
          thumb-color="#FFFFFF"
          @change="sliderHistoryCallback"
          @click:prepend="decrementSlider"
          @click:append="incrementSlider"
        ></v-slider>
      </div>
      <!-- Playback button for general sizes -->
      <div
        class="hidden md:col-start-1 md:col-span-3 md:flex justify-center items-center"
      >
        <div v-if="loaded" class="btn-group mr-2">
          <button
            class="btn btn-sm px-4 xl:px-2"
            :class="{ 'btn-active': playback.playing }"
            @click="
              playback.playing = !playback.playing
              startOrEndPlayback()
            "
          >
            <font-awesome-icon
              v-if="!playback.playing"
              :icon="['fas', 'play']"
            ></font-awesome-icon>
            <font-awesome-icon
              v-if="playback.playing"
              :icon="['fas', 'pause']"
            ></font-awesome-icon>
            <span v-if="!playback.playing" class="align-top hidden xl:inline"
              >Play</span
            >
            <span v-if="playback.playing" class="align-top hidden xl:inline"
              >Pause</span
            >
          </button>
          <button
            class="btn btn-sm px-4 xl:px-2"
            :class="{ 'btn-active': playback.repeat }"
            @click="playback.repeat = !playback.repeat"
          >
            <font-awesome-icon :icon="['fas', 'repeat']"></font-awesome-icon>
            <span class="align-top hidden xl:inline">
              Repeat: <span v-if="playback.repeat">On</span>
              <span v-if="!playback.repeat">Off</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Capture status -->
      <div
        v-if="captureIndices.length > sliderVal - 1 && sliderVal - 1 >= 0"
        class="col-span-full md:col-start-4 md:col-span-6 text-xs xl:text-base justify-center"
      >
        <div
          class="w-full bg-neutral-800 border border-black border-solid rounded"
        >
          <div
            :class="
              controlData(captureIndices[sliderVal - 1]).bgClass + ' pt-2'
            "
          >
            <span class="p-2">
              <span class="text-gray-300"
                >{{
                  controlData(captureIndices[sliderVal - 1]).timestamp
                    | dateTimeFormatShort
                }}:
              </span>
              {{ regionName(captureIndices[sliderVal - 1]) }} captured by
              {{ capturingOutfitTag(captureIndices[sliderVal - 1]) }}
            </span>
            <FactionSegmentBar
              v-if="controlData(captureIndices[sliderVal - 1]).mapControl"
              class="pt-2"
              :vs="mapControlData(captureIndices[sliderVal - 1]).vs"
              :nc="mapControlData(captureIndices[sliderVal - 1]).nc"
              :tr="mapControlData(captureIndices[sliderVal - 1]).tr"
              :other="mapControlData(captureIndices[sliderVal - 1]).cutoff"
              :out-of-play="
                mapControlData(captureIndices[sliderVal - 1]).outOfPlay
              "
              dropoff-percent="15"
            ></FactionSegmentBar>
          </div>
        </div>
      </div>

      <!-- Playback button for phones -->
      <div
        class="flex md:hidden col-start-2 w-1/2 col-span-3 justify-center items-center"
      >
        <div v-if="loaded" class="btn-group mr-2">
          <button
            class="btn btn-sm px-4 xl:px-2"
            :class="{ 'btn-active': playback.playing }"
            @click="
              playback.playing = !playback.playing
              startOrEndPlayback()
            "
          >
            <font-awesome-icon
              v-if="!playback.playing"
              :icon="['fas', 'play']"
            ></font-awesome-icon>
            <font-awesome-icon
              v-if="playback.playing"
              :icon="['fas', 'pause']"
            ></font-awesome-icon>
            <span v-if="!playback.playing" class="align-top hidden xl:inline"
              >Play</span
            >
            <span v-if="playback.playing" class="align-top hidden xl:inline"
              >Pause</span
            >
          </button>
          <button
            class="btn btn-sm px-4 xl:px-2"
            :class="{ 'btn-active': playback.repeat }"
            @click="playback.repeat = !playback.repeat"
          >
            <font-awesome-icon :icon="['fas', 'repeat']"></font-awesome-icon>
            <span class="align-top hidden xl:inline">
              Repeat: <span v-if="playback.repeat">On</span>
              <span v-if="!playback.repeat">Off</span>
            </span>
          </button>
        </div>
      </div>

      <!-- Playback speed -->
      <div
        class="col-start-5 col-span-full mt-5 md:col-start-10 md:col-span-3 md:mt-0"
      >
        <span>Playback speed: {{ (playback.delay / 1000).toFixed(2) }}s</span>
        <v-slider
          v-model="playback.delay"
          class="w-full"
          min="250"
          max="2000"
          @change="updatePlaybackDelay()"
        ></v-slider>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LControl, LMap } from 'vue2-leaflet'
import { Constructor } from 'vue/types/options'
import RemainingTime from '../RemainingTime.vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { worldToMap } from '~/libraries/MapWorld'
import { MAP_FACTION_COLORS } from '@/constants/FactionMapColors'
import { Zone, zoneToWarpgateArray } from '@/ps2alerts-constants/zone'
import ApiRequest from '@/api-request'
import MapRegionDataRequest from '@/libraries/MapRegionDataRequest'
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface'
import { AssetsBaseUrl, Endpoints } from '@/constants/Endpoints'
import zoneNameFilter from '~/filters/ZoneName'
import { FacilityType } from '@/ps2alerts-constants/facilityType'
import { MapRegion } from '~/libraries/MapRegion'
import { Faction } from '@/ps2alerts-constants/faction'
import { FacilityBadge } from '~/libraries/FacilityBadge'
import factionShortName from '~/filters/FactionShortName'
import factionCircleEmoji from '~/filters/FactionCircleEmoji'
import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface'
import { FactionBgClassString } from '@/constants/FactionBgClass'
import { Ps2AlertsEventType } from '~/ps2alerts-constants/ps2AlertsEventType'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'
import { OutfitwarsTerritoryResultInterface } from '~/ps2alerts-constants/interfaces/OutfitwarsTerritoryResultInterface'

export default Vue.extend({
  name: 'AlertMap',
  components: { RemainingTime },
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
      url:
        AssetsBaseUrl +
        '/zones/' +
        zoneNameFilter(this.alert.zone).toLowerCase() +
        `/${this.alert.mapVersion ?? '1.0'}/` +
        '{z}/tile_{x}_{y}.png',
      minZoom: 2,
      maxZoom: 7,
      zoomSnap: 0.5,
      zoomDelta: 0.5,
      bounds: [
        [0, 0],
        [-256, 256],
      ],
      maxBounds: [
        [0, 0],
        [-250, 250],
      ],
      viscosity: 0.1,
      noWrap: true,
      mapRegions: new Map<number, MapRegion>(),
      map: {} as L.Map,
      lastCaptured: undefined as L.Polygon | undefined,
      remaining: {} as LControl,
      crs: this.$L.CRS.Simple,
      polys: this.$L.featureGroup([], {
        pane: 'hexPane',
      }),
      links: this.$L.featureGroup([], {
        pane: 'linkPane',
      }),
      badges: this.$L.featureGroup([], {
        pane: 'badgePane',
      }),
      textBadges: this.$L.featureGroup([], {
        pane: 'badgeTextPane',
      }),
      currentIndex: -1,
      captureIndices: [] as number[],
      tickLabels: [] as string[],
      scrollEndTimer: null as NodeJS.Timeout | null,
      scrolledCard: null as Element | null,
      oldSliderVal: 0,
      sliderVal: 0,
      sliderMax: 0,
      historyCache: [] as InstanceFacilityControlEntriesResponseInterface[],
      outfitData: new Map<string, InstanceOutfitAggregateResponseInterface>(),
      zoomInSound: new Audio(Endpoints.ASSETS_AUDIO_ZOOM_IN),
      zoomOutSound: new Audio(Endpoints.ASSETS_AUDIO_ZOOM_OUT),
      ZoomCenterControl: undefined as Constructor | undefined,
      playback: {
        playing: false,
        repeat: false,
        interval: undefined as number | undefined,
        delay: 1000,
      },
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
      if (this.alert.state === Ps2AlertsEventState.ENDED) {
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
  mounted() {
    const { ZoomCenter } = require('~/libraries/ZoomCenter')
    this.ZoomCenterControl = ZoomCenter
    this.$nextTick(() => {
      this.init()
      this.loadRegions().then(() => {
        this.pull()
      })
    })
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
      if (this.alert.state === Ps2AlertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    init(): void {
      this.map = (this.$refs.map as LMap).mapObject as L.Map
      if (this.alert.zone === Zone.NEXUS) {
        (this.$refs.map as Vue).$el.classList.add('bg-nexus')
      }
      if (this.alert.zone === Zone.OSHUR) {
        (this.$refs.map as Vue).$el.classList.add('bg-oshur')
      }
      this.remaining = this.$refs.timer as LControl
      const centerIcon = (this.$refs.centerIcon as HTMLElement).cloneNode(
        true
      ) as HTMLElement
      centerIcon.setAttribute('style', '')
      if (this.ZoomCenterControl) {
        this.map.addControl(
          new this.ZoomCenterControl({
            zoomCenterText: centerIcon.outerHTML,
            zoomCenterLevel: this.alert.zone === Zone.NEXUS ? 3 : 2,
          })
        )
      }
      this.map.attributionControl.addAttribution(
        'Tiles from <a title="Planetside 2® Public Test Server" href="https://forums.daybreakgames.com/ps2/index.php?threads/read-first-test-server-policies-download-link.114038/">PTS client</a>'
      )
      this.map.attributionControl.addAttribution(
        'Map data from <a href="https://census.daybreakgames.com">Census</a>'
      )
      this.map.attributionControl.addAttribution(
        'Oshur data from <a title="Planetside 2 API developers\' Discord channel on the unofficial Planetside 2 Discord server" href="https://discord.com/channels/251073753759481856/451032574538547201">#api-dev</a>'
      )
      this.map.attributionControl.addAttribution('Oshur hexes from RiderAnton')
      this.map.attributionControl
        .getContainer()
        ?.classList.add('whitespace-nowrap')
      this.map.createPane('hexPane', this.map.getPane('overlayPane'))
      this.map.createPane('capturedHexPane', this.map.getPane('overlayPane'))
      this.map.createPane('linkPane', this.map.getPane('overlayPane'))
      this.map.createPane('badgePane', this.map.getPane('overlayPane'))
      this.map.createPane('badgeTextPane', this.map.getPane('overlayPane'))
      this.map.on('drag', () => {
        this.map.fitBounds(this.map.getBounds())
      })
      this.$L
        .tileLayer(this.url, {
          bounds: [
            [0, 0],
            [-256, 256],
          ],
          minNativeZoom: 2,
          maxNativeZoom: 5,
        })
        .addTo(this.map)

      this.zoomInSound.loop = false
      this.zoomOutSound.loop = false
      this.zoomInSound.volume = 0.5
      this.zoomOutSound.volume = 0.5

      this.playback.delay = parseInt(
        localStorage.getItem('mapPlaybackSpeed') ?? '1000'
      )

      if (window.matchMedia('(min-width: 1280px)').matches) {
        this.map.setMinZoom(1.5)
      }

      this.setTimers()
    },
    factionColor(faction: Faction) {
      return MAP_FACTION_COLORS[faction].toString()
    },
    facilityIconSvg(captureIndex: number): string {
      const reverseIndex = this.historyCache.length - captureIndex - 1
      const controlEvent = this.historyCache[reverseIndex]
      const faction = controlEvent.newFaction
      const region = this.mapRegions.get(controlEvent.facility)
      const size = '30'
      if (!region)
        return (
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="' +
          size +
          '" height="' +
          size +
          '"></svg>'
        )
      return region.badge().getIcon(faction, 30).outerHTML
    },
    capturingOutfitTag(captureIndex: number): string {
      const reverseIndex = this.historyCache.length - captureIndex - 1
      const controlEvent = this.historyCache[reverseIndex]
      const outfitId = controlEvent.outfitCaptured
      if (outfitId) {
        const outfitAggregate = this.outfitData.get(outfitId)
        if (outfitAggregate && outfitAggregate.outfit.tag) {
          // Nested if so that it will drop out of the if statements to return the faction name
          //   when the "SERVER" outfit captures a base
          if (outfitAggregate.outfit.tag !== 'SERVER') {
            return `[${outfitAggregate.outfit.tag}]`
          }
        } else if (outfitAggregate && outfitAggregate.outfit.name) {
          return outfitAggregate.outfit.name
        } else {
          return factionShortName(controlEvent.newFaction)
        }
      }
      return factionShortName(controlEvent.newFaction)
    },
    controlData(
      captureIndex: number
    ): InstanceFacilityControlEntriesResponseInterface & {
      loser: string
      bgClass: string
    } {
      const reverseIndex = this.historyCache.length - captureIndex - 1
      const controlEvent = this.historyCache[reverseIndex]
      const loser = factionShortName(controlEvent.oldFaction)
      const bgClass = FactionBgClassString(controlEvent.newFaction)
      return { ...controlEvent, loser, bgClass }
    },
    mapControlData(captureIndex: number): MapControlInterface {
      const reverseIndex = this.historyCache.length - captureIndex - 1
      const mapControl = this.historyCache[reverseIndex].mapControl as MapControlInterface
      if (!mapControl) {
        return {
          vs: 33,
          nc: 33,
          tr: 33,
          cutoff: 0,
          outOfPlay: 0,
        }
      }
      return mapControl
    },
    regionName(captureIndex: number): string {
      const reverseIndex = this.historyCache.length - captureIndex - 1
      const facilityId = this.historyCache[reverseIndex].facility
      const name = this.mapRegions.get(facilityId)?.name
      if (name) {
        return name
      }
      return ''
    },
    createRegionBadge(region: MapRegion): FacilityBadge {
      // If the facility type is not given or the badge is already built, just return it
      if (region.badge().ready()) {
        return region.badge()
      }
      const markerOptions = {
        pane: 'badgePane',
        bubblingMouseEvents: true,
        riseOnHover: true,
      }

      const textMarkerOptions = {
        pane: 'badgeTextPane',
        bubblingMouseEvents: true,
        riseOnHover: true,
      }

      const indicator = this.$L.marker(region.mapLocation(), markerOptions)
      const indicatorText = this.$L.marker(
        region.mapLocation(),
        textMarkerOptions
      )

      const badge = region.badge(
        this.$L.stamp(indicator),
        this.$L.stamp(indicatorText)
      )
      const icon = this.$L.divIcon(badge.divOptions())
      const text = this.$L.divIcon(badge.textDivOptions())

      indicator.setIcon(icon).addTo(this.badges)
      indicator.once('add', () => {
        const el = indicator.getElement()
        if (el) {
          el.style.width =
            'max(' +
            badge.minSize().toString() +
            'px, max(' +
            badge.widthVW().toString() +
            'vw' +
            ',' +
            badge.widthVW().toString() +
            'vh))'
          el.style.height =
            'max(' +
            badge.minSize().toString() +
            'px, max(' +
            badge.heightVW().toString() +
            'vw' +
            ',' +
            badge.heightVW().toString() +
            'vh))'
          el.style.marginTop =
            'min(' +
            (-badge.minSize() / 2).toString() +
            'px, min(' +
            (-badge.heightVW() / 2).toString() +
            'vw' +
            ',' +
            (-badge.heightVW() / 2).toString() +
            'vh))'
          el.style.marginLeft =
            'min(' +
            (-badge.minSize() / 2).toString() +
            'px, min(' +
            (-badge.widthVW() / 2).toString() +
            'vw' +
            ',' +
            (-badge.widthVW() / 2).toString() +
            'vh))'
        }
      })
      indicatorText.setIcon(text).addTo(this.textBadges)
      return badge
    },
    warpgate(faction: Faction): MapRegion | undefined {
      const zone = this.alert.zone
      if (!zone) {
        console.error('Unable to find warpgate of undefined zone!')
        return undefined
      }
      const warpgates: number[] | undefined = zoneToWarpgateArray.get(zone)
      if (warpgates === undefined) {
        console.error(
          'AlertMap.warpgate: Unsupported continent? Zone ID: ' +
            zone.toString()
        )
        return undefined
      }
      let region: MapRegion | undefined
      warpgates.forEach((facilityId: number) => {
        if (region) {
          return
        }
        if (this.mapRegions.get(facilityId)?.faction === faction) {
          region = this.mapRegions.get(facilityId)
        }
      })
      return region
    },
    cutoff(facility: MapRegion): boolean {
      // This could use improvement, probably should be moved to MapRegion as well (Need to record all links in MapRegion first)
      // Currently this performs a depth first search of all connected territories starting at the faction's warpgate
      //    and returns false if it finds *facility* during the search.
      if (facility.facilityType === FacilityType.WARPGATE) {
        return false
      }
      // This array is being treated as a stack
      const frontier = [this.warpgate(facility.faction)]
      const visited = new Map<number, boolean>()
      while (frontier.length !== 0) {
        const curr = frontier.pop()
        if (!curr) {
          return false
        }
        if (curr.id === facility.id) {
          return false
        }
        // Check all connections and add them to the frontier if they match factions
        curr.connections.forEach((connection) => {
          if (visited.get(connection.id)) {
            return
          }
          if (connection.faction === facility.faction) {
            frontier.push(connection)
          }
        })
        visited.set(curr.id, true)
      }
      return true
    },
    decrementSlider() {
      if (this.sliderVal <= 1) {
        return
      }
      const captureCards = this.$refs.captureCards as Vue[]
      captureCards[
        captureCards.length - (this.sliderVal - 1)
      ].$el.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      })
      this.historyCallback(this.sliderVal - 1)
    },
    incrementSlider() {
      if (this.sliderVal === this.captureIndices.length) {
        return
      }
      const captureCards = this.$refs.captureCards as Vue[]
      captureCards[
        captureCards.length - (this.sliderVal + 1)
      ].$el.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
        behavior: 'smooth',
      })
      this.historyCallback(this.sliderVal + 1)
    },
    startOrEndPlayback() {
      if (this.playback.playing) {
        this.playback.interval = window.setInterval(
          this.runPlayback,
          this.playback.delay
        )
        if (this.sliderVal === this.captureIndices.length) {
          this.runPlayback(0)
        } else {
          this.runPlayback()
        }
      } else {
        window.clearInterval(this.playback.interval)
        this.playback.interval = undefined
      }
    },
    updatePlaybackDelay() {
      // Save the playback so it'll load the user's preference
      localStorage.setItem('mapPlaybackSpeed', String(this.playback.delay))
      if (this.playback.playing) {
        window.clearInterval(this.playback.interval)
        this.playback.interval = window.setInterval(
          this.runPlayback,
          this.playback.delay
        )
      }
    },
    runPlayback(sliderOverride?: number) {
      if (sliderOverride === undefined) {
        sliderOverride = this.sliderVal
      }
      let nextVal = sliderOverride + 1
      if (
        sliderOverride === this.captureIndices.length &&
        !this.playback.repeat
      ) {
        this.playback.playing = false
        this.startOrEndPlayback()
        return
      } else if (
        sliderOverride === this.captureIndices.length &&
        this.playback.repeat
      ) {
        nextVal = 1
      }
      this.sliderHistoryCallback(
        nextVal,
        this.playback.delay < 450 && this.sliderVal > nextVal
          ? 'auto'
          : 'smooth'
      )
    },
    resetLimit(): void {
      this.currentIndex = -1
    },
    historyIndexCallback(captureIndex: number): void {
      if (!this.loaded) {
        return
      }
      this.oldSliderVal = captureIndex
      this.historyCallback(captureIndex)
    },
    scrollHighlightListener(): void {
      if (this.scrollEndTimer) {
        clearTimeout(this.scrollEndTimer)
      }
      this.scrollEndTimer = setTimeout(() => {
        if (this.scrolledCard) {
          this.scrolledCard.parentElement?.removeEventListener(
            'scroll',
            this.scrollHighlightListener
          )
          this.scrolledCard.classList.add('highlight')
          this.scrolledCard.addEventListener(
            'animationend',
            () => {
              this.scrolledCard?.classList.remove('highlight')
            },
            { once: true }
          )
        }
      }, 100)
    },
    sliderHistoryCallback(value: number, behavior?: 'smooth' | 'auto'): void {
      if (!this.loaded) {
        return
      }
      const captureCards = this.$refs.captureCards as Vue[]
      if (value <= captureCards.length && value > 0) {
        this.scrolledCard = captureCards[captureCards.length - value].$el
        this.scrolledCard.classList.remove('highlight')
        this.scrolledCard.parentElement?.addEventListener(
          'scroll',
          this.scrollHighlightListener
        )
        this.scrolledCard.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: behavior !== undefined ? 'smooth' : behavior,
        })
        // add highlight here to make the animation play if no scroll is needed
        this.scrollEndTimer = setTimeout(() => {
          if (this.scrolledCard) {
            this.scrolledCard.parentElement?.removeEventListener(
              'scroll',
              this.scrollHighlightListener
            )
            this.scrolledCard.classList.add('highlight')
            this.scrolledCard.addEventListener(
              'animationend',
              () => {
                this.scrolledCard?.classList.remove('highlight')
              },
              { once: true }
            )
          }
        }, 100)
      }
      this.historyCallback(value)
    },
    historyCallback(value: number): void {
      this.sliderVal = value
      const reverse = this.oldSliderVal > this.sliderVal
      this.oldSliderVal = this.sliderVal
      if (this.sliderVal >= this.captureIndices.length) {
        this.resetLimit()
      }
      // Force an update when returning to the latest capture
      let forceUpdate = false
      if (this.sliderVal >= this.captureIndices.length) {
        forceUpdate = true
      }

      this.updateTerritory(
        // Copy the history since updateTerritory reverses the provided list
        Object.assign([], this.historyCache),
        forceUpdate ? undefined : this.sliderVal,
        forceUpdate,
        reverse
      )

      this.updateCutoffs()
    },
    updateTerritory(
      result: InstanceFacilityControlEntriesResponseInterface[],
      indexLimit?: number,
      force = false,
      reverse = false
    ): void {
      if (this.lastCaptured) {
        this.lastCaptured.getElement()?.classList.remove('lastCaptured')
        this.polys.removeLayer(this.lastCaptured)
        this.lastCaptured.options.pane = 'hexPane'
        this.polys.addLayer(this.lastCaptured)
      }
      if (indexLimit) {
        this.currentIndex = 0
      }
      // result is ordered by timestamp descending, so the most recent is first, and all defences are filtered by the API
      const lastCaptureEvent = result[0]
      result.reverse().forEach((controlEvent, index, eventArray) => {
        // We aren't forcing an update and the map has already loaded
        if (!force && this.loaded) {
          // This is an initial control event or an event we've already consumed
          if (
            controlEvent.isInitial ||
            this.lastUpdated > new Date(controlEvent.timestamp)
          ) {
            // We are not scrubbing through history
            if (this.currentIndex === -1 || this.currentIndex > index) {
              // Do nothing with the control event
              return
            }
          }
        }

        // This basically checks to see if we are either:
        //    1. Seeing a new capture come in while we are auto updating, or
        //    2. Resetting the map to a capture event further along the alert than this one
        // and applies the capture event if either of those are true
        if (
          (this.currentIndex === -1 && indexLimit === undefined) ||
          (indexLimit !== undefined && index < this.captureIndices[indexLimit])
        ) {
          let region = this.mapRegions.get(controlEvent.facility)
          if (!region) {
            return
          }

          // Update map region (TODO: Update links should probably be refactored into something the region can do)
          // This does not immediately set the hex color, but instead waits for updateCutoffs to be called
          region.faction = controlEvent.newFaction
          region.badge().update(this.map.getZoom())
          this.updateLinks(controlEvent.facility)

          // If we've reached the final region we're updating, apply the "captured" class to the hex to animate the color change
          if (
            (indexLimit && index === this.captureIndices[indexLimit - 1]) ||
            controlEvent.timestamp === lastCaptureEvent?.timestamp
          ) {
            const reverseFacility =
              reverse && indexLimit
                ? eventArray[this.captureIndices[indexLimit]].facility
                : undefined
            const facility = controlEvent.facility
            region = this.mapRegions.get(facility)
            if (!region) {
              console.error(
                `Region not found for facility ${facility.toString()}`
              )
              return
            }
            const polygon = this.polys.getLayer(region.outlineStamp) as
              | L.Polygon
              | undefined
            if (polygon) {
              this.lastCaptured = polygon
              this.polys.removeLayer(this.lastCaptured)
              this.lastCaptured.options.pane = 'capturedHexPane'
              this.polys.addLayer(this.lastCaptured)
              this.lastCaptured
                .getElement()
                ?.classList.add('captured', 'lastCaptured')
              this.lastCaptured.getElement()?.addEventListener(
                'animationend',
                (event) => {
                  ;(event.target as Element).classList.remove('captured')
                },
                { once: true }
              )
            }

            // if we're moving backwards through time, add an 'uncaptured' animation to show what base we backed off from
            if (reverseFacility) {
              region = this.mapRegions.get(reverseFacility)
              if (!region) {
                console.error(
                  `Region not found for facility ${reverseFacility.toString()}`
                )
                return
              }
              const revPolygon = this.polys.getLayer(region.outlineStamp) as
                | L.Polygon
                | undefined
              revPolygon?.getElement()?.classList.add('uncaptured')
              revPolygon?.getElement()?.addEventListener(
                'animationend',
                (event) => {
                  ;(event.target as Element).classList.remove('uncaptured')
                },
                { once: true }
              )
            }
          }
          if (indexLimit) {
            this.currentIndex = index
          }
        }
        // If this is a brand new capture event, add it to our list
        if (!controlEvent.isInitial && !this.captureIndices.includes(index)) {
          this.captureIndices.push(index)
          this.tickLabels.push(factionCircleEmoji(controlEvent.newFaction))
          this.sliderMax = this.captureIndices.length
          if (this.currentIndex === -1) {
            this.sliderVal = this.sliderMax
            this.oldSliderVal = this.sliderVal
          }
        }
      })
    },
    updateCutoffs(): void {
      for (const region of this.mapRegions.values()) {
        region.cutoff = this.cutoff(region)
        const polygon = this.polys.getLayer(region.outlineStamp) as
          | L.Polygon
          | undefined
        polygon?.getElement()?.classList.forEach((className, _, classList) => {
          if (className.startsWith('region-')) {
            classList.remove(className)
          }
        })
        const className =
          'region-' +
          factionShortName(region.faction, true) +
          (region.cutoff ? '-cutoff' : '')
        polygon?.getElement()?.classList.add(className)
      }
    },
    updateLinks(facility: number) {
      const region = this.mapRegions.get(facility)
      if (region === undefined) {
        return
      }
      region.connections.forEach((connection) => {
        const linkStamp = region.linkStamps.get(connection.id)
        const bgLinkStamp = region.bgLinkStamps.get(connection.id)
        if (linkStamp === undefined || bgLinkStamp === undefined) {
          console.error(
            'AlertMap.updateLinks: link between ' +
              region.name +
              ' and ' +
              connection.name +
              ' does not exist!'
          )
          return
        }
        const link = this.links.getLayer(linkStamp) as L.Polyline | undefined
        const bglink = this.links.getLayer(bgLinkStamp) as
          | L.Polyline
          | undefined
        if (link === undefined || bglink === undefined) {
          console.error(
            'AlertMap.updateLinks: link between ' +
              region.name +
              ' and ' +
              connection.name +
              ' does not exist!'
          )
          return
        }

        const warpgate =
          region.facilityType === FacilityType.WARPGATE ||
          connection.facilityType === FacilityType.WARPGATE
        const allied = region.faction === connection.faction
        const disabled =
          region.faction === Faction.NONE || connection.faction === Faction.NONE
        const className =
          'link-' +
          (allied
            ? factionShortName(region.faction, true)
            : disabled
            ? factionShortName(Faction.NONE, true)
            : warpgate
            ? 'warpgate'
            : 'captureable')

        link.getElement()?.classList.forEach((aClassName, _, classList) => {
          if (aClassName.startsWith('link-')) {
            classList.remove(aClassName)
          }
        })
        link.getElement()?.classList.add(className)

        bglink.getElement()?.classList.forEach((aClassName, _, classList) => {
          if (aClassName.startsWith('bglink-')) {
            classList.remove(aClassName)
          }
        })
        bglink.getElement()?.classList.add(`bg${className}`)
      })
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2AlertsEventState.ENDED) {
        return
      }

      let endpoint = Endpoints.INSTANCE_FACILITY_CONTROL_ENTRIES.replace(
        '{instance}',
        this.alert.instanceId ? this.alert.instanceId.toString() : 'whatever'
      )
      if (
        this.alert.ps2AlertsEventType &&
        this.alert.ps2AlertsEventType ===
          Ps2AlertsEventType.OUTFIT_WARS_AUG_2022
      ) {
        endpoint = ps2AlertsApiEndpoints.outfitwarsInstanceFacility.replace(
          '{instanceId}',
          this.alert.instanceId ? this.alert.instanceId.toString() : 'whatever'
        )
      }

      console.log('AlertMap.pull', this.alert.instanceId)
      await Promise.all([
        this.pullOutfitData(this.alert.instanceId ?? '12345'),
        new ApiRequest().get<InstanceFacilityControlEntriesResponseInterface[]>(
          `${endpoint}?sortBy=timestamp&order=desc&noDefences=true`
        ),
      ])
        .then((values) => {
          this.outfitData = values[0]
          const result = values[1]
          // Ensure the correct fields are filled from the map control embed
          for (let facilityControl of result) {
            if (
              this.alert.ps2AlertsEventType ===
                Ps2AlertsEventType.OUTFIT_WARS_AUG_2022 &&
              facilityControl.mapControl
            ) {
              (facilityControl.mapControl as MapControlInterface).tr = (facilityControl.mapControl as OutfitwarsTerritoryResultInterface).red;
              (facilityControl.mapControl as MapControlInterface).nc = (facilityControl.mapControl as OutfitwarsTerritoryResultInterface).blue;
              (facilityControl.mapControl as MapControlInterface).vs = 0
            }
          }
          // Copy the history since updateTerritory reverses the provided list
          this.historyCache = Object.assign([], result)
          this.updateTerritory(result, undefined)
          this.updateCutoffs()

          this.loaded = true
          const now = new Date()
          // Yes, there really isn't a Date.UTCNow() or similar
          // Yes, I looked it up too
          // Yes, I am as appalled as you are
          this.lastUpdated = new Date(
            Date.UTC(
              now.getUTCFullYear(),
              now.getUTCMonth(),
              now.getUTCDate(),
              now.getUTCHours(),
              now.getUTCMinutes(),
              now.getUTCSeconds()
            )
          )
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
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
        return
      }
      const zone = this.alert.zone
      if (!zone) {
        console.error('AlertMap.loadRegions: No zone information found')
        return
      }
      const regions = await new MapRegionDataRequest().pull(
        zone,
        this.alert.mapVersion ?? '1.0'
      )

      regions.forEach((region) => {
        this.mapRegions.set(region.id, region)
        const polygon = this.$L.polygon(
          region.outline(),
          region.outlineOptions()
        )

        // Set on hover colors and ensure the attached badge layers get the same event
        polygon.on('mouseover', (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: '#FFFFFF',
          })
          if (region.badge().ready()) {
            region.badge().setHovered(true, this.map.getZoom())
            ;(
              this.badges.getLayer(region.badge().indicatorStamp) as
                | L.Marker
                | undefined
            )?.fire('mouseover', e, false)
            ;(
              this.textBadges.getLayer(region.badge().textStamp) as
                | L.Marker
                | undefined
            )?.fire('mouseover', e, false)
          }
          e.target.bringToFront()
        })

        // Set on hover colors and ensure the attached badge layers get the same event
        polygon.on('mouseout', (e: L.LeafletMouseEvent) => {
          e.target.setStyle({
            color: '#000000',
          })
          if (region.badge().ready()) {
            region.badge().setHovered(false, this.map.getZoom())
            ;(
              this.badges.getLayer(region.badge().indicatorStamp) as
                | L.Marker
                | undefined
            )?.fire('mouseout', e, false)
            ;(
              this.textBadges.getLayer(region.badge().textStamp) as
                | L.Marker
                | undefined
            )?.fire('mouseout', e, false)
          }
        })

        region.outlineStamp = this.$L.stamp(polygon)
        this.polys.addLayer(polygon)
      })

      // Build facility links
      regions.forEach((region) => {
        region.connections.forEach((connection) => {
          // No duplicates
          if (region.linkStamps.get(connection.id) !== undefined) {
            return
          }
          const link = this.$L.polyline(
            [
              worldToMap(region.badgeLocation.asArray()),
              worldToMap(connection.badgeLocation.asArray()),
            ],
            {
              weight: 2,
              pane: 'linkPane',
              className: 'link-NS',
              interactive: false,
              bubblingMouseEvents: true,
            }
          )
          region.linkStamps.set(connection.id, this.$L.stamp(link))
          connection.linkStamps.set(region.id, this.$L.stamp(link))

          const bglink = this.$L.polyline(
            [
              worldToMap(region.badgeLocation.asArray()),
              worldToMap(connection.badgeLocation.asArray()),
            ],
            {
              weight: 2,
              pane: 'linkPane',
              className: 'bglink-NS',
              interactive: false,
              bubblingMouseEvents: true,
            }
          )
          region.bgLinkStamps.set(connection.id, this.$L.stamp(bglink))
          connection.bgLinkStamps.set(region.id, this.$L.stamp(bglink))

          this.links.addLayer(bglink)
          this.links.addLayer(link)
        })
        this.createRegionBadge(region)
      })

      this.map.on('zoom', () => {
        for (const region of this.mapRegions.values()) {
          region.badge().update(this.map.getZoom())
        }
        if (Math.abs(this.prevZoom - this.map.getZoom()) < 0.1) {
          return
        }
        const direction = this.prevZoom - this.map.getZoom()
        // current zoom > previous zoom means we zoomed in
        if (direction < 0) {
          this.zoomOutSound.pause()
          this.zoomInSound.currentTime = 0
          this.zoomInSound.play()
        } else if (direction > 0) {
          this.zoomInSound.pause()
          this.zoomOutSound.currentTime = 0
          this.zoomOutSound.play()
        }
        this.prevZoom = this.map.getZoom()
      })

      for (const region of this.mapRegions.values()) {
        const badge = this.badges.getLayer(region.badge().indicatorStamp)
        const text = this.textBadges.getLayer(region.badge().textStamp)
        const polygon = this.polys.getLayer(region.outlineStamp)
        if (
          badge === undefined ||
          polygon === undefined ||
          text === undefined
        ) {
          return
        }
        badge.addEventParent(polygon)
        text.addEventParent(badge)
      }

      this.polys.addTo(this.map)
      this.links.addTo(this.map)
      this.badges.addTo(this.map)
      this.textBadges.addTo(this.map)
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

@keyframes alert {
  0% {
    filter: blur(2px);
    opacity: 0.5;
    width: 23%;
    left: -1.5%;
  }
  50% {
    filter: blur(4px);
    opacity: 1;
    width: 23%;
    left: -1.5%;
  }
  100% {
    filter: blur(0);
  }
}

.animate-alert {
  animation: alert 1s linear infinite alternate;
}

.alert-timer {
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 5px rgba(0, 194, 253, 0.7), 0 0 10px rgba(0, 194, 253, 0.7),
    0 0 15px rgba(0, 194, 253, 0.7), 0 0 20px rgba(0, 194, 253, 0.7);
}

.map {
  background: #010707;
  height: 850px;
  max-height: min(70vw, 80vh);
}

.bg-nexus {
  background: #051010;
}

.bg-oshur {
  background: #051010;
}

::v-deep .map-region {
  transition: fill 0.1s ease-in, opacity 0.1s ease-in, stroke 0.1s ease-in,
    fill-opacity 0.1s ease-in, stroke-opacity 0.1s ease-in;
}

::v-deep {
  .region-VS,
  .region-NC,
  .region-TR,
  .region-NS {
    fill-opacity: 0.4;
  }

  .region-VS {
    fill: #6e18a3;
  }
  .region-NC {
    fill: #0064aa;
  }
  .region-TR {
    fill: #bc1212;
  }
  .region-NS {
    fill: #718096;
  }

  .region-VS-cutoff,
  .region-NC-cutoff,
  .region-TR-cutoff,
  .region-NS-cutoff {
    fill-opacity: 0.8;
  }

  .region-VS-cutoff {
    fill: #2e153d;
  }
  .region-NC-cutoff {
    fill: #0f273f;
  }
  .region-TR-cutoff {
    fill: #3a0005;
  }
  .region-NS-cutoff {
    fill: #718096;
  }

  .link-VS,
  .link-NC,
  .link-TR,
  .link-warpgate,
  .link-capturable,
  .bglink-warpgate,
  .bglink-captureable {
    opacity: 0.8;
  }

  .link-warpgate,
  .link-captureable,
  .bglink-warpgate,
  .bglink-captureable {
    stroke-dasharray: 5 5;
  }

  .link-VS {
    stroke: #ffb2ff;
  }
  .link-NC {
    stroke: #b0ffff;
  }
  .link-TR {
    stroke: #ffbfb2;
  }
  .link-NS {
    stroke: #928e99;
    opacity: 0.6;
  }
  .link-warpgate {
    stroke: #928e99;
  }
  .link-captureable {
    stroke: #eae690;
  }

  .bglink-NS,
  .bglink-VS,
  .bglink-NC,
  .bglink-TR {
    stroke: none;
  }
  .bglink-warpgate {
    stroke: #49474c;
    stroke-dashoffset: 5;
  }
  .bglink-captureable {
    stroke: #8b7251;
    stroke-dashoffset: 5;
  }

  .timeline {
    --scrollbar-foreground: rgb(48, 58, 64);
    --scrollbar-background: rgba(55, 65, 81, 0);
    --radius: 10px;
    --size: 10px;
    scrollbar-color: var(--scrollbar-foreground) var(--scrollbar-background);
    scrollbar-width: thin;
    height: 850px;
    max-height: min(70vw, 80vh);
  }
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
</style>
