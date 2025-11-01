import * as Phaser from 'phaser'
import Player from './Player'
import Projectile from './Projectile'
import type { NPCConfig, NPCType, BattleData } from '@/types/game'
import { usePlayerStatsStore } from '@/stores/playerStats'
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
    const playerStatsStore = usePlayerStatsStore()
    const baseHealth = 100
    const healthMultiplier = playerStatsStore.healthMultiplier
    this.playerHealth = Math.floor(baseHealth * healthMultiplier)
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
      layer1.setDepth(0)
    }
    if (layer2) {
      layer2.setPosition(0, 0)
      layer2.setDepth(1)
    }
    if (layer3) {
      layer3.setPosition(0, 0)
      layer3.setDepth(2)
    }
    
    const shipSprite = this.matter.add.sprite(300, 350, 'ship')
    shipSprite.setStatic(true)
    shipSprite.setSensor(true)
    shipSprite.setDepth(3)

    const playerX = 470
    const playerY = 370
    const npcX = playerX + 150
    
    const npcConfig = NPC_CONFIGS.find(config => config.texture === this.npcType)
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
    
    this.player.setFixedRotation()
    this.player.setDepth(10)
    
    this.npcSprite = this.matter.add.sprite(npcX, playerY, this.npcType)
    this.npcSprite.setDepth(10)
    this.npcSprite.setFlipX(true)
    const { Body, Bodies } = Phaser.Physics.Matter.Matter
    const npcBody = Bodies.circle(npcX, playerY, 12, {
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

    this.time.delayedCall(100, () => {
      this.matter.world.on('collisionstart', (event: any) => {
        event.pairs.forEach((pair: any) => {
          const { bodyA, bodyB } = pair
          
          if (bodyA.label === 'playerProjectile' && bodyB.label === 'npcCollider') {
            this.handlePlayerProjectileHit(bodyA)
          } else if (bodyA.label === 'npcCollider' && bodyB.label === 'playerProjectile') {
            this.handlePlayerProjectileHit(bodyB)
          }
          
          if (bodyA.label === 'npcProjectile' && bodyB.label === 'playerCollider') {
            if (!this.jumpInvulnerable) {
              this.handleNPCProjectileHit(bodyA)
            } else {
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

    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.roundPixels = true
    this.cameras.main.setZoom(2)
    this.cameras.main.centerOn((playerX + npcX) / 2, playerY)
    
    const battleStartEvent = new CustomEvent('battleStart')
    window.dispatchEvent(battleStartEvent)

    this.startAttackTimers()
    this.setupEventListeners()
    
    this.time.delayedCall(500, () => {
      this.firePlayerProjectile()
    })
  }


  private updatePlayerHealthBar(): void {
    const healthEvent = new CustomEvent('battleHealth', {
      detail: { playerHealth: this.playerHealth, npcHealth: this.npcHealth }
    })
    window.dispatchEvent(healthEvent)
  }

  private updateNPCHealthBar(): void {
    const healthEvent = new CustomEvent('battleHealth', {
      detail: { playerHealth: this.playerHealth, npcHealth: this.npcHealth }
    })
    window.dispatchEvent(healthEvent)
  }

  private startAttackTimers(): void {
    const playerStatsStore = usePlayerStatsStore()
    const attackSpeed = playerStatsStore.stats.baseAttackSpeed
    const attackDelay = attackSpeed * 1000
    
    this.playerAttackTimer = this.time.addEvent({
      delay: attackDelay,
      callback: this.firePlayerProjectile,
      callbackScope: this,
      loop: true,
    })
    
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
      velocityX: 8,
      damage: 10,
      isPlayerProjectile: true,
    })
    
    projectile.setTint(0x00ff00)
    projectile.setDepth(50)
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
      velocityX: -8,
      damage: 15,
      isPlayerProjectile: false,
    })
    
    projectile.setTint(0xff0000)
    projectile.setDepth(50)
    projectile.setVisible(true)
    projectile.setActive(true)
    
    this.npcProjectiles.push(projectile)
  }

  private handlePlayerProjectileHit(body: any): void {
    const projectile = this.playerProjectiles.find(p => {
      if (!p.body || !p.active) return false
      if (p.body === body) return true
      if ((p.body as any).parts) {
        return (p.body as any).parts.some((part: any) => part === body || part.id === body.id)
      }
      return false
    })
    if (!projectile || !projectile.active) return
    
    const startX = (projectile as any).startX
    if (startX && Math.abs(projectile.x - startX) < 30) {
      return
    }
    
    this.npcHealth = Math.max(0, this.npcHealth - projectile.damage)
    this.updateNPCHealthBar()
    
    projectile.destroy()
    this.playerProjectiles = this.playerProjectiles.filter(p => p !== projectile && p.active)
    
    if (this.npcHealth <= 0) {
      this.checkWinCondition()
    }
  }

  private handleNPCProjectileHit(body: any): void {
    const projectile = this.npcProjectiles.find(p => {
      if (!p.body || !p.active) return false
      if (p.body === body) return true
      if ((p.body as any).parts) {
        return (p.body as any).parts.some((part: any) => part === body || part.id === body.id)
      }
      return false
    })
    if (!projectile || !projectile.active) return
    
    const startX = (projectile as any).startX
    if (startX && Math.abs(projectile.x - startX) < 30) {
      return
    }
    
    const playerStatsStore = usePlayerStatsStore()
    const evasionChance = playerStatsStore.evasionChance
    const evasionRoll = Math.random() * 100
    
    if (evasionRoll < evasionChance) {
      this.dodgedAttacks++
      projectile.destroy()
      this.npcProjectiles = this.npcProjectiles.filter(p => p !== projectile && p.active)
      return
    }
    
    const armor = playerStatsStore.armorValue
    const baseDamage = projectile.damage
    const armorReduction = armor / (armor + 100)
    const finalDamage = Math.max(1, Math.floor(baseDamage * (1 - armorReduction)))
    
    this.playerHealth = Math.max(0, this.playerHealth - finalDamage)
    this.updatePlayerHealthBar()
    this.hitsTaken++
    
    projectile.destroy()
    this.npcProjectiles = this.npcProjectiles.filter(p => p !== projectile && p.active)
    
    if (this.playerHealth <= 0) {
      this.endBattle('loss')
    }
  }

  update(): void {
    if (!this.player) return

    this.player.setVelocity(0, 0)
    this.player.anims.play('idle', true)

    if (Phaser.Input.Keyboard.JustDown(this.player.inputKeys.space)) {
      if (!this.isJumping) {
        this.jump()
      }
    }

    if (this.isJumping) {
      if (Math.abs(this.player.y - this.playerStartY) < 5) {
        this.isJumping = false
        this.jumpInvulnerable = false
      }
    }
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
    
    this.playerProjectiles = this.playerProjectiles.filter(p => p.active)
    this.npcProjectiles = this.npcProjectiles.filter(p => p.active)
    
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
    
    this.time.delayedCall(600, () => {
      this.jumpInvulnerable = false
    })
    const nearbyProjectiles = this.npcProjectiles.filter(p => {
      if (!p.active) return false
      const distance = Math.abs(p.x - this.player.x)
      const yDistance = Math.abs(p.y - this.player.y)
      return distance < 30 && yDistance < 30
    })
    
    if (nearbyProjectiles.length > 0) {
      nearbyProjectiles.forEach(p => {
        this.dodgedAttacks++
        p.destroy()
      })
      this.npcProjectiles = this.npcProjectiles.filter(p => !nearbyProjectiles.includes(p))
    }
  }

  private checkWinCondition(): void {
    if (this.npcHealth <= 0) {
      this.endBattle('win')
    }
  }

  private endBattle(result: 'win' | 'loss'): void {
    if (this.playerAttackTimer) {
      this.playerAttackTimer.remove()
    }
    if (this.npcAttackTimer) {
      this.npcAttackTimer.remove()
    }
    
    this.playerProjectiles.forEach(p => p.destroy())
    this.npcProjectiles.forEach(p => p.destroy())
    
    if (result === 'win') {
      const playerStatsStore = usePlayerStatsStore()
      const artifact = playerStatsStore.getArtifactByNPC(this.npcType)
      
      if (artifact) {
        const wasAdded = playerStatsStore.addArtifact(artifact)
        
        const event = new CustomEvent('battleEnd', { 
          detail: { 
            result, 
            npcType: this.npcType,
            artifact: wasAdded ? artifact : null,
            alreadyOwned: !wasAdded
          } 
        })
        window.dispatchEvent(event)
      } else {
        const event = new CustomEvent('battleEnd', { 
          detail: { result, npcType: this.npcType } 
        })
        window.dispatchEvent(event)
      }
    } else {
      const event = new CustomEvent('battleEnd', { 
        detail: { result, npcType: this.npcType } 
      })
      window.dispatchEvent(event)
    }
    
    this.scene.start('MainScene')
  }

  private setupEventListeners(): void {
    this.events.on('shutdown', () => {
    })
  }

  destroy(): void {
    if (this.playerAttackTimer) {
      this.playerAttackTimer.remove()
    }
    if (this.npcAttackTimer) {
      this.npcAttackTimer.remove()
    }
    
    this.playerProjectiles.forEach(p => {
      if (p.active) p.destroy()
    })
    this.npcProjectiles.forEach(p => {
      if (p.active) p.destroy()
    })
    
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
    
    this.events.removeAllListeners()
    this.matter.world.off('collisionstart')
    
    super.destroy()
  }
}
