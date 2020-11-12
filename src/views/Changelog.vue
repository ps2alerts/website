<template>
  <div class="col-span-3 ss:col-span-4">
    <div class="text-center h-full">
      <h1 class="text-title">
        Change Log
      </h1>
      <p>Last updated: 11th Nov 2020</p>
    </div>
  </div>
  <div class="col-span-3 ss:col-span-2 bg-tint card editorial relative">
    <div class="tag feature">
      New feature
    </div>
    <div class="h-full">
      <h1 class="text-subtitle text-center">
        Real Time Monitor
      </h1>
      <p class="content-spacing text-center">
        Added: 8th Nov 2020
      </p>
      <img
        class="object-contain mx-auto content-spacing rounded-lg"
        src="../assets/img/change-log/rtm.png"
        height="213"
        width="479"
      >
      <p>
        The Real Time Alert Monitor has returned! At the left of your screen (top if you're on mobile) you're now able to see a live list of alerts!
      </p>
      <p>
        You can use this to keep track on the alerts out of the game as well as fix a few niggles where PS2 doesn't properly show alerts in game. Additionally, you're able to see a to-the-minute population count on each alert's continent, enabling you to see if a fight is one sided or not.
      </p>
    </div>
  </div>

  <div class="col-span-3 ss:col-span-2 bg-tint card editorial relative">
    <div class="tag feature">
      New feature
    </div>
    <div class="h-full">
      <h1 class="text-subtitle text-center">
        Real Time Monitor
      </h1>
      <p class="content-spacing text-center">
        Added: 8th Nov 2020
      </p>
      <p>
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Phasellus vitae elit quam. Maecenas enim ipsum, ornare elementum pulvinar et, vestibulum eu eros. Nullam bibendum vulputate mi. Nulla sed felis at enim euismod ornare. Morbi semper felis eget nunc convallis, ac aliquet quam porttitor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas vitae tortor lorem. Phasellus non neque neque. Etiam placerat enim ipsum, porttitor gravida dui imperdiet malesuada. Pellentesque sit amet nulla mollis, tristique dolor id, posuere neque. Praesent lectus elit, consectetur ac nibh id, sollicitudin pulvinar leo. Vivamus venenatis risus neque, sed euismod sem finibus ut. Quisque laoreet ipsum neque, id aliquam ex feugiat nec. Mauris dapibus, nibh nec faucibus sodales, lacus mi pellentesque nulla, quis elementum nunc augue sit amet nisl. Phasellus nec felis et erat vulputate molestie.
      </p>
    </div>
  </div>

  <div class="col-span-3 ss:col-span-2 bg-tint card editorial relative">
    <div class="tag feature">
      New feature
    </div>
    <div class="h-full">
      <h1 class="text-subtitle text-center">
        Real Time Monitor
      </h1>
      <p class="content-spacing text-center">
        Added: 8th Nov 2020
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam imperdiet nulla dui, sed finibus purus sodales sit amet. In vitae risus velit. Phasellus sit amet scelerisque ligula. Nullam eget sapien ut lectus lobortis facilisis sit amet nec odio. Suspendisse convallis justo id neque iaculis molestie. Nunc tincidunt nisl sit amet ultricies facilisis. Vestibulum purus turpis, accumsan eu accumsan eu, congue id mauris. Nulla vulputate metus in neque placerat eleifend. Integer pellentesque luctus hendrerit.
      </p>
      <p>
        Aenean feugiat consectetur nulla eu bibendum. Duis rutrum arcu sed congue laoreet. Phasellus et lectus ac orci eleifend gravida. Morbi congue justo id mollis ultricies. Vestibulum at eleifend enim, eget viverra velit. Donec nec tellus congue, suscipit dui eget, varius sem. Vivamus suscipit magna risus, at condimentum velit pretium vitae. Donec sed orci mi. Morbi accumsan massa vel eros lacinia faucibus.
      </p>
    </div>
  </div>

  <div class="col-span-3 ss:col-span-2 bg-tint card editorial relative">
    <div class="tag feature">
      New feature
    </div>
    <div class="h-full">
      <h1 class="text-subtitle text-center">
        Real Time Monitor
      </h1>
      <p class="content-spacing text-center">
        Added: 8th Nov 2020
      </p>
      <p>
        The Real Time Alert Monitor has returned! At the left of your screen (top if you're on mobile) you're now able to see a live list of alerts!
      </p>
      <p>
        You can use this to keep track on the alerts out of the game as well as fix a few niggles where PS2 doesn't properly show alerts in game. Additionally, you're able to see a to-the-minute population count on each alert's continent, enabling you to see if a fight is one sided or not.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Changelog",
  created() {
    document.title = 'Change Log';
  }
});
</script>

<style scoped lang="scss">
%tag {
  @apply py-1 px-2 rounded-tl rounded-tr text-xs text-center;
  margin: -1rem;
  margin-bottom: 1rem;
}

.feature {
  @extend %tag;
  @apply bg-green-800;
}

</style>
