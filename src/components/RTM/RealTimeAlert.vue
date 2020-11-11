<template>
  <td
    :remaining="remaining"
    :instanceId="instanceId"
  >
    {{ $filters.worldName(world) }}
  </td>
  <td>{{ $filters.zoneName(zone) }}</td>
  <td>{{ remainingTimeText }}</td>
  <td
    v-show="mode === 'territory'"
  >
    <FactionSegmentBar
      :vs="result.vs"
      :nc="result.nc"
      :tr="result.tr"
      :other="result.cutoff"
    />
  </td>
  <td
    v-show="mode === 'pops'"
    class="text-center"
  >
    <FactionSegmentBar
      :vs="pops.vs"
      :nc="pops.nc"
      :tr="pops.tr"
      :other="pops.nso"
      :show-as-calculated-percentage="isPercentage"
      :is-percentage="false"
    />
  </td>
  <td class="text-center">
    <router-link
      class="btn btn-sm"
      :to="{ name: 'Alert', params: { instanceId: instanceId }}"
    >
      <FontAwesomeIcon
        fixed-width
        :icon="['fas', 'eye']"
      />
    </router-link>
  </td>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";
import {World} from "@/constants/World";
import {Zone} from "@/constants/Zone";
import {AlertRemainingTime} from "@/filters/AlertRemainingTime";
import {AlertRemainingTimeText} from "@/filters/AlertRemainingTimeText";

export default defineComponent({
  name: "RealTimeAlert",
  components: {
    FactionSegmentBar: defineAsyncComponent(() => import(/* webpackChunkName: "FactionSegmentBar" */ "@/components/common/FactionSegmentBar.vue")),
  },
  props: {
    instanceId: {
      type: String,
      required: true
    },
    world: {
      type: Number,
      default: World.MILLER,
      required: true
    },
    zone: {
      type: Number,
      default: Zone.INDAR,
      required: true
    },
    started: {
      type: String,
      default: 'Jan 1st 1970 00:00:00',
      required: true
    },
    duration: {
      type: Number,
      default: 0,
      required: true
    },
    mode: {
      type: String,
      default: 'territory',
      required: true,
    },
    isPercentage: {
      type: Boolean,
      default: false,
    },
    pops: {
      type: Object,
      default: () => {
        return {
          vs: 0,
          nc: 0,
          tr: 0,
          nso: 0,
        }
      }
    },
    result: {
      type: Object,
      default: () => {
        return {
          vs: 33,
          nc: 33,
          tr: 33,
          nso: 33,
          total: 33,
        }
      }
    }
  },
  data() {
    return {
      remaining: AlertRemainingTime(this.started, this.duration),
    }
  },
  computed: {
    remainingTimeText(): string {
      if (this.remaining < -30) {
        return 'Overdue!';
      }
      if (this.remaining < 0) {
        return 'Ending...';
      }
      return AlertRemainingTimeText(this.remaining);
    }
  },
  created() {
    setInterval(() => {
      this.tickTock()
    }, 1000);
  },
  methods: {
    tickTock() {
      this.remaining = this.remaining - 1;
    }
  }
});
</script>
