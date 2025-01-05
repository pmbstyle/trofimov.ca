<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['openUrl'])

const projects = [
  {
    name: "Conway's Game of Life",
    url: 'http://gol.trofimov.ca',
    iconClass: 'item-gol'
  },
  {
    name: 'Color Palette Generator',
    url: 'https://github.com/pmbstyle/acpg',
    iconClass: 'item-csg'
  },
  {
    name: 'Alice AI assistant',
    url: 'https://github.com/pmbstyle/Alice',
    iconClass: 'item-alice'
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
