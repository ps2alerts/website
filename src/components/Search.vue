<template>
  <form class="w-full">
    <div class="flex items-center  py-2">
      <input
        class="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type="text"
        placeholder="Maelstrome26 (DOESN'T WORK YET!)"
        aria-label="Full name"
      >
      <button
        class="flex-shrink-0 bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-sm border-4 text-white py-1 px-2 rounded"
        type="button"
      >
        Search
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Search"
});
</script>
