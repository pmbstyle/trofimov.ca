<script lang="ts" setup>
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
</script>
<template>
  <div class="game-dialog" v-if="show">
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
