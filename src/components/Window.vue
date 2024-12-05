<script setup lang="ts">
import { ref, defineEmits } from "vue";
import CloseIcon from "@/assets/img/close.svg";
import MinimizeIcon from "@/assets/img/minimize.svg";
import ExpandIcon from "@/assets/img/expand.svg";

const fullscreen = ref(false);

const emit = defineEmits(["close"]);

const toggleFullscreen = () => {
  fullscreen.value = !fullscreen.value;
};
</script>
<template>
  <div
    class="mockup-window border bg-base-300 flex-1 flex flex-col drop-shadow-md absolute z-20"
    :class="{ 'fullscreen mt-8 rounded-none': fullscreen, 'mt-10 mb-5 ml-5 mr-5': !fullscreen }"
  >
    <div class="window-header">
      <div class="close-window" @click="emit('close')">
        <img :src="CloseIcon" />
      </div>
      <div class="minimize-window" @click="emit('close')">
        <img :src="MinimizeIcon" />
      </div>
      <div class="maximize-window" @click="toggleFullscreen">
        <img :src="ExpandIcon" :class="{ 'rotate-180': fullscreen }" />
      </div>
    </div>
    <slot />
  </div>
</template>
