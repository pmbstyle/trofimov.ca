import Player from './Player'
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

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  preload() {
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

  create() {
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
    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
    layer2.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer2)
    layer3.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer3)
    this.matter.add.sprite(300, 350, 'ship').setStatic(true).setSensor(false)

    this.initNPC()
    this.initPlayer()
    this.initCamera()
  }

  update() {
    this.player.update()
  }

  initCamera() {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    this.cameras.main.setZoom(1)
  }
  initPlayer() {
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
    })
  }
  initNPC() {
    const npcs = [
      { x: 720, y: 260, texture: 'blacksmith', frame: 'blacksmith_idle' },
      { x: 750, y: 470, texture: 'scarecrow', frame: null },
      { x: 830, y: 320, texture: 'stand', frame: null },
      { x: 1010, y: 320, texture: 'statue', frame: null },
      { x: 640, y: 335, texture: 'mailbox', frame: null },
    ]
    const { Body, Bodies } = Phaser.Physics.Matter.Matter
    npcs.forEach(npc => {
      this[npc.texture] = this.matter.add.sprite(npc.x, npc.y, npc.texture)
      if (npc.texture !== 'stand' && npc.texture !== 'statue') {
        this.matter.add
          .sprite(npc.x, npc.y - 20, 'bubble')
          .setStatic(true)
          .setSensor(false)
      } else {
        this.matter.add
          .sprite(npc.x, npc.y - 40, 'bubble')
          .setStatic(true)
          .setSensor(true)
      }

      const colliderName = npc.texture + 'Collider'
      const sensorName = npc.texture + 'Sensor'
      const compoundBody = Body.create({
        parts: [
          Bodies.circle(this[npc.texture].x, this[npc.texture].y, 12, {
            isSensor: false,
            label: colliderName,
          }),
          Bodies.circle(this[npc.texture].x, this[npc.texture].y, 24, {
            isSensor: true,
            label: sensorName,
          }),
        ],
        frictionAir: 0.35,
      })
      this[npc.texture].setExistingBody(compoundBody)
      this[npc.texture].setFixedRotation()
      this[npc.texture].body.isStatic = true
      if (npc.frame) {
        this[npc.texture].play(`${npc.frame}`)
      }
    })
  }
}
