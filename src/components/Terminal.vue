<script lang="ts" setup>
import { useTerminalStore } from "@/stores/terminal";
import TerminalInput from "./TerminalInput.vue";
import TerminalHistory from "./TerminalHistory.vue";
const store = useTerminalStore();
</script>

<template>
    <div class="terminal w-full">
        <perfect-scrollbar>
            <div class="term-header" v-html="store.staticHeader" v-if="store.showHeader"></div>
            <TerminalHistory />
            <TerminalInput />
        </perfect-scrollbar>
    </div>
</template>