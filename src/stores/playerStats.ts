import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Artifact, StatType, NPCType, PlayerStats } from '@/types/game'
import AnvilOfFortitude from '@/assets/game/artifacts/anvil.png'
import ScytheOfSwiftness from '@/assets/game/artifacts/scythe.png'
import MailOfProtection from '@/assets/game/artifacts/mail.png'
import ScrollOfAgility from '@/assets/game/artifacts/book.png'
import AmuletOfVitality from '@/assets/game/artifacts/amulet.png'

// Artifact definitions - unique per NPC
export const ARTIFACTS: Record<NPCType, Artifact> = {
  blacksmith: {
    id: 'art_blacksmith',
    name: 'Anvil of Fortitude',
    description: 'Forged in the fires of determination, this artifact increases your <strong>health by 25%</strong>, making you more resilient to attacks.',
    statType: 'health',
    bonus: 1.25,
    npcSource: 'blacksmith',
    color: '#8B4513', // Brown/SaddleBrown
    image: AnvilOfFortitude,
  },
  scarecrow: {
    id: 'art_scarecrow',
    name: 'Scythe of Swiftness',
    description: 'Harvested from fields of experience, this artifact increases your attack speed by 20%, allowing you to strike faster.',
    statType: 'attackSpeed',
    bonus: 1.2,
    npcSource: 'scarecrow',
    color: '#228B22', // ForestGreen
    image: ScytheOfSwiftness,
  },
  mailbox: {
    id: 'art_mailbox',
    name: 'Mail of Protection',
    description: 'Delivered from distant contacts, this artifact increases your armor by 15, reducing incoming damage.',
    statType: 'armor',
    bonus: 15,
    npcSource: 'mailbox',
    color: '#4169E1', // RoyalBlue
    image: MailOfProtection,
  },
  stand: {
    id: 'art_stand',
    name: 'Book of Agility',
    description: 'Learned from ancient knowledge, this artifact increases your evasion chance by 15%, helping you dodge attacks.',
    statType: 'evasion',
    bonus: 15,
    npcSource: 'stand',
    color: '#FFD700', // Gold
    image: ScrollOfAgility,
  },
  statue: {
    id: 'art_statue',
    name: 'Amulet of Vitality',
    description: 'Carved from stone of wisdom, this artifact increases your health by 25%, enhancing your endurance.',
    statType: 'health',
    bonus: 1.25,
    npcSource: 'statue',
    color: '#9370DB', // MediumPurple
    image: AmuletOfVitality,
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
          stats.baseAttackSpeed = stats.baseAttackSpeed / artifact.bonus
          break
        case 'armor':
          stats.baseArmor = stats.baseArmor + artifact.bonus
          break
        case 'evasion':
          stats.baseEvasion = stats.baseEvasion + artifact.bonus
          break
      }
    })
    
    return stats
  })

  const healthMultiplier = computed(() => {
    const healthArtifacts = inventory.value.filter(a => a.statType === 'health')
    let multiplier = 1
    healthArtifacts.forEach(artifact => {
      multiplier *= artifact.bonus
    })
    return multiplier
  })

  const attackSpeedMultiplier = computed(() => {
    const speedArtifacts = inventory.value.filter(a => a.statType === 'attackSpeed')
    let multiplier = 1
    speedArtifacts.forEach(artifact => {
      multiplier /= artifact.bonus
    })
    return multiplier
  })

  const armorValue = computed(() => {
    const armorArtifacts = inventory.value.filter(a => a.statType === 'armor')
    return armorArtifacts.reduce((sum, artifact) => sum + artifact.bonus, 0)
  })

  const evasionChance = computed(() => {
    const evasionArtifacts = inventory.value.filter(a => a.statType === 'evasion')
    const totalEvasion = evasionArtifacts.reduce((sum, artifact) => sum + artifact.bonus, 0)
    // Cap evasion at 60% to prevent invincibility
    return Math.min(60, totalEvasion)
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

