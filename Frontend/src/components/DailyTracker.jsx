import { useEffect, useState } from 'react'
import api from '../axios'
import { CheckCircle2, Clock, AlertCircle, Calendar, User, Flag, Filter, ArrowRight } from 'lucide-react'
import ActivityModal from './ActivityModal'

export default function DailyTracker() {
  const [tasks, setTasks] = useState([])
  const [todaysEntries, setTodaysEntries] = useState([])
  const [users, setUsers] = useState([]) 
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Helper to format Time (HH:MM AM/PM)
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
        hour: '2-digit', 
        minute:'2-digit'
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const usersRes = await api.get('/users')
        setUsers(usersRes.data)

        const tasksRes = await api.get('/tasks', {
            params: { date: selectedDate }
        })
        
        const activityRes = await api.get('/activities/daily') 
        
        setTasks(tasksRes.data)
        setTodaysEntries(activityRes.data.data)
      } catch (error) {
        console.error("Failed to fetch data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [refreshTrigger, selectedDate])

  const getEntryForTask = (taskId) => {
    return todaysEntries.find(entry => entry.task.id === taskId)
  }

  const getPriorityColor = (p) => {
    switch(p) {
        case 'Critical': return 'bg-red-100 text-red-700 border-red-200'
        case 'High': return 'bg-orange-100 text-orange-700 border-orange-200'
        case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const handleOpenLog = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Daily Tracker</h2>
          <p className="text-gray-500 mt-1">
            Managing tasks for: <span className="font-semibold text-blue-600">{formatDate(selectedDate)}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
            </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid gap-4">
            {tasks.length > 0 ? tasks.map((task) => {
            const entry = getEntryForTask(task.id)
            
            return (
                <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    
                    <div className="flex-1 w-full">
                        {/* Title Row */}
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                            
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                                <Flag size={10} /> {task.priority}
                            </span>

                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                                task.status === 'Completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}>
                                {task.status}
                            </span>
                        </div>

                        {/* Assignee & Deadline Info */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <div className="flex items-center gap-1" title="Currently Assigned To">
                                <User size={12} />
                                <span className="font-medium">{task.assignee ? task.assignee.name : 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <AlertCircle size={12} />
                                Deadline: {formatDate(task.deadline)}
                            </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        
                        {/* --- BIO DETAILS & REMARK (Requirement 3 MET HERE) --- */}
                        {entry && (
                            <div className="bg-blue-50 rounded-lg border border-blue-100 p-3 mt-3 animate-in fade-in">
                                {/* The Header showing WHO and WHEN */}
                                <div className="flex justify-between items-center mb-2 border-b border-blue-100 pb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">
                                            {entry.user.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-blue-800">
                                                {entry.user.name}
                                            </span>
                                            <span className="text-[10px] text-blue-400 leading-none">
                                                Updated this task
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-blue-500 font-medium">
                                        <Clock size={12} />
                                        {formatTime(entry.created_at)}
                                    </div>
                                </div>
                                
                                {/* The Content */}
                                <p className="text-sm text-blue-900 leading-relaxed">
                                    "{entry.remark}"
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex-shrink-0">
                        <button 
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition border ${
                                task.status === 'Completed'
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : (entry ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50' : 'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-sm')
                            }`}
                            onClick={() => handleOpenLog(task)}
                        >
                            {task.status === 'Completed' ? 'View / Reopen' : (entry ? 'Update / Reassign' : 'Log Update')}
                        </button>
                    </div>

                </div>
                </div>
            )
            }) : (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Filter className="mx-auto text-gray-300 mb-2" size={32} />
                    <p className="text-gray-500">No tasks scheduled for this date.</p>
                </div>
            )}
        </div>
      )}

      <ActivityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={selectedTask}
        users={users} 
        onSuccess={handleSuccess}
      />
    </div>
  )
}