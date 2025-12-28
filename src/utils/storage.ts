interface UserProfile {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced'
  goal: 'weight-loss' | 'strength' | 'mobility' | 'general-health'
  equipment: 'none' | 'dumbbells' | 'resistance-bands' | 'both'
  weeklyDays: number
  limitations: string[]
}

interface Progress {
  completedDays: number[]
  currentDay: number
}

export function loadUserProfile(): UserProfile | null {
  try {
    const stored = localStorage.getItem('fitpath-profile')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem('fitpath-profile', JSON.stringify(profile))
}

export function loadProgress(): Progress | null {
  try {
    const stored = localStorage.getItem('fitpath-progress')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function saveProgress(progress: Progress): void {
  localStorage.setItem('fitpath-progress', JSON.stringify(progress))
}