<template>
  <v-tooltip bottom>
    <template #activator="{ on, attrs }">
      <font-awesome-icon
        :icon="['fas', 'info-circle']"
        v-bind="attrs"
        v-on="on"
      ></font-awesome-icon>
    </template>
    {{ message }}
  </v-tooltip>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'InfoTooltip',
  components: {},
  props: {
    direction: {
      type: String,
      default: 'bottom',
    },
    message: {
      type: String,
      default: 'Foo',
    },
  },
  data() {},
})
</script>
