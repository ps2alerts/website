<template>
  <header>
    <nav class="flex items-center justify-between flex-wrap bg-red-500 px-4 py-6">
      <div class="flex items-center flex-shrink-0 text-white mr-6">
        <img
          class="ps2alerts-logo mr-2 w-12"
          alt="PS2Alerts Logo"
          src="../assets/img/alert-icon.png"
        >
        <span class="font-semibold text-3xl tracking-tight">PS2Alerts</span>
      </div>
      <div class="block lg:hidden">
        <button class="flex items-center px-3 py-2 border rounded text-red-200 border-red-400 hover:text-white hover:border-white">
          <img
            class="ps2alerts-logo w-2"
            alt="PS2Alerts Logo"
            src="../assets/img/alert-icon.png"
          >
        </button>
      </div>
      <div class="w-full block lg:w-auto">
        <div class="bg-red-700 btn text-white inline-block text-lg px-4 py-2 leading-none rounded mt-4 lg:mt-0">
          PRE-ALPHA
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",
});
</script>
