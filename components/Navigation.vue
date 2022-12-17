<template>
  <div class="mb-4">
    <nav>
      <v-tabs
        v-model="activeTab"
        centered
        dark
        grow
        optional
        height="48"
        show-arrows
        hide-slider
        mobile-breakpoint="720"
      >
        <v-tab
          v-for="tab in tabs"
          :key="tab.id"
          :to="tab.route"
          exact
          :class="returnClass(tab)"
        >
          <font-awesome-icon :icon="tab.icon" class="mr-2" />
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </nav>
    <nav v-show="!isOutfitWars" id="subTabs" class="mb-2">
      <v-tabs centered dark grow optional height="40" hide-slider show-arrows>
        <v-tab
          v-for="tab in subTabs"
          :key="tab.id"
          :href="tab.href"
          exact
          target="_blank"
        >
          <font-awesome-icon :icon="tab.icon" class="mr-2" />
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </nav>
    <nav v-show="isOutfitWars" id="subTabs" class="mb-2">
      <v-tabs centered dark grow optional height="40" hide-slider show-arrows>
        <v-tab
          v-for="tab in outfitWarsTabs"
          :key="tab.id"
          :to="tab.route"
          exact
          :class="returnClass(tab)"
        >
          <font-awesome-icon
            :icon="tab.icon"
            class="mr-2"
            :class="tab.iconClass"
          />
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </nav>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface TabInterface {
  id: number
  name: string
  route?: string
  href?: string
  icon: string[]
  class?: string
  iconClass?: object
}

const tabs: TabInterface[] = [
  { id: 1, name: 'Statistics', route: `/`, icon: ['fas', 'chart-area'] },
  {
    id: 2,
    name: 'Alert History',
    route: `/alert-history`,
    icon: ['fas', 'poll-h'],
  },
  {
    id: 3,
    name: 'Outfit Wars',
    route: `/outfit-wars`,
    icon: ['fas', 'trophy'],
    class: 'ow-tab',
  },
  {
    id: 4,
    name: 'Change Log',
    route: `/change-log`,
    icon: ['fas', 'tasks'],
  },
]
const subTabs: TabInterface[] = [
  {
    id: 1,
    name: 'Patreon',
    href: `https://www.patreon.com/PS2Alerts`,
    icon: ['fab', 'patreon'],
  },
  {
    id: 2,
    name: 'Discord',
    href: `https://discord.gg/jEWfAJWHxa`,
    icon: ['fab', 'discord'],
  },
  {
    id: 3,
    name: 'Twitter',
    href: `https://twitter.com/ps2alerttracker`,
    icon: ['fab', 'twitter'],
  },
  {
    id: 4,
    name: 'GitHub',
    href: `https://github.com/ps2alerts`,
    icon: ['fab', 'github'],
  },
]
const outfitWarsTabs: TabInterface[] = [
  {
    id: 1,
    name: 'Rankings & Brackets',
    route: '/outfit-wars',
    icon: ['fas', 'code-fork'],
    iconClass: { '-rotate-90': true },
    class: 'ow-subtab',
  },
  {
    id: 2,
    name: 'Matches',
    route: '/outfit-wars/matches',
    icon: ['fas', 'bars-progress'],
    class: 'ow-subtab',
  },
  {
    id: 3,
    name: 'Statistics',
    route: '/outfit-wars/statistics',
    icon: ['fas', 'ranking-star'],
    class: 'ow-subtab',
  },
]

export default Vue.extend({
  name: 'Navigation',
  data() {
    return {
      activeTab: `/`,
      isOutfitWars: false,
      tabs,
      subTabs,
      outfitWarsTabs,
    }
  },
  watch: {
    activeTab() {
      this.updateOutfitwarsMode()
    },
  },
  created() {
    this.updateOutfitwarsMode()
  },
  methods: {
    returnClass(tab: TabInterface): { [k: string]: boolean } {
      const object: { [k: string]: boolean } = {}
      if (tab.class) {
        const key = tab.class
        object[key] = true

        if (tab.class === 'ow-tab') {
          const currentRouteHasOw =
            this.$nuxt.$route.path.includes('outfit-wars')

          if (currentRouteHasOw) {
            object['v-tab--active'] = true
          }
        }
      }
      return object
    },
    updateOutfitwarsMode() {
      this.isOutfitWars = this.$nuxt.$route.path.includes('outfit-wars')
    },
  },
})
</script>
