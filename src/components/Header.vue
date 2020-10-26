<template>
  <header>
    <nav class="flex items-center justify-center flex-wrap bg-red-500 px-4 py-6">
      <div class="flex flex-shrink-0 text-white px-6">
        <img
          class="ps2alerts-logo mr-2 w-12"
          alt="PS2Alerts Logo"
          src="../assets/img/alert-icon.png"
        >
        <span class="font-semibold text-3xl tracking-tight">PS2Alerts</span>
      </div>
      <div class="flex w-auto block justify-center px-6 md:mt-4 lg:mt-0">
        <div class="bg-red-700 btn text-white inline-block text-lg px-4 py-2 leading-none rounded">
          PRE-ALPHA
        </div>
      </div>
      <div class="w-full block text-center mt-4">
        <p class="text-white text-xs">
          This is <b>not</b> representative of the final product!
        </p>
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
