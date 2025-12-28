import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { DayRoutine } from '../types'
import { Check, Calendar, TrendingUp, Award, Flame, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProgressTrackerProps {
  routine: DayRoutine[]
  completedDays: Set<number>
  currentDay: number
}

export function ProgressTracker({ routine, completedDays, currentDay }: ProgressTrackerProps) {
  const completionPercentage = Math.round((completedDays.size / routine.length) * 100)
  const streak = Array.from(completedDays).filter(day => day <= currentDay).length

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-6 h-6" />
            <span className="text-2xl font-bold">{streak}</span>
          </div>
          <div className="text-sm font-semibold">Day Streak</div>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6" />
            <span className="text-2xl font-bold">{completionPercentage}%</span>
          </div>
          <div className="text-sm font-semibold">Complete</div>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>Weekly Goal</span>
              <span>{completedDays.size} / {routine.length} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-600">
              {completionPercentage === 100 ? '🏆 Perfect week!' : 
               completionPercentage >= 70 ? '🔥 Crushing it!' :
               completionPercentage >= 40 ? '💪 Keep pushing!' : '🎯 Just getting started!'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="shadow-xl">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Workout Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {routine.map((day, index) => {
              const isCompleted = completedDays.has(index)
              const isCurrent = index === currentDay
              const isRestDay = day.isRestDay

              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-emerald-400 border-green-600 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-br from-orange-400 to-red-400 border-orange-600 text-white'
                      : isRestDay
                      ? 'bg-gray-100 border-gray-300 text-gray-600'
                      : 'bg-gray-50 border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-xs font-bold mb-1">Day {index + 1}</div>
                  {isCompleted && (
                    <Check className="w-4 h-4" />
                  )}
                  {isCurrent && !isCompleted && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                  {isRestDay && !isCompleted && (
                    <span className="text-lg">🧘</span>
                  )}
                  {!isRestDay && !isCompleted && !isCurrent && (
                    <span className="text-lg">💪</span>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-4 flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-400 rounded border-2 border-green-600"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-orange-400 to-red-400 rounded border-2 border-orange-600"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 rounded border-2 border-gray-300"></div>
              <span>Workout</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded border-2 border-gray-300"></div>
              <span>Rest</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
        <CardContent className="p-6 text-center">
          <div className="text-3xl mb-3">🔥</div>
          <div className="text-lg font-bold text-gray-900 mb-2">
            {streak === 0 ? "Your journey starts today!" :
             streak === 1 ? "First workout complete!" :
             streak === 3 ? "Three days of consistency!" :
             streak === 5 ? "Five days! You're unstoppable!" :
             streak === 7 ? "Perfect week! You're a champion!" :
             "Keep crushing your goals!"}
          </div>
          <div className="text-sm text-gray-600">
            Every workout brings you closer to your goals!
          </div>
        </CardContent>
      </Card>
    </div>
  )
}