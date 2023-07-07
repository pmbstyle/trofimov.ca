import Player from './Player'
import baseChipPipo from '@/assets/game/map/[Base]BaseChip_pipo.png'
import waterPipo from '@/assets/game/map/[A]Water_pipo.png'
import dirtPipo from '@/assets/game/map/[A]Dirt_pipo.png'
import mapJson from '@/assets/game/map/map.json'

import blacksmithPng from '@/assets/game/npc/blacksmith.png'
import blacksmithAtlas from '@/assets/game/npc/blacksmith_atlas.json'
import blacksmithAnimation from '@/assets/game/npc/blacksmith_anim.json'
import { space } from 'postcss/lib/list'

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
	}

	preload() {
		Player.preload(this)
		this.load.image('tiles', baseChipPipo)
		this.load.image('water', waterPipo)
		this.load.image('dirt', dirtPipo)
		this.load.tilemapTiledJSON('map', mapJson)

		this.load.atlas('blacksmith', blacksmithPng, blacksmithAtlas)
        this.load.animation('blacksmith_anim', blacksmithAnimation)
	}

	create() {
		const map = this.make.tilemap({ key: 'map' })
		const tileset = map.addTilesetImage('[Base]BaseChip_pipo', 'tiles', 32, 32, 0, 0)
		const water = map.addTilesetImage('[A]Water_pipo', 'water', 32, 32, 0, 0)
		const dirt = map.addTilesetImage('[A]Dirt_pipo', 'dirt', 32, 32, 0, 0)
		const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0)
		const layer2 = map.createLayer('Tile Layer 2', [water,tileset,dirt], 0, 0)
		const layer3 = map.createLayer('Tile Layer 3', [dirt,tileset], 0, 0)
		layer1.setCollisionByProperty({ collides: true })
		this.matter.world.convertTilemapLayer(layer1)
		layer2.setCollisionByProperty({ collides: true })
		this.matter.world.convertTilemapLayer(layer2)
		layer3.setCollisionByProperty({ collides: true })
		this.matter.world.convertTilemapLayer(layer3)

		this.blacksmith = this.matter.add.sprite(720, 260, 'blacksmith')
		this.blacksmith.play('blacksmith_idle')
		this.blacksmith.setFixedRotation()
		this.blacksmith.body.isStatic = true

		this.player = new Player({
			scene: this,
			x: 470,
			y: 370,
			texture: 'player',
			frame: 'townsfolk_m_idle_1'
		})
		this.player.inputKeys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			space: Phaser.Input.Keyboard.KeyCodes.SPACE
		})

		this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
		this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
		this.cameras.main.setZoom(1);
	}

	update() {
		this.player.update()
	}

}