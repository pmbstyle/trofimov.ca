<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['openUrl'])

const projects = [
  {
    name: 'BroodMind autonomous multi-agent system',
    url: 'https://github.com/pmbstyle/BroodMind',
    iconClass: 'item-broodmind',
  },
  {
    name: 'Alice Smart Desktop AI Assistant',
    url: 'https://github.com/pmbstyle/Alice',
    iconClass: 'item-alice',
  },
  {
    name: 'Gemini Browser Agent',
    url: 'https://github.com/pmbstyle/gemini-browser-agent',
    iconClass: 'item-gemini',
  },
  {
    name: 'Riddi Local Text-to-Speech Browser Reader',
    url: 'https://github.com/pmbstyle/riddi',
    iconClass: 'item-riddi',
  },
  {
    name: 'Temporal Awareness MCP Server',
    url: 'https://github.com/pmbstyle/temporal-awareness-mcp',
    iconClass: 'item-github',
  },
  {
    name: 'Fara Browser Automation Agent',
    url: 'https://github.com/pmbstyle/fara-agent',
    iconClass: 'item-github',
  },
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
