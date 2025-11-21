import * as Phaser from 'phaser'

export type NPCType =
  | 'blacksmith'
  | 'scarecrow'
  | 'mailbox'
  | 'stand'
  | 'statue'

export type StatType = 'health' | 'attackSpeed' | 'armor' | 'evasion'

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

export interface BattleData {
  npcType: NPCType
  playerX: number
  playerY: number
}

export type BattleResult = 'win' | 'loss'

export interface ProjectileData {
  scene: Phaser.Scene
  x: number
  y: number
  velocityX: number
  damage: number
  isPlayerProjectile: boolean
}

export interface PlayerStats {
  baseHealth: number
  baseAttackSpeed: number
  baseArmor: number
  baseEvasion: number
}

export interface Artifact {
  id: string
  name: string
  description: string
  statType: StatType
  bonus: number
  npcSource: NPCType
  color: string
  image?: string
}

export interface ArtifactReward {
  artifact: Artifact
  show: boolean
}
