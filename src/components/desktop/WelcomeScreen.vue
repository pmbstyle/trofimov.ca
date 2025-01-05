<script setup lang="ts">
defineProps<{
  hideWelcome: boolean
}>()
</script>

<template>
  <div
    class="welcome absolute z-10 text-8xl text-white text-bold w-full h-full flex justify-center items-center opacity-80"
    :class="{ hide: hideWelcome }"
  >
    Welcome
  </div>
</template>
