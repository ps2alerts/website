<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <span v-bind="attrs" v-on="on">
        {{ text }}
        <font-awesome-icon :icon="['fas', icon]"></font-awesome-icon>
      </span>
    </template>
    {{ tooltip }}
  </v-tooltip>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'InfoTooltip',
  components: {},
  props: {
    tooltip: {
      type: String,
      default: 'Foo',
    },
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'info-circle',
    },
  },
  data() {},
})
</script>
