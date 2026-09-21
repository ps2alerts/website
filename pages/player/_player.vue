<template>
  <ProfilePage :id="id" type="character" :world="world" />
</template>

<script lang="ts">
import Vue from 'vue'
import ProfilePage from '~/components/profiles/ProfilePage.vue'
import { World } from '~/ps2alerts-constants/world'

export default Vue.extend({
  name: 'Player',
  components: { ProfilePage },
  computed: {
    id(): string {
      return this.$route.params.player.toString()
    },
    // Character ids can exist on more than one server after merges, so the link may pin one
    world(): World | null {
      const world = parseInt(String(this.$route.query.world ?? ''), 10)
      return isNaN(world) ? null : (world as World)
    },
  },
})
</script>
