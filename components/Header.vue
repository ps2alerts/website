<template>
  <header class="items-center justify-center bg-tint p-4">
    <div class="flex text-white px-6 justify-center items-center mb-2">
      <img
        class="ps2alerts-logo mr-2 w-16"
        alt="PS2Alerts Logo"
        src="../assets/img/alert-icon.png"
      />
      <h1 class="font-semibold text-4xl">PS2Alerts</h1>
    </div>
    <div class="flex w-auto block justify-center px-6 mb-2">
      <div class="btn">BETA</div>
    </div>
    <div class="flex w-auto block justify-center">
      <p class="text-center" v-html="motto" />
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
        'Powered by ISO',
        'The ultimate proof that "<faction> is OP"!',
        'Miller server best server?',
        'V26 Maelstrom Turbo Laser needs a buff!',
        'Tracking all your alert kills, and C4 suicides...',
        'Making Alerts great again!',
        'How many revives did <b>YOU</b> get last alert?',
        'Measuring E-Peens since 2014',
        'Feeding the TR victim complex',
        'Proving VS is OP',
        'NC Millah stronk matey',
        'Fueling the TR victim complex',
      ],
    }
  },
  created() {
    const rand = Math.floor(Math.random() * this.mottos.length)
    this.motto = this.mottos[rand]
  },
})
</script>
