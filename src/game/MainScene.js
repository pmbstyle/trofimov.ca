import Player from './Player'

export default class MainScene extends Phaser.Scene {
	constructor() {
		super('MainScene');
	}

	preload() {
		console.log('MainScene preload')
		Player.preload(this)
	}

	create() {
		console.log('MainScene create')
		this.player = new Player({
			scene: this,
			x: 100,
			y: 100,
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