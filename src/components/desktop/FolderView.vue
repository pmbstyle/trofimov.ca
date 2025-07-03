<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['openUrl'])

const projects = [
  {
    name: 'Alice Smart Desktop AI Assistant',
    url: 'https://github.com/pmbstyle/Alice',
    iconClass: 'item-alice',
  }
]

const handleOpenUrl = (url: string) => {
  emit('openUrl', url)
}
</script>

<template>
  <Transition>
    <div class="folder" v-show="isOpen">
      <div
        v-for="project in projects"
        :key="project.url"
        class="desktop-item"
        :class="project.iconClass"
        @click="handleOpenUrl(project.url)"
      >
        <div class="icon"></div>
        <div class="name">{{ project.name }}</div>
      </div>
    </div>
  </Transition>
</template>
