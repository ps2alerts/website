<template>
  <div class="col-span-12 card relative text-center">
    <div class="tag section">Map</div>
    <CountdownSpinner
      v-if="alert.state === 1"
      :percent="updateCountdownPercent"
      :update-rate="updateRate"
    />
    <div class="grid gap-2 grid-cols-4">
      <div class="col-start-1 col-span-4 xl:col-span-3">
        <client-only>
          <l-map
            ref="map"
            class="map"
            :zoom="zoom"
            :center="center"
            :max-zoom="maxZoom"
            :zoom-snap="zoomSnap"
            :zoom-delta="zoomDelta"
            :crs="crs"
          >
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
                />
                <img
                  src="/img/alert-icon.png"
                  class="absolute left-0 w-3 xl:w-6"
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
      <div
        class="timeline overflow-y-auto col-start-4 col-span-1 hidden xl:block"
      >
        <client-only>
          <v-card-text class="text-gray-300">
            Alert Capture Timeline
          </v-card-text>
          <v-card
            v-for="(captureIndex, index) in captureIndices.slice().reverse()"
            :key="index"
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
              <div class="pb-1 pt-6 px-10 text-sm">
                {{ regionName(captureIndex) }}
              </div>
              <div class="px-2 pb-4 text-sm">
                {{ capturingOutfitTag(captureIndex) }} captured the base from
                the {{ controlData(captureIndex).loser }}
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
                <span v-if="!controlData(captureIndex).mapControl"
                  >Awaiting data...</span
                >
              </div>
            </div>
          </v-card>
        </client-only>
      </div>
      <div class="col-start-1 col-span-4">
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
          @change="historyCallback"
          @click:prepend="decrementSlider"
          @click:append="incrementSlider"
        ></v-slider>
      </div>
      <div
        v-if="captureIndices.length > sliderVal - 1 && sliderVal - 1 >= 0"
        class="col-start-1 col-span-4 text-xs xl:text-base"
      >
        <span
          class="bg-neutral-800 border border-black border-solid rounded py-2"
        >
          <span
            :class="controlData(captureIndices[sliderVal - 1]).bgClass + ' p-2'"
          >
            <span class="text-gray-300"
              >{{
                controlData(captureIndices[sliderVal - 1]).timestamp
                  | dateTimeFormatShort
              }}:</span
            >
            {{ regionName(captureIndices[sliderVal - 1]) }} captured by
            {{ capturingOutfitTag(captureIndices[sliderVal - 1]) }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { LControl, LMap } from 'vue2-leaflet'
import RemainingTime from '../RemainingTime.vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import { worldToMap } from '~/libraries/MapWorld'
import { MAP_FACTION_COLORS } from '@/constants/FactionMapColors'
import { Zone, zoneToWarpgateArray } from '@/constants/Zone'
import ApiRequest from '@/api-request'
import MapRegionDataRequest from '@/libraries/MapRegionDataRequest'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceFacilityControlEntriesResponseInterface } from '~/interfaces/instance-entries/InstanceFacilityControlEntriesResponseInterface'
import { AssetsBaseUrl, Endpoints } from '~/constants/Endpoints'
import zoneNameFilter from '~/filters/ZoneName'
import { FacilityType } from '~/constants/FacilityType'
import { MapRegion } from '~/libraries/MapRegion'
import { Faction } from '~/constants/Faction'
import { FacilityBadge } from '~/libraries/FacilityBadge'
import factionShortName from '~/filters/FactionShortName'
import factionCircleEmoji from '~/filters/FactionCircleEmoji'
import { InstanceOutfitAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceOutfitAggregateResponseInterface'
import { MapControlInterface } from '~/interfaces/instance-entries/MapControlInterface'
import { FactionBgClassString } from '~/constants/FactionBgClass'

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
        '/{z}/tile_{x}_{y}.png',
      minZoom: 2,
      maxZoom: 7,
      zoomSnap: 1,
      zoomDelta: 1,
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
      oldSliderVal: 0,
      sliderVal: 0,
      sliderMax: 0,
      historyCache: [] as InstanceFacilityControlEntriesResponseInterface[],
      outfitData: new Map<string, InstanceOutfitAggregateResponseInterface>(),
      zoomInSound: new Audio(Endpoints.ASSETS_AUDIO_ZOOM_IN),
      zoomOutSound: new Audio(Endpoints.ASSETS_AUDIO_ZOOM_OUT),
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
  mounted() {
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
      this.map = (this.$refs.map as LMap).mapObject as L.Map
      this.remaining = this.$refs.timer as LControl
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
      this.map.on('zoom', () => {
        if (Math.abs(this.prevZoom - this.map.getZoom()) < 0.1) {
          return
        }
        const direction = this.prevZoom - this.map.getZoom()
        // current zoom > previous zoom means we zoomed in
        if (direction < 0 && this.zoomInSound.paused) {
          this.zoomOutSound.pause()
          this.zoomInSound.currentTime = 0
          this.zoomInSound.play()
        } else if (this.zoomOutSound.paused) {
          this.zoomInSound.pause()
          this.zoomOutSound.currentTime = 0
          this.zoomOutSound.play()
        }
        this.prevZoom = this.map.getZoom()
      })
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
          '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" width="' +
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
            return '[' + outfitAggregate.outfit.tag + ']'
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
      const mapControl = this.historyCache[reverseIndex].mapControl
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
      if (this.sliderVal === 0) {
        return
      }
      this.historyCallback(this.sliderVal - 1)
    },
    incrementSlider() {
      if (this.sliderVal === this.captureIndices.length) {
        return
      }
      this.historyCallback(this.sliderVal + 1)
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

      const capture = this.updateTerritory(
        // Copy the history since updateTerritory reverses the provided list
        Object.assign([], this.historyCache),
        forceUpdate ? undefined : this.sliderVal,
        forceUpdate,
        reverse
      )
      if (capture) {
        this.updateCutoffs()
      }
    },
    updateTerritory(
      result: InstanceFacilityControlEntriesResponseInterface[],
      indexLimit?: number,
      force = false,
      reverse = false
    ): boolean {
      let capture = false
      if (indexLimit) {
        this.currentIndex = 0
      }
      const lastCaptureEvent = result.find((event) => {
        return !event.isDefence
      })
      result.reverse().forEach((controlEvent, index, eventArray) => {
        // Defence events do not affect the map state
        //   (TODO: Though they could be used for interesting data in the future)
        if (controlEvent.isDefence) {
          return
        }

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
          // Capture is used by callers to check whether we need to update hex colors in updateCutoffs or not
          capture = true

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
                'Region not found for facility ' + facility.toString()
              )
              return
            }
            const polygon = this.polys.getLayer(region.outlineStamp) as
              | L.Polygon
              | undefined
            polygon?.getElement()?.classList.add('captured')
            polygon?.getElement()?.addEventListener(
              'animationend',
              (event) => {
                ;(event.target as Element).classList.remove('captured')
              },
              { once: true }
            )
            polygon?.bringToFront()

            // if we're moving backwards through time, add an 'uncaptured' animation to show what base we backed off from
            if (reverseFacility) {
              region = this.mapRegions.get(reverseFacility)
              if (!region) {
                console.error(
                  'Region not found for facility ' + reverseFacility.toString()
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
      return capture
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
        bglink.getElement()?.classList.add('bg' + className)
      })
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      this.outfitData = await this.pullOutfitData(
        this.alert.instanceId ?? '12345'
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
          this.historyCache = Object.assign([], result)
          const capture = this.updateTerritory(result, undefined)
          if (capture) {
            this.updateCutoffs()
          }
          this.loaded = true
          const now = new Date()
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

      const regions = await new MapRegionDataRequest().pull(
        this.alert.zone ? this.alert.zone : Zone.INDAR
      )

      this.$L.Icon.Default.prototype.options.iconAnchor = [0, 0]
      this.$L.Icon.Default.prototype.options.tooltipAnchor = [0, 0]
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
  text-shadow: 0px 0px 5px rgba(0, 194, 253, 0.7),
    0px 0px 10px rgba(0, 194, 253, 0.7), 0px 0px 15px rgba(0, 194, 253, 0.7),
    0px 0px 20px rgba(0, 194, 253, 0.7);
}

.map {
  background: #010707;
  height: 850px;
  max-height: min(70vw, 80vh);
}

::v-deep .map-region {
  transition: fill 0.1s ease-in, opacity 0.1s ease-in, stroke 0.1s ease-in,
    fill-opacity 0.1s ease-in, stroke-opacity 0.1s ease-in;
}

::v-deep .region-TR {
  fill: #bc1212;
  fill-opacity: 0.4;
}

::v-deep .region-NC {
  fill: #0064aa;
  fill-opacity: 0.4;
}

::v-deep .region-VS {
  fill: #6e18a3;
  fill-opacity: 0.4;
}

::v-deep .region-NS {
  fill: #718096;
  fill-opacity: 0.4;
}

::v-deep .region-NS-cutoff {
  fill: #718096;
  fill-opacity: 0.8;
}

::v-deep .region-VS-cutoff {
  fill: #2e153d;
  fill-opacity: 0.8;
}

::v-deep .region-NC-cutoff {
  fill: #0f273f;
  fill-opacity: 0.8;
}

::v-deep .region-TR-cutoff {
  fill: #3a0005;
  fill-opacity: 0.8;
}

::v-deep .link-NS {
  stroke: #928e99;
  opacity: 0.6;
}

::v-deep .link-VS {
  stroke: #ffb2ff;
  opacity: 0.8;
}

::v-deep .link-NC {
  stroke: #b0ffff;
  opacity: 0.8;
}

::v-deep .link-TR {
  stroke: #ffbfb2;
  opacity: 0.8;
}

::v-deep .link-warpgate {
  stroke: #928e99;
  opacity: 0.8;
  stroke-dasharray: 5 5;
}

::v-deep .link-captureable {
  stroke: #eae690;
  opacity: 0.8;
  stroke-dasharray: 5 5;
}

::v-deep .bglink-NS,
::v-deep .bglink-VS,
::v-deep .bglink-NC,
::v-deep .bglink-TR {
  stroke: none;
}

::v-deep .bglink-warpgate {
  stroke: #49474c;
  opacity: 0.8;
  stroke-dasharray: 5 5;
  stroke-dashoffset: 5;
}

::v-deep .bglink-captureable {
  stroke: #8b7251;
  opacity: 0.8;
  stroke-dasharray: 5 5;
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
