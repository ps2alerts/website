<template>
  <section class="relative">
    <div v-if="showTutorial" id="tutorial" class="text-red-700 font-bold pt-4">
      Click on the cog top right to configure!
    </div>
    <div class="config">
      <a v-show="!config.show" href="#" @click="toggleConfig(true)">
        <font-awesome-icon
          :icon="['fa', 'cog']"
          :class="{ 'text-red-700': showTutorial === true }"
        ></font-awesome-icon>
      </a>
      <a v-show="config.show" href="#" @click="toggleConfig(false)">
        <font-awesome-icon
          :icon="['fa', 'check']"
          class="text-red-700"
        ></font-awesome-icon>
      </a>
    </div>
    <div
      id="alert-info"
      class="rounded-lg"
      :style="{
        backgroundColor: tempConfig.widgetColor,
        boxShadow: `0 0 20px ${tempConfig.shadowColor}`,
        color: tempConfig.textColor,
      }"
    >
      <div v-if="error !== ''" class="text-center p-2">{{ error }}</div>
      <div v-if="loaded && !error">
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
              <div v-show="alert.state === 2">
                <span v-if="!alert.result.draw"
                  >{{ alert.result.victor | factionShortName }} victory!</span
                >
                <span v-else>Draw!</span>
              </div>
            </div>
          </div>
          <div
            v-if="config.characterName && !error"
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
                    <div class="text-xs">HS %</div>
                  </div>
                </div>
              </div>
              <div v-if="minorError !== ''">
                {{ config.characterName }}<br />
                <p class="font-normal text-base leading-5">
                  {{ minorError }}
                </p>
              </div>
            </div>
          </div>
          <div v-show="config.showToggles" class="toggles p-2 text-center">
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
      <div v-if="!loaded" class="text-center p-2"><h2>Loading...</h2></div>
    </div>

    <div
      v-if="config.show"
      id="config-panel"
      class="p-2 text-center rounded-lg"
    >
      <h1 class="text-2xl">Config</h1>
      <div class="text-center p-2">
        To configure OBS with the same settings, save then copy the URL into the
        Browser Source. Make sure the alert ID matches the alert you're playing.
        (Autodetection coming in the future)
      </div>
      <a href="#" class="btn btn-sm mb-2" @click="saveConfig()">
        <font-awesome-icon :icon="['fas', 'save']"></font-awesome-icon> Save
      </a>
      <div class="grid grid-cols-3 gap-2">
        <div class="col-span-1">
          Background Color
          <a
            v-show="!same.widgetColor"
            href="#"
            class="text-blue-600"
            @click="resetConfig('widgetColor')"
            >Reset</a
          >
          <v-color-picker
            v-model="tempConfig.widgetColor"
            class="ma-2"
          ></v-color-picker>
        </div>
        <div class="col-span-1">
          Shadow Color
          <a
            v-show="!same.shadowColor"
            href="#"
            class="text-blue-600"
            @click="resetConfig('shadowColor')"
            >Reset</a
          >
          <v-color-picker
            v-model="tempConfig.shadowColor"
            class="ma-2"
          ></v-color-picker>
        </div>
        <div class="col-span-1">
          Text Color
          <a
            v-show="!same.textColor"
            href="#"
            class="text-blue-600"
            @click="resetConfig('textColor')"
            >Reset</a
          >
          <v-color-picker
            v-model="tempConfig.textColor"
            class="ma-2"
          ></v-color-picker>
        </div>
        <div class="col-span-1">
          Character
          <a
            v-show="!same.characterName"
            href="#"
            class="text-blue-600"
            @click="resetConfig('characterName')"
            >Reset</a
          >
          <v-text-field
            v-model="tempConfig.characterName"
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
import { Ps2AlertsEventState } from '@/ps2alerts-constants/ps2AlertsEventState'
import ApiRequest from '~/api-request'
import { InstanceTerritoryControlResponseInterface } from '~/interfaces/InstanceTerritoryControlResponseInterface'
import { CensusEndpoints, Endpoints } from '@/constants/Endpoints'
import { InstanceCharacterAggregateResponseInterface } from '~/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface'
import { AlertCharacterTableDataInterface } from '~/interfaces/alert/AlertCharacterTableDataInterface'
import { CensusCharacterResponseInterface } from '~/interfaces/census/CensusCharacterResponseInterface'

const defaultSettings = {
  alert: {} as InstanceTerritoryControlResponseInterface,
  characterId: '' as string | null | void,
  // @ts-ignore
  characterStats: {} as AlertCharacterTableDataInterface,
  error: '',
  minorError: '',
  loaded: false,
}

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
      ...defaultSettings,
      pageTitle: 'Alert Result',
      pageDesc:
        'Per Alert results of each Alert ever triggered in Planetside 2.',
      updateRate: 1000,
      updateCountdown: 10,
      updateCountdownInterval: undefined as undefined | number,
      interval: undefined as undefined | number,
      eager: true,
      showTutorial: true,
      alert: undefined as undefined | InstanceTerritoryControlResponseInterface,
      characterStats: undefined as
        | undefined
        | InstanceCharacterAggregateResponseInterface,
      defaultConfig: {
        show: false,
        widgetColor: '#383838FF',
        shadowColor: '#000000FF',
        textColor: '#E2E8F0FF',
        characterName: '',
        showToggles: false,
      },
      config: {
        show: false,
        widgetColor: '#383838FF',
        shadowColor: '#000000FF',
        textColor: '#E2E8F0FF',
        characterName: '',
        showToggles: false,
      },
      tempConfig: {
        show: false,
        widgetColor: '#383838FF',
        shadowColor: '#000000FF',
        textColor: '#E2E8F0FF',
        characterName: '',
        showToggles: false,
      },
    }
  },
  computed: {
    same(): object {
      return {
        characterName:
          this.tempConfig.characterName === this.defaultConfig.characterName,
        widgetColor:
          this.tempConfig.widgetColor === this.defaultConfig.widgetColor,
        shadowColor:
          this.tempConfig.shadowColor === this.defaultConfig.shadowColor,
        textColor: this.tempConfig.textColor === this.defaultConfig.textColor,
      }
    },
  },
  watch: {
    $route() {
      this.init(this.$route.params.alert.toString())
    },
    'alert.state'() {
      if (this.alert && this.alert.state === Ps2AlertsEventState.ENDED) {
        this.clearTimers()
      }
    },
  },
  beforeDestroy() {
    this.reset()
  },
  async created() {
    this.reset()
    await this.init(this.$route.params.alert.toString())
  },
  mounted() {
    document.documentElement.id = 'streaming'
  },
  methods: {
    saveConfig() {
      const queries = {
        characterName:
          this.tempConfig.characterName !== this.defaultConfig.characterName
            ? this.tempConfig.characterName.toString()
            : undefined,
        widgetColor:
          this.tempConfig.widgetColor !== this.defaultConfig.widgetColor
            ? this.tempConfig.widgetColor.toString()
            : undefined,
        shadowColor:
          this.tempConfig.shadowColor !== this.defaultConfig.shadowColor
            ? this.tempConfig.shadowColor.toString()
            : undefined,
        textColor:
          this.tempConfig.textColor !== this.defaultConfig.textColor
            ? this.tempConfig.textColor.toString()
            : undefined,
        // showToggles: this.tempConfig.showToggles ?? undefined,
      }

      this.$router.replace({ query: queries })
    },
    reset() {
      this.loaded = false
      this.characterId = ''
      this.characterStats = undefined
      this.alert = undefined
      this.error = ''
      this.clearTimers()
    },
    clearTimers() {
      clearInterval(this.interval)
      clearInterval(this.updateCountdownInterval)
    },
    updateMeta() {
      if (this.alert && this.alert.instanceId) {
        this.pageTitle = `STREAM Alert #${this.alert.instanceId}`
      }
    },
    async init(instanceId: string): Promise<void> {
      setTimeout(() => {
        this.showTutorial = false
      }, 2500)
      this.config = {
        show: false,
        // @ts-ignore
        characterName:
          this.$route.query?.characterName ?? this.config.characterName,
        // @ts-ignore
        widgetColor: this.$route.query?.widgetColor ?? this.config.widgetColor,
        // @ts-ignore
        shadowColor: this.$route.query?.shadowColor ?? this.config.shadowColor,
        // @ts-ignore
        textColor: this.$route.query?.textColor ?? this.config.textColor,
      }

      // Eww... but have to do it as you can't just copy values
      this.tempConfig = {
        show: false,
        // @ts-ignore
        characterName:
          this.$route.query?.characterName ?? this.config.characterName,
        // @ts-ignore
        widgetColor: this.$route.query?.widgetColor ?? this.config.widgetColor,
        // @ts-ignore
        shadowColor: this.$route.query?.shadowColor ?? this.config.shadowColor,
        // @ts-ignore
        textColor: this.$route.query?.textColor ?? this.config.textColor,
      }

      await this.pull(instanceId)

      if (!this.alert) {
        this.error = "Alert doesn't exist!"
        return
      }

      if (this.alert.state === Ps2AlertsEventState.STARTED) {
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
      if (this.alert && this.alert.state === Ps2AlertsEventState.ENDED) {
        return
      }

      this.error = ''
      this.minorError = ''

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
        .catch(() => {
          this.error = `Unable to find Alert ${this.$route.params.alert.toString()}`
        })

      if (!this.alert) {
        this.error = "Alert doesn't exist!"
        return
      }

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
            if (!result || !result.character) {
              this.minorError =
                'Character not found in alert stats yet! Make a kill / death for this to show.'
            }
            this.characterStats = this.updateCharacter(result)
          })
          .catch(() => {
            this.minorError =
              'Character not found in alert stats yet! Make a kill / death for this to show.'
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
            this.minorError = 'Character does not exist. PS4 is not supported.'
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
            ? ((character.headshots / character.kills) * 100).toFixed(1)
            : 0,
      })
    },
    toggleConfig(val: boolean) {
      this.config.show = val
      this.showTutorial = false
    },
    resetConfig(config: string): void {
      switch (config) {
        case 'characterName':
          this.tempConfig.characterName = this.defaultConfig.characterName
          break
        case 'widgetColor':
          this.tempConfig.widgetColor = this.defaultConfig.widgetColor
          break
        case 'shadowColor':
          this.tempConfig.shadowColor = this.defaultConfig.shadowColor
          break
        case 'textColor':
          this.tempConfig.textColor = this.defaultConfig.textColor
          break
      }
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

  #tutorial {
    text-align: center;
  }

  .config {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>
