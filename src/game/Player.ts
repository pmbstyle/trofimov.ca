import * as Phaser from 'phaser'
import playerPng from '@/assets/game/npc/player.png'
import playerAtlas from '@/assets/game/npc/player_atlas.json'
import playerAnimation from '@/assets/game/npc/player_anim.json'
import type { PlayerData, NPCType } from '@/types/game'

export default class Player extends Phaser.Physics.Matter.Sprite {
  public inputKeys!: {
    up: Phaser.Input.Keyboard.Key
    down: Phaser.Input.Keyboard.Key
    left: Phaser.Input.Keyboard.Key
    right: Phaser.Input.Keyboard.Key
    space: Phaser.Input.Keyboard.Key
  }
  public scene: Phaser.Scene

  constructor(data: PlayerData) {
    const { scene, x, y, texture, frame } = data
    super(scene.matter.world, x, y, texture, frame)
    this.scene = scene
    this.scene.add.existing(this)

    const { Body, Bodies } = Phaser.Physics.Matter.Matter
    const playerCollider = Bodies.circle(this.x, this.y, 12, {
      isSensor: false,
      label: 'playerCollider',
    })
    const playerSensor = Bodies.circle(this.x, this.y, 32, {
      isSensor: true,
      label: 'playerSensor',
    })
    const compoundBody = Body.create({
      parts: [playerCollider, playerSensor],
      frictionAir: 0.35,
    })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
  }

  static preload(scene: Phaser.Scene): void {
    scene.load.atlas('player', playerPng, playerAtlas)
    scene.load.animation('player_anim', playerAnimation)
  }

  get velocity(): Phaser.Math.Vector2 {
    return this.body.velocity
  }

  update(): void {
    const speed = 2.5
    const playerVelocity = new Phaser.Math.Vector2()
    if (this.inputKeys.left.isDown) {
      playerVelocity.x = -speed
    }
    if (this.inputKeys.right.isDown) {
      playerVelocity.x = speed
    }
    if (this.inputKeys.up.isDown) {
      playerVelocity.y = -speed
    }
    if (this.inputKeys.down.isDown) {
      playerVelocity.y = speed
    }
    playerVelocity.normalize()
    playerVelocity.scale(speed)
    this.setVelocity(playerVelocity.x, playerVelocity.y)

    if (this.velocity.x < 0) {
      this.flipX = true
    } else if (this.velocity.x > 0) {
      this.flipX = false
    }

    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play('walk', true)
    } else {
      this.anims.play('idle', true)
    }

    // Check if SPACE is pressed
    if (Phaser.Input.Keyboard.JustDown(this.inputKeys.space)) {
      // First, check if player is near any NPC
      const npcs: NPCType[] = ['blacksmith', 'scarecrow', 'mailbox', 'stand', 'statue']
      const playerSensor = this.body.parts[1]
      let nearNPC: NPCType | null = null
      
      if (playerSensor) {
        npcs.forEach(npc => {
          // Get NPC sprite from scene (MainScene stores it as a property for compatibility)
          const npcSprite = (this.scene as any)[npc] as Phaser.Physics.Matter.Sprite
          if (!npcSprite || !npcSprite.body) return

          // Find the NPC sensor by label (more reliable than array index)
          const npcBody = npcSprite.body as any
          const sensorLabel = npc + 'Sensor'
          const npcSensor = npcBody.parts?.find((part: any) => part.label === sensorLabel)
          if (!npcSensor) return
          
          // Check collision between player sensor and NPC sensor
          const npcCollision = this.scene.matter.overlap(playerSensor, npcSensor)
          if (npcCollision) {
            nearNPC = npc
          }
        })
      }
      
      // If near an NPC, interact with it (which will toggle dialog)
      // If not near any NPC, close any open dialog
      if (nearNPC) {
        this.scene.events.emit('interactWithNPC', nearNPC)
      } else {
        // Not near any NPC, close any open dialog
        this.scene.events.emit('closeDialog')
      }
    }
  }

  destroy(): void {
    if (this.inputKeys && this.input && this.input.keys) {
      this.input.keys.removeAllKeys()
    }
    super.destroy()
  }
}

