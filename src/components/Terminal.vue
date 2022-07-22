<script lang="ts" setup>
import { useTerminalStore } from "@/stores/terminal";
const store = useTerminalStore();
</script>

<template>
    <div class="terminal">
        <perfect-scrollbar>
            <div class="term-header" v-html="store.staticHeader"></div>
        </perfect-scrollbar>
    </div>
</template>