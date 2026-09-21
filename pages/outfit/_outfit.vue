<template>
  <ProfilePage :id="id" type="outfit" :world="world" />
</template>

<script lang="ts">
import Vue from 'vue'
import ProfilePage from '~/components/profiles/ProfilePage.vue'
import { World } from '~/ps2alerts-constants/world'

export default Vue.extend({
  name: 'Outfit',
  components: { ProfilePage },
  computed: {
    id(): string {
      return this.$route.params.outfit.toString()
    },
    // PS4 and PC outfits can share an id, and merges spread one outfit across servers, so the link may pin one
    world(): World | null {
      const world = parseInt(String(this.$route.query.world ?? ''), 10)
      return isNaN(world) ? null : (world as World)
    },
  },
})
</script>
