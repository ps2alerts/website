<template>
  <div class="territory-bar">
    <div
      class="territory-bar-segment vs"
      :style="{ width: vs+'%' }"
    >
      {{ vs > 5 ? vs : '' }}
    </div>
    <div
      class="territory-bar-segment nc"
      :style="{ width: nc+'%' }"
    >
      {{ nc > 5 ? nc : '' }}
    </div>
    <div
      class="territory-bar-segment tr"
      :style="{ width: tr+'%' }"
    >
      {{ tr > 5 ? tr : '' }}
    </div>
    <div
      class="territory-bar-segment cutoff"
      :style="{ width: cutoff+'%' }"
    >
      {{ cutoff > 5 ? cutoff : '' }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "TerritoryBar",
  props: {
    vs: {
      type: Number,
      default: 33,
      required: true
    },
    nc: {
      type: Number,
      default: 33,
      required: true
    },
    tr: {
      type: Number,
      default: 33,
      required: true
    },
    cutoff: {
      type: Number,
      default: 0,
      required: true
    }
  },
});
</script>

<style scoped lang="scss">
.territory-bar {
  display: inline-block;
  width: 100%;
  height: 30px;
  color: white;

  .territory-bar-segment {
    width: 33%;
    height: 100%;
    display: inline-block;
    background-color: grey;
    float: left;

    &.vs {
      background-color: rebeccapurple;
    }

    &.nc {
      background-color: darkblue;
    }

    &.tr {
      background-color: red;
    }
  }
}
</style>
