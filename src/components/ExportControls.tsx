import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Download, FileText, Printer, Share2, Mail, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'
import { ExportData, exportWorkoutPlan, printWorkoutPlan } from '../utils/exportUtils'

interface ExportControlsProps {
  exportData: ExportData
}

export function ExportControls({ exportData }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportText = async () => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate processing
      exportWorkoutPlan(exportData, 'text')
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportCSV = async () => {
    setIsExporting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      exportWorkoutPlan(exportData, 'csv')
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    printWorkoutPlan(exportData)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const textContent = `Check out my FitPath workout plan! ${exportData.userProfile.goal.toUpperCase()} goal with ${exportData.userProfile.weeklyDays} days per week. 💪`
        await navigator.share({
          title: 'FitPath Workout Plan',
          text: textContent,
        })
      } catch (error) {
        console.log('Share cancelled or failed')
      }
    } else {
      // Fallback - copy to clipboard
      const textContent = exportToText(exportData)
      navigator.clipboard.writeText(textContent).then(() => {
        alert('Workout plan copied to clipboard!')
      })
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent('My FitPath Workout Plan')
    const body = encodeURIComponent(`Check out my personalized workout plan from FitPath!\n\nFitness Level: ${exportData.userProfile.fitnessLevel}\nGoal: ${exportData.userProfile.goal}\nWeekly Commitment: ${exportData.userProfile.weeklyDays} days\n\nProgress: ${exportData.completedDays.length}/7 days completed\n\nKeep me accountable! 💪`)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-black flex items-center gap-3">
          <Download className="w-7 h-7" />
          EXPORT & SHARE
        </CardTitle>
        <CardDescription className="text-white/90 text-lg font-bold">
          Save your workout plan and track progress
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          {/* Export Options */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-3"
          >
            <h3 className="text-xl font-black text-white mb-4">📥 Export Options</h3>
            
            <Button
              onClick={handleExportText}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-black text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <FileText className="w-5 h-5 mr-3" />
              {isExporting ? 'EXPORTING...' : 'EXPORT AS TEXT (.txt)'}
            </Button>
            
            <Button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-black text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <Download className="w-5 h-5 mr-3" />
              {isExporting ? 'EXPORTING...' : 'EXPORT AS CSV (.csv)'}
            </Button>
            
            <Button
              onClick={handlePrint}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-black text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <Printer className="w-5 h-5 mr-3" />
              PRINT WORKOUT PLAN
            </Button>
          </motion.div>

          {/* Share Options */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="space-y-3"
          >
            <h3 className="text-xl font-black text-white mb-4">📤 Share Options</h3>
            
            <Button
              onClick={handleShare}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <Share2 className="w-5 h-5 mr-3" />
              SHARE WORKOUT
            </Button>
            
            <Button
              onClick={handleEmailShare}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <Mail className="w-5 h-5 mr-3" />
              EMAIL TO FRIEND
            </Button>
            
            <Button
              onClick={() => {
                const text = exportToText(exportData)
                navigator.clipboard.writeText(text).then(() => {
                  alert('Workout plan copied to clipboard! 📋')
                })
              }}
              className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <Smartphone className="w-5 h-5 mr-3" />
              COPY TO CLIPBOARD
            </Button>
          </motion.div>
        </div>

        {/* Export Info */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border-2 border-blue-600 rounded-xl">
          <h4 className="text-lg font-black text-blue-400 mb-2">📊 Export Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-black text-white">{exportData.routine.length}</div>
              <div className="text-sm text-gray-400 font-bold">Total Days</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{exportData.completedDays.length}</div>
              <div className="text-sm text-gray-400 font-bold">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{exportData.userProfile.weeklyDays}</div>
              <div className="text-sm text-gray-400 font-bold">Days/Week</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{Math.round((exportData.completedDays.length / 7) * 100)}%</div>
              <div className="text-sm text-gray-400 font-bold">Progress</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 p-4 bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-600 rounded-xl">
          <h4 className="text-lg font-black text-green-400 mb-2">💡 Export Tips</h4>
          <ul className="text-sm text-gray-300 space-y-1 font-semibold">
            <li>• Text format includes all exercise details and modifications</li>
            <li>• CSV format is perfect for tracking in spreadsheets</li>
            <li>• Print format is optimized for paper tracking</li>
            <li>• Share with friends for accountability and motivation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function for clipboard
function exportToText(data: ExportData): string {
  const { userProfile, routine, completedDays, generatedDate } = data
  
  let text = '='.repeat(60) + '\n'
  text += '                    FITPATH WORKOUT PLAN\n'
  text += '='.repeat(60) + '\n\n'
  
  text += '📋 PROFILE INFORMATION\n'
  text += '-'.repeat(30) + '\n'
  text += `Fitness Level: ${userProfile.fitnessLevel.toUpperCase()}\n`
  text += `Primary Goal: ${userProfile.goal.replace('-', ' ').toUpperCase()}\n`
  text += `Available Equipment: ${userProfile.equipment.replace('-', ' ').toUpperCase()}\n`
  text += `Weekly Commitment: ${userProfile.weeklyDays} days\n`
  text += `Physical Limitations: ${userProfile.limitations.length > 0 ? userProfile.limitations.join(', ').toUpperCase() : 'NONE'}\n`
  text += `Generated Date: ${new Date(generatedDate).toLocaleDateString()}\n\n`
  
  text += '📊 PROGRESS OVERVIEW\n'
  text += '-'.repeat(30) + '\n'
  text += `Completed Days: ${completedDays.length} / 7\n`
  text += `Completion Rate: ${Math.round((completedDays.length / 7) * 100)}%\n\n`
  
  text += '📅 7-DAY WORKOUT ROUTINE\n'
  text += '='.repeat(60) + '\n\n'
  
  routine.forEach((day, index) => {
    const isCompleted = completedDays.includes(index)
    const status = isCompleted ? '✅ COMPLETED' : '⏳ PENDING'
    
    text += `${'='.repeat(20)} DAY ${day.day + 1} ${'='.repeat(20)}\n`
    text += `Status: ${status}\n`
    text += `Title: ${day.title}\n`
    
    if (day.isRestDay) {
      text += `Type: REST & RECOVERY\n`
      text += `Description: ${day.description}\n`
    } else {
      text += `Type: WORKOUT DAY\n`
      text += `Exercises: ${day.exercises?.length || 0} exercises\n\n`
      
      if (day.exercises) {
        day.exercises.forEach((exercise, exIndex) => {
          text += `  ${exIndex + 1}. ${exercise.name.toUpperCase()}\n`
          text += `     Instructions: ${exercise.instructions}\n`
          if (exercise.sets) text += `     Sets: ${exercise.sets}\n`
          if (exercise.duration) text += `     Duration: ${exercise.duration}\n`
          if (exercise.modification) {
            text += `     ⚠️  Modification: ${exercise.modification}\n`
          }
          text += '\n'
        })
      }
    }
    text += '\n'
  })
  
  text += '='.repeat(60) + '\n'
  text += '                    STAY CONSISTENT! 💪\n'
  text += '                YOUR FITNESS JOURNEY MATTERS\n'
  text += '='.repeat(60) + '\n'
  
  return text
}