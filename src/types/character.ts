export type CharacterState = 'Idle' | 'Run' | 'Jump' | 'Sit' | 'Sleep'
export type CharacterDirection = 'left' | 'right'

export interface CharacterProps {
  state: CharacterState
  duration: number | 'loop'
  direction: CharacterDirection
}