<template>
  <div
    class="col-span-12 ss:col-span-8 ss:col-start-3 bg-tint card editorial relative my-4"
  >
    <div class="tag announcement">
      <font-awesome-icon :icon="['fas', 'bullhorn']"></font-awesome-icon>
      Announcement
    </div>

    <div class="grid grid-cols-12 place-items-center">
      <div class="col-span-12">
        <div class="p-6 text-center items-center justify-items-center">
          <img
            id="splash-icon"
            src="../assets/img/alert-icon.png"
            alt="PS2Alerts Icon"
            class="inline-block rounded-md"
          />
        </div>
      </div>
      <div class="col-span-12">
        <h1 class="text-subtitle text-center">
          PS2Alerts has launched into Beta!
        </h1>
        <h2 class="text-center text-2xl mb-4">
          All statistics have been reset and are now being permanently
          collected!
        </h2>
        <p>
          It has taken 9 months for the website to finally come back to life, it
          has been a long road but we're finally here! The site will continue to
          have new features added to it in the coming weeks and months. Check
          out the
          <a
            href="https://github.com/ps2alerts/website/issues"
            target="_blank"
            class="text-blue-600"
            >GitHub project</a
          >
          for an idea of what's coming up!
        </p>
        <p>
          I'd like to thank everyone in the community who have shown their
          support for the project, either via words of encouragement or
          <a
            href="https://www.patreon.com/PS2Alerts"
            target="_blank"
            class="text-blue-600"
            >financially</a
          >
          - it means a lot!
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
