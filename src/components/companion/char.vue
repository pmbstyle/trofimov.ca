<template>
  <div>
    <canvas
      ref="canvas"
      :width="config.frameWidth"
      :height="config.frameHeight"
      class="aichar-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { SPRITE_CONFIG, SPRITE_FRAMES } from '@/constants/character'
import { loadSprite } from '@/utils/sprite'

type CharacterState = 'Idle' | 'Run' | 'Jump' | 'Sit' | 'Sleep'
type CharacterDirection = 'left' | 'right'

interface CharacterProps {
  state: CharacterState
  duration: number | 'loop'
  direction: CharacterDirection
}

// Import sprite sheets
import IdleSprite from '@/assets/aichar/idle.png'
import RunSprite from '@/assets/aichar/run.png'
import JumpSprite from '@/assets/aichar/jump.png'
import SitSprite from '@/assets/aichar/sit.png'
import SleepSprite from '@/assets/aichar/sleep.png'

const props = defineProps<CharacterProps>()
const emit = defineEmits<{
  (e: 'animationComplete'): void
  (e: 'animationFrame', frame: number): void
}>()

const config = SPRITE_CONFIG
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const currentFrame = ref(0)
let animationInterval: number | null = null

const spriteMap = {
  Idle: { sprite: IdleSprite, frames: SPRITE_FRAMES.Idle },
  Run: { sprite: RunSprite, frames: SPRITE_FRAMES.Run },
  Jump: { sprite: JumpSprite, frames: SPRITE_FRAMES.Jump },
  Sit: { sprite: SitSprite, frames: SPRITE_FRAMES.Sit },
  Sleep: { sprite: SleepSprite, frames: SPRITE_FRAMES.Sleep },
}

const animate = async () => {
  if (!ctx.value || !canvas.value) return

  const { sprite, frames } = spriteMap[props.state]
  const spriteImage = await loadSprite(sprite)

  if (animationInterval) clearInterval(animationInterval)

  const duration = props.duration === 'loop' ? Infinity : props.duration
  const endTime =
    Date.now() + (typeof duration === 'number' ? duration : Infinity)

  animationInterval = window.setInterval(() => {
    ctx.value?.clearRect(0, 0, config.frameWidth, config.frameHeight)

    const x = currentFrame.value * config.frameWidth

    if (props.direction === 'left') {
      ctx.value?.save()
      ctx.value?.scale(-1, 1)
      ctx.value?.drawImage(
        spriteImage,
        x,
        0,
        config.frameWidth,
        config.frameHeight,
        -config.frameWidth,
        0,
        config.frameWidth,
        config.frameHeight
      )
      ctx.value?.restore()
    } else {
      ctx.value?.drawImage(
        spriteImage,
        x,
        0,
        config.frameWidth,
        config.frameHeight,
        0,
        0,
        config.frameWidth,
        config.frameHeight
      )
    }

    currentFrame.value = (currentFrame.value + 1) % frames
    emit('animationFrame', currentFrame.value)

    if (Date.now() >= endTime && props.duration !== 'loop') {
      if (animationInterval) clearInterval(animationInterval)
      emit('animationComplete')
    }
  }, 1000 / config.frameRate)
}

watch(() => [props.state, props.duration, props.direction], animate)

onMounted(() => {
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    animate()
  }
})

onUnmounted(() => {
  if (animationInterval) clearInterval(animationInterval)
})
</script>
