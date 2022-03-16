<template>
  <header class="items-center justify-center bg-tint p-4">
    <div class="flex text-white px-6 justify-center items-center mb-2">
      <img
        class="ps2alerts-logo mr-2 w-16"
        alt="PS2Alerts Logo"
        src="/img/alert-icon.png"
      />
      <h1 class="font-semibold text-4xl">PS2Alerts</h1>
    </div>
    <div class="w-auto block justify-center text-center">
      <p v-html="motto" />
      <p class="text-sm text-gray-400">{{ version }}</p>
    </div>
  </header>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Header',
  data() {
    return {
      motto: '',
      mottos: [
        'The metagame <b>everyone</b> plays!',
        'Powered by continent locks!',
        'Powered by A7',
        'The ultimate proof that "X faction is OP"!',
        'Miller server best server?',
        'V26 Maelstrom Turbo Laser needs a buff!',
        'Tracking all your alert kills, and C4 suicides...',
        'Making Alerts great again!',
        'How many revives did <b>YOU</b> get last alert?',
        'Measuring E-Peens since 2014',
        'Feeding the VS victim complex',
        'Feeding the NC victim complex',
        'Fueling the TR victim complex',
        'Still waiting on NSO team_id...',
        'Zergfits OP',
        'Proving VS is OP',
        'NC Millah stronk matey,,,,,,',
        'A zerg a day keeps the purples away',
        'RIP Briggs',
        'RIP Router meta',
        'RIP ANT Cloak',
        'Pew pew!',
        'An salty OS a day keeps the doctor away',
      ],
      version: this.$config.version,
    }
  },
  created() {
    const rand = Math.floor(Math.random() * this.mottos.length)
    this.motto = this.mottos[rand]
  },
})
</script>
