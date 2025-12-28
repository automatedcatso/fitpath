import { UserProfile, DayRoutine, Exercise } from '../types'

export function generateRoutine(profile: UserProfile): DayRoutine[] {
  const routine: DayRoutine[] = []
  const workoutDays = Math.min(profile.weeklyDays, 7)
  
  // Calculate rest day distribution
  const restDays = 7 - workoutDays
  const restDayPattern = distributeRestDays(workoutDays, restDays)

  for (let day = 0; day < 7; day++) {
    if (restDayPattern.includes(day)) {
      routine.push({
        day,
        title: `Day ${day + 1}: Rest & Recovery`,
        isRestDay: true,
        description: "Light stretching or gentle walking is encouraged. Listen to your body."
      })
    } else {
      const workout = generateWorkout(profile, day)
      routine.push({
        day,
        title: `Day ${day + 1}: ${workout.title}`,
        isRestDay: false,
        exercises: workout.exercises
      })
    }
  }

  return routine
}

function distributeRestDays(workoutDays: number, restDays: number): number[] {
  const restDayIndices: number[] = []
  const interval = Math.floor(7 / (restDays + 1))
  
  for (let i = 0; i < restDays; i++) {
    restDayIndices.push(Math.min((i + 1) * interval - 1, 6))
  }
  
  return restDayIndices
}

function generateWorkout(profile: UserProfile, dayIndex: number): { title: string; exercises: Exercise[] } {
  const { fitnessLevel, goal, equipment, limitations } = profile
  
  // Workout templates based on goal and equipment
  const workoutTemplates = {
    'weight-loss': {
      none: ['Full Body Cardio', 'Core & Cardio', 'Lower Body Power', 'Upper Body Blast'],
      dumbbells: ['Strength & Cardio', 'Full Body Burn', 'HIIT Weights', 'Metabolic Conditioning'],
      'resistance-bands': ['Band Cardio Flow', 'Full Body Toning', 'Resistance Circuit', 'Band Power'],
      both: ['Hybrid Power', 'Full Body Fusion', 'Athletic Conditioning', 'Ultimate Burn']
    },
    'strength': {
      none: ['Bodyweight Strength', 'Upper Body Power', 'Lower Body Build', 'Core Foundation'],
      dumbbells: ['Upper Body Focus', 'Lower Body Power', 'Full Body Strength', 'Functional Fitness'],
      'resistance-bands': ['Band Resistance', 'Progressive Tension', 'Band Power Build', 'Total Body Tone'],
      both: ['Progressive Overload', 'Power Building', 'Strength Circuit', 'Maximal Effort']
    },
    'mobility': {
      none: ['Flow & Stretch', 'Joint Mobility', 'Flexibility Focus', 'Active Recovery'],
      dumbbells: ['Dynamic Mobility', 'Strength & Stretch', 'Functional Movement', 'Recovery Strength'],
      'resistance-bands': ['Band Stretching', 'Mobility Flow', 'Flexibility Bands', 'Active Recovery'],
      both: ['Complete Mobility', 'Dynamic Recovery', 'Full Body Flow', 'Restoration Day']
    },
    'general-health': {
      none: ['Balanced Fitness', 'Wellness Circuit', 'Energy Boost', 'Health Foundation'],
      dumbbells: ['Total Health', 'Balanced Strength', 'Wellness Weights', 'Energy Circuit'],
      'resistance-bands': ['Health & Tone', 'Wellness Bands', 'Energy Flow', 'Balance Training'],
      both: ['Complete Wellness', 'Health Fusion', 'Energy System', 'Total Balance']
    }
  }

  const templates = workoutTemplates[goal]?.[equipment] || workoutTemplates['general-health']['none']
  const title = templates[dayIndex % templates.length]

  // Generate exercises based on fitness level and goal
  const exercises = generateExercises(profile, title)

  return { title, exercises }
}

function generateExercises(profile: UserProfile, workoutTitle: string): Exercise[] {
  const { fitnessLevel, goal, equipment, limitations } = profile
  
  const exerciseLibrary = {
    beginner: {
      'weight-loss': [
        { name: 'Marching in Place', instructions: 'Lift knees alternately, keep core engaged', duration: '2 minutes' },
        { name: 'Wall Sit', instructions: 'Slide down wall until knees are at 90 degrees', duration: '30 seconds x 3' },
        { name: 'Arm Circles', instructions: 'Small circles forward, then backward', duration: '1 minute each direction' },
        { name: 'Step Touches', instructions: 'Step side to side, add arm movements', duration: '2 minutes' },
        { name: 'Modified Plank', instructions: 'Hold on knees or against wall', duration: '20 seconds x 3' },
        { name: 'Calf Raises', instructions: 'Rise up on toes, lower slowly', sets: '15 reps x 3' }
      ],
      'strength': [
        { name: 'Wall Push-ups', instructions: 'Push against wall, keep body straight', sets: '10 reps x 3' },
        { name: 'Chair Squats', instructions: 'Sit and stand without using hands', sets: '10 reps x 3' },
        { name: 'Glute Bridges', instructions: 'Lie on back, lift hips', sets: '12 reps x 3' },
        { name: 'Standing Rows', instructions: 'Pull arms back, squeeze shoulder blades', sets: '12 reps x 3' },
        { name: 'Calf Raises', instructions: 'Rise up on toes', sets: '15 reps x 3' },
        { name: 'Side Leg Lifts', instructions: 'Lift leg to side, keep straight', sets: '10 each x 2' }
      ],
      'mobility': [
        { name: 'Cat-Cow Stretch', instructions: 'Arch and round back slowly', duration: '1 minute' },
        { name: 'Shoulder Rolls', instructions: 'Roll shoulders forward and backward', duration: '30 seconds each' },
        { name: 'Gentle Twists', instructions: 'Rotate torso side to side', duration: '1 minute' },
        { name: 'Ankle Circles', instructions: 'Rotate ankles in both directions', duration: '30 seconds each' },
        { name: 'Neck Stretches', instructions: 'Gentle side bends and chin tucks', duration: '1 minute' },
        { name: 'Hip Circles', instructions: 'Circle hips in both directions', duration: '30 seconds each' }
      ],
      'general-health': [
        { name: 'Walking in Place', instructions: 'Lift knees, swing arms naturally', duration: '3 minutes' },
        { name: 'Arm Raises', instructions: 'Raise arms overhead and lower', sets: '12 reps x 3' },
        { name: 'Leg Swings', instructions: 'Swing leg forward and back', sets: '10 each x 2' },
        { name: 'Torso Twists', instructions: 'Rotate upper body side to side', duration: '1 minute' },
        { name: 'Deep Breathing', instructions: 'Inhale deeply, exhale slowly', duration: '2 minutes' },
        { name: 'Heel Raises', instructions: 'Rise onto balls of feet', sets: '15 reps x 3' }
      ]
    },
    intermediate: {
      'weight-loss': [
        { name: 'Jumping Jacks', instructions: 'Jump while spreading arms and legs', duration: '45 seconds x 3' },
        { name: 'Bodyweight Squats', instructions: 'Lower to 90 degrees, keep chest up', sets: '15 reps x 3' },
        { name: 'Mountain Climbers', instructions: 'Alternate knees to chest quickly', duration: '30 seconds x 3' },
        { name: 'Burpees', instructions: 'Squat, jump back, push-up, jump up', sets: '8 reps x 3' },
        { name: 'High Knees', instructions: 'Run in place bringing knees high', duration: '30 seconds x 3' },
        { name: 'Plank Jacks', instructions: 'Plank position, jump feet apart and together', duration: '30 seconds x 3' }
      ],
      'strength': [
        { name: 'Push-ups', instructions: 'Full push-ups or on knees', sets: '10-15 reps x 3' },
        { name: 'Lunges', instructions: 'Step forward, lower back knee', sets: '10 each x 3' },
        { name: 'Plank', instructions: 'Hold straight body position', duration: '30-45 seconds x 3' },
        { name: 'Dips', instructions: 'Use chair or bench', sets: '10-12 reps x 3' },
        { name: 'Superman', instructions: 'Lift chest and arms off floor', sets: '12 reps x 3' },
        { name: 'Side Plank', instructions: 'Hold on each side', duration: '20 seconds each x 2' }
      ],
      'mobility': [
        { name: 'Sun Salutation Flow', instructions: 'Flow through yoga sequence', duration: '5 minutes' },
        { name: 'Hip Flexor Stretch', instructions: 'Kneeling lunge position', duration: '30 seconds each' },
        { name: 'Thoracic Rotation', instructions: 'Rotate upper spine', duration: '1 minute' },
        { name: 'Dynamic Hamstring', instructions: 'Swing leg forward and back', duration: '30 seconds each' },
        { name: 'Shoulder Mobility', instructions: 'Arm circles and crosses', duration: '2 minutes' },
        { name: 'Ankle Mobility', instructions: 'Rock forward and back', duration: '1 minute each' }
      ],
      'general-health': [
        { name: 'Brisk Walk in Place', instructions: 'Quick pace with arm movement', duration: '5 minutes' },
        { name: 'Squat to Reach', instructions: 'Squat and reach overhead', sets: '12 reps x 3' },
        { name: 'Modified Burpees', instructions: 'Step back instead of jump', sets: '8 reps x 3' },
        { name: 'Arm Circles', instructions: 'Large circles forward and back', duration: '1 minute each' },
        { name: 'Leg Swings', instructions: 'Forward and side swings', duration: '30 seconds each' },
        { name: 'Core Rotation', instructions: 'Standing twists with arm movement', duration: '2 minutes' }
      ]
    },
    advanced: {
      'weight-loss': [
        { name: 'Burpee Variations', instructions: 'Add push-up and tuck jump', sets: '10 reps x 4' },
        { name: 'Plyometric Lunges', instructions: 'Jump between lunge positions', sets: '8 each x 3' },
        { name: 'Box Jumps', instructions: 'Jump onto stable surface', sets: '10 reps x 3' },
        { name: 'Sprint Intervals', instructions: 'High intensity bursts', duration: '30 seconds x 8' },
        { name: 'Kettlebell Swings', instructions: 'Hip hinge movement', sets: '15 reps x 4' },
        { name: 'Battle Ropes', instructions: 'Alternating waves', duration: '30 seconds x 4' }
      ],
      'strength': [
        { name: 'Pistol Squats', instructions: 'Single leg squat', sets: '5 each x 3' },
        { name: 'Handstand Push-ups', instructions: 'Against wall or freestanding', sets: '5-8 reps x 3' },
        { name: 'Muscle-ups', instructions: 'Pull-up to dip transition', sets: '3-5 reps x 3' },
        { name: 'One-arm Push-ups', instructions: 'Wide base, tight core', sets: '3-5 each x 3' },
        { name: 'Front Levers', instructions: 'Hold horizontal position', duration: '10 seconds x 3' },
        { name: 'Planche Push-ups', instructions: 'Advanced bodyweight skill', sets: '3-5 reps x 3' }
      ],
      'mobility': [
        { name: 'Advanced Yoga Flow', instructions: 'Complex pose sequences', duration: '10 minutes' },
        { name: 'Gymnastics Stretching', instructions: 'Dynamic flexibility work', duration: '15 minutes' },
        { name: 'Contortion Prep', instructions: 'Extreme range of motion', duration: '20 minutes' },
        { name: 'Dynamic Movement', instructions: 'Full body flow', duration: '10 minutes' },
        { name: 'Joint Preparation', instructions: 'Advanced mobility drills', duration: '15 minutes' },
        { name: 'Recovery Protocol', instructions: 'Active recovery techniques', duration: '10 minutes' }
      ],
      'general-health': [
        { name: 'Complex Movement', instructions: 'Multi-joint exercises', sets: '12 reps x 4' },
        { name: 'Athletic Drills', instructions: 'Sport-specific movements', duration: '10 minutes' },
        { name: 'Functional Fitness', instructions: 'Real-world movements', sets: '15 reps x 3' },
        { name: 'Power Development', instructions: 'Explosive movements', sets: '8 reps x 4' },
        { name: 'Endurance Circuit', instructions: 'Extended duration', duration: '15 minutes' },
        { name: 'Recovery Active', instructions: 'Light movement', duration: '10 minutes' }
      ]
    }
  }

  const exercises = exerciseLibrary[fitnessLevel]?.[goal] || exerciseLibrary.beginner['general-health']
  
  // Add modifications based on limitations
  return exercises.map(exercise => {
    let modification = undefined
    
    if (limitations.includes('Knee issues') && (exercise.name.includes('Squat') || exercise.name.includes('Lunge'))) {
      modification = 'Reduce range of motion or perform seated alternative'
    }
    if (limitations.includes('Back problems') && (exercise.name.includes('Plank') || exercise.name.includes('Burpee'))) {
      modification = 'Focus on form, reduce intensity or choose alternative'
    }
    if (limitations.includes('Shoulder concerns') && exercise.name.includes('Push-up')) {
      modification = 'Perform on knees or against wall to reduce shoulder load'
    }
    
    return { ...exercise, modification }
  })
}