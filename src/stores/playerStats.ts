import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Artifact, StatType, NPCType, PlayerStats } from '@/types/game'

// Artifact definitions - unique per NPC
export const ARTIFACTS: Record<NPCType, Artifact> = {
  blacksmith: {
    id: 'art_blacksmith',
    name: 'Anvil of Fortitude',
    description: 'Forged in the fires of determination, this artifact increases your health by 50%, making you more resilient to attacks.',
    statType: 'health',
    bonus: 1.5,
    npcSource: 'blacksmith',
    color: '#8B4513', // Brown/SaddleBrown
  },
  scarecrow: {
    id: 'art_scarecrow',
    name: 'Scythe of Swiftness',
    description: 'Harvested from fields of experience, this artifact increases your attack speed by 30%, allowing you to strike faster.',
    statType: 'attackSpeed',
    bonus: 1.5,
    npcSource: 'scarecrow',
    color: '#228B22', // ForestGreen
  },
  mailbox: {
    id: 'art_mailbox',
    name: 'Mail of Protection',
    description: 'Delivered from distant contacts, this artifact increases your armor by 30%, reducing incoming damage.',
    statType: 'armor',
    bonus: 1.5,
    npcSource: 'mailbox',
    color: '#4169E1', // RoyalBlue
  },
  stand: {
    id: 'art_stand',
    name: 'Scroll of Agility',
    description: 'Learned from ancient knowledge, this artifact increases your evasion chance by 30%, helping you dodge attacks.',
    statType: 'evasion',
    bonus: 1.5,
    npcSource: 'stand',
    color: '#FFD700', // Gold
  },
  statue: {
    id: 'art_statue',
    name: 'Amulet of Vitality',
    description: 'Carved from stone of wisdom, this artifact increases your health by 50%, enhancing your endurance.',
    statType: 'health',
    bonus: 1.5,
    npcSource: 'statue',
    color: '#9370DB', // MediumPurple
  },
}

export const usePlayerStatsStore = defineStore('playerStats', () => {
  // Base stats
  const baseStats = ref<PlayerStats>({
    baseHealth: 100,
    baseAttackSpeed: 1.5, // seconds between attacks
    baseArmor: 0,
    baseEvasion: 0,
  })

  // Inventory (max 5 artifacts)
  const inventory = ref<Artifact[]>([])
  const MAX_INVENTORY_SIZE = 5

  const stats = computed(() => {
    const stats = { ...baseStats.value }
    
    inventory.value.forEach(artifact => {
      switch (artifact.statType) {
        case 'health':
          stats.baseHealth = Math.floor(stats.baseHealth * artifact.bonus)
          break
        case 'attackSpeed':
          stats.baseAttackSpeed = stats.baseAttackSpeed / 1.3
          break
        case 'armor':
          stats.baseArmor = stats.baseArmor + 30
          break
        case 'evasion':
          stats.baseEvasion = stats.baseEvasion + 30
          break
      }
    })
    
    return stats
  })

  const healthMultiplier = computed(() => {
    const healthArtifacts = inventory.value.filter(a => a.statType === 'health')
    let multiplier = 1
    healthArtifacts.forEach(() => {
      multiplier *= 1.5
    })
    return multiplier
  })

  const attackSpeedMultiplier = computed(() => {
    const speedArtifacts = inventory.value.filter(a => a.statType === 'attackSpeed')
    let multiplier = 1
    speedArtifacts.forEach(() => {
      multiplier /= 1.3
    })
    return multiplier
  })

  const armorValue = computed(() => {
    const armorArtifacts = inventory.value.filter(a => a.statType === 'armor')
    return armorArtifacts.length * 30
  })

  const evasionChance = computed(() => {
    const evasionArtifacts = inventory.value.filter(a => a.statType === 'evasion')
    return Math.min(100, evasionArtifacts.length * 30)
  })

  const hasArtifact = (artifactId: string) => {
    return inventory.value.some(a => a.id === artifactId)
  }

  const addArtifact = (artifact: Artifact) => {
    if (hasArtifact(artifact.id)) {
      return false
    }
    if (inventory.value.length >= MAX_INVENTORY_SIZE) {
      return false
    }
    inventory.value.push(artifact)
    return true
  }

  const removeArtifact = (artifactId: string) => {
    const index = inventory.value.findIndex(a => a.id === artifactId)
    if (index !== -1) {
      inventory.value.splice(index, 1)
      return true
    }
    return false
  }

  const getArtifactByNPC = (npcType: NPCType): Artifact | null => {
    return ARTIFACTS[npcType] || null
  }

  const resetStats = () => {
    baseStats.value = {
      baseHealth: 100,
      baseAttackSpeed: 1.5,
      baseArmor: 0,
      baseEvasion: 0,
    }
    inventory.value = []
  }

  return {
    baseStats,
    inventory,
    stats,
    healthMultiplier,
    attackSpeedMultiplier,
    armorValue,
    evasionChance,
    hasArtifact,
    addArtifact,
    removeArtifact,
    getArtifactByNPC,
    resetStats,
    MAX_INVENTORY_SIZE,
  }
})

