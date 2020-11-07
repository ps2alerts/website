<template>
  <div class="bg-gray-300 col-span-3 ss:col-span-4 px-4 py-4 mb-2 bg-gray-300">
    {{ $filters.worldName(alert.world) }} - {{ $filters.zoneName(alert.zone) }}
    <p v-show="alert.state === 1">
      Started: {{ started }}
    </p>
    <p v-show="alert.state === 2">
      Ended: {{ ended }}
    </p>
    <div v-if="alert.result">
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
      />
    </div>
    <div v-if="!alert.result">
      <p>Awaiting territory data...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment-timezone";
import {DATE_TIME_FORMAT} from "@/constants/Time";
import FactionSegmentBar from "@/components/common/FactionSegmentBar.vue";

export default defineComponent({
  name: "AllAlertsEntry",
  components: {
    FactionSegmentBar
  },
  props: {
    alert: {
      type: Object,
      required: true
    }
  },
  computed: {
    started():string {
      return moment(this.alert.timeStarted).format(DATE_TIME_FORMAT);
    },
    ended():string {
      return moment(this.alert.timeEnded).format(DATE_TIME_FORMAT);
    }
  }
});
</script>
