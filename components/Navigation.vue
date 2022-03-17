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
        mobile-breakpoint="720"
      >
        <v-tab v-for="tab in tabs" :key="tab.id" :to="tab.route" exact>
          <font-awesome-icon :icon="tab.icon" class="mr-2" />
          {{ tab.name }}
        </v-tab>
      </v-tabs>
    </nav>
    <nav id="subTabs" class="mb-2">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Navigation',
  data() {
    return {
      activeTab: `/`,
      tabs: [
        { id: 1, name: 'Statistics', route: `/`, icon: ['fas', 'chart-area'] },
        {
          id: 2,
          name: 'Alert History',
          route: `/alert-history`,
          icon: ['fas', 'poll-h'],
        },
        {
          id: 3,
          name: 'Change Log',
          route: `/change-log`,
          icon: ['fas', 'tasks'],
        },
      ],
      subTabs: [
        {
          id: 1,
          name: 'Patreon',
          href: `https://www.patreon.com/PS2Alerts`,
          icon: ['fab', 'patreon'],
        },
        {
          id: 2,
          name: 'Discord',
          href: `https://discord.io/ps2alerts`,
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
      ],
    }
  },
})
</script>
