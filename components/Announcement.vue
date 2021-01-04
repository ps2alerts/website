<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Announcement - 4th Jan 2021
    </div>

    <div class="grid grid-cols-12 place-items-center">
      <div class="col-span-12">
        <h1 class="text-subtitle text-center">
          Stats have unfortunately been reset :(
        </h1>
        <p>
          Due to an issue with how the victories were being stored (and also the
          fact the combat data was corrupted and has already been reset) I've
          chosen to wipe the entire dataset and start from scratch. There was a
          recent change to apply activity level brackets for victories on a
          daily basis, and I made the mistake of not testing it thoroughly
          enough resulting in it storing in a malformed way where alert
          victories weren't being counted correctly. In the interest of ensuring
          data integrity, the dataset has been wiped in it's entirety and we're
          starting again.
        </p>
        <p>
          My humblest apologies to everyone for this, for those who have been
          playing the Alert Metagame and have fought hard for your victories, I
          am truly sorry. This shouldn't happen again, but as with every major
          undertaking like this there are going to be bumps in the road. There
          is also a reason why the website is in a Beta stage, it's not fully
          complete.
        </p>
        <p>- [DIG] Maelstrome26 (PS2Alerts Lead Developer - Miller VS)</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Announcement',
})
</script>

<style scoped lang="scss">
#splash-icon {
  max-height: 20vh;
}
</style>
