import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { DayRoutine } from '../types'
import { Check, Clock, AlertCircle, ChevronRight, Flame, Trophy, Target, Zap, Star, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { AICoach } from './AICoach'

interface RoutineDisplayProps {
  routine: DayRoutine[]
  currentDay: number
  completedDays: Set<number>
  onDayComplete: (dayIndex: number) => void
  onDayChange: (dayIndex: number) => void
}

export function RoutineDisplay({ routine, currentDay, completedDays, onDayComplete, onDayChange }: RoutineDisplayProps) {
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null)

  const todayRoutine = routine[currentDay]
  const isCompleted = completedDays.has(currentDay)

  const getMotivationalMessage = () => {
    const streak = Array.from(completedDays).filter(day => day <= currentDay).length
    if (streak === 0) return "🔥 READY TO CRUSH YOUR GOALS?"
    if (streak === 1) return "💪 FIRST WORKOUT COMPLETE! YOU'RE ON FIRE!"
    if (streak === 3) return "⚡ THREE DAYS OF PURE POWER!"
    if (streak === 5) return "🏆 FIVE DAYS! YOU'RE A BEAST!"
    if (streak === 7) return "🎯 FULL WEEK! LEGENDARY PERFORMANCE!"
    return `⭐ ${streak} DAY${streak !== 1 ? 'S' : ''} OF CRUSHING IT!`
  }

  const handleNextDay = () => {
    if (currentDay < routine.length - 1) {
      onDayChange(currentDay + 1)
    }
  }

  const handlePreviousDay = () => {
    if (currentDay > 0) {
      onDayChange(currentDay - 1)
    }
  }

  const getWorkoutIntensity = () => {
    if (todayRoutine?.isRestDay) return { color: 'from-blue-600 to-cyan-600', icon: Clock, label: 'ACTIVE RECOVERY' }
    if (currentDay <= 2) return { color: 'from-orange-600 to-red-600', icon: Flame, label: 'HIGH INTENSITY' }
    if (currentDay <= 4) return { color: 'from-purple-600 to-pink-600', icon: Zap, label: 'POWER TRAINING' }
    return { color: 'from-indigo-600 to-purple-600', icon: Target, label: 'PEAK PERFORMANCE' }
  }

  const intensity = getWorkoutIntensity()

  return (
    <div className="space-y-6">
      {/* AI Coach Section */}
      <AICoach
        currentDay={currentDay}
        completedDays={completedDays}
        isWorkoutDay={!todayRoutine?.isRestDay}
        hasCompletedToday={isCompleted}
      />

      {/* Hero Section */}
      <div className={`relative rounded-2xl bg-gradient-to-r ${intensity.color} p-1 overflow-hidden shadow-2xl`}>
        <div className="absolute inset-0 bg-white opacity-10"></div>
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-4 bg-gradient-to-r ${intensity.color} rounded-xl shadow-lg`}>
                  <intensity.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-black text-orange-400 uppercase tracking-wider">
                  {intensity.label}
                </span>
              </div>
              <h2 className="text-4xl font-black text-white mb-3">
                Day {currentDay + 1}: {todayRoutine?.title}
              </h2>
              <p className="text-xl text-gray-300 mb-4 font-bold">
                {getMotivationalMessage()}
              </p>
              {isCompleted && (
                <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl inline-flex shadow-xl">
                  <Trophy className="w-6 h-6" />
                  <span className="font-black text-lg">WORKOUT COMPLETE!</span>
                </div>
              )}
            </div>
            <div className="relative">
              <div className="text-7xl text-center mb-6">💪</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-600/50 to-indigo-600/50 rounded-xl p-4 border-2 border-blue-400 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop&crop=face&auto=format&dpr=2&q=80" 
                    alt="Gym Boy" 
                    className="w-full h-24 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=200&h=200&fit=crop&crop=face&auto=format&dpr=2&q=80"
                    }}
                  />
                  <p className="text-sm text-blue-300 mt-2 text-center font-black">BUILD STRENGTH</p>
                </div>
                <div className="bg-gradient-to-br from-pink-600/50 to-purple-600/50 rounded-xl p-4 border-2 border-pink-400 shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1548690312-e3b507d8e110?w=200&h=200&fit=crop&crop=face&auto=format&dpr=2&q=80" 
                    alt="Gym Girl" 
                    className="w-full h-24 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1594381898411-846e7db19d12?w=200&h=200&fit=crop&crop=face&auto=format&dpr=2&q=80"
                    }}
                  />
                  <p className="text-sm text-pink-300 mt-2 text-center font-black">TONE & SCULPT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 shadow-2xl border-2 border-gray-700">
        <Button
          onClick={handlePreviousDay}
          disabled={currentDay === 0}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black px-6 text-lg shadow-xl"
        >
          ← PREVIOUS
        </Button>
        
        <div className="text-center">
          <div className="text-3xl font-black text-white">Day {currentDay + 1}</div>
          <div className="text-sm text-gray-400 font-bold">of {routine.length} days</div>
        </div>

        <Button
          onClick={handleNextDay}
          disabled={currentDay === routine.length - 1}
          className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-black px-6 text-lg shadow-xl"
        >
          NEXT →
        </Button>
      </div>

      {/* Workout Card */}
      <Card className={`shadow-2xl border-2 ${isCompleted ? 'border-green-500 bg-gradient-to-br from-green-900/50 to-emerald-900/50' : 'border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800'}`}>
        <CardHeader className={`bg-gradient-to-r ${isCompleted ? 'from-green-600 to-emerald-600' : intensity.color} text-white rounded-t-lg`}>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-black flex items-center gap-3">
                {isCompleted && <Check className="w-7 h-7" />}
                {todayRoutine?.title}
              </CardTitle>
              <CardDescription className="text-white/90 mt-2 text-lg font-bold">
                {todayRoutine?.isRestDay ? "Rest and recover" : "Time to push your limits!"}
              </CardDescription>
            </div>
            <div className="text-5xl">
              {todayRoutine?.isRestDay ? '🧘' : '🔥'}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {todayRoutine?.isRestDay ? (
            <div className="text-center py-12">
              <div className={`bg-gradient-to-r ${intensity.color} w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                <Clock className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">REST & RECOVERY</h3>
              <p className="text-gray-300 text-xl max-w-md mx-auto font-bold">
                {todayRoutine.description || "Light stretching or gentle walking is encouraged. Listen to your body."}
              </p>
              <div className="mt-8 flex justify-center gap-6">
                <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-lg shadow-xl">
                  💧 HYDRATION
                </div>
                <div className="bg-green-600 text-white px-6 py-3 rounded-xl font-black text-lg shadow-xl">
                  🥗 NUTRITION
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {todayRoutine?.exercises?.map((exercise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-xl p-5 hover:shadow-2xl transition-all duration-300 ${
                    index % 2 === 0 ? 'bg-gradient-to-r from-orange-900/30 to-red-900/30 border-orange-600' : 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl font-black text-orange-400">
                          {index + 1}
                        </span>
                        <h4 className="font-black text-white text-2xl">{exercise.name}</h4>
                      </div>
                      <p className="text-gray-300 mb-4 text-lg font-semibold">{exercise.instructions}</p>
                      <div className="flex gap-3 flex-wrap">
                        {exercise.sets && (
                          <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-5 py-3 rounded-full text-lg font-black shadow-lg">
                            🔥 {exercise.sets}
                          </span>
                        )}
                        {exercise.duration && (
                          <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-5 py-3 rounded-full text-lg font-black shadow-lg">
                            ⏱️ {exercise.duration}
                          </span>
                        )}
                      </div>
                      {exercise.modification && (
                        <div className="mt-4 p-4 bg-yellow-900/50 border-2 border-yellow-600 rounded-xl">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-yellow-400 mt-0.5" />
                            <p className="text-sm text-yellow-300 font-bold">{exercise.modification}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="bg-gradient-to-br from-orange-800 to-red-800 border-2 border-dashed border-orange-500 rounded-xl w-20 h-20 flex items-center justify-center shadow-xl">
                        <span className="text-3xl">💪</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6">
        {!todayRoutine?.isRestDay && (
          <Button
            onClick={() => onDayComplete(currentDay)}
            disabled={isCompleted}
            size="lg"
            className={`px-12 py-6 text-2xl font-black shadow-2xl transform hover:scale-105 transition-all ${
              isCompleted
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
            } text-white`}
          >
            {isCompleted ? (
              <>
                <Check className="w-7 h-7 mr-3" />
                COMPLETED! 💪
              </>
            ) : (
              <>
                <Flame className="w-7 h-7 mr-3" />
                COMPLETE WORKOUT! 🔥
              </>
            )}
          </Button>
        )}
        
        {currentDay < routine.length - 1 && (
          <Button
            onClick={handleNextDay}
            variant="outline"
            size="lg"
            className="px-12 py-6 text-2xl font-black border-4 border-orange-500 text-orange-400 hover:bg-orange-900/50 shadow-2xl transform hover:scale-105 transition-all"
          >
            Next Day →
          </Button>
        )}
      </div>
    </div>
  )
}