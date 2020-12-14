<template>
  <div
    class="col-span-12 lg:col-span-6 ss:col-span-4 card relative items-center"
  >
    <div class="tag section">Faction Combat Metrics</div>
    <div v-if="alert.state === 1" class="absolute top-0 right-0 mr-2">
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-progress-circular
            :value="updateCountdownPercent"
            :rotate="-90"
            :size="14"
            v-bind="attrs"
            v-on="on"
          ></v-progress-circular>
        </template>
        <span>Updates every {{ updateRate / 1000 }} secs</span>
      </v-tooltip>
    </div>
    <div v-if="!loaded" class="text-center">
      <h1>Loading...</h1>
    </div>
    <div v-if="loaded" class="text-center">
      <table class="w-full table-fixed border-row text-sm mb-2">
        <thead>
          <tr class="font-bold text-base">
            <td class="text-left">Metric</td>
            <td class="bg-vs px-4">VS</td>
            <td class="bg-tr px-4">TR</td>
            <td class="bg-nc px-4">NC</td>
            <td class="bg-nso px-4">NSO</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">Kills</td>
            <td class="bg-vs">
              <span v-if="data.vs">{{ data.vs.kills || 0 }}</span>
            </td>
            <td class="bg-tr">
              <span v-if="data.tr">{{ data.tr.kills || 0 }}</span>
            </td>
            <td class="bg-nc">
              <span v-if="data.nc">{{ data.nc.kills || 0 }}</span>
            </td>
            <td class="bg-nso">
              <span v-if="data.nso"
                >{{ data.nso.kills || 0 }}<sup>*1</sup></span
              >
            </td>
          </tr>
          <tr>
            <td class="text-left">Deaths</td>
            <td class="bg-vs">
              <span v-if="data.vs">{{ data.vs.deaths || 0 }}</span>
            </td>
            <td class="bg-tr">
              <span v-if="data.tr">{{ data.tr.deaths || 0 }}</span>
            </td>
            <td class="bg-nc">
              <span v-if="data.nc">{{ data.nc.deaths || 0 }}</span>
            </td>
            <td class="bg-nso">
              <span v-if="data.nso">{{ data.nso.deaths || 0 }}</span>
            </td>
          </tr>
          <tr>
            <td class="text-left">K/D</td>
            <td class="bg-vs">
              <span v-if="data.vs">
                {{
                  data.vs.kills && data.vs.deaths
                    ? (data.vs.kills / data.vs.deaths).toFixed(2)
                    : data.vs.kills || 0
                }}
              </span>
            </td>
            <td class="bg-tr">
              <span v-if="data.tr">
                {{
                  data.tr.kills && data.tr.deaths
                    ? (data.tr.kills / data.tr.deaths).toFixed(2)
                    : data.tr.kills || 0
                }}
              </span>
            </td>
            <td class="bg-nc">
              <span v-if="data.nc">
                {{
                  data.nc.kills && data.nc.deaths
                    ? (data.nc.kills / data.nc.deaths).toFixed(2)
                    : data.nc.kills || 0
                }}
              </span>
            </td>
            <td class="bg-nso">
              <span v-if="data.nso">
                {{
                  data.nso.kills && data.nso.deaths
                    ? (data.nso.kills / data.nso.deaths).toFixed(2)
                    : data.nso.kills || 0
                }}
              </span>
            </td>
          </tr>
          <tr>
            <td class="text-left">Teamkills</td>
            <td class="bg-vs">
              <span v-if="data.vs">{{ data.vs.teamKills || 0 }}</span>
            </td>
            <td class="bg-tr">
              <span v-if="data.tr">{{ data.tr.teamKills || 0 }}</span>
            </td>
            <td class="bg-nc">
              <span v-if="data.nc">{{ data.nc.teamKills || 0 }}</span>
            </td>
            <td class="bg-nso">
              <span v-if="data.nso"
                >{{ data.nso.teamKills || 0 }}<sup>*2</sup>
              </span>
            </td>
          </tr>
          <tr>
            <td class="text-left">Suicides</td>
            <td class="bg-vs">
              <span v-if="data.vs">{{ data.vs.suicides || 0 }}</span>
            </td>
            <td class="bg-tr">
              <span v-if="data.tr">{{ data.tr.suicides || 0 }}</span>
            </td>
            <td class="bg-nc">
              <span v-if="data.nc">{{ data.nc.suicides || 0 }}</span>
            </td>
            <td class="bg-nso">
              <span v-if="data.nso">{{ data.nso.suicides || 0 }}</span>
            </td>
          </tr>
          <tr>
            <td class="text-left">Headshots</td>
            <td class="bg-vs">
              <span v-if="data.vs">{{ data.vs.headshots || 0 }}</span>
            </td>
            <td class="bg-tr">
              <span v-if="data.tr">{{ data.tr.headshots || 0 }}</span>
            </td>
            <td class="bg-nc">
              <span v-if="data.nc">{{ data.nc.headshots || 0 }}</span>
            </td>
            <td class="bg-nso">
              <span v-if="data.nso">{{ data.nso.headshots || 0 }}</span>
            </td>
          </tr>
          <tr>
            <td class="text-left">HSR</td>
            <td class="bg-vs">
              <span v-if="data.vs">
                {{
                  data.vs.headshots && data.vs.kills
                    ? ((data.vs.headshots / data.vs.kills) * 100).toFixed(2)
                    : 0
                }}%
              </span>
            </td>
            <td class="bg-tr">
              <span v-if="data.tr">
                {{
                  data.tr.headshots && data.tr.kills
                    ? ((data.tr.headshots / data.tr.kills) * 100).toFixed(2)
                    : 0
                }}%
              </span>
            </td>
            <td class="bg-nc">
              <span v-if="data.nc">
                {{
                  data.nc.headshots && data.nc.kills
                    ? ((data.nc.headshots / data.nc.kills) * 100).toFixed(2)
                    : 0
                }}%
              </span>
            </td>
            <td class="bg-nso">
              <span v-if="data.nso">
                {{
                  data.nso.headshots && data.nso.kills
                    ? ((data.nso.headshots / data.nso.kills) * 100).toFixed(2)
                    : 0
                }}%
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="col-span-12 text-xs text-gray-500 text-left">
        <p>*1 does not include NSO vs NSO kills.</p>
        <p>
          *2 NSO Teamkills represent NSO vs NSO. It is currently not possible to
          track what faction NSO's are on via the API without some
          <b>major</b> hacking.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { InstanceTerritoryControlResponseInterface } from '@/interfaces/InstanceTerritoryControlResponseInterface'
import ApiRequest from '@/api-request'
import { Ps2alertsEventState } from '@/constants/Ps2alertsEventState'
import { InstanceFactionCombatAggregateResponseInterface } from '@/interfaces/aggregates/instance/InstanceFactionCombatAggregateResponseInterface'
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
      updateRate: 5000,
      updateCountdown: 0,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      data: {} as InstanceFactionCombatAggregateResponseInterface,
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
    this.init()
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
      this.pull()
      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull()
        }, this.updateRate)
      }
    },
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('AlertFactionCombatMetrics.pull', this.alert.instanceId)

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
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
  },
})
</script>
