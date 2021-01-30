<template>
  <section class="relative">
    <div class="config">
      <a v-show="!config.show" href="#" @click="toggleConfig(true)">
        <font-awesome-icon :icon="['fa', 'cog']"></font-awesome-icon>
      </a>
      <a v-show="config.show" href="#" @click="toggleConfig(false)">
        <font-awesome-icon :icon="['fa', 'check']"></font-awesome-icon>
      </a>
    </div>
    <div
      id="alert-info"
      class="rounded-lg"
      :style="{
        backgroundColor: config.widgetColor,
        boxShadow: `0 0 20px ${config.shadowColor}`,
      }"
    >
      <div v-if="loaded">
        <div id="stats">
          <FactionSegmentBar
            v-if="alert.result"
            :vs="alert.result.vs"
            :nc="alert.result.nc"
            :tr="alert.result.tr"
            :other="alert.result.cutoff"
            :out-of-play="alert.result.outOfPlay"
          />
          <div class="top p-2 text-lg grid grid-cols-4">
            <div class="col-span-3">
              {{ alert.world | worldName }} | {{ alert.zone | zoneName }} |
              {{ alert.bracket | bracketName }} activity
            </div>
            <div class="col-span-1 text-right font-bold">
              <div v-show="alert.state === 1">
                <remaining-time
                  :started="alert.timeStarted"
                  :duration="alert.duration"
                ></remaining-time>
              </div>
              <div v-show="alert.state === 2">Ended!</div>
            </div>
          </div>
          <div
            v-if="config.characterName !== '' && config.characterName !== null"
            class="character p-2 border-t border-gray-100"
          >
            <div class="text-center text-xl font-bold">
              <span v-if="characterOutfit">[{{ characterOutfit }}]</span>
              {{ config.characterName }}
            </div>
            <div class="text-center text-lg grid grid-cols-8 gap-1 mt-3">
              <div class="col-span-1">
                <div class="leading-4 font-bold">123</div>
                <div class="text-xs">Kills</div>
              </div>
              <div class="col-span-1">
                <div class="leading-4 font-bold">123</div>
                <div class="text-xs">Deaths</div>
              </div>
              <div class="col-span-1">
                <div class="leading-4 font-bold">0.12</div>
                <div class="text-xs">KDR</div>
              </div>
              <div class="col-span-1">
                <div class="leading-4 font-bold">124</div>
                <div class="text-xs">TKs</div>
              </div>
              <div class="col-span-1">
                <div class="leading-4 font-bold">12</div>
                <div class="text-xs">TKed</div>
              </div>
              <div class="col-span-1">
                <div class="leading-4 font-bold">2</div>
                <div class="text-xs">Sui</div>
              </div>
              <div class="col-span-1">
                <div class="leading-4 font-bold">12</div>
                <div class="text-xs">HS</div>
              </div>
              <div class="col-span-1">
                <div class="leading-4 font-bold">0.12%</div>
                <div class="text-xs">HSR</div>
              </div>
            </div>
          </div>
          <div v-show="config.showToggles" class="toggles p-2">
            <a href="#" class="p-1">
              <font-awesome-icon :icon="['fa', 'user']"></font-awesome-icon>
            </a>
            <a href="#" class="p-1">
              <font-awesome-icon :icon="['fa', 'users']"></font-awesome-icon>
            </a>
            <a href="#" class="p-1">
              <font-awesome-icon :icon="['fa', 'bomb']"></font-awesome-icon>
            </a>
            <a href="#" class="p-1">
              <font-awesome-icon
                :icon="['fa', 'fighter-jet']"
              ></font-awesome-icon>
            </a>
            <a href="#" class="p-1">
              <font-awesome-icon :icon="['fa', 'user-tag']"></font-awesome-icon>
            </a>
          </div>
        </div>
      </div>
      <div v-else class="text-center"><h2>Loading...</h2></div>
    </div>

    <div
      v-if="config.show"
      id="config-panel"
      class="p-2 text-center rounded-lg"
    >
      <h1 class="text-xl">Config</h1>
      <div class="grid grid-cols-3 gap-2">
        <div class="col-span-1">
          Background Color
          <v-color-picker
            v-model="config.widgetColor"
            class="ma-2"
          ></v-color-picker>
        </div>
        <div class="col-span-1">
          Shadow Color
          <v-color-picker
            v-model="config.shadowColor"
            class="ma-2"
          ></v-color-picker>
        </div>
        <div class="col-span-1">
          Settings
          <v-checkbox
            v-model="config.showToggles"
            label="Show Toggles?"
          ></v-checkbox>
          <v-text-field
            v-model="config.characterName"
            label="Character"
            solo
            clearable
          ></v-text-field>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Ps2alertsEventState } from '~/constants/Ps2alertsEventState'
import ApiRequest from '~/api-request'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { Endpoints } from '~/constants/Endpoints'

export default Vue.extend({
  name: 'StreamingAlert',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteUpdate(to, from, next) {
    this.reset()
    next()
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeRouteLeave(to, from, next) {
    this.reset()
    next()
  },
  layout: 'streaming',
  data() {
    return {
      pageTitle: 'Alert Result',
      pageDesc:
        'Per Alert results of each Alert ever triggered in Planetside 2.',
      error: null,
      loaded: false,
      updateRate: 5000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      alert: {} as InstanceTerritoryControlResponseInterface,
      characterOutfit: '',
      metricsTab: 'players',
      eager: true,
      config: {
        show: false,
        widgetColor: '#383838FF',
        shadowColor: '#000000FF',
        characterName: '',
        showToggles: false,
      },
    }
  },
  watch: {
    'alert.state'() {
      if (this.alert.state === Ps2alertsEventState.ENDED) {
        this.clearTimers()
      }
    },
    'config.widgetColor'() {
      this.config.widgetColor
        ? (localStorage.widgetColor = this.config.widgetColor)
        : localStorage.removeItem('widgetColor')
      this.saveConfig()
    },
    'config.shadowColor'() {
      this.config.shadowColor
        ? (localStorage.shadowColor = this.config.shadowColor)
        : localStorage.removeItem('shadowColor')
      this.saveConfig()
    },
    'config.characterName'() {
      this.config.characterName
        ? (localStorage.characterName = this.config.characterName)
        : localStorage.removeItem('characterName')
      this.saveConfig()
    },
    'config.showToggles'() {
      this.config.showToggles
        ? (localStorage.showToggles = this.config.showToggles)
        : localStorage.removeItem('showToggles')
      this.saveConfig()
    },
  },
  beforeDestroy() {
    this.reset()
  },
  created() {
    this.reset()
    this.init(this.$route.params.alert.toString())
  },
  mounted() {
    const params = this.$route.query
    console.log('params', params)

    document.documentElement.id = 'streaming'

    this.config = {
      show: false,
      characterName:
        this.$route.query.characterName?.toString() ??
        this.config.characterName,
      widgetColor:
        this.$route.query.widgetColor?.toString() ?? this.config.widgetColor,
      shadowColor:
        this.$route.query.shadowColor?.toString() ?? this.config.shadowColor,
      showToggles:
        this.$route.query.showToggles?.toString() === 'true' ??
        this.config.showToggles,
    }
  },
  methods: {
    saveConfig() {
      this.$router.replace({
        path: `/streaming/alert/${this.$route.params.alert.toString()}`,
        query: {
          characterName: this.config.characterName.toString() ?? undefined,
          widgetColor: this.config.widgetColor.toString() ?? undefined,
          shadowColor: this.config.shadowColor.toString() ?? undefined,
          showToggles: this.config.showToggles.toString() ?? undefined,
        },
      })
    },
    reset() {
      this.loaded = false
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    updateMeta() {
      if (this.alert.instanceId) {
        this.pageTitle = `Alert #${this.alert.instanceId}`
      }
    },
    async init(instanceId: string): Promise<void> {
      console.log(instanceId)

      await this.pull(instanceId)

      if (this.alert.state === Ps2alertsEventState.STARTED) {
        this.updateCountdownInterval = window.setInterval(() => {
          return this.updateCountdown >= 0 ? this.updateCountdown-- : 0
        }, 1000)

        this.interval = window.setInterval(() => {
          this.pull(instanceId)
        }, this.updateRate)
      }

      this.updateMeta()
    },
    async pull(instanceId: string): Promise<void> {
      if (this.alert && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      console.log('Alert details pull', instanceId)

      await new ApiRequest()
        .get<InstanceTerritoryControlResponseInterface>(
          Endpoints.INSTANCE.replace('{instance}', instanceId)
        )
        .then((alert) => {
          this.alert = alert
          console.log('alert', alert)
          this.loaded = true
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })
    },
    toggleConfig(val: boolean) {
      this.config.show = val
    },
  },
})
</script>

<style scoped lang="scss">
section {
  position: relative;

  #config-panel {
    position: absolute;
    top: 20px;
    width: 800px;
    height: 500px;
    right: 20px;
    @apply bg-gray-800;
  }

  #alert-info {
    position: absolute;
    top: 10px;
    left: 15px;
    width: 450px;
    box-shadow: 0 0 10px #881a1a;
  }

  .config {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>
