<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as Phaser from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import MainScene from '@/game/MainScene'
import BattleScene from '@/game/BattleScene'
import { useDialogsStore } from '@/stores/dialogs'
import type { NPCType } from '@/types/game'

const dialogStore = useDialogsStore()
const gameInstance = ref<Phaser.Game | null>(null)
const showInstructions = ref(true)
const gameContainerRef = ref<HTMLElement | null>(null)
const dismissCountdown = ref(5)
const showLossScreen = ref(false)
const showBattleUI = ref(false)
const playerHealth = ref(100)
const npcHealth = ref(100)
let countdownInterval: number | null = null

const getOptimalSize = () => {
  if (!gameContainerRef.value) {
    return { width: 768, height: 500 }
  }
  
  const rect = gameContainerRef.value.getBoundingClientRect()
  const containerWidth = rect.width || 768
  const containerHeight = rect.height || 500
  
  // Maintain 16:10 aspect ratio (768:480, but use 768:500 for better fit)
  const aspectRatio = 768 / 500
  let width = containerWidth
  let height = width / aspectRatio
  
  // If height is too large, constrain by height instead
  if (height > containerHeight) {
    height = containerHeight
    width = height * aspectRatio
  }
  
  return {
    width: Math.floor(width),
    height: Math.floor(height),
  }
}

const config = ref<Phaser.Types.Core.GameConfig>({
  type: Phaser.AUTO,
  width: 768,
  height: 500,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 768,
    height: 500,
  },
  scene: [MainScene, BattleScene],
  parent: 'game',
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  transparent: true,
  autoFocus: true,
  pixelArt: true,
  roundPixels: true,
  antialias: false,
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision',
      },
    ],
  },
})

const handleResize = () => {
  if (gameInstance.value && gameContainerRef.value) {
    const size = getOptimalSize()
    gameInstance.value.scale.resize(size.width, size.height)
  }
}

const handleNPCInteraction = (evt: Event) => {
  const customEvent = evt as CustomEvent<{ npcType: NPCType }>
  const npcType = customEvent.detail.npcType
  
  // Map NPC types to dialog types
  const dialogTypeMap: Record<NPCType, 'skills' | 'experience' | 'contacts' | 'education' | 'about'> = {
    blacksmith: 'skills',
    scarecrow: 'experience',
    mailbox: 'contacts',
    stand: 'education',
    statue: 'about',
  }
  
  const dialogType = dialogTypeMap[npcType]
  const dialogName = npcType
  
  // Check if this dialog is already open - if so, close it
  if (dialogStore.dialogues[dialogName as keyof typeof dialogStore.dialogues].show) {
    dialogStore.dialogues[dialogName as keyof typeof dialogStore.dialogues].show = false
    return
  }
  
  // Close all other dialogs first
  Object.keys(dialogStore.dialogues).forEach(key => {
    dialogStore.dialogues[key as keyof typeof dialogStore.dialogues].show = false
  })
  
  // Open the dialog
  dialogStore.dialogues[dialogName as keyof typeof dialogStore.dialogues].show = true
  
  // Notify game scene that dialog is opening
  const event = new CustomEvent('gameDialogOpen', { detail: { npcType } })
  window.dispatchEvent(event)
}

const handleCloseDialog = () => {
  // Close all dialogs
  Object.keys(dialogStore.dialogues).forEach(key => {
    dialogStore.dialogues[key as keyof typeof dialogStore.dialogues].show = false
  })
}

const handleBattleStart = () => {
  showBattleUI.value = true
  playerHealth.value = 100
  npcHealth.value = 100
}

const handleBattleHealth = (evt: Event) => {
  const customEvent = evt as CustomEvent<{ playerHealth: number, npcHealth: number }>
  playerHealth.value = customEvent.detail.playerHealth
  npcHealth.value = customEvent.detail.npcHealth
}

const handleBattleEnd = (evt: Event) => {
  showBattleUI.value = false
  const customEvent = evt as CustomEvent<{ result: 'win' | 'loss', npcType: NPCType }>
  const { result, npcType } = customEvent.detail
  
  if (result === 'win') {
    // Show dialog on win
    const dialogTypeMap: Record<NPCType, 'skills' | 'experience' | 'contacts' | 'education' | 'about'> = {
      blacksmith: 'skills',
      scarecrow: 'experience',
      mailbox: 'contacts',
      stand: 'education',
      statue: 'about',
    }
    
    const dialogName = npcType
    // Close all other dialogs first
    Object.keys(dialogStore.dialogues).forEach(key => {
      dialogStore.dialogues[key as keyof typeof dialogStore.dialogues].show = false
    })
    
    // Open the dialog
    dialogStore.dialogues[dialogName as keyof typeof dialogStore.dialogues].show = true
  } else {
    // Show loss screen
    showLossScreen.value = true
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      showLossScreen.value = false
    }, 3000)
  }
}

onMounted(async () => {
  await nextTick()
  
  // Wait for DOM element to be available
  if (!gameContainerRef.value) {
    console.error('Game container element not found')
    return
  }
  
  // Update config based on container size
  const size = getOptimalSize()
  config.value.width = size.width
  config.value.height = size.height
  if (config.value.scale) {
    config.value.scale.width = size.width
    config.value.scale.height = size.height
  }
  
  // Set parent to the actual DOM element
  config.value.parent = gameContainerRef.value
  
  // Create game instance
  try {
    gameInstance.value = new Phaser.Game(config.value as Phaser.Types.Core.GameConfig)
  } catch (error) {
    console.error('Failed to initialize Phaser game:', error)
  }
  
  // Listen for NPC interaction events
  window.addEventListener('gameNPCInteract', handleNPCInteraction as EventListener)
  
  // Listen for close dialog events
  window.addEventListener('gameCloseDialog', handleCloseDialog)
  
  // Listen for battle events
  window.addEventListener('battleStart', handleBattleStart)
  window.addEventListener('battleHealth', handleBattleHealth as EventListener)
  window.addEventListener('battleEnd', handleBattleEnd as EventListener)
  
  // Listen for window resize
  window.addEventListener('resize', handleResize)
  
  // Start countdown timer for instructions
  countdownInterval = window.setInterval(() => {
    dismissCountdown.value--
    if (dismissCountdown.value <= 0) {
      showInstructions.value = false
      if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }
  }, 1000)
})

const closeInstructions = () => {
  showInstructions.value = false
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

onBeforeUnmount(() => {
  // Clear countdown interval
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
  
  // Remove event listeners
  window.removeEventListener('gameNPCInteract', handleNPCInteraction as EventListener)
  window.removeEventListener('gameCloseDialog', handleCloseDialog)
  window.removeEventListener('battleStart', handleBattleStart)
  window.removeEventListener('battleHealth', handleBattleHealth as EventListener)
  window.removeEventListener('battleEnd', handleBattleEnd as EventListener)
  window.removeEventListener('resize', handleResize)
  
  // Destroy game instance to prevent memory leaks
  if (gameInstance.value) {
    gameInstance.value.destroy(true)
    gameInstance.value = null
  }
})
</script>

<template>
  <div id="game" ref="gameContainerRef" class="game w-full overflow-hidden relative">
    <div 
      v-if="showInstructions" 
      class="game-instructions-overlay"
      @click="closeInstructions"
    >
      <div class="game-instructions-content">
        <h3>Controls</h3>
        <div class="game-instructions-grid">
          <div>
            <strong>Movement:</strong>
            <div class="game-instructions-keys">
              <kbd>W</kbd>
              <kbd>A</kbd>
              <kbd>S</kbd>
              <kbd>D</kbd>
            </div>
          </div>
          <div>
            <strong>Action:</strong>
            <div class="game-instructions-keys">
              <kbd>SPACE</kbd>
            </div>
          </div>
        </div>
        <p class="game-instructions-hint">
          Walk up to NPCs and press <kbd>SPACE</kbd> to interact
        </p>
        <p class="game-instructions-dismiss">
          Click anywhere to dismiss ({{ dismissCountdown }} sec)
        </p>
      </div>
    </div>
    <div 
      v-if="showBattleUI" 
      class="game-battle-ui"
    >
      <div class="game-health-bars">
        <div class="game-health-bar-container">
          <div class="game-health-bar-label">Player</div>
          <div class="game-health-bar-bg">
            <div 
              class="game-health-bar-fill game-health-bar-player" 
              :style="{ width: `${playerHealth}%` }"
            ></div>
          </div>
        </div>
        <div class="game-health-bar-container">
          <div class="game-health-bar-label">NPC</div>
          <div class="game-health-bar-bg">
            <div 
              class="game-health-bar-fill game-health-bar-npc" 
              :style="{ width: `${npcHealth}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
    <div 
      v-if="showLossScreen" 
      class="game-loss-overlay"
      @click="showLossScreen = false"
    >
      <div class="game-loss-content">
        <h2>You have lost</h2>
        <p>Click to continue</p>
      </div>
    </div>
  </div>
</template>
