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
  },
  {
    name: 'Gemini Browser Agent',
    url: 'https://github.com/pmbstyle/gemini-browser-agent',
    iconClass: 'item-gemini',
  },
  {
    name: 'OpenRouter LLM Proxy Service',
    url: 'https://github.com/pmbstyle/openrouter-proxy',
    iconClass: 'item-openrouter',
  },
  {
    name: 'BootVue',
    url: 'https://github.com/pmbstyle/BootVue',
    iconClass: 'item-github',
  },
  {
    name: 'Temporal Awareness MCP Server',
    url: 'https://github.com/pmbstyle/temporal-awareness-mcp',
    iconClass: 'item-github',
  },
  {
    name: 'OntarioDoctor (PoC)',
    url: 'https://github.com/pmbstyle/OntarioDoctor',
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
