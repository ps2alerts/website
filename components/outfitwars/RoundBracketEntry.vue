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
      class="flex gap-2 p-2 mb-2 bg-tint rounded relative hover bg-[#1e1e1e]"
    >
      <div class="self-center">
        <object
          :data="rankings[0].id | outfitImage"
          type="image/png"
          width="50px"
        >
          <img
            :src="rankings[0].faction | factionImage"
            :alt="rankings[0].faction"
          />
        </object>
      </div>
      <div class="grid grid-cols-7 gap-2 justify-center grow">
        <div class="col-start-1 col-span-3 text-base mb-2 lg:mb-0">
          <div class="text-right mb-1">
            {{ rankings[0].name.trim() }}
          </div>
        </div>
        <div class="col-start-4 col-span-1 text-base mb-2 lg:mb-0">
          <div class="text-center mb-1">vs.</div>
        </div>
        <div class="col-end-8 col-span-3 text-base mb-2 lg:mb-0">
          <div class="text-left mb-1">
            {{ rankings[1].name.trim() }}
          </div>
        </div>
        <!-- Using borders here for alignment - the FactionSegment bar is 1px taller than the Awaiting match text otherwise -->
        <div
          v-if="!(match && match.result)"
          class="text-gray-500 col-start-3 col-span-3 border-b border-[#1e1e1e] rounded"
        >
          <span
            >Match starts {{ getUserTime(rankings[0].matchStartTime) }}</span
          >
        </div>
        <FactionSegmentBar
          v-else-if="match && match.result"
          class="col-start-2 col-span-5"
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
        <object
          :data="rankings[1].id | outfitImage"
          type="image/png"
          width="50px"
        >
          <img
            :src="rankings[1].faction | factionImage"
            :alt="rankings[1].faction"
          />
        </object>
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts">
import Vue from 'vue'
import moment from 'moment-timezone'
import { PropValidator } from 'vue/types/options'
import { DATE_TIME_FORMAT_SHORT } from '@/constants/Time'
import { Team } from '@/ps2alerts-constants/outfitwars/team'
import { FactionBgClass } from '@/constants/FactionBgClass'
import { FactionBorderClass } from '@/constants/FactionBorderClass'
import FactionSegmentBar from '~/components/common/FactionSegmentBar.vue'
import { InstanceOutfitWarsResponseInterface } from '~/interfaces/InstanceOutfitWarsResponseInterface'
import { ParsedOutfitDataInterface } from '~/interfaces/ParsedOutfitDataInterface'
import ApiRequest from '~/api-request'
import { ps2AlertsApiEndpoints } from '~/ps2alerts-constants/ps2AlertsApiEndpoints'
import { Ps2AlertsEventState } from '~/ps2alerts-constants/ps2AlertsEventState'

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
            entry.id === undefined ||
            entry.name === undefined ||
            entry.faction === undefined ||
            entry.world === undefined ||
            entry.matchStartTime === undefined
          ) {
            return false
          }
        }
        return true
      },
      required: true,
    } as PropValidator<ParsedOutfitDataInterface[]>,
  },
  data() {
    return {
      match: undefined as InstanceOutfitWarsResponseInterface | undefined,
      updateRate: 10000,
      updateInterval: undefined as number | undefined,
    }
  },
  computed: {
    started(): string {
      return moment(this.match?.timeStarted).format(DATE_TIME_FORMAT_SHORT)
    },
    ended(): string {
      return moment(this.match?.timeEnded).format(DATE_TIME_FORMAT_SHORT)
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
    init() {
      this.pull()
      this.updateInterval = window.setInterval(() => {
        this.pull()
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
    getUserTime(datetime: Date): string {
      const locale = Intl.NumberFormat().resolvedOptions().locale
      try {
        return new Intl.DateTimeFormat(locale, {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(datetime)
      } catch (err) {
        console.error(err)
        console.error(JSON.stringify(datetime))
        return datetime.toLocaleString(locale)
      }
    },
  },
})
</script>
