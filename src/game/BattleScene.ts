import * as Phaser from 'phaser'
import Player from './Player'
import Projectile from './Projectile'
import type { NPCConfig, NPCType, BattleData } from '@/types/game'
import baseChipPipo from '@/assets/game/map/[Base]BaseChip_pipo.png'
import waterPipo from '@/assets/game/map/[A]Water_pipo.png'
import dirtPipo from '@/assets/game/map/[A]Dirt_pipo.png'
import ship from '@/assets/game/map/ship.png'
import mapJson from '@/assets/game/map/map.json'
import bubble from '@/assets/game/npc/bubble.png'
import scarecrow from '@/assets/game/npc/scarecrow.png'
import mailbox from '@/assets/game/npc/mailbox.png'
import stand from '@/assets/game/npc/stand.png'
import statue from '@/assets/game/npc/statue.png'
import blacksmithPng from '@/assets/game/npc/blacksmith.png'
import blacksmithAtlas from '@/assets/game/npc/blacksmith_atlas.json'
import blacksmithAnimation from '@/assets/game/npc/blacksmith_anim.json'

// NPC configuration - same as MainScene but we'll filter for battle
const NPC_CONFIGS: NPCConfig[] = [
  { x: 720, y: 260, texture: 'blacksmith', frame: 'blacksmith_idle' },
  { x: 750, y: 470, texture: 'scarecrow', frame: null },
  { x: 830, y: 320, texture: 'stand', frame: null },
  { x: 1010, y: 320, texture: 'statue', frame: null },
  { x: 640, y: 335, texture: 'mailbox', frame: null },
]

export default class BattleScene extends Phaser.Scene {
  public player!: Player
  private npcSprite!: Phaser.Physics.Matter.Sprite
  private npcType!: NPCType
  private playerHealth: number = 100
  private npcHealth: number = 100
  private playerHealthBar!: Phaser.GameObjects.Graphics
  private npcHealthBar!: Phaser.GameObjects.Graphics
  private playerHealthBarBg!: Phaser.GameObjects.Graphics
  private npcHealthBarBg!: Phaser.GameObjects.Graphics
  
  private playerProjectiles: Projectile[] = []
  private npcProjectiles: Projectile[] = []
  
  private playerAttackTimer!: Phaser.Time.TimerEvent
  private npcAttackTimer!: Phaser.Time.TimerEvent
  
  private totalNPCAttacks: number = 0
  private dodgedAttacks: number = 0
  private hitsTaken: number = 0
  
  private isJumping: boolean = false
  private jumpInvulnerable: boolean = false
  private playerStartY: number = 0
  
  private battleData!: BattleData

  constructor() {
    super('BattleScene')
  }

  init(data: BattleData): void {
    this.battleData = data
    this.npcType = data.npcType
    this.playerHealth = 100
    this.npcHealth = 100
    this.totalNPCAttacks = 0
    this.dodgedAttacks = 0
    this.hitsTaken = 0
    this.isJumping = false
    this.jumpInvulnerable = false
  }

  preload(): void {
    Player.preload(this)
    Projectile.preload(this)
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
    // Create map layers (same as MainScene but we'll hide most NPCs)
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
    
    const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0)
    const layer2 = map.createLayer('Tile Layer 2', [water, tileset, dirt], 0, 0)
    const layer3 = map.createLayer('Tile Layer 3', [dirt, tileset], 0, 0)
    
    if (layer1) {
      layer1.setPosition(0, 0)
      layer1.setDepth(0) // Bottom layer
      // Don't convert to collision - projectiles should pass through tiles
    }
    if (layer2) {
      layer2.setPosition(0, 0)
      layer2.setDepth(1)
      // Don't convert to collision - projectiles should pass through tiles
    }
    if (layer3) {
      layer3.setPosition(0, 0)
      layer3.setDepth(2)
      // Don't convert to collision - projectiles should pass through tiles
    }
    
    // Ship decoration - make it a sensor so projectiles pass through
    const shipSprite = this.matter.add.sprite(300, 350, 'ship')
    shipSprite.setStatic(true)
    shipSprite.setSensor(true) // Make sensor so projectiles pass through
    shipSprite.setDepth(3)

    // Position player and NPC on opposite sides of road
    // Road is at player's X position, so player stays at their X, NPC goes to opposite side
    const npcConfig = NPC_CONFIGS.find(config => config.texture === this.npcType)
    const npcOriginalX = npcConfig?.x || 720
    const npcOriginalY = npcConfig?.y || 260
    
    // Player on left side (slightly left of their position), NPC on right side
    const playerX = this.battleData.playerX - 100
    const playerY = this.battleData.playerY
    const npcX = this.battleData.playerX + 200
    const npcY = playerY // Same Y as player for battle alignment
    
    // Initialize player
    this.player = new Player({
      scene: this,
      x: playerX,
      y: playerY,
      texture: 'player',
      frame: 'townsfolk_m_idle_1',
    })
    this.playerStartY = playerY
    this.player.inputKeys = this.input.keyboard!.addKeys({
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
    
    // Disable player movement in battle
    this.player.setFixedRotation()
    this.player.setDepth(10) // Player on top of decorations
    
    // Initialize NPC (only the one we're battling)
    this.npcSprite = this.matter.add.sprite(npcX, npcY, this.npcType)
    this.npcSprite.setDepth(10) // NPC on top of decorations
    const { Body, Bodies } = Phaser.Physics.Matter.Matter
    const npcBody = Bodies.circle(npcX, npcY, 12, {
      isSensor: false,
      label: 'npcCollider',
    })
    this.npcSprite.setExistingBody(npcBody)
    this.npcSprite.setFixedRotation()
    if (this.npcSprite.body) {
      (this.npcSprite.body as any).isStatic = true
    }
    
    if (npcConfig?.frame) {
      this.npcSprite.play(npcConfig.frame)
    }

    // Setup collision detection with a small delay to avoid immediate collisions
    this.time.delayedCall(100, () => {
      this.matter.world.on('collisionstart', (event: any) => {
        event.pairs.forEach((pair: any) => {
          const { bodyA, bodyB } = pair
          
          // Player projectile hits NPC
          if (bodyA.label === 'playerProjectile' && bodyB.label === 'npcCollider') {
            this.handlePlayerProjectileHit(bodyA)
          } else if (bodyA.label === 'npcCollider' && bodyB.label === 'playerProjectile') {
            this.handlePlayerProjectileHit(bodyB)
          }
          
          // NPC projectile hits player (only if not invulnerable from jumping)
          if (bodyA.label === 'npcProjectile' && bodyB.label === 'playerCollider') {
            if (!this.jumpInvulnerable) {
              this.handleNPCProjectileHit(bodyA)
            } else {
              // Player is jumping/invulnerable - count as a successful dodge
              const projectile = this.npcProjectiles.find(p => p.body === bodyA || (p.body as any).parts?.some((part: any) => part === bodyA || part.id === bodyA.id))
              if (projectile && projectile.active) {
                this.dodgedAttacks++
                projectile.destroy()
                this.npcProjectiles = this.npcProjectiles.filter(p => p !== projectile)
              }
            }
          } else if (bodyA.label === 'playerCollider' && bodyB.label === 'npcProjectile') {
            if (!this.jumpInvulnerable) {
              this.handleNPCProjectileHit(bodyB)
            } else {
              // Player is jumping/invulnerable - count as a successful dodge
              const projectile = this.npcProjectiles.find(p => p.body === bodyB || (p.body as any).parts?.some((part: any) => part === bodyB || part.id === bodyB.id))
              if (projectile && projectile.active) {
                this.dodgedAttacks++
                projectile.destroy()
                this.npcProjectiles = this.npcProjectiles.filter(p => p !== projectile)
              }
            }
          }
        })
      })
    })

    // Setup camera first
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.roundPixels = true
    this.cameras.main.setZoom(2)
    this.cameras.main.centerOn((playerX + npcX) / 2, playerY)
    
    // Dispatch battle start event for Vue UI
    const battleStartEvent = new CustomEvent('battleStart')
    window.dispatchEvent(battleStartEvent)

    // Start attack timers
    this.startAttackTimers()
    
    // Setup event listeners
    this.setupEventListeners()
    
    // Fire first projectile immediately for testing
    this.time.delayedCall(500, () => {
      this.firePlayerProjectile()
    })
  }


  private updatePlayerHealthBar(): void {
    // Dispatch health update event to Vue
    const healthEvent = new CustomEvent('battleHealth', {
      detail: { playerHealth: this.playerHealth, npcHealth: this.npcHealth }
    })
    window.dispatchEvent(healthEvent)
  }

  private updateNPCHealthBar(): void {
    // Dispatch health update event to Vue
    const healthEvent = new CustomEvent('battleHealth', {
      detail: { playerHealth: this.playerHealth, npcHealth: this.npcHealth }
    })
    window.dispatchEvent(healthEvent)
  }

  private startAttackTimers(): void {
    // Player auto-attack every 1.5 seconds
    this.playerAttackTimer = this.time.addEvent({
      delay: 1500,
      callback: this.firePlayerProjectile,
      callbackScope: this,
      loop: true,
    })
    
    // NPC attacks every 2.5 seconds
    this.npcAttackTimer = this.time.addEvent({
      delay: 2500,
      callback: this.fireNPCProjectile,
      callbackScope: this,
      loop: true,
    })
  }

  private firePlayerProjectile(): void {
    if (!this.player || !this.npcSprite) return
    
    const projectile = new Projectile({
      scene: this,
      x: this.player.x,
      y: this.player.y,
      velocityX: 8, // Speed towards NPC (positive = right) - faster
      damage: 10,
      isPlayerProjectile: true,
    })
    
    // Make projectile more visible
    projectile.setTint(0x00ff00) // Green tint for player projectiles
    projectile.setDepth(50) // Projectiles above player/NPC
    projectile.setVisible(true)
    projectile.setActive(true)
    
    
    this.playerProjectiles.push(projectile)
  }

  private fireNPCProjectile(): void {
    if (!this.player || !this.npcSprite) return
    
    this.totalNPCAttacks++
    
    const projectile = new Projectile({
      scene: this,
      x: this.npcSprite.x,
      y: this.npcSprite.y,
      velocityX: -8, // Speed towards player (negative = left) - faster
      damage: 15,
      isPlayerProjectile: false,
    })
    
    // Make projectile more visible
    projectile.setTint(0xff0000) // Red tint for NPC projectiles
    projectile.setDepth(50) // Projectiles above player/NPC
    projectile.setVisible(true)
    projectile.setActive(true)
    
    
    this.npcProjectiles.push(projectile)
  }

  private handlePlayerProjectileHit(body: any): void {
    // Find the projectile by matching body or body parts
    const projectile = this.playerProjectiles.find(p => {
      if (!p.body || !p.active) return false
      if (p.body === body) return true
      if ((p.body as any).parts) {
        return (p.body as any).parts.some((part: any) => part === body || part.id === body.id)
      }
      return false
    })
    if (!projectile || !projectile.active) return
    
    // Only hit if projectile has moved away from spawn point (avoid immediate collision)
    const startX = (projectile as any).startX
    if (startX && Math.abs(projectile.x - startX) < 30) {
      return
    }
    
    // Deal damage to NPC
    this.npcHealth = Math.max(0, this.npcHealth - projectile.damage)
    this.updateNPCHealthBar()
    
    // Destroy projectile
    projectile.destroy()
    this.playerProjectiles = this.playerProjectiles.filter(p => p !== projectile && p.active)
    
    // Check win condition
    if (this.npcHealth <= 0) {
      this.checkWinCondition()
    }
  }

  private handleNPCProjectileHit(body: any): void {
    // Find the projectile by matching body or body parts
    const projectile = this.npcProjectiles.find(p => {
      if (!p.body || !p.active) return false
      if (p.body === body) return true
      if ((p.body as any).parts) {
        return (p.body as any).parts.some((part: any) => part === body || part.id === body.id)
      }
      return false
    })
    if (!projectile || !projectile.active) return
    
    // Only hit if projectile has moved away from spawn point (avoid immediate collision)
    const startX = (projectile as any).startX
    if (startX && Math.abs(projectile.x - startX) < 30) {
      return
    }
    
    // Deal damage to player
    this.playerHealth = Math.max(0, this.playerHealth - projectile.damage)
    this.updatePlayerHealthBar()
    this.hitsTaken++
    
    // Destroy projectile
    projectile.destroy()
    this.npcProjectiles = this.npcProjectiles.filter(p => p !== projectile && p.active)
    
    // Check loss condition
    if (this.playerHealth <= 0) {
      this.endBattle('loss')
    }
  }

  update(): void {
    if (!this.player) return

    // Disable player movement (WASD) - override player update behavior
    this.player.setVelocity(0, 0)
    this.player.anims.play('idle', true)

    // Handle jump (SPACE key)
    if (Phaser.Input.Keyboard.JustDown(this.player.inputKeys.space)) {
      if (!this.isJumping) {
        this.jump()
      }
    }

    // Update jump animation
    if (this.isJumping) {
      // Check if player is back on ground
      if (Math.abs(this.player.y - this.playerStartY) < 5) {
        this.isJumping = false
        this.jumpInvulnerable = false
      }
    }

    // Ensure projectiles maintain velocity
    this.playerProjectiles.forEach(p => {
      if (p.active && p.body) {
        const Matter = Phaser.Physics.Matter.Matter
        const vel = Matter.Body.getVelocity(p.body)
        if (Math.abs(vel.x) < 0.1) {
          Matter.Body.setVelocity(p.body, { x: 8, y: 0 })
          p.setVelocityX(8)
          p.setVelocityY(0)
        } else {
          p.setVelocityX(vel.x)
          p.setVelocityY(vel.y)
        }
      }
    })
    
    this.npcProjectiles.forEach(p => {
      if (p.active && p.body) {
        const Matter = Phaser.Physics.Matter.Matter
        const vel = Matter.Body.getVelocity(p.body)
        if (Math.abs(vel.x) < 0.1) {
          Matter.Body.setVelocity(p.body, { x: -8, y: 0 })
          p.setVelocityX(-8)
          p.setVelocityY(0)
        } else {
          p.setVelocityX(vel.x)
          p.setVelocityY(vel.y)
        }
      }
    })
    
    // Clean up destroyed projectiles
    this.playerProjectiles = this.playerProjectiles.filter(p => p.active)
    this.npcProjectiles = this.npcProjectiles.filter(p => p.active)
    
    // Dispatch health update event to Vue
    const healthEvent = new CustomEvent('battleHealth', {
      detail: { playerHealth: this.playerHealth, npcHealth: this.npcHealth }
    })
    window.dispatchEvent(healthEvent)
  }

  private jump(): void {
    if (!this.player) return
    
    this.isJumping = true
    this.jumpInvulnerable = true
    
    // Play jump animation if available
    this.player.anims.play('jump', true)
    
    // Move player up
    const jumpHeight = 60
    this.tweens.add({
      targets: this.player,
      y: this.playerStartY - jumpHeight,
      duration: 300,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        this.player.setY(this.playerStartY)
      },
    })
    
    // Invulnerability duration
    this.time.delayedCall(600, () => {
      this.jumpInvulnerable = false
    })
    
    // Check if player avoided an attack (dodge)
    // Look for projectiles that would have hit the player if they didn't jump
    const nearbyProjectiles = this.npcProjectiles.filter(p => {
      if (!p.active) return false
      const distance = Math.abs(p.x - this.player.x)
      const yDistance = Math.abs(p.y - this.player.y)
      // Projectile is close horizontally and would have hit if player didn't jump
      return distance < 30 && yDistance < 30
    })
    
    if (nearbyProjectiles.length > 0) {
      // Player successfully dodged - destroy projectiles and count as dodge
      nearbyProjectiles.forEach(p => {
        this.dodgedAttacks++
        p.destroy()
      })
      this.npcProjectiles = this.npcProjectiles.filter(p => !nearbyProjectiles.includes(p))
    }
  }

  private checkWinCondition(): void {
    // Win if NPC is defeated
    if (this.npcHealth <= 0) {
      this.endBattle('win')
    }
  }

  private endBattle(result: 'win' | 'loss'): void {
    // Stop attack timers
    if (this.playerAttackTimer) {
      this.playerAttackTimer.remove()
    }
    if (this.npcAttackTimer) {
      this.npcAttackTimer.remove()
    }
    
    // Clean up projectiles
    this.playerProjectiles.forEach(p => p.destroy())
    this.npcProjectiles.forEach(p => p.destroy())
    
    // Dispatch event with result
    const event = new CustomEvent('battleEnd', { 
      detail: { result, npcType: this.npcType } 
    })
    window.dispatchEvent(event)
    
    // Return to main scene
    this.scene.start('MainScene')
  }

  private setupEventListeners(): void {
    // Listen for battle end events from outside
    this.events.on('shutdown', () => {
      // Cleanup
    })
  }

  destroy(): void {
    // Stop timers
    if (this.playerAttackTimer) {
      this.playerAttackTimer.remove()
    }
    if (this.npcAttackTimer) {
      this.npcAttackTimer.remove()
    }
    
    // Clean up projectiles
    this.playerProjectiles.forEach(p => {
      if (p.active) p.destroy()
    })
    this.npcProjectiles.forEach(p => {
      if (p.active) p.destroy()
    })
    
    // Cleanup
    if (this.player) {
      this.player.destroy()
    }
    if (this.npcSprite) {
      this.npcSprite.destroy()
    }
    if (this.playerHealthBar) {
      this.playerHealthBar.destroy()
    }
    if (this.npcHealthBar) {
      this.npcHealthBar.destroy()
    }
    if (this.playerHealthBarBg) {
      this.playerHealthBarBg.destroy()
    }
    if (this.npcHealthBarBg) {
      this.npcHealthBarBg.destroy()
    }
    
    // Remove event listeners
    this.events.removeAllListeners()
    this.matter.world.off('collisionstart')
    
    super.destroy()
  }
}
