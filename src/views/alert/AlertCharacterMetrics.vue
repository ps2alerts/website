<template>
  <div class="tag section">
    Character Metrics
  </div>
  <div
    v-if="loaded"
    class="grid grid-cols-12"
  >
    <div class="col-span-12 mb-4">
      <div class="col-span-12">
        Total players: {{ data.length }}
      </div>
    </div>
    <table class="table-auto text-center">
      <thead>
        <tr>
          <td class="py-2 pr-4">
            Rank
          </td>
          <td class="py-2 pr-4">
            Character
          </td>
          <td class="py-2 pr-4">
            Outfit
          </td>
          <td class="py-2 pr-4">
            Kills
          </td>
          <td class="py-2 pr-4">
            Deaths
          </td>
          <td class="py-2 pr-4">
            KD
          </td>
          <td class="py-2 pr-4">
            TKs
          </td>
          <td class="py-2 pr-4">
            Suicides
          </td>
          <td class="py-2 pr-4">
            Headshots
          </td>
          <td class="py-2 pr-4">
            HSR
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(character, index) in data"
          :key="character.character"
          class="mb-2"
        >
          <td class="pr-4 text-left">
            {{ index + 1 }}
          </td>
          <td class="pr-4 text-left">
            {{ character.character }}
          </td>
          <td class="pr-4 text-left">
            {{ character.outfit }}
          </td>
          <td class="pr-4">
            {{ character.kills }}
          </td>
          <td class="pr-4">
            {{ character.deaths }}
          </td>
          <td class="pr-4">
            {{ (character.kills / character.deaths).toFixed(2) }}
          </td>
          <td class="pr-4">
            {{ character.teamKills }}
          </td>
          <td class="pr-4">
            {{ character.suicides }}
          </td>
          <td class="pr-4">
            {{ character.headshots }}
          </td>
          <td class="pr-4">
            {{ ((character.headshots / character.kills) * 100).toFixed(2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {InstanceTerritoryControlResponseInterface} from "@/interfaces/InstanceTerritoryControlResponseInterface";
import ApiRequest from "@/api-request";
import {Ps2alertsEventState} from "@/constants/Ps2alertsEventState";
import {Endpoints} from "@/constants/Endpoints";
import {InstanceCharacterAggregateResponseInterface} from "@/interfaces/aggregates/instance/InstanceCharacterAggregateResponseInterface";

export default defineComponent({
  name: "AlertCharacterMetrics",
  props: {
    alert: {
      type: Object as () => InstanceTerritoryControlResponseInterface,
      default: {},
      required: true
    },
  },
  data: function() {
    return {
      error: null,
      loaded: false,
      data: {} as InstanceCharacterAggregateResponseInterface[],
    }
  },
  created() {
    this.pull();
    setInterval(() => {
      void this.pull();
    }, 30000);
  },
  methods: {
    async pull(): Promise<void> {
      if (this.loaded && this.alert.state === Ps2alertsEventState.ENDED) {
        return;
      }

      await new ApiRequest().get<InstanceCharacterAggregateResponseInterface[]>(
        Endpoints.AGGREGATES_INSTANCE_CHARACTER.replace('{instance}', this.alert.instanceId),
        {
          sortBy: 'kills',
          order: 'desc'
        })
        .then(result => {
          this.data = result
          this.loaded = true;
        })
        .catch(e => {
          this.error = e.message;
        })
    },
  }
});
</script>
