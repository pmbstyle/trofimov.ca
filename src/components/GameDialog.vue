<script lang="ts" setup>
import { ref, watch, nextTick } from 'vue'
import scarecrow from '@/assets/game/npc/scarecrow.png'
import mailbox from '@/assets/game/npc/mailbox.png'
import stand from '@/assets/game/npc/stand.png'
import statue from '@/assets/game/npc/statue.png'
import blacksmith from '@/assets/game/npc/blacksmith-solo.png'
import { useDialogsStore } from '@/stores/dialogs'

const dialogStore = useDialogsStore()

const props = defineProps({
  show: Boolean,
  type: String,
})

const dialog = dialogStore.getGameDialog(
  props.type as 'about' | 'skills' | 'experience' | 'education' | 'contacts'
)

const icons = {
  about: statue,
  skills: blacksmith,
  experience: scarecrow,
  education: stand,
  contacts: mailbox,
}

const dialogRef = ref<HTMLElement | null>(null)

watch(() => props.show, async (newValue, oldValue) => {
  await nextTick()
  if (!dialogRef.value) return
  
  if (newValue) {
    // Show with fade-in
    dialogRef.value.classList.remove('game-dialog--hidden')
    dialogRef.value.classList.add('game-dialog--visible')
  } else {
    // Hide with fade-out
    dialogRef.value.classList.remove('game-dialog--visible')
    dialogRef.value.classList.add('game-dialog--hidden')
  }
}, { immediate: true })
</script>
<template>
  <div 
    v-if="props.show"
    ref="dialogRef"
    class="game-dialog game-dialog--hidden"
  >
    <div class="close-dialog" @click="$emit('close')">x</div>
    <div class="game-dialog__icon">
      <img :src="icons[type as keyof typeof icons]" alt="icon" />
    </div>
    <div class="game-dialog__title">{{ dialog.name }}</div>
    <perfect-scrollbar ref="termScroll">
      <div class="game-dialog__content" v-html="dialog.content"></div>
    </perfect-scrollbar>
  </div>
</template>
