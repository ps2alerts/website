<template>
  <div
    class="col-span-3 ss:col-span-4 px-4 py-4 mb-2 bg-tint rounded relative"
  >
    <div v-if="alert.result">
      <FactionSegmentBar
        :vs="alert.result.vs"
        :nc="alert.result.nc"
        :tr="alert.result.tr"
        :other="alert.result.cutoff"
        :out-of-play="alert.result.outOfPlay"
      />
    </div>


    <div>
      {{ alert }}
    </div>
    <div>
      {{ instanceEventDetails }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment from "moment-timezone";
import {DATE_TIME_FORMAT} from "@/constants/Time";
import ApiRequest from "@/api-request";
import FactionSegmentBar from "@/components/common/FactionSegmentBar.vue";
import {InstanceEventDetails} from "@/filters/InstanceEventDetails";
import {MetagameDetailsInterface} from "@/interfaces/MetagameDetailsInterface";

export default defineComponent({
  name: "Alert",
  components: {
    FactionSegmentBar,
  },
  props: {
    instanceId: {
      type: String,
      default: "1-0000"
    },
  },
  data: function() {
    return {
      loaded: false,
      error: null,
      alert: {censusMetagameEventType: 0},
      ApiRequest: new ApiRequest(),
      lastUpdated: 'Fetching...',
    }
  },
  computed: {
    instanceEventDetails(): MetagameDetailsInterface | null {
      return InstanceEventDetails(this.alert.censusMetagameEventType);
    }
  },
  created() {
    document.title = 'Alert #' + this.instanceId;
    this.pull();
    setInterval(() => {
      void this.pull();
    }, 30000);
  },
  methods: {
    async pull(): Promise<void> {
      await this.ApiRequest.client
        .get(`/instances/${this.instanceId}`)
        .then(response => {
          this.error = null;
          this.alert = response.data;
          console.log(this.alert);
          this.loaded = true;
        })
        .catch(e => {
          this.error = e.message;
        });
      this.lastUpdated = moment().format(DATE_TIME_FORMAT)
    },
    debug(event: never, loc = '') {
      console.log(loc, event)
    },
  }
});
</script>

<style scoped lang="scss"></style>
