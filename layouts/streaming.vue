<template>
  <main data-app="true" class="streaming">
    <Maintenance v-if="$config.maintenance === true"></Maintenance>
    <div v-if="$config.maintenance === false" class="font-sans">
      <Nuxt />
    </div>
  </main>
</template>
