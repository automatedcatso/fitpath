import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { UserProfile } from '../types'
import { ChevronRight, ChevronLeft, Sparkles, Flame, Trophy, Target, Zap, Heart, Star, ArrowRight, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface OnboardingFormProps {
  onComplete: (profile: UserProfile) => void
}

export function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fitnessLevel: '',
    goal: '',
    equipment: '',
    weeklyDays: 3,
    limitations: []
  })

  const totalSteps = 5

  const steps = [
    {
      title: "FITNESS LEVEL",
      subtitle: "Where does your fitness journey begin?",
      icon: <Flame className="w-8 h-8" />,
      color: "from-orange-600 to-red-600"
    },
    {
      title: "YOUR GOAL",
      subtitle: "What do you want to achieve?",
      icon: <Target className="w-8 h-8" />,
      color: "from-purple-600 to-pink-600"
    },
    {
      title: "EQUIPMENT",
      subtitle: "What tools do you have access to?",
      icon: <Zap className="w-8 h-8" />,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "COMMITMENT",
      subtitle: "How many days per week will you train?",
      icon: <Heart className="w-8 h-8" />,
      color: "from-green-600 to-emerald-600"
    },
    {
      title: "LIMITATIONS",
      subtitle: "Any physical considerations we should know?",
      icon: <Star className="w-8 h-8" />,
      color: "from-indigo-600 to-purple-600"
    }
  ]

  const fitnessLevels = [
    { value: 'beginner', label: 'BEGINNER', description: 'New to exercise or returning after a long break', icon: '🌱' },
    { value: 'intermediate', label: 'INTERMEDIATE', description: 'Regular exercise 2-3 times per week', icon: '💪' },
    { value: 'advanced', label: 'ADVANCED', description: 'Consistent training 4+ times per week', icon: '🔥' }
  ]

  const goals = [
    { value: 'weight-loss', label: 'WEIGHT LOSS', description: 'Burn calories and shed excess weight', icon: '🎯' },
    { value: 'strength', label: 'BUILD STRENGTH', description: 'Increase muscle mass and power', icon: '💪' },
    { value: 'mobility', label: 'IMPROVE MOBILITY', description: 'Enhance flexibility and movement', icon: '🧘' },
    { value: 'general-health', label: 'GENERAL HEALTH', description: 'Overall wellness and fitness', icon: '⭐' }
  ]

  const equipmentOptions = [
    { value: 'none', label: 'NO EQUIPMENT', description: 'Bodyweight exercises only', icon: '🏃' },
    { value: 'dumbbells', label: 'DUMBBELLS', description: 'Free weights for resistance', icon: '🏋️' },
    { value: 'resistance-bands', label: 'RESISTANCE BANDS', description: 'Portable resistance training', icon: '🎯' },
    { value: 'both', label: 'FULL SETUP', description: 'Dumbbells and bands', icon: '💪' }
  ]

  const weeklyOptions = [
    { value: 1, label: '1 DAY', description: 'Light start', icon: '📅' },
    { value: 2, label: '2 DAYS', description: 'Building momentum', icon: '📅📅' },
    { value: 3, label: '3 DAYS', description: 'Balanced routine', icon: '📅📅📅' },
    { value: 4, label: '4 DAYS', description: 'Serious commitment', icon: '📅📅📅📅' },
    { value: 5, label: '5 DAYS', description: 'High dedication', icon: '📅📅📅📅📅' },
    { value: 6, label: '6 DAYS', description: 'Elite training', icon: '📅📅📅📅📅📅' },
    { value: 7, label: '7 DAYS', description: 'Maximum effort', icon: '📅📅📅📅📅📅📅' }
  ]

  const limitationOptions = [
    { value: 'knee', label: 'Knee Issues', icon: '🦵' },
    { value: 'back', label: 'Back Concerns', icon: '🦴' },
    { value: 'shoulder', label: 'Shoulder Limitations', icon: '💪' },
    { value: 'none', label: 'No Limitations', icon: '✅' }
  ]

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(formData as UserProfile)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleLimitationToggle = (value: string) => {
    const current = formData.limitations || []
    if (value === 'none') {
      setFormData({ ...formData, limitations: [] })
    } else {
      const newLimitations = current.includes(value)
        ? current.filter(l => l !== value)
        : [...current.filter(l => l !== 'none'), value]
      setFormData({ ...formData, limitations: newLimitations })
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return formData.fitnessLevel !== ''
      case 1: return formData.goal !== ''
      case 2: return formData.equipment !== ''
      case 3: return formData.weeklyDays && formData.weeklyDays > 0
      case 4: return true // Limitations are optional
      default: return false
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            {fitnessLevels.map((level) => (
              <motion.div
                key={level.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, fitnessLevel: level.value as any })}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.fitnessLevel === level.value
                    ? 'bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-500 shadow-2xl'
                    : 'bg-gray-800/50 border-gray-700 hover:border-orange-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{level.icon}</span>
                    <div>
                      <Label className="text-xl font-black text-white cursor-pointer">{level.label}</Label>
                      <p className="text-gray-400 mt-1 font-semibold">{level.description}</p>
                    </div>
                  </div>
                  {formData.fitnessLevel === level.value && (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            {goals.map((goal) => (
              <motion.div
                key={goal.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, goal: goal.value as any })}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.goal === goal.value
                    ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500 shadow-2xl'
                    : 'bg-gray-800/50 border-gray-700 hover:border-purple-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{goal.icon}</span>
                    <div>
                      <Label className="text-xl font-black text-white cursor-pointer">{goal.label}</Label>
                      <p className="text-gray-400 mt-1 font-semibold">{goal.description}</p>
                    </div>
                  </div>
                  {formData.goal === goal.value && (
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            {equipmentOptions.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, equipment: option.value as any })}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  formData.equipment === option.value
                    ? 'bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border-blue-500 shadow-2xl'
                    : 'bg-gray-800/50 border-gray-700 hover:border-blue-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{option.icon}</span>
                    <div>
                      <Label className="text-xl font-black text-white cursor-pointer">{option.label}</Label>
                      <p className="text-gray-400 mt-1 font-semibold">{option.description}</p>
                    </div>
                  </div>
                  {formData.equipment === option.value && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {weeklyOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData({ ...formData, weeklyDays: option.value })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                    formData.weeklyDays === option.value
                      ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-500 shadow-2xl'
                      : 'bg-gray-800/50 border-gray-700 hover:border-green-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <Label className="text-lg font-black text-white cursor-pointer block">{option.label}</Label>
                  <p className="text-gray-400 text-sm font-semibold mt-1">{option.description}</p>
                  {formData.weeklyDays === option.value && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mt-2">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {limitationOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLimitationToggle(option.value)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${
                    (formData.limitations?.includes(option.value) || (option.value === 'none' && !formData.limitations?.length))
                      ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500 shadow-2xl'
                      : 'bg-gray-800/50 border-gray-700 hover:border-indigo-600'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.icon}</div>
                  <Label className="text-lg font-black text-white cursor-pointer block">{option.label}</Label>
                  {(formData.limitations?.includes(option.value) || (option.value === 'none' && !formData.limitations?.length)) && (
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mt-2">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-4xl">💪</span>
            </div>
            <h1 className="text-6xl font-black text-white">FITPATH</h1>
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-4xl">🔥</span>
            </div>
          </div>
          <p className="text-2xl text-gray-300 font-bold">YOUR PERSONALIZED FITNESS JOURNEY STARTS HERE</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-black text-gray-400">STEP {currentStep + 1} OF {totalSteps}</span>
            <span className="text-sm font-black text-gray-400">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-600 to-red-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Main Card */}
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 shadow-2xl">
          <CardHeader className={`bg-gradient-to-r ${steps[currentStep].color} text-white rounded-t-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-black flex items-center gap-3">
                  {steps[currentStep].icon}
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription className="text-white/90 mt-2 text-xl font-bold">
                  {steps[currentStep].subtitle}
                </CardDescription>
              </div>
              <div className="text-6xl opacity-50">
                {currentStep === 0 && '🌱'}
                {currentStep === 1 && '🎯'}
                {currentStep === 2 && '🏋️'}
                {currentStep === 3 && '❤️'}
                {currentStep === 4 && '⭐'}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                size="lg"
                className="px-8 py-4 text-xl font-black border-4 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="w-6 h-6 mr-2" />
                PREVIOUS
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                size="lg"
                className="px-8 py-4 text-xl font-black bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-2xl transform hover:scale-105 transition-all"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    <Sparkles className="w-6 h-6 mr-2" />
                    START JOURNEY
                    <ArrowRight className="w-6 h-6 ml-2" />
                  </>
                ) : (
                  <>
                    NEXT
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Debug Info - Remove in production */}
        <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white text-sm">
          <p className="font-bold">Debug Info:</p>
          <p>Fitness Level: {formData.fitnessLevel || 'Not selected'}</p>
          <p>Goal: {formData.goal || 'Not selected'}</p>
          <p>Equipment: {formData.equipment || 'Not selected'}</p>
          <p>Weekly Days: {formData.weeklyDays || 'Not selected'}</p>
          <p>Limitations: {formData.limitations?.join(', ') || 'None'}</p>
          <p>Current Step Valid: {isStepValid() ? 'YES' : 'NO'}</p>
        </div>

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-xl font-black text-orange-400">PROVEN RESULTS</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💪</div>
              <p className="text-xl font-black text-purple-400">PERSONALIZED PLANS</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <p className="text-xl font-black text-green-400">DAILY MOTIVATION</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}