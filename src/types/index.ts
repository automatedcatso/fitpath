export interface UserProfile {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goal: 'weight-loss' | 'strength' | 'mobility' | 'general-health'
  equipment: 'none' | 'dumbbells' | 'resistance-bands' | 'both'
  weeklyDays: number
  limitations: string[]
}

export interface Exercise {
  name: string
  instructions: string
  sets?: string
  duration?: string
  modification?: string
}

export interface DayRoutine {
  day: number
  title: string
  isRestDay: boolean
  exercises?: Exercise[]
  description?: string
}