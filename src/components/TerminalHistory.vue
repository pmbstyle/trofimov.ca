<script lang="ts" setup>
import { useTerminalStore } from '@/stores/terminal'
import TerminalCommand from './TerminalCommand.vue'

const store = useTerminalStore()
</script>

<template>
  <div>
    <div
      class="history-item"
      v-for="(item, index) in store.historyShown"
      :key="index"
    >
      <TerminalCommand :pwd="item.pwd">{{ item.command }}</TerminalCommand>

      <div
        class="history-output markdown-content"
        v-if="typeof item.output === 'string'"
        v-html="item.output"
      ></div>

      <div class="history-output-grid" v-else>
        <div
          class="history-output-grid-item"
          v-for="(output, index) in item.output"
          :key="index"
        >
          <p :class="`text-color-${output.color} text-weight-${output.weight}`">
            {{ output.text }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
