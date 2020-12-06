<template>
  <div class="col-span-12 lg:col-span-6 card">
    <div class="tag section">Combat Metrics</div>
    <div v-if="loaded" class="grid grid-cols-12 text-center">
      <div class="col-span-6 lg:col-span-3 ss:col-span-2 mb-4">
        <h1 class="text-xl">Kills</h1>
        <div v-if="data.vs" class="bg-vs w-full">
          {{ data.vs.kills || 0 }}
        </div>
        <div v-if="data.tr" class="bg-tr w-full">
          {{ data.tr.kills || 0 }}
        </div>
        <div v-if="data.nc" class="bg-nc w-full">
          {{ data.nc.kills || 0 }}
        </div>
        <div v-if="data.nso" class="bg-nso w-full">
          {{ data.nso.kills || 0 }}<sup>*1</sup>
        </div>
      </div>
      <div class="col-span-6 lg:col-span-3 ss:col-span-2 mb-4">
        <h1 class="text-xl">Deaths</h1>
        <div v-if="data.vs" class="bg-vs w-full">
          {{ data.vs.deaths || 0 }}
        </div>
        <div v-if="data.tr" class="bg-tr w-full">
          {{ data.tr.deaths || 0 }}
        </div>
        <div v-if="data.nc" class="bg-nc w-full">
          {{ data.nc.deaths || 0 }}
        </div>
        <div v-if="data.nso" class="bg-nso w-full">
          {{ data.nso.deaths || 0 }}
        </div>
      </div>
      <div class="col-span-6 lg:col-span-3 ss:col-span-2 mb-4">
        <h1 class="text-xl">KD</h1>
        <div v-if="data.vs" class="bg-vs w-full">
          {{
            data.vs.kills && data.vs.deaths
              ? (data.vs.kills / data.vs.deaths).toFixed(2)
              : data.vs.kills || 0
          }}
        </div>
        <div v-if="data.tr" class="bg-tr w-full">
          {{
            data.tr.kills && data.tr.deaths
              ? (data.tr.kills / data.tr.deaths).toFixed(2)
              : data.tr.kills || 0
          }}
        </div>
        <div v-if="data.nc" class="bg-nc w-full">
          {{
            data.nc.kills && data.nc.deaths
              ? (data.nc.kills / data.nc.deaths).toFixed(2)
              : data.nc.kills || 0
          }}
        </div>
        <div v-if="data.nso" class="bg-nso w-full">
          {{
            data.nso.kills && data.nso.deaths
              ? (data.nso.kills / data.nso.deaths).toFixed(2)
              : data.nso.kills || 0
          }}
        </div>
      </div>
      <div class="col-span-6 lg:col-span-3 ss:col-span-2 mb-4">
        <h1 class="text-xl">Teamkills</h1>
        <div v-if="data.vs" class="bg-vs w-full">
          {{ data.vs.teamKills || 0 }}
        </div>
        <div v-if="data.tr" class="bg-tr w-full">
          {{ data.tr.teamKills || 0 }}
        </div>
        <div v-if="data.nc" class="bg-nc w-full">
          {{ data.nc.teamKills || 0 }}
        </div>
        <div v-if="data.nso" class="bg-nso w-full">N/A<sup>*2</sup></div>
      </div>
      <div class="col-span-6 lg:col-span-3 ss:col-span-2 mb-4">
        <h1 class="text-xl">Suicides</h1>
        <div v-if="data.vs" class="bg-vs w-full">
          {{ data.vs.suicides || 0 }}
        </div>
        <div v-if="data.tr" class="bg-tr w-full">
          {{ data.tr.suicides || 0 }}
        </div>
        <div v-if="data.nc" class="bg-nc w-full">
          {{ data.nc.suicides || 0 }}
        </div>
        <div v-if="data.nso" class="bg-nso w-full">
          {{ data.nso.suicides || 0 }}
        </div>
      </div>
      <div class="col-span-6 lg:col-span-3 ss:col-span-2 mb-4">
        <h1 class="text-xl">Headshots</h1>
        <div v-if="data.vs" class="bg-vs w-full">
          {{ data.vs.headshots || 0 }}
        </div>
        <div v-if="data.tr" class="bg-tr w-full">
          {{ data.tr.headshots || 0 }}
        </div>
        <div v-if="data.nc" class="bg-nc w-full">
          {{ data.nc.headshots || 0 }}
        </div>
        <div v-if="data.nso" class="bg-nso w-full">
          {{ data.nso.headshots || 0 }}
        </div>
      </div>
      <div class="col-span-6 lg:col-span-3 ss:col-span-2 mb-4">
        <h1 class="text-xl">HSR %</h1>
        <div v-if="data.vs" class="bg-vs w-full">
          {{
            data.vs.headshots && data.vs.kills
              ? ((data.vs.headshots / data.vs.kills) * 100).toFixed(2)
              : 0
          }}
        </div>
        <div v-if="data.tr" class="bg-tr w-full">
          {{
            data.tr.headshots && data.tr.kills
              ? ((data.tr.headshots / data.tr.kills) * 100).toFixed(2)
              : 0
          }}
        </div>
        <div v-if="data.nc" class="bg-nc w-full">
          {{
            data.nc.headshots && data.nc.kills
              ? ((data.nc.headshots / data.nc.kills) * 100).toFixed(2)
              : 0
          }}
        </div>
        <div v-if="data.nso" class="bg-nso w-full">
          {{
            data.nso.headshots && data.nso.kills
              ? ((data.nso.headshots / data.nso.kills) * 100).toFixed(2)
              : 0
          }}
        </div>
      </div>
    </div>
    <div class="col-span-12 text-xs text-gray-500 text-left">
      <p>*1 does not include NSO vs NSO kills.</p>
      <p>
        *2 NSO Teamkills are not tracked it's currently incalculable accurately.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceFactionCombatAggregateResponseInterface } from '@/interfaces/InstanceFactionCombatAggregateResponseInterface'
import { Endpoints } from '@/constants/Endpoints'

export default Vue.extend({
  name: 'AlertFactionCombat',
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
      interval: undefined as undefined | number,
      data: {} as InstanceFactionCombatAggregateResponseInterface,
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  created() {
    clearInterval(this.interval)
    this.init()
  },
  methods: {
    init(): void {
      this.pull()
      this.interval = window.setInterval(() => {
        this.pull()
      }, 10000)
    },
    async pull(): Promise<void> {
      console.log('AlertFactionCombatMetrics.pull', this.alert.instanceId)
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      await new ApiRequest()
        .get<InstanceFactionCombatAggregateResponseInterface>(
          Endpoints.AGGREGATES_INSTANCE_FACTION.replace(
            '{instance}',
            this.alert.instanceId
              ? this.alert.instanceId.toString()
              : 'whatever'
          )
        )
        .then((result) => {
          this.data = result
          this.loaded = true
        })
        .catch((e) => {
          this.error = e.message
        })
    },
  },
})
</script>
