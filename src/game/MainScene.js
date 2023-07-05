import Player from './Player'
import baseChipPipo from '@/assets/game/map/[Base]BaseChip_pipo.png'
import waterPipo from '@/assets/game/map/[A]Water_pipo.png'
import dirtPipo from '@/assets/game/map/[A]Dirt_pipo.png'
import mapJson from '@/assets/game/map/map.json'

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
	}

	create() {
		const map = this.make.tilemap({ key: 'map' })
		const tileset = map.addTilesetImage('[Base]BaseChip_pipo', 'tiles', 32, 32, 0, 0)
		const water = map.addTilesetImage('[A]Water_pipo', 'water', 32, 32, 0, 0)
		const dirt = map.addTilesetImage('[A]Dirt_pipo', 'dirt', 32, 32, 0, 0)
		const layer1 = map.createLayer('Tile Layer 1', tileset, 0, 0)
		const layer2 = map.createLayer('Tile Layer 2', [water,tileset,dirt], 0, 0)
		const layer3 = map.createLayer('Tile Layer 3', [dirt,tileset], 0, 0)
		// const layer3 = map.createLayer('Tile Layer 3', [water,tileset], 0, 0)
		layer2.setCollisionByProperty({ collides: true })
		this.matter.world.convertTilemapLayer(layer2)
		

		this.player = new Player({
			scene: this,
			x: 100,
			y: 230,
			texture: 'player',
			frame: 'townsfolk_m_idle_1'
		})
		this.player.inputKeys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D
		})
	}

	update() {
		this.player.update()
	}

}