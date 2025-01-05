<script setup lang="ts">
import { ref } from 'vue'
import FolderView from './FolderView.vue'

const emit = defineEmits(['switchWindow', 'openUrl'])

const folders = ref({
  projects: false,
})

const openFolder = (name: string) => {
  folders.value.projects = !folders.value.projects
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
        @click="openFolder('projects')"
      >
        <div class="icon"></div>
        <div class="name">Small projects</div>
      </div>
    </div>

    <FolderView :isOpen="folders.projects" @openUrl="handleOpenUrl" />
  </div>
</template>
