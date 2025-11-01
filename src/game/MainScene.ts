import * as Phaser from 'phaser'
import Player from './Player'
import type { NPCConfig, NPCType, NPCEntity } from '@/types/game'
import baseChipPipo from '@/assets/game/map/[Base]BaseChip_pipo.png'
import waterPipo from '@/assets/game/map/[A]Water_pipo.png'
import dirtPipo from '@/assets/game/map/[A]Dirt_pipo.png'
import bubble from '@/assets/game/npc/bubble.png'
import scarecrow from '@/assets/game/npc/scarecrow.png'
import mailbox from '@/assets/game/npc/mailbox.png'
import stand from '@/assets/game/npc/stand.png'
import statue from '@/assets/game/npc/statue.png'
import ship from '@/assets/game/map/ship.png'
import mapJson from '@/assets/game/map/map.json'
import blacksmithPng from '@/assets/game/npc/blacksmith.png'
import blacksmithAtlas from '@/assets/game/npc/blacksmith_atlas.json'
import blacksmithAnimation from '@/assets/game/npc/blacksmith_anim.json'

// NPC configuration - extracted from hardcoded values
const NPC_CONFIGS: NPCConfig[] = [
  { x: 720, y: 260, texture: 'blacksmith', frame: 'blacksmith_idle' },
  { x: 750, y: 470, texture: 'scarecrow', frame: null },
  { x: 830, y: 320, texture: 'stand', frame: null },
  { x: 1010, y: 320, texture: 'statue', frame: null },
  { x: 640, y: 335, texture: 'mailbox', frame: null },
]

export default class MainScene extends Phaser.Scene {
  public player!: Player
  private npcs: Map<NPCType, NPCEntity> = new Map()
  private interactionPrompts: Map<NPCType, Phaser.GameObjects.Text> = new Map()
  private bubbleTweens: Map<NPCType, Phaser.Tweens.Tween> = new Map()
  private currentDialogNPC: NPCType | null = null
  private dialogOpenHandler: EventListener | null = null
  private dialogCloseHandler: EventListener | null = null

  constructor() {
    super('MainScene')
  }

  preload(): void {
    Player.preload(this)
    this.load.image('tiles', baseChipPipo)
    this.load.image('water', waterPipo)
    this.load.image('dirt', dirtPipo)
    this.load.tilemapTiledJSON('map', mapJson)
    this.load.image('bubble', bubble)
    this.load.image('scarecrow', scarecrow)
    this.load.image('mailbox', mailbox)
    this.load.image('stand', stand)
    this.load.image('statue', statue)
    this.load.image('ship', ship)

    this.load.atlas('blacksmith', blacksmithPng, blacksmithAtlas)
    this.load.animation('blacksmith_anim', blacksmithAnimation)
  }

  create(): void {
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage(
      '[Base]BaseChip_pipo',
      'tiles',
      32,
      32,
      0,
      0
    )
    const water = map.addTilesetImage('[A]Water_pipo', 'water', 32, 32, 0, 0)
    const dirt = map.addTilesetImage('[A]Dirt_pipo', 'dirt', 32, 32, 0, 0)
    
    // Create layers with pixel-perfect rendering
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0)
    const layer2 = map.createLayer('Tile Layer 2', [water, tileset, dirt], 0, 0)
    const layer3 = map.createLayer('Tile Layer 3', [dirt, tileset], 0, 0)
    
    // Ensure layers render at integer positions
    if (layer1) layer1.setPosition(0, 0)
    if (layer2) layer2.setPosition(0, 0)
    if (layer3) layer3.setPosition(0, 0)
    
    if (layer1) {
      layer1.setCollisionByProperty({ collides: true })
      this.matter.world.convertTilemapLayer(layer1)
    }
    if (layer2) {
      layer2.setCollisionByProperty({ collides: true })
      this.matter.world.convertTilemapLayer(layer2)
    }
    if (layer3) {
      layer3.setCollisionByProperty({ collides: true })
      this.matter.world.convertTilemapLayer(layer3)
    }
    
    this.matter.add.sprite(300, 350, 'ship').setStatic(true).setSensor(false)

    this.initNPC()
    this.initPlayer()
    this.initCamera()
    this.setupEventListeners()
  }

  update(): void {
    if (this.player) {
      this.player.update()
      this.updateNPCProximity()
      
      // Update prompt positions to follow NPCs (if camera moves)
      this.npcs.forEach((entity, npcType) => {
        const prompt = this.interactionPrompts.get(npcType)
        if (prompt && entity.isNearPlayer) {
          prompt.setPosition(entity.sprite.x, entity.sprite.y - 50)
        }
      })
    }
  }

  private setupEventListeners(): void {
    // Listen for NPC interaction events from Player
    this.events.on('interactWithNPC', (npcType: NPCType) => {
      this.handleNPCInteraction(npcType)
    })
    
    // Listen for close dialog events
    this.events.on('closeDialog', () => {
      const event = new CustomEvent('gameCloseDialog')
      window.dispatchEvent(event)
      this.handleDialogClose()
    })
    
    // Listen for dialog open/close events from Vue
    this.dialogOpenHandler = ((event: Event) => {
      const customEvent = event as CustomEvent<{ npcType: NPCType }>
      this.handleDialogOpen(customEvent.detail.npcType)
    }) as EventListener
    this.dialogCloseHandler = (() => {
      this.handleDialogClose()
    }) as EventListener
    
    window.addEventListener('gameDialogOpen', this.dialogOpenHandler)
    window.addEventListener('gameCloseDialog', this.dialogCloseHandler)
  }

  private handleNPCInteraction(npcType: NPCType): void {
    // Hide bubble when starting battle
    this.hideBubble(npcType)
    
    // Start battle scene instead of opening dialog
    const battleData = {
      npcType,
      playerX: this.player.x,
      playerY: this.player.y,
    }
    this.scene.start('BattleScene', battleData)
  }

  private handleDialogOpen(npcType: NPCType): void {
    // Hide bubble when dialog opens
    this.hideBubble(npcType)
    this.currentDialogNPC = npcType
  }

  private handleDialogClose(): void {
    // Show bubble again when dialog closes
    if (this.currentDialogNPC) {
      const entity = this.npcs.get(this.currentDialogNPC)
      // Only show bubble if player is still near NPC
      if (entity && entity.isNearPlayer) {
        this.showBubble(this.currentDialogNPC)
        this.startBubblePulse(this.currentDialogNPC)
      }
      this.currentDialogNPC = null
    }
  }

  private hideBubble(npcType: NPCType): void {
    const entity = this.npcs.get(npcType)
    if (entity && entity.bubble) {
      // Stop pulsing animation
      this.stopBubblePulse(npcType)
      // Hide the bubble
      entity.bubble.setVisible(false)
    }
  }

  private showBubble(npcType: NPCType): void {
    const entity = this.npcs.get(npcType)
    if (entity && entity.bubble) {
      // Show the bubble
      entity.bubble.setVisible(true)
    }
  }

  private updateNPCProximity(): void {
    // Update proximity state and visual feedback
    this.npcs.forEach((entity, npcType) => {
      if (this.player && entity.sprite.body) {
        const playerBody = this.player.body as any
        const playerSensor = playerBody.parts?.find((part: any) => part.label === 'playerSensor')
        // Find the NPC sensor by label (more reliable than array index)
        const npcBody = entity.sprite.body as any
        const sensorLabel = npcType + 'Sensor'
        const npcSensor = npcBody.parts?.find((part: any) => part.label === sensorLabel)
        if (!playerSensor || !npcSensor) return
        
        // Use the same collision check as Player interaction
        const isNear = this.matter.overlap(playerSensor, npcSensor)
        const wasNear = entity.isNearPlayer
        entity.isNearPlayer = !!isNear

        // Show/hide interaction prompt
        const prompt = this.interactionPrompts.get(npcType)
        if (isNear && !wasNear) {
          // Just entered proximity - show prompt and start bubble pulse
          // Only show bubble if no dialog is currently open for this NPC
          if (this.currentDialogNPC !== npcType) {
            this.showInteractionPrompt(npcType)
            this.startBubblePulse(npcType)
          }
          if (entity.sprite) {
            // Add subtle glow effect
            entity.sprite.setTint(0xffffaa)
          }
        } else if (!isNear && wasNear) {
          // Just left proximity - hide prompt and stop pulse
          this.hideInteractionPrompt(npcType)
          this.stopBubblePulse(npcType)
          if (entity.sprite) {
            entity.sprite.clearTint()
          }
        }
      }
    })
  }

  private showInteractionPrompt(npcType: NPCType): void {
    const entity = this.npcs.get(npcType)
    if (!entity) return

    let prompt = this.interactionPrompts.get(npcType)
    if (!prompt) {
      prompt = this.add
        .text(entity.sprite.x, entity.sprite.y - 50, 'Press SPACE', {
          fontSize: '10px',
          fontFamily: 'Arial',
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 3,
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: '#000000',
            blur: 0,
            stroke: true,
            fill: true,
          },
        })
        .setOrigin(0.5, 0.5)
        .setDepth(1000)
        .setScale(0)
      
      this.interactionPrompts.set(npcType, prompt)
      
      // Animate prompt appearance
      this.tweens.add({
        targets: prompt,
        scale: 1,
        duration: 200,
        ease: 'Back.easeOut',
      })
    } else {
      prompt.setVisible(true)
      this.tweens.add({
        targets: prompt,
        scale: 1,
        duration: 200,
        ease: 'Back.easeOut',
      })
    }
  }

  private hideInteractionPrompt(npcType: NPCType): void {
    const prompt = this.interactionPrompts.get(npcType)
    if (prompt) {
      this.tweens.add({
        targets: prompt,
        scale: 0,
        duration: 150,
        ease: 'Back.easeIn',
        onComplete: () => {
          prompt.setVisible(false)
        },
      })
    }
  }

  private startBubblePulse(npcType: NPCType): void {
    const entity = this.npcs.get(npcType)
    if (!entity || !entity.bubble) return

    // Stop any existing pulse
    this.stopBubblePulse(npcType)

    // Create pulsing animation
    const bubble = entity.bubble
    const tween = this.tweens.add({
      targets: bubble,
      scale: { from: 1, to: 1.2 },
      alpha: { from: 1, to: 0.7 },
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    this.bubbleTweens.set(npcType, tween)
  }

  private stopBubblePulse(npcType: NPCType): void {
    const tween = this.bubbleTweens.get(npcType)
    if (tween) {
      tween.stop()
      this.bubbleTweens.delete(npcType)
      
      const entity = this.npcs.get(npcType)
      if (entity && entity.bubble) {
        entity.bubble.setScale(1)
        entity.bubble.setAlpha(1)
      }
    }
  }

  initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    
    // Enable pixel-perfect rendering for camera
    this.cameras.main.roundPixels = true
    
    // Use whole number zoom (2 instead of 1.5) to prevent sub-pixel rendering gaps
    // Non-integer zooms cause vertical/horizontal lines between tiles
    this.cameras.main.setZoom(2)
    
    // Smoother camera following with lerp (0.1 = smoother without sub-pixel issues)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    
    // Set camera deadzone to prevent jitter when player is still
    this.cameras.main.setDeadzone(20, 20)
    
    // Set camera bounds to prevent following outside map
    const mapWidth = 48 * 32 // tiles * tile size
    const mapHeight = 24 * 32
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight)
  }
  
  private zoomOnInteraction(npcType: NPCType): void {
    // Removed zoom effect - just open dialog without camera zoom
    // This prevents the unwanted zoom behavior
  }

  initPlayer(): void {
    this.player = new Player({
      scene: this,
      x: 470,
      y: 370,
      texture: 'player',
      frame: 'townsfolk_m_idle_1',
    })
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as {
      up: Phaser.Input.Keyboard.Key
      down: Phaser.Input.Keyboard.Key
      left: Phaser.Input.Keyboard.Key
      right: Phaser.Input.Keyboard.Key
      space: Phaser.Input.Keyboard.Key
    }
  }

  initNPC(): void {
    const { Body, Bodies } = Phaser.Physics.Matter.Matter
    
    NPC_CONFIGS.forEach(config => {
      const sprite = this.matter.add.sprite(config.x, config.y, config.texture)
      
      // Create bubble sprite
      const bubbleY = config.texture !== 'stand' && config.texture !== 'statue' 
        ? config.y - 20 
        : config.y - 40
      const bubbleSprite = this.matter.add
        .sprite(config.x, bubbleY, 'bubble')
        .setStatic(true)
        .setSensor(config.texture === 'stand' || config.texture === 'statue')

      const colliderName = config.texture + 'Collider'
      const sensorName = config.texture + 'Sensor'
      const compoundBody = Body.create({
        parts: [
          Bodies.circle(sprite.x, sprite.y, 12, {
            isSensor: false,
            label: colliderName,
          }),
          Bodies.circle(sprite.x, sprite.y, 24, {
            isSensor: true,
            label: sensorName,
          }),
        ],
        frictionAir: 0.35,
      })
      sprite.setExistingBody(compoundBody)
      sprite.setFixedRotation()
      sprite.body.isStatic = true
      
      if (config.frame) {
        sprite.play(config.frame)
      }

      // Store NPC entity
      const entity: NPCEntity = {
        sprite,
        bubble: bubbleSprite,
        isNearPlayer: false,
        type: config.texture,
      }
      this.npcs.set(config.texture, entity)
      
      // Keep old property access for compatibility during transition
      ;(this as any)[config.texture] = sprite
    })
  }

  getNPC(npcType: NPCType): NPCEntity | undefined {
    return this.npcs.get(npcType)
  }

  destroy(): void {
    // Stop all tweens
    this.bubbleTweens.forEach(tween => tween.stop())
    this.bubbleTweens.clear()
    
    // Cleanup interaction prompts
    this.interactionPrompts.forEach(prompt => prompt.destroy())
    this.interactionPrompts.clear()
    
    // Cleanup NPCs
    this.npcs.forEach(entity => {
      entity.sprite.destroy()
      entity.bubble?.destroy()
    })
    this.npcs.clear()
    
    // Cleanup player
    if (this.player) {
      this.player.destroy()
    }
    
    // Remove event listeners
    this.events.removeAllListeners()
    
    // Remove window event listeners
    if (this.dialogOpenHandler) {
      window.removeEventListener('gameDialogOpen', this.dialogOpenHandler)
      this.dialogOpenHandler = null
    }
    if (this.dialogCloseHandler) {
      window.removeEventListener('gameCloseDialog', this.dialogCloseHandler)
      this.dialogCloseHandler = null
    }
    
    super.destroy()
  }
}

