import type { NPCType } from '@/types/game'

export interface AttackPatternHit {
  offset: number // milliseconds after telegraph completes
  damage: number
}

export interface AttackPattern {
  id: string
  name: string
  hint: string
  prompt: string
  telegraphDuration: number
  cooldown: number
  color: number
  radius: number
  hits: AttackPatternHit[]
}

const easy = (offset: number, damage: number): AttackPatternHit => ({
  offset,
  damage,
})

export const ATTACK_PATTERNS: Record<NPCType, AttackPattern[]> = {
  blacksmith: [
    {
      id: 'hammer-quake',
      name: 'Hammer Quake',
      hint: 'Massive strike after the ground glows.',
      prompt: 'Jump after glow',
      telegraphDuration: 1900,
      cooldown: 1400,
      color: 0xff7043,
      radius: 60,
      hits: [easy(0, 30)],
    },
    {
      id: 'ember-volley',
      name: 'Ember Volley',
      hint: 'Three sparks in rhythm—stay airborne.',
      prompt: '3 sparks rhythm',
      telegraphDuration: 1500,
      cooldown: 1300,
      color: 0xffb347,
      radius: 55,
      hits: [easy(0, 10), easy(350, 10), easy(700, 10)],
    },
    {
      id: 'forge-spark',
      name: 'Forge Spark',
      hint: 'Two delayed blasts; jump on the pulse.',
      prompt: 'Twin pulses',
      telegraphDuration: 1500,
      cooldown: 1300,
      color: 0xffe082,
      radius: 55,
      hits: [easy(220, 16), easy(700, 16)],
    },
  ],
  scarecrow: [
    {
      id: 'gust-charge',
      name: 'Gust Charge',
      hint: 'Wind-up into a forceful shove.',
      prompt: 'Gust incoming',
      telegraphDuration: 1600,
      cooldown: 1300,
      color: 0x8bc34a,
      radius: 55,
      hits: [easy(120, 26)],
    },
    {
      id: 'seed-rain',
      name: 'Seed Rain',
      hint: 'Falling seeds hit twice—time your jump.',
      prompt: '2 drops',
      telegraphDuration: 1500,
      cooldown: 1300,
      color: 0xaed581,
      radius: 50,
      hits: [easy(0, 16), easy(450, 16)],
    },
    {
      id: 'crow-dive',
      name: 'Crow Dive',
      hint: 'Shadow pause, then a heavy dive.',
      prompt: 'Jump at shadow',
      telegraphDuration: 1800,
      cooldown: 1500,
      color: 0x689f38,
      radius: 60,
      hits: [easy(0, 30)],
    },
  ],
  mailbox: [
    {
      id: 'parcel-pop',
      name: 'Parcel Pop',
      hint: 'Two parcel bounces before detonation.',
      prompt: 'Bounce then boom',
      telegraphDuration: 1600,
      cooldown: 1300,
      color: 0x64b5f6,
      radius: 50,
      hits: [easy(0, 14), easy(480, 14)],
    },
    {
      id: 'homing-letter',
      name: 'Homing Letter',
      hint: 'It slows before impact—jump at the flash.',
      prompt: 'Jump on flash',
      telegraphDuration: 1400,
      cooldown: 1200,
      color: 0x42a5f5,
      radius: 45,
      hits: [easy(400, 24)],
    },
    {
      id: 'priority-burst',
      name: 'Priority Burst',
      hint: 'Five light shots in a steady rhythm.',
      prompt: '4-beat volley',
      telegraphDuration: 1200,
      cooldown: 1300,
      color: 0x2196f3,
      radius: 45,
      hits: [easy(0, 9), easy(300, 9), easy(600, 9), easy(900, 9)],
    },
  ],
  stand: [
    {
      id: 'rune-beam',
      name: 'Rune Beam',
      hint: 'Sigils align before the beam lands.',
      prompt: 'Sigils align',
      telegraphDuration: 1600,
      cooldown: 1400,
      color: 0xfff176,
      radius: 55,
      hits: [easy(0, 30)],
    },
    {
      id: 'knowledge-pulse',
      name: 'Knowledge Pulse',
      hint: 'A wide pulse expands slowly—wait, then jump.',
      prompt: 'Expanding ring',
      telegraphDuration: 1500,
      cooldown: 1300,
      color: 0xffeb3b,
      radius: 60,
      hits: [easy(500, 26)],
    },
    {
      id: 'quiz-orb',
      name: 'Quiz Orb',
      hint: 'Orb charges then pops; dodge for a bonus.',
      prompt: 'Quick pop',
      telegraphDuration: 1200,
      cooldown: 1100,
      color: 0xfff59d,
      radius: 45,
      hits: [easy(350, 20)],
    },
  ],
  statue: [
    {
      id: 'granite-slam',
      name: 'Granite Slam',
      hint: 'Longest wind-up, heaviest hit.',
      prompt: 'Longest windup',
      telegraphDuration: 2000,
      cooldown: 1500,
      color: 0xb39ddb,
      radius: 60,
      hits: [easy(0, 38)],
    },
    {
      id: 'pebble-spray',
      name: 'Pebble Spray',
      hint: 'Two staggered sprays; stay midair.',
      prompt: 'Double tap',
      telegraphDuration: 1400,
      cooldown: 1200,
      color: 0xd1c4e9,
      radius: 45,
      hits: [easy(0, 14), easy(420, 14)],
    },
    {
      id: 'guardian-ring',
      name: 'Guardian Ring',
      hint: 'Ring expands slowly before impact.',
      prompt: 'Ring burst',
      telegraphDuration: 1600,
      cooldown: 1400,
      color: 0x9575cd,
      radius: 60,
      hits: [easy(600, 28)],
    },
  ],
}
