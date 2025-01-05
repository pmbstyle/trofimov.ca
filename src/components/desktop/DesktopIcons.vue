<script setup lang="ts">
import { ref, nextTick } from 'vue'
import FolderView from './FolderView.vue'

const emit = defineEmits(['switchWindow', 'openUrl'])

const folders = ref({
  projects: false,
})

let outsideClickListener: (event: Event, selector: string) => void = () => {}

const removeClickListener = () => {
  const monitor = document.getElementsByClassName('desktop')[0] as HTMLElement
  if (outsideClickListener && monitor) {
    monitor.removeEventListener('click', outsideClickListener as EventListener)
    outsideClickListener = () => {}
  }
}

const clickOutside = (event: Event, selector: string) => {
  if (event.target && !(event.target as Element).closest(selector)) {
    folders.value.projects = false
    removeClickListener()
  }
}

const openFolder = async (name: 'projects') => {
  event.stopPropagation()
  folders.value[name] = !folders.value[name]
  if (folders.value[name]) {
    await nextTick()
    outsideClickListener = (event: Event) => clickOutside(event, '.folder')
    const monitor = document.getElementsByClassName('desktop')[0] as HTMLElement
    if (monitor) {
      monitor.addEventListener('click', outsideClickListener as EventListener)
    }
  } else {
    removeClickListener()
  }
}
const handleOpenUrl = (url: string) => {
  emit('openUrl', url)
}

const handleSwitchWindow = (window: string) => {
  emit('switchWindow', window)
}
</script>

<template>
  <div
    class="desktop-item item-terminal hide-mobile"
    @click="handleSwitchWindow('terminal')"
  >
    <div class="icon"></div>
    <div class="name">Terminal</div>
  </div>

  <div
    class="desktop-item item-game hide-mobile"
    @click="handleSwitchWindow('game')"
  >
    <div class="icon"></div>
    <div class="name">Game</div>
  </div>

  <div class="desktop-item item-resume" @click="handleSwitchWindow('resume')">
    <div class="icon"></div>
    <div class="name">Resume.pdf</div>
  </div>

  <div class="desktop-item item-contact" @click="handleSwitchWindow('contact')">
    <div class="icon"></div>
    <div class="name">Contact</div>
  </div>

  <div class="side-grid">
    <div class="items">
      <div
        class="desktop-item item-projects-folder"
        @click.stop="openFolder('projects')"
      >
        <div class="icon"></div>
        <div class="name">Small projects</div>
      </div>
    </div>

    <FolderView :isOpen="folders.projects" @openUrl="handleOpenUrl" />
  </div>
</template>

<style scoped>
.folder-enter-active,
.folder-leave-active {
  transition: opacity 0.3s ease;
}

.folder-enter-from,
.folder-leave-to {
  opacity: 0;
}
</style>
