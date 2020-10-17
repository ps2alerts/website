<template>
  <div class="home">
    <HelloWorld msg="Hello there, General Kenobi..." />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld
  }
});
</script>
