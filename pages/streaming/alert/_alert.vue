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
        <div id="stats card">
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
              <div v-show="alert.state === 2">
                <span v-if="!alert.result.draw"
                  >{{ alert.result.victor | factionShortName }} victory!</span
                >
                <span v-else>Draw!</span>
              </div>
            </div>
          </div>
          <div
            v-if="config.characterName"
            class="character p-2 border-t border-gray-100"
          >
            <div class="text-center text-xl font-bold">
              <div v-if="characterStats.character">
                <div>
                  <span v-if="characterStats.character.outfit.tag"
                    >[{{ characterStats.character.outfit.tag }}]</span
                  >
                  {{ characterStats.character.name }}
                </div>
                <div class="text-center text-lg grid grid-cols-8 gap-1 mt-3">
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.kills }}
                    </div>
                    <div class="text-xs">Kills</div>
                  </div>
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.deaths }}
                    </div>
                    <div class="text-xs">Deaths</div>
                  </div>
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.kd }}
                    </div>
                    <div class="text-xs">KD</div>
                  </div>
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.teamKills }}
                    </div>
                    <div class="text-xs">TKs</div>
                  </div>
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.teamKilled }}
                    </div>
                    <div class="text-xs">TKed</div>
                  </div>
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.suicides }}
                    </div>
                    <div class="text-xs">Sui</div>
                  </div>
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.headshots }}
                    </div>
                    <div class="text-xs">HS</div>
                  </div>
                  <div class="col-span-1">
                    <div class="leading-4 font-bold">
                      {{ characterStats.hsr }}
                    </div>
                    <div class="text-xs">HSR</div>
                  </div>
                </div>
              </div>
              <div v-else>
                {{ config.characterName }}<br />
                <span class="font-normal text-base"
                  >No character stats found yet!</span
                >
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
          <div class="p-1 text-xs text-center border-t">
            More stats at ps2alerts.com/alert/{{ alert.instanceId }}
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
import { CensusEndpoints, Endpoints } from '~/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import { AlertCharacterTableDataInterface } from '~/interfaces/alert/AlertCharacterTableDataInterface'
import { CensusCharacterResponseInterface } from '~/interfaces/census/CensusCharacterResponseInterface'

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
      error: '',
      loaded: false,
      updateRate: 1000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      alert: {} as InstanceTerritoryControlResponseInterface,
      characterId: '' as string | null | void,
      characterStats: {} as AlertCharacterTableDataInterface,
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
    document.documentElement.id = 'streaming'
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
        this.pageTitle = `STREAM Alert #${this.alert.instanceId}`
      }
    },
    async init(instanceId: string): Promise<void> {
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
      console.log('pull')
      if (this.alert && this.alert.state === Ps2alertsEventState.ENDED) {
        return
      }

      this.error = ''

      if (this.config.characterName && this.characterId === '') {
        this.characterId = await this.pullCharacterId(this.config.characterName)
      }

      await new ApiRequest()
        .get<InstanceTerritoryControlResponseInterface>(
          Endpoints.INSTANCE.replace('{instance}', instanceId)
        )
        .then((alert) => {
          this.alert = alert
          this.updateCountdown = this.updateRate / 1000
        })
        .catch((e) => {
          this.error = e.message
        })

      if (this.characterId && this.characterId !== '') {
        await new ApiRequest()
          .get<InstanceCharacterAggregateResponseInterface>(
            Endpoints.AGGREGATES_INSTANCE_CHARACTER_SINGLE.replace(
              '{instance}',
              this.alert.instanceId
                ? this.alert.instanceId.toString()
                : 'whatever'
            ).replace('{character}', this.characterId)
          )
          .then((result) => {
            this.characterStats = this.updateCharacter(result)
          })
          .catch(() => {
            this.error = 'Character not found in stats yet!'
          })
      }

      this.loaded = true
    },

    // Makes a request to census to resolve the character ID
    async pullCharacterId(name: string): Promise<string | null | void> {
      return await new ApiRequest('https://census.daybreakgames.com')
        .get<CensusCharacterResponseInterface>(
          CensusEndpoints.CHARACTER_NAME_SEARCH.replace(
            '{serviceId}',
            'ps2alertsdotcom'
          ).replace('{characterName}', name.toLowerCase())
        )
        .then((result) => {
          if (result.character_list.length === 0) {
            return null
          }
          return result.character_list[0].character_id
        })
        .catch((e) => {
          this.error = e.message
        })
    },

    // Updates the characters data so it is rendered on page
    updateCharacter(
      character: InstanceCharacterAggregateResponseInterface
    ): AlertCharacterTableDataInterface {
      // Ensure table displays all data even if zero
      character.kills = character.kills ?? 0
      character.deaths = character.deaths ?? 0
      character.teamKills = character.teamKills ?? 0
      character.teamKilled = character.teamKilled ?? 0
      character.suicides = character.suicides ?? 0
      character.headshots = character.headshots ?? 0

      // Outfit name formatting
      if (character.character.outfit) {
        character.character.outfit.name = character.character.outfit?.tag
          ? `[${character.character.outfit.tag}] ${character.character.outfit.name}`
          : character.character.outfit?.name
      } else {
        character.character.outfit = {
          name: '',
          id: '0',
          faction: character.character.faction,
          world: character.character.world,
          leader: 'foo',
        }
      }

      return Object.assign(character, {
        br: character.character.asp
          ? character.character.battleRank + 120
          : character.character.battleRank,
        kd:
          character.kills && character.deaths
            ? (character.kills / character.deaths).toFixed(2)
            : character.kills || 0,
        hsr:
          character.headshots && character.kills
            ? ((character.headshots / character.kills) * 100).toFixed(2)
            : 0,
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
