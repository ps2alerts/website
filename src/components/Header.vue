<template>
  <header>
    <header class="items-center justify-center bg-tint p-4">
      <div class="flex text-white px-6 justify-center items-center ">
        <img
          class="ps2alerts-logo mr-2 w-16"
          alt="PS2Alerts Logo"
          src="../assets/img/alert-icon.png"
        >
        <h1 class="font-semibold text-4xl">
          PS2Alerts
        </h1>
      </div>
      <div class="flex w-auto block justify-center px-6 mt-4">
        <p v-html="motto" />
      </div>
      <div class="flex w-auto block justify-center px-6 mt-4">
        <div class="bg-red-700 text-white inline-block text-lg px-4 py-2 leading-none rounded">
          PRE-ALPHA
        </div>
      </div>
      <div class="w-full block text-center mt-4">
        <p class="text-white text-xs">
          This is <b>not</b> representative of the final product and is subject to vast changes!
        </p>
      </div>
    </header>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",
  data() {
    return {
      motto: "",
      mottos: [
        "The metagame <b>everyone</b> plays!",
        "Powered via continent locks!",
        "Powered by ISO",
        "The ultimate proof that \"X is OP\"!",
        "Miller server best server?",
        "V26 Maelstrom Turbo Laser needs a buff!",
        "Tracking all your alert kills, and all your C4 suicides...",
        "Making Alerts great again!",
        "How many revives did <b>YOU</b> get last alert?",
        "Measuring E-Peens since 2014",
      ]
    }
  },
  created () {
    const rand = Math.floor(Math.random() * this.mottos.length);
    this.motto = this.mottos[rand]
  }
});
</script>
