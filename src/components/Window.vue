<script setup lang="ts">
import { defineEmits } from "vue";
import CloseIcon from "@/assets/img/close.svg";
import MinimizeIcon from "@/assets/img/minimize.svg";
import ExpandIcon from "@/assets/img/expand.svg";

const emit = defineEmits(["close"]);
</script>
<template>
  <div
    class="mockup-window border bg-base-300 flex-1 flex flex-col mt-10 mb-5 ml-5 mr-5 drop-shadow-md absolute z-20"
  >
    <div class="window-header">
      <div class="close-window" @click="emit('close')">
        <img :src="CloseIcon" />
      </div>
      <div class="minimize-window" @click="emit('close')">
        <img :src="MinimizeIcon" />
      </div>
      <div class="maximize-window">
        <img :src="ExpandIcon" />
      </div>
    </div>
    <slot/>
  </div>
</template>
