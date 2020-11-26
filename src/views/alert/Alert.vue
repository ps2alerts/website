<template>
  <div
    v-if="alert.result"
    class="col-span-3 ss:col-span-4"
  >
    <div class="mb-2">
      <AlertResultBar :alert="alert" />
    </div>
    <div class="grid grid-cols-12 gap-2">
      <div
        class="col-span-12 lg:col-span-6 ss:col-span-3 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertDetails :alert="alert" />
      </div>
      <div
        class="col-span-3 lg:col-span-6 ss:col-span-9 px-4 py-4 mb-2 bg-tint rounded"
      >
        <AlertCombatMetrics :alert="alert" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import AlertResultBar from "@/views/alert/AlertResultBar.vue";
import ApiRequest from "@/api-request";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import AlertDetails from "@/views/alert/AlertDetails.vue";
import AlertCombatMetrics from "@/views/alert/AlertCombatMetrics.vue";
import {Endpoints} from "@/constants/Endpoints";

export default defineComponent({
  name: "Alert",
  components: {
    AlertResultBar,
    AlertDetails,
    AlertCombatMetrics,
  },
  props: {
    instanceId: {
      type: String,
      default: "1-0000"
    },
  },
  data: function() {
    return {
      error: null,
      alert: {} as InstanceTerritoryControlResponseInterface,
    }
  },
  computed: {
    // instanceEventDetails(): MetagameDetailsInterface | null {
    //   return InstanceEventDetails(this.alert.censusMetagameEventType);
    // },
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
      if (this.alert && this.alert.state === Ps2alertsEventState.ENDED) {
        return;
      }

      await new ApiRequest().get<InstanceTerritoryControlResponseInterface>(Endpoints.INSTANCE.replace('{instance}', this.instanceId))
        .then(alert => {
          this.alert = alert;
        })
        .catch(e => {
          this.error = e.message;
        })
    },
  }
});
</script>
