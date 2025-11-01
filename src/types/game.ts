import * as Phaser from 'phaser'

export type NPCType = 'blacksmith' | 'scarecrow' | 'mailbox' | 'stand' | 'statue'

export interface NPCConfig {
  x: number
  y: number
  texture: NPCType
  frame: string | null
}

export interface PlayerData {
  scene: Phaser.Scene
  x: number
  y: number
  texture: string
  frame: string
}


export interface NPCEntity {
  sprite: Phaser.Physics.Matter.Sprite
  bubble?: Phaser.Physics.Matter.Sprite
  isNearPlayer: boolean
  type: NPCType
}

