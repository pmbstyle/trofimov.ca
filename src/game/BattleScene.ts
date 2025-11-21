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
import projectilePlayer from '@/assets/game/projectiles/projectile-right.png'
import {
  ATTACK_PATTERNS,
  type AttackPattern,
  type AttackPatternHit,
} from './attackPatterns'

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
  private playerHealth = 100
  private npcHealth = 100
  private playerMaxHealth = 100
  private npcMaxHealth = 100
  private playerProjectiles: Projectile[] = []
  private playerAttackTimer!: Phaser.Time.TimerEvent
  private isJumping = false
  private jumpInvulnerable = false
  private playerStartY = 0
  private jumpTween?: Phaser.Tweens.Tween
  private jumpRecoveryTimer?: Phaser.Time.TimerEvent
  private npcJumping = false
  private npcJumpTween?: Phaser.Tweens.Tween
  private npcJumpTimer?: Phaser.Time.TimerEvent
  private battleData!: BattleData
  private patternTimers: Phaser.Time.TimerEvent[] = []
  private telegraphGraphics?: Phaser.GameObjects.Graphics
  private telegraphText?: Phaser.GameObjects.Text
  private telegraphProgressEvent?: Phaser.Time.TimerEvent
  private patternOrder: AttackPattern[] = []
  private patternIndex = 0

  constructor() {
    super('BattleScene')
  }

  init(data: BattleData): void {
    this.battleData = data
    this.npcType = data.npcType
    const playerStatsStore = usePlayerStatsStore()
    const baseHealth = 80
    const healthMultiplier = playerStatsStore.healthMultiplier
    this.playerMaxHealth = Math.floor(baseHealth * healthMultiplier)
    this.playerHealth = this.playerMaxHealth
    this.npcMaxHealth = 80
    this.npcHealth = this.npcMaxHealth
    this.isJumping = false
    this.jumpInvulnerable = false
    this.patternTimers = []
    this.telegraphGraphics = undefined
    this.telegraphText = undefined
    this.telegraphProgressEvent = undefined
    this.patternOrder = []
    this.patternIndex = 0
    this.npcJumping = false
    this.npcJumpTween = undefined
    if (this.npcJumpTimer) {
      this.npcJumpTimer.remove()
      this.npcJumpTimer = undefined
    }
    this.preparePatternOrder()
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
    this.load.image('projectilePlayer', projectilePlayer)

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

    const playerX = 600
    const playerY = 370
    const npcY = playerY - 10
    const npcX = playerX + 250

    const npcConfig = NPC_CONFIGS.find(
      config => config.texture === this.npcType
    )
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

    this.npcSprite = this.matter.add.sprite(npcX, npcY, this.npcType)
    this.npcSprite.setDepth(10)
    this.npcSprite.setFlipX(true)
    const { Bodies } = Phaser.Physics.Matter.Matter
    const npcBody = Bodies.circle(npcX, npcY, 12, {
      isSensor: false,
      label: 'npcCollider',
    })
    this.npcSprite.setExistingBody(npcBody)
    this.npcSprite.setFixedRotation()
    if (this.npcSprite.body) {
      ;(this.npcSprite.body as any).isStatic = true
    }

    if (npcConfig?.frame) {
      this.npcSprite.play(npcConfig.frame)
    }

    this.time.delayedCall(100, () => {
      this.matter.world.on('collisionstart', (event: any) => {
        event.pairs.forEach((pair: any) => {
          const { bodyA, bodyB } = pair

          if (
            bodyA.label === 'playerProjectile' &&
            bodyB.label === 'npcCollider'
          ) {
            this.handlePlayerProjectileHit(bodyA)
          } else if (
            bodyA.label === 'npcCollider' &&
            bodyB.label === 'playerProjectile'
          ) {
            this.handlePlayerProjectileHit(bodyB)
          }
        })
      })
    })

    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.roundPixels = true
    this.cameras.main.setZoom(2)
    this.cameras.main.centerOn((playerX + npcX) / 2, playerY)

    const battleStartEvent = new CustomEvent('battleStart', {
      detail: {
        npcType: this.npcType,
        playerMaxHealth: this.playerMaxHealth,
        npcMaxHealth: this.npcMaxHealth,
      },
    })
    window.dispatchEvent(battleStartEvent)
    this.emitBattleHealth()

    this.startBattleLoops()
    this.setupEventListeners()
  }

  private emitBattleHealth(): void {
    const healthEvent = new CustomEvent('battleHealth', {
      detail: {
        playerHealth: this.playerHealth,
        npcHealth: this.npcHealth,
        playerMaxHealth: this.playerMaxHealth,
        npcMaxHealth: this.npcMaxHealth,
      },
    })
    window.dispatchEvent(healthEvent)
  }

  private startBattleLoops(): void {
    const playerStatsStore = usePlayerStatsStore()
    const attackSpeed = playerStatsStore.stats.baseAttackSpeed
    const attackDelay = attackSpeed * 1000

    this.playerAttackTimer = this.time.addEvent({
      delay: attackDelay,
      callback: this.firePlayerProjectile,
      callbackScope: this,
      loop: true,
    })

    // Kick off an opening projectile so the player sees progress quickly
    this.time.delayedCall(500, () => {
      this.firePlayerProjectile()
    })

    this.scheduleNextPattern(900)
    this.scheduleNextNPCJump()
  }

  private firePlayerProjectile(): void {
    if (!this.player || !this.npcSprite) return

    const projectile = new Projectile({
      scene: this,
      x: this.player.x,
      y: this.player.y,
      velocityX: 8,
      damage: 6,
      isPlayerProjectile: true,
    })

    projectile.setTexture('projectilePlayer')
    projectile.setDepth(50)
    projectile.setVisible(true)
    projectile.setActive(true)

    this.playerProjectiles.push(projectile)
  }

  private scheduleNextPattern(delay: number): void {
    if (this.playerHealth <= 0 || this.npcHealth <= 0) return
    const timer = this.time.delayedCall(delay, () => {
      this.beginPattern()
    })
    this.patternTimers.push(timer)
  }

  private beginPattern(): void {
    if (this.playerHealth <= 0 || this.npcHealth <= 0) return
    const pattern = this.getNextPattern()
    this.showTelegraph(pattern)
    const timer = this.time.delayedCall(pattern.telegraphDuration, () => {
      this.hideTelegraph()
      this.executePattern(pattern)
    })
    this.patternTimers.push(timer)
  }

  private executePattern(pattern: AttackPattern): void {
    const longest = pattern.hits.reduce(
      (max, hit) => Math.max(max, hit.offset),
      0
    )
    pattern.hits.forEach(hit => {
      const timer = this.time.delayedCall(hit.offset, () => {
        this.resolveHit(pattern, hit)
      })
      this.patternTimers.push(timer)
    })
    this.scheduleNextPattern(longest + pattern.cooldown + 400)
  }

  private getNextPattern(): AttackPattern {
    if (this.patternOrder.length === 0) {
      this.preparePatternOrder()
    }
    if (this.patternIndex >= this.patternOrder.length) {
      this.preparePatternOrder()
    }
    const pattern = this.patternOrder[this.patternIndex]
    this.patternIndex++
    return pattern
  }

  private preparePatternOrder(): void {
    const pool = ATTACK_PATTERNS[this.npcType] || ATTACK_PATTERNS.blacksmith
    this.patternOrder = Phaser.Utils.Array.Shuffle([...pool])
    this.patternIndex = 0
  }

  private scheduleNextNPCJump(): void {
    if (!this.npcSprite) return
    const delay = Phaser.Math.Between(5000, 9000)
    this.npcJumpTimer = this.time.delayedCall(delay, () => {
      this.triggerNPCJump()
      this.scheduleNextNPCJump()
    })
  }

  private triggerNPCJump(): void {
    if (!this.npcSprite || this.npcJumping) return
    this.npcJumping = true
    const npcStartY = this.npcSprite.y
    const jumpHeight = 40
    if (this.npcJumpTween) {
      this.npcJumpTween.stop()
      this.npcJumpTween.remove()
    }
    this.npcJumpTween = this.tweens.add({
      targets: this.npcSprite,
      y: npcStartY - jumpHeight,
      duration: 640,
      ease: 'Sine.easeOut',
      yoyo: true,
      hold: 120,
      onComplete: () => {
        this.npcSprite.setY(npcStartY)
        this.npcJumping = false
        this.npcJumpTween = undefined
      },
    })
  }

  private showTelegraph(pattern: AttackPattern): void {
    if (!this.player) return
    if (!this.telegraphGraphics) {
      this.telegraphGraphics = this.add.graphics()
      this.telegraphGraphics.setDepth(5)
    }
    this.telegraphGraphics.setVisible(true)
    const duration = pattern.telegraphDuration
    this.telegraphProgressEvent?.remove()
    const drawProgress = (progress: number) => {
      const clamped = Phaser.Math.Clamp(progress, 0, 1)
      const radius = Phaser.Math.Linear(pattern.radius, 12, clamped)
      this.drawTelegraphCircle(radius, pattern.color)
    }
    if (!this.telegraphText) {
      this.telegraphText = this.add
        .text(this.player.x, this.player.y - 90, '', {
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#ffffff',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 3,
        })
        .setDepth(20)
        .setOrigin(0.5, 0.5)
    }
    const updateDisplay = (elapsed: number) => {
      if (!this.telegraphText || !this.player) return
      const timeLeft = Math.max(0, duration - elapsed)
      const urgent = timeLeft <= 500
      const countdown = Math.ceil(timeLeft / 500)
      const message = urgent
        ? `${pattern.prompt}\nPRESS SPACE!`
        : `${pattern.prompt}\n${countdown}`
      this.telegraphText.setText(message)
      this.telegraphText.setColor(urgent ? '#ffe066' : '#ffffff')
      this.telegraphText.setScale(urgent ? 1.25 : 1)
      this.telegraphText.setPosition(this.player.x, this.player.y - 80)
      this.telegraphText.setVisible(true)
    }
    drawProgress(0)
    updateDisplay(0)
    const startTime = this.time.now
    this.telegraphProgressEvent = this.time.addEvent({
      delay: 16,
      loop: true,
      callback: () => {
        const elapsed = this.time.now - startTime
        drawProgress(elapsed / duration)
        updateDisplay(elapsed)
        if (elapsed >= duration) {
          this.telegraphProgressEvent?.remove()
          this.telegraphProgressEvent = undefined
        }
      },
    })
  }

  private drawTelegraphCircle(radius: number, color: number): void {
    if (!this.telegraphGraphics || !this.player) return
    this.telegraphGraphics.clear()
    this.telegraphGraphics.fillStyle(color, 0.18)
    this.telegraphGraphics.lineStyle(2, color, 0.95)
    this.telegraphGraphics.fillCircle(this.player.x, this.player.y, radius)
    this.telegraphGraphics.strokeCircle(this.player.x, this.player.y, radius)
  }

  private hideTelegraph(): void {
    if (this.telegraphProgressEvent) {
      this.telegraphProgressEvent.remove()
      this.telegraphProgressEvent = undefined
    }
    if (this.telegraphGraphics) {
      this.telegraphGraphics.clear()
      this.telegraphGraphics.setVisible(false)
    }
    if (this.telegraphText) {
      this.telegraphText.setVisible(false)
    }
  }

  private resolveHit(pattern: AttackPattern, hit: AttackPatternHit): void {
    if (this.playerHealth <= 0 || this.npcHealth <= 0) return
    const playerStatsStore = usePlayerStatsStore()

    if (this.jumpInvulnerable || this.isJumping) {
      this.showFloatingText('Dodged!', '#b2ffb2')
      return
    }

    const evasionChance = playerStatsStore.evasionChance
    if (Math.random() * 100 < evasionChance) {
      this.showFloatingText('Evaded!', '#b2ffb2')
      return
    }

    const armor = playerStatsStore.armorValue
    const armorReduction = armor / (armor + 120)
    const baseDamage = hit.damage
    const finalDamage = Math.max(
      1,
      Math.floor(baseDamage * (1 - armorReduction))
    )

    this.playerHealth = Math.max(0, this.playerHealth - finalDamage)
    this.emitBattleHealth()
    this.showFloatingText(`-${finalDamage}`, '#ffb2b2')
    this.cameras.main.shake(200, 0.002)

    if (this.playerHealth <= 0) {
      this.endBattle('loss')
    }
  }

  private showFloatingText(message: string, color: string): void {
    if (!this.player) return
    this.showFloatingTextAt(this.player.x, this.player.y - 40, message, color)
  }

  private showFloatingTextAt(x: number, y: number, message: string, color: string): void {
    const text = this.add
      .text(x, y, message, {
        fontSize: '12px',
        fontFamily: 'monospace',
        color,
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setDepth(200)
    this.tweens.add({
      targets: text,
      y: text.y - 18,
      alpha: 0,
      duration: 600,
      ease: 'Sine.easeOut',
      onComplete: () => text.destroy(),
    })
  }

  private showNPCHitEffect(x: number, y: number): void {
    const colors = [0xfff59d, 0xffffff, 0xff6f61]
    const circle = this.add
      .circle(x, y, 8, Phaser.Utils.Array.GetRandom(colors))
      .setDepth(150)
    this.tweens.add({
      targets: circle,
      scale: { from: 1, to: 0.3 },
      alpha: { from: 1, to: 0 },
      duration: 220,
      ease: 'Cubic.easeOut',
      onComplete: () => circle.destroy(),
    })
  }

  private stopPatternLoop(): void {
    this.patternTimers.forEach(timer => {
      if (timer) {
        timer.remove()
      }
    })
    this.patternTimers = []
    this.hideTelegraph()
    if (this.npcJumpTimer) {
      this.npcJumpTimer.remove()
      this.npcJumpTimer = undefined
    }
  }

  private handlePlayerProjectileHit(body: any): void {
    const projectile = this.playerProjectiles.find(p => {
      if (!p.body || !p.active) return false
      if (p.body === body) return true
      if ((p.body as any).parts) {
        return (p.body as any).parts.some(
          (part: any) => part === body || part.id === body.id
        )
      }
      return false
    })
    if (!projectile || !projectile.active) return

    const startX = (projectile as any).startX
    if (startX && Math.abs(projectile.x - startX) < 30) {
      return
    }

    this.npcHealth = Math.max(0, this.npcHealth - projectile.damage)
    this.emitBattleHealth()
    if (this.npcSprite) {
      this.showNPCHitEffect(this.npcSprite.x, this.npcSprite.y - 10)
      this.showFloatingTextAt(
        this.npcSprite.x,
        this.npcSprite.y - 40,
        `-${projectile.damage}`,
        '#ffdce0'
      )
    }

    projectile.destroy()
    this.playerProjectiles = this.playerProjectiles.filter(
      p => p !== projectile && p.active
    )

    if (this.npcHealth <= 0) {
      this.checkWinCondition()
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

    this.playerProjectiles = this.playerProjectiles.filter(p => p.active)
  }

  private jump(): void {
    if (!this.player) return

    this.isJumping = true
    this.jumpInvulnerable = true
    if (this.jumpRecoveryTimer) {
      this.jumpRecoveryTimer.remove()
      this.jumpRecoveryTimer = undefined
    }

    // Play jump animation if available
    this.player.anims.play('jump', true)

    // Move player up
    const jumpHeight = 60
    if (this.jumpTween) {
      this.jumpTween.stop()
      this.jumpTween.remove()
    }
    this.jumpTween = this.tweens.add({
      targets: this.player,
      y: this.playerStartY - jumpHeight,
      duration: 320,
      ease: 'Sine.easeOut',
      yoyo: true,
      hold: 80,
      onComplete: () => {
        this.player.setY(this.playerStartY)
        this.isJumping = false
        this.jumpRecoveryTimer = this.time.delayedCall(180, () => {
          this.jumpInvulnerable = false
          this.jumpRecoveryTimer = undefined
        })
        this.jumpTween = undefined
      },
    })
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

    this.playerProjectiles.forEach(p => p.destroy())
    this.playerProjectiles = []
    this.stopPatternLoop()

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
            alreadyOwned: !wasAdded,
          },
        })
        window.dispatchEvent(event)
      } else {
        const event = new CustomEvent('battleEnd', {
          detail: { result, npcType: this.npcType },
        })
        window.dispatchEvent(event)
      }
    } else {
      const event = new CustomEvent('battleEnd', {
        detail: { result, npcType: this.npcType },
      })
      window.dispatchEvent(event)
    }

    // Pass saved player position back to MainScene
    this.scene.start('MainScene', {
      playerX: this.battleData.playerX,
      playerY: this.battleData.playerY,
    })
  }

  private setupEventListeners(): void {
    this.events.on('shutdown', () => {})
  }

  destroy(): void {
    if (this.playerAttackTimer) {
      this.playerAttackTimer.remove()
    }

    this.playerProjectiles.forEach(p => {
      if (p.active) p.destroy()
    })
    this.playerProjectiles = []
    this.stopPatternLoop()

    if (this.player) {
      this.player.destroy()
    }
    if (this.npcSprite) {
      this.npcSprite.destroy()
    }
    if (this.jumpTween) {
      this.jumpTween.stop()
      this.jumpTween.remove()
      this.jumpTween = undefined
    }
    if (this.npcJumpTween) {
      this.npcJumpTween.stop()
      this.npcJumpTween.remove()
      this.npcJumpTween = undefined
    }
    if (this.npcJumpTimer) {
      this.npcJumpTimer.remove()
      this.npcJumpTimer = undefined
    }
    if (this.telegraphGraphics) {
      this.telegraphGraphics.destroy()
      this.telegraphGraphics = undefined
    }
    if (this.telegraphText) {
      this.telegraphText.destroy()
      this.telegraphText = undefined
    }

    this.events.removeAllListeners()
    this.matter.world.off('collisionstart')

    super.destroy()
  }
}
