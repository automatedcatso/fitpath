import { useState, useEffect } from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Lightbulb, MessageCircle, Sparkles, TrendingUp, Heart, Zap, Clock, Bell, Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AICoachProps {
  currentDay: number
  completedDays: Set<number>
  isWorkoutDay: boolean
  hasCompletedToday: boolean
}

interface CoachMessage {
  id: string
  type: 'motivation' | 'tip' | 'warning' | 'celebration' | 'reminder'
  message: string
  icon: any
  color: string
}

export function AICoach({ currentDay, completedDays, isWorkoutDay, hasCompletedToday }: AICoachProps) {
  const [messages, setMessages] = useState<CoachMessage[]>([])
  const [isListening, setIsListening] = useState(false)
  const [currentMessage, setCurrentMessage] = useState<CoachMessage | null>(null)
  const [alarmTime, setAlarmTime] = useState<string>('')
  const [isAlarmSet, setIsAlarmSet] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const coachTips = {
    motivation: [
      { message: "💪 YOU'RE UNSTOPPABLE! Push through the discomfort!", icon: Sparkles, color: "from-purple-600 to-pink-600" },
      { message: "🔥 EVERY REP COUNTS! Build your dream body NOW!", icon: TrendingUp, color: "from-orange-600 to-red-600" },
      { message: "⚡ YOUR FUTURE SELF THANKS YOU! Keep going!", icon: Zap, color: "from-yellow-600 to-orange-600" },
      { message: "🎯 FORM OVER SPEED! Quality creates results!", icon: Lightbulb, color: "from-blue-600 to-indigo-600" },
      { message: "💫 REMEMBER YOUR WHY! Goals are within reach!", icon: Heart, color: "from-pink-600 to-rose-600" }
    ],
    tips: [
      { message: "💧 HYDRATE NOW! Water between sets = better performance!", icon: Lightbulb, color: "from-blue-600 to-cyan-600" },
      { message: "🫁 BREATHE RIGHT! Exhale effort, inhale recovery!", icon: MessageCircle, color: "from-green-600 to-emerald-600" },
      { message: "⏱️ REST SMART! 30-60 seconds for optimal growth!", icon: Clock, color: "from-purple-600 to-indigo-600" },
      { message: "🎯 CORE ENGAGED! Every exercise needs stability!", icon: Zap, color: "from-orange-600 to-yellow-600" },
      { message: "📈 PROGRESSIVE OVERLOAD! Increase intensity gradually!", icon: TrendingUp, color: "from-red-600 to-pink-600" }
    ],
    celebration: [
      { message: "🏆 ABSOLUTELY CRUSHING IT! You're a BEAST!", icon: Sparkles, color: "from-yellow-600 to-orange-600" },
      { message: "🎉 WORKOUT COMPLETE! One step closer to GREATNESS!", icon: Heart, color: "from-pink-600 to-rose-600" },
      { message: "⭐ INCREDIBLE CONSISTENCY! Dedication pays off!", icon: TrendingUp, color: "from-purple-600 to-indigo-600" },
      { message: "🔥 YOU'RE ON FIRE! This commitment is RARE!", icon: Zap, color: "from-orange-600 to-red-600" },
      { message: "💪 BEAST MODE ACTIVATED! You're UNSTOPPABLE!", icon: Sparkles, color: "from-green-600 to-emerald-600" }
    ],
    reminders: [
      { message: "⏰ WORKOUT TIME! Your body is ready!", icon: Bell, color: "from-red-600 to-orange-600" },
      { message: "🔔 REMINDER! Don't forget your fitness goals!", icon: Bell, color: "from-purple-600 to-pink-600" },
      { message: "📱 TIME TO MOVE! Your workout awaits!", icon: Bell, color: "from-blue-600 to-indigo-600" }
    ]
  }

  const playNotificationSound = () => {
    if (soundEnabled) {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'fitpath-reminder',
        requireInteraction: true
      })
    }
  }

  const setAlarm = () => {
    if (alarmTime) {
      setIsAlarmSet(true)
      localStorage.setItem('fitpath-alarm', alarmTime)
      
      // Schedule notification
      const [hours, minutes] = alarmTime.split(':').map(Number)
      const now = new Date()
      const alarmDate = new Date()
      alarmDate.setHours(hours, minutes, 0, 0)
      
      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1)
      }
      
      const timeUntilAlarm = alarmDate.getTime() - now.getTime()
      
      setTimeout(() => {
        playNotificationSound()
        showNotification('🔥 WORKOUT TIME!', 'Your AI Coach is ready! Let\'s crush today\'s workout!')
        
        const reminderMessage: CoachMessage = {
          id: Date.now().toString(),
          type: 'reminder',
          message: '⏰ WORKOUT TIME! Your body is ready for action!',
          icon: Bell,
          color: 'from-red-600 to-orange-600'
        }
        
        setMessages(prev => [reminderMessage, ...prev].slice(0, 3))
        setCurrentMessage(reminderMessage)
        setTimeout(() => setCurrentMessage(null), 8000)
      }, timeUntilAlarm)
    }
  }

  const clearAlarm = () => {
    setIsAlarmSet(false)
    setAlarmTime('')
    localStorage.removeItem('fitpath-alarm')
  }

  const generateCoachMessage = () => {
    let messageArray: any[] = []
    
    if (hasCompletedToday) {
      messageArray = coachTips.celebration
    } else if (isWorkoutDay) {
      messageArray = [...coachTips.motivation, ...coachTips.tips]
    } else {
      messageArray = [
        { message: "🧘 REST DAY IS CRUCIAL! Muscles grow when you recover!", icon: Heart, color: "from-blue-600 to-indigo-600" },
        { message: "💧 HYDRATE & PREPARE! Tomorrow's workout awaits!", icon: Lightbulb, color: "from-green-600 to-emerald-600" },
        { message: "📈 RECOVERY IS MAGIC! Embrace the rest!", icon: TrendingUp, color: "from-purple-600 to-pink-600" }
      ]
    }

    const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)]
    const newMessage: CoachMessage = {
      id: Date.now().toString(),
      type: hasCompletedToday ? 'celebration' : isWorkoutDay ? 'motivation' : 'tip',
      ...randomMessage
    }

    setMessages(prev => [newMessage, ...prev].slice(0, 3))
    setCurrentMessage(newMessage)
    playNotificationSound()
    
    setTimeout(() => setCurrentMessage(null), 5000)
  }

  useEffect(() => {
    requestNotificationPermission()
    
    const savedAlarm = localStorage.getItem('fitpath-alarm')
    if (savedAlarm) {
      setAlarmTime(savedAlarm)
      setIsAlarmSet(true)
    }

    generateCoachMessage()
    const interval = setInterval(generateCoachMessage, 15000)
    return () => clearInterval(interval)
  }, [currentDay, hasCompletedToday, isWorkoutDay])

  const handleCoachInteraction = () => {
    setIsListening(true)
    generateCoachMessage()
    setTimeout(() => setIsListening(false), 1000)
  }

  return (
    <div className="space-y-4">
      {/* AI Coach Card */}
      <Card className="relative overflow-hidden shadow-2xl border-2 border-purple-300 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20"></div>
        <CardContent className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
                {isListening && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full shadow-lg"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
              <div>
                <h3 className="font-black text-2xl text-white">AI COACH</h3>
                <p className="text-sm text-purple-300 font-semibold">Your Personal Motivator</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                size="sm"
                className={`${soundEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleCoachInteraction}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                GET TIP
              </Button>
            </div>
          </div>

          {/* Current Message Display */}
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={currentMessage.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className={`p-5 rounded-2xl bg-gradient-to-r ${currentMessage.color} text-white mb-4 shadow-xl border-2 border-white/20`}
              >
                <div className="flex items-start gap-3">
                  <currentMessage.icon className="w-6 h-6 mt-0.5 flex-shrink-0" />
                  <p className="text-lg font-black leading-relaxed">{currentMessage.message}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alarm Section */}
          <div className="mb-4 p-4 bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl border-2 border-orange-600/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-black text-orange-300 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                WORKOUT ALARM
              </h4>
              <Button
                onClick={isAlarmSet ? clearAlarm : setAlarm}
                size="sm"
                className={`${isAlarmSet ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold`}
              >
                {isAlarmSet ? 'CLEAR' : 'SET'}
              </Button>
            </div>
            <input
              type="time"
              value={alarmTime}
              onChange={(e) => setAlarmTime(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 text-white border-2 border-orange-600 rounded-xl font-bold text-lg focus:outline-none focus:border-orange-500"
            />
            {isAlarmSet && (
              <p className="text-sm text-orange-300 mt-2 font-semibold">
                ⏰ Alarm set for {alarmTime} - Get ready to crush it!
              </p>
            )}
          </div>

          {/* Message History */}
          <div className="space-y-2">
            <p className="text-sm font-black text-gray-400 uppercase tracking-wider">Recent Tips</p>
            {messages.slice(1).map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <message.icon className="w-5 h-5 text-purple-400" />
                <p className="text-sm font-bold text-gray-300 line-clamp-1">{message.message}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-4 text-center border-2 border-orange-400 shadow-xl">
          <div className="text-2xl font-black text-white">
            {completedDays.size}
          </div>
          <div className="text-sm font-bold text-orange-100">COMPLETED</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-4 text-center border-2 border-purple-400 shadow-xl">
          <div className="text-2xl font-black text-white">
            {currentDay + 1}
          </div>
          <div className="text-sm font-bold text-purple-100">CURRENT DAY</div>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-center border-2 border-green-400 shadow-xl">
          <div className="text-2xl font-black text-white">
            {Math.round((completedDays.size / 7) * 100)}%
          </div>
          <div className="text-sm font-bold text-green-100">PROGRESS</div>
        </div>
      </div>
    </div>
  )
}