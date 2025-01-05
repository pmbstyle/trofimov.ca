<template>
  <div class="w-[320px] h-[64px] absolute bottom-0 right-14 overflow-hidden">
    <Char
      :state="state"
      :duration="'loop'"
      :direction="direction"
      class="absolute cursor-pointer"
      :style="charStyle"
      @click="toggleChat"
    />
  </div>
  <!-- <Chat/> -->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Char from './Char.vue'
import Chat from './Chat.vue'

const state = ref<'Idle' | 'Run' | 'Jump' | 'Sit' | 'Sleep'>('Idle')
const direction = ref<'left' | 'right'>('right')

const posX = ref(0)
const posY = ref(0)

const speed = 1
const jumpHeight = 10
const jumpDuration = 500
let actionInterval: number | null = null
let movementInterval: number | null = null
let timeoutIds = []

const updateMovement = () => {
  if (state.value === 'Run') {
    if (direction.value === 'right') {
      posX.value += speed
      if (posX.value > 320 - 32) {
        direction.value = 'left'
      }
    } else {
      posX.value -= speed
      if (posX.value < 0) {
        direction.value = 'right'
      }
    }
  }
}

const charStyle = computed(() => ({
  transform: `translate(${posX.value}px, ${posY.value}px)`,
  width: '64px', // scaled up
  height: '64px', // scaled up
  imageRendering: 'pixelated',
}))

const startAnimation = () => {
  state.value = 'Idle'
  timeoutIds.push(
    setTimeout(() => {
      state.value = 'Run'
      direction.value = 'right'
      timeoutIds.push(
        setTimeout(() => {
          jump()
          timeoutIds.push(
            setTimeout(() => {
              direction.value = 'left'
              state.value = 'Run'
              timeoutIds.push(
                setTimeout(() => {
                  direction.value = 'left'
                  state.value = 'Idle'
                }, 2000)
              )
              direction.value = 'right'
              state.value = 'Run'
              timeoutIds.push(
                setTimeout(() => {
                  state.value = 'Sleep'
                }, 2000)
              )
            }, jumpDuration + 200)
          )
        }, 4000)
      )
    }, 3000)
  )
}

const jump = () => {
  state.value = 'Jump'
  const startY = posY.value
  const peakY = startY - jumpHeight

  const start = Date.now()
  const animateJump = () => {
    const elapsed = Date.now() - start
    const progress = elapsed / jumpDuration
    if (progress < 0.5) {
      posY.value = startY - progress * 2 * jumpHeight
    } else if (progress < 1) {
      posY.value = peakY + (progress - 0.5) * 2 * jumpHeight
    } else {
      posY.value = startY
      return
    }
    requestAnimationFrame(animateJump)
  }
  requestAnimationFrame(animateJump)
}

const stopAnimation = () => {
  state.value = 'Idle'
  posX.value = 200
  posY.value = 0
  direction.value = 'left'

  timeoutIds.forEach(id => clearTimeout(id))
  timeoutIds = []

  if (movementInterval) {
    clearInterval(movementInterval)
    movementInterval = null
  }
  if (actionInterval) {
    clearInterval(actionInterval)
    actionInterval = null
  }
}

const toggleChat = () => {
  if (timeoutIds.length) {
    stopAnimation()
  } else {
    movementInterval = window.setInterval(updateMovement, 16)
    startAnimation()
    actionInterval = window.setInterval(startAnimation, 20000)
  }
}

onMounted(() => {
  movementInterval = window.setInterval(updateMovement, 16)
  startAnimation()
  actionInterval = window.setInterval(startAnimation, 20000)
})

onUnmounted(() => {
  stopAnimation()
})
</script>
