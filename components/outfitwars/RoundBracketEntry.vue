<!-- eslint-disable prettier/prettier -->
<template>
  <NuxtLink
    :to="{
      name: 'outfit-wars-outfitwars',
      params: { outfitwars: match ? match.instanceId : '' },
    }"
    :disabled="!match"
    :event="match && match.state !== 0 ? 'click' : ''"
  >
    <div
      v-if="loaded && redData !== undefined && blueData !== undefined"
      class="flex gap-2 p-2 mb-2 border bg-tint rounded relative hover text-xs sm:text-base"
      :class="getBackgroundColour()"
    >
      <div class="self-center">
        <TeamLogo
          class="self-center place-self-center w-12"
          :outfit-id="redData.id"
          :outfit-faction="redData.faction"
          rounding="rounded"
        />
        <span :class="getLabelClass(redData.faction)">{{
          redData.faction | factionShortName
        }}</span>
      </div>
      <div
        class="grid grid-cols-7 gap-x-1 gap-y-2 w-full content-center"
      >
        <div class="flex items-center align-middle justify-end col-start-1 col-span-3 mb-2 lg:mb-0">
          <div
            class="text-right mb-1 font-semibold text-shadow"
            :class="formatOutfitFaction(getTeamFaction(redData.id))"
          >
            <span v-if="victor === 3" class="font-bold">{{ formatOutfitName(redData.displayName.trim()) }}</span>
            <span v-else-if="victor" class="line-through">{{ formatOutfitName(redData.displayName.trim()) }}</span>
            <span v-else>{{ formatOutfitName(redData.displayName.trim()) }}</span>
            <span v-if="redData.index !== undefined" class="text-gray-500 py-2">#{{ redData.index + 1 }}</span>
          </div>
        </div>
        <div class="flex items-center align-middle justify-evenly col-start-4 col-span-1 mb-2 lg:mb-0">
          <div class="text-center mb-1">vs</div>
        </div>
        <div class="flex items-center align-middle justify-start col-end-8 col-span-3 mb-2 lg:mb-0">
          <div
            class="text-left mb-1 font-semibold text-shadow"
            :class="formatOutfitFaction(getTeamFaction(blueData.id))"
          >
            <span v-if="blueData.index !== undefined" class="text-gray-500 py-2">#{{ blueData.index + 1 }}</span>
            <span v-if="victor === 2" class="font-bold">{{ formatOutfitName(blueData.displayName.trim()) }}</span>
            <span v-else-if="victor" class="line-through">{{ formatOutfitName(blueData.displayName.trim()) }}</span>
            <span v-else>{{ formatOutfitName(blueData.displayName.trim()) }}</span>
          </div>
        </div>
        <!-- Using borders here for alignment - the FactionSegment bar is 1px taller than the Awaiting match text otherwise -->
        <div
          v-if="!(match && match.result)"
          class="text-gray-500 col-start-3 col-span-3"
        >
          <span>{{ getUserTime(blueData.matchStartTime) }}</span
          >
        </div>
        <FactionSegmentBar
          v-else-if="match && match.result"
          class="col-start-1 col-span-7"
          :vs="0"
          :nc="match.result.blue"
          :tr="match.result.red"
          :other="match.result.cutoff"
          :out-of-play="0"
          dropoff-percent="5"
          :outfitwars="true"
        />
      </div>
      <div class="self-center">
        <TeamLogo
          class="self-center place-self-center w-12"
          :outfit-id="blueData.id"
          :outfit-faction="blueData.faction"
          rounding="rounded"
        />
        <span :class="getLabelClass(blueData.faction)">{{
          blueData.faction | factionShortName
        }}</span>
      </div>
    </div>
    <div
      v-else-if="loaded && redData !== undefined"
      class="flex gap-2 p-2 mb-2 border bg-tint rounded relative hover text-xs sm:text-base"
    >
      <div class="self-center">
        <TeamLogo
          class="self-center place-self-center w-12"
          :outfit-id="redData.id"
          :outfit-faction="redData.faction"
          rounding="rounded"
        />
        <span :class="getLabelClass(redData.faction)">{{
          redData.faction | factionShortName
        }}</span>
      </div>
      <div
        class="grid grid-cols-7 gap-x-1 gap-y-2 w-full content-center"
      >
        <div class="flex items-center align-middle justify-end col-start-1 col-span-3 mb-2 lg:mb-0">
          <div
            class="text-right mb-1 font-semibold text-shadow"
            :class="formatOutfitFaction(getTeamFaction(redData.id))"
          >
            <span v-if="victor === 3" class="font-bold">{{ formatOutfitName(redData.displayName.trim()) }}</span>
            <span v-else-if="victor" class="line-through">{{ formatOutfitName(redData.displayName.trim()) }}</span>
            <span v-else>{{ formatOutfitName(redData.displayName.trim()) }}</span>
          </div>
        </div>
        <div class="flex items-center align-middle justify-center col-start-4 col-span-1 mb-2 lg:mb-0">
          <div class="text-center mb-1">vs</div>
        </div>
        <div class="flex items-center align-middle justify-start col-end-8 col-span-3 mb-2 lg:mb-0">
          <div
            class="text-left mb-1 font-semibold text-shadow"
            :class="formatOutfitFaction(0)"
          >
            <span v-if="victor === 2" class="font-bold">{{ formatOutfitName('Undefined') }}</span>
            <span v-else-if="victor" class="line-through">{{ formatOutfitName('Undefined') }}</span>
            <span v-else>{{ formatOutfitName('Undefined') }}</span>
          </div>
        </div>
        <!-- Using borders here for alignment - the FactionSegment bar is 1px taller than the Awaiting match text otherwise -->
        <div
          v-if="!(match && match.result)"
          class="text-gray-500 col-start-3 col-span-3"
        >
          <span>{{ getUserTime(redData.matchStartTime) }}</span
          >
        </div>
        <FactionSegmentBar
          v-else-if="match && match.result"
          class="col-start-1 col-span-7"
          :vs="0"
          :nc="match.result.blue"
          :tr="match.result.red"
          :other="match.result.cutoff"
          :out-of-play="0"
          dropoff-percent="5"
          :outfitwars="true"
        />
      </div>
      <div class="self-center">
        <TeamLogo
          class="self-center place-self-center w-12"
          outfit-id="'0'"
          :outfit-faction="0"
          rounding="rounded"
        />
        <span :class="getLabelClass(0)">{{
          0 | factionShortName
        }}</span>
      </div>
    </div>
    <div
      v-else-if="loaded && blueData !== undefined"
      class="flex gap-2 p-2 mb-2 border bg-tint rounded relative hover text-xs sm:text-base"
    >
      <div class="self-center">
        <TeamLogo
          class="self-center place-self-center w-12"
          outfit-id="0"
          :outfit-faction="0"
          rounding="rounded"
        />
        <span :class="getLabelClass(0)">{{
          0 | factionShortName
        }}</span>
      </div>
      <div
        class="grid grid-cols-7 gap-x-1 gap-y-2 w-full content-center"
      >
        <div class="flex items-center align-middle justify-end col-start-1 col-span-3 mb-2 lg:mb-0">
          <div
            class="text-right mb-1 font-semibold text-shadow"
            :class="formatOutfitFaction(0)"
          >
            <span v-if="victor === 3" class="font-bold">{{ formatOutfitName('Undefined') }}</span>
            <span v-else-if="victor" class="line-through">{{ formatOutfitName('Undefined') }}</span>
            <span v-else>{{ formatOutfitName('Undefined') }}</span>
          </div>
        </div>
        <div class="flex items-center align-middle justify-center col-start-4 col-span-1 mb-2 lg:mb-0">
          <div class="text-center mb-1">vs</div>
        </div>
        <div class="flex items-center align-middle justify-start col-end-8 col-span-3 mb-2 lg:mb-0">
          <div
            class="text-left mb-1 font-semibold text-shadow"
            :class="formatOutfitFaction(getTeamFaction(blueData.id))"
          >
            <span v-if="victor === 2" class="font-bold">{{ formatOutfitName(blueData.displayName.trim()) }}</span>
            <span v-else-if="victor" class="line-through">{{ formatOutfitName(blueData.displayName.trim()) }}</span>
            <span v-else>{{ formatOutfitName(blueData.displayName.trim()) }}</span>
          </div>
        </div>
        <!-- Using borders here for alignment - the FactionSegment bar is 1px taller than the Awaiting match text otherwise -->
        <div
          v-if="!(match && match.result)"
          class="text-gray-500 col-start-3 col-span-3"
        >
          <span>{{ getUserTime(blueData.matchStartTime) }}</span
          >
        </div>
        <FactionSegmentBar
          v-else-if="match && match.result"
          class="col-start-1 col-span-7"
          :vs="0"
          :nc="match.result.blue"
          :tr="match.result.red"
          :other="match.result.cutoff"
          :out-of-play="0"
          dropoff-percent="5"
          :outfitwars="true"
        />
      </div>
      <div class="self-center">
        <TeamLogo
          class="self-center place-self-center w-12"
          :outfit-id="blueData.id"
          :outfit-faction="blueData.faction"
          rounding="rounded"
        />
        <span :class="getLabelClass(blueData.faction)">{{
          blueData.faction | factionShortName
        }}</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue'
import { PropValidator } from 'vue/types/options'
import { DATE_TIME_FORMAT_SHORT } from '@/constants/Time'
import { Team } from '@/ps2alerts-constants/outfitwars/team'
import {
  FactionBgClass,
  FactionBgClassString,
  TeamToFaction,
} from '@/constants/FactionBgClass'
import {
  FactionBorderClass,
  FactionBorderClassString,
} from '@/constants/FactionBorderClass'
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { ParsedOutfitDataInterface } from '~/interfaces/ParsedOutfitDataInterface'
import ApiRequest from '~/api-request'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'
import { Ps2AlertsEventState } from '~/ps2alerts-constants/ps2AlertsEventState'
import { Faction } from '~/ps2alerts-constants/faction'
import { FactionTextClass } from '~/constants/FactionTextClass'
import factionShortName from '~/filters/FactionShortName'
import { formatDateTime } from '~/utilities/TimeHelper'

export default Vue.extend({
  name: 'RoundBracketEntry',
  components: {
    FactionSegmentBar,
  },
  props: {
    rankings: {
      // Array of OutfitInterface
      validator(value: ParsedOutfitDataInterface[]) {
        if (value.length !== 2) {
          return false
        }
        for (const entry of value) {
          // each outfit must have an id, name, faction, world, and leader
          if (
            !entry.id ||
            !entry.name ||
            !entry.faction ||
            !entry.world ||
            !entry.matchStartTime
          ) {
            return false
          }
        }
        return true
      },
      required: true,
    } as PropValidator<ParsedOutfitDataInterface[]>,
    currentRound: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      match: undefined as InstanceOutfitWarsResponseInterface | undefined,
      updateRate: 10000,
      updateInterval: undefined as number | undefined,
      redData: undefined as ParsedOutfitDataInterface | undefined,
      blueData: undefined as ParsedOutfitDataInterface | undefined,
      loaded: false,
    }
  },
  computed: {
    started(): string {
      return formatDateTime(
        new Date(this.match?.timeStarted ?? new Date()),
        DATE_TIME_FORMAT_SHORT
      )
    },
    ended(): string {
      return formatDateTime(
        new Date(this.match?.timeEnded ?? new Date()),
        DATE_TIME_FORMAT_SHORT
      )
    },
    victorClass(): object {
      if (!this.match || this.match.state === 0) {
        return {
          'bg-nso': true,
        }
      }
      if (!this.match.result || !this.match.result.victor) {
        return {}
      }

      return {
        ...FactionBgClass(this.match.result.victor.valueOf()),
        ...FactionBorderClass(this.match.result.victor.valueOf(), true),
      }
    },
    victor(): Team | null {
      return this.match?.result ? this.match.result.victor : null
    },
  },
  watch: {
    rankings: {
      handler() {
        if (this.rankings[0].instanceId || this.rankings[1].instanceId) {
          this.pull()
        }
      },
      deep: true,
    },
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await this.pull()
      this.assignTeamData()
      this.loaded = true
      this.updateInterval = window.setInterval(() => {
        this.pull()
        this.assignTeamData()
      }, this.updateRate)
    },
    async pull() {
      const instanceId =
        this.rankings[0].instanceId ?? this.rankings[1].instanceId
      if (instanceId) {
        this.match =
          await new ApiRequest().get<InstanceOutfitWarsResponseInterface>(
            ps2AlertsApiEndpoints.outfitwarsInstance.replace(
              '{instanceId}',
              instanceId
            )
          )
        if (this.match.state === Ps2AlertsEventState.ENDED) {
          window.clearInterval(this.updateInterval)
        }
      }
    },
    formatOutfitName(string: string): string {
      const length = string.length
      const maxLength = 64
      return length > maxLength
        ? `${string.substring(0, maxLength)}...`
        : string
    },
    formatOutfitFaction(faction: Faction): object {
      return FactionTextClass(faction)
    },
    getUserTime(datetime: Date): string {
      // If match time is in the past which is a common occurrence for the future matches until we get official data, display TBA - unless we are in the 20 minute prep phase
      const now = new Date()
      const twentyMinMS = 1200000

      if (
        datetime.getTime() + twentyMinMS < now.getTime() &&
        this.rankings[0].round === this.currentRound
      ) {
        return 'Not yet scheduled'
      }

      let stringToReturn = ''

      const locale = Intl.NumberFormat().resolvedOptions().locale
      try {
        const timeString = new Intl.DateTimeFormat(locale, {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(datetime)
        stringToReturn = `Match starts: ${timeString}`
      } catch (err) {
        console.error(err)
        console.error(JSON.stringify(datetime))
        stringToReturn = `Match starts: ${datetime.toLocaleString(locale)}`
      }

      return stringToReturn
    },
    getBackgroundColour(): object {
      if (!this.match?.result.victor) {
        return {
          'bg-[#1e1e1e]': true,
          'border-gray-600': true,
          'hover:border-gray-400': true,
        }
      }

      const victorFaction = TeamToFaction(this.match?.result.victor)
      const bgClass = FactionBgClassString(victorFaction)
      const borderClass = FactionBorderClassString(victorFaction)
      return {
        [bgClass]: true,
        [borderClass]: true,
      }
    },
    getLabelClass(faction: Faction): object {
      const factionSmall = factionShortName(faction)
      // console.log(factionSmall)
      return {
        label: true,
        [factionSmall]: true,
      }
    },
    getTeamFaction(outfitId: string): Faction {
      // If no match has happened yet, we don't know what the instance will be
      if (!this.match?.instanceId) {
        return Faction.NONE
      }

      return this.match?.outfitwars.teams?.red?.id === outfitId
        ? Faction.TERRAN_REPUBLIC
        : Faction.NEW_CONGLOMERATE
    },
    // Filters the data by the team to ensure we always have a red vs blue display
    assignTeamData(): void {
      // If we don't have the match yet (match in the future), assign using available ranking data
      if (!this.match?.instanceId) {
        this.blueData = this.rankings[1]
        this.redData = this.rankings[0]
        return
      }

      const blueData = this.rankings.filter(
        (outfit: ParsedOutfitDataInterface) => {
          return outfit.id === this.match?.outfitwars.teams?.blue?.id
        }
      )
      const redData = this.rankings.filter(
        (outfit: ParsedOutfitDataInterface) => {
          return outfit.id === this.match?.outfitwars.teams?.red?.id
        }
      )

      this.blueData = blueData[0]
      this.redData = redData[0]
    },
  },
})
</script>

<style scoped lang="scss">
.text-shadow {
  text-shadow: 0 0 10px black;
}
</style>
