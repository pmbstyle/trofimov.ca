<script lang="ts" setup>
import { useTerminalStore } from '@/stores/terminal'
import TerminalInput from './TerminalInput.vue'
import TerminalHistory from './TerminalHistory.vue'
import { ref } from 'vue'
const store = useTerminalStore()

const termScroll = ref(null)
const scrollBottom = () => {
  termScroll.value.$el.scrollTop = termScroll.value.$el.scrollHeight
}
</script>

<template>
  <div class="terminal w-full">
    <perfect-scrollbar ref="termScroll">
      <div
        class="term-header"
        v-html="store.staticHeader"
        v-if="store.showHeader"
      ></div>
      <TerminalHistory />
      <TerminalInput @termInput="scrollBottom" />
    </perfect-scrollbar>
  </div>
</template>
