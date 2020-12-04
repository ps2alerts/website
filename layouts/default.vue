<template>
  <div class="font-sans flex">
    <div id="panel-left" class="w-full">
      <client-only>
        <Header />
        <!--        <RealTimeMonitor />-->
      </client-only>

      <Footer class="hidden lg:block" />
    </div>
    <div
      id="panel-right"
      class="w-full h-full px-4 grid grid-cols-2 lg:grid-cols-3 ss:grid-cols-4 gap-4"
    >
      <Navigation />
      <Nuxt />
    </div>
    <Footer class="lg:hidden" />
  </div>
</template>
