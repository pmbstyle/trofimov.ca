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
    description:
      'Forged in determination, this artifact increases your <strong>health by 12%</strong>, making you more resilient to attacks without breaking the balance.',
    statType: 'health',
    bonus: 1.12,
    npcSource: 'blacksmith',
    color: '#8B4513', // Brown/SaddleBrown
    image: AnvilOfFortitude,
  },
  scarecrow: {
    id: 'art_scarecrow',
    name: 'Scythe of Swiftness',
    description:
      'Harvested from fields of experience, this artifact increases your <strong>attack speed by 15%</strong>, allowing you to strike faster without trivializing combat.',
    statType: 'attackSpeed',
    bonus: 1.15,
    npcSource: 'scarecrow',
    color: '#228B22', // ForestGreen
    image: ScytheOfSwiftness,
  },
  mailbox: {
    id: 'art_mailbox',
    name: 'Mail of Protection',
    description:
      'Delivered from distant contacts, this artifact increases your <strong>armor by 8</strong>, softening blows while keeping battles engaging.',
    statType: 'armor',
    bonus: 8,
    npcSource: 'mailbox',
    color: '#4169E1', // RoyalBlue
    image: MailOfProtection,
  },
  stand: {
    id: 'art_stand',
    name: 'Book of Agility',
    description:
      'Learned from ancient knowledge, this artifact increases your <strong>evasion chance by 10%</strong>, helping you dodge attacks without guaranteeing perfection.',
    statType: 'evasion',
    bonus: 10,
    npcSource: 'stand',
    color: '#FFD700', // Gold
    image: ScrollOfAgility,
  },
  statue: {
    id: 'art_statue',
    name: 'Amulet of Vitality',
    description:
      'Carved from stone of wisdom, this artifact increases your <strong>health by 12%</strong>, enhancing your endurance while keeping encounters exciting.',
    statType: 'health',
    bonus: 1.12,
    npcSource: 'statue',
    color: '#9370DB', // MediumPurple
    image: AmuletOfVitality,
  },
}

export const usePlayerStatsStore = defineStore('playerStats', () => {
  // Base stats
  const baseStats = ref<PlayerStats>({
    baseHealth: 100,
    baseAttackSpeed: 2, // seconds between auto attacks
    baseArmor: 0,
    baseEvasion: 0,
  })

  // Inventory (max 5 artifacts)
  const inventory = ref<Artifact[]>([])
  const MAX_INVENTORY_SIZE = 5
  const championCelebrated = ref(false)

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
    // Cap total health boost to avoid invincibility
    return Math.min(1.8, multiplier)
  })

  const attackSpeedMultiplier = computed(() => {
    const speedArtifacts = inventory.value.filter(
      a => a.statType === 'attackSpeed'
    )
    let multiplier = 1
    speedArtifacts.forEach(artifact => {
      multiplier /= artifact.bonus
    })
    return multiplier
  })

  const armorValue = computed(() => {
    const armorArtifacts = inventory.value.filter(a => a.statType === 'armor')
    const totalArmor = armorArtifacts.reduce(
      (sum, artifact) => sum + artifact.bonus,
      0
    )
    return Math.min(30, totalArmor)
  })

  const evasionChance = computed(() => {
    const evasionArtifacts = inventory.value.filter(
      a => a.statType === 'evasion'
    )
    const totalEvasion = evasionArtifacts.reduce(
      (sum, artifact) => sum + artifact.bonus,
      0
    )
    // Cap evasion at 40% to prevent invincibility
    return Math.min(40, totalEvasion)
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
      baseAttackSpeed: 2,
      baseArmor: 0,
      baseEvasion: 0,
    }
    inventory.value = []
    championCelebrated.value = false
  }

  const markChampionCelebrated = (value = true) => {
    championCelebrated.value = value
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
    markChampionCelebrated,
  }
})
