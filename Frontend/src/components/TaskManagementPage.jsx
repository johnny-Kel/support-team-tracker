import { useState, useEffect } from 'react'
import api from '../axios'
import { Plus, Trash2, ListChecks, Loader2, Calendar, User, Flag, AlertCircle } from 'lucide-react'

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [status, setStatus] = useState('Pending')
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  // --- DATE HELPER (The Fix) ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Fetch Tasks AND Users
  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/users')
      ])
      setTasks(tasksRes.data)
      setUsers(usersRes.data)
      
      if (usersRes.data.length > 0) {
        setAssignedTo(usersRes.data[0].id)
      }
    } catch (error) {
      console.error("Failed to load data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Create New Task
  const handleCreate = async (e) => {
    e.preventDefault()
    setIsCreating(true)
    setError('')

    try {
      await api.post('/tasks', { 
        title, 
        description,
        priority,
        status,
        start_date: startDate,
        deadline,
        assigned_user_id: assignedTo
      })
      
      setTitle('')
      setDescription('')
      setPriority('Medium')
      setStatus('Pending')
      setStartDate('')
      setDeadline('')
      fetchData() 
    } catch (err) {
      console.error(err)
      setError("Failed to create task. Please check all fields.")
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id) => {
    if(!confirm("Are you sure you want to remove this activity?")) return
    try {
      await api.delete(`/tasks/${id}`)
      fetchData()
    } catch (error) {
      alert("Failed to delete.")
    }
  }

  const getPriorityColor = (p) => {
    switch(p) {
        case 'Critical': return 'bg-red-100 text-red-700 border-red-200'
        case 'High': return 'bg-orange-100 text-orange-700 border-orange-200'
        case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200'
        default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Task Management</h2>
        <p className="text-gray-500">Define, assign, and track support activities.</p>
      </div>

      {/* --- CREATE FORM --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" /> 
          Add New Activity
        </h3>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleCreate} className="space-y-4">
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Title *</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Server Maintenance"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To *</label>
                <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        required
                    >
                        <option value="">Select Personnel...</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select 
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                    <option>Pending</option>
                    <option>In-Progress</option>
                    <option>On-Hold</option>
                    <option>Completed</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                <input 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input 
              type="text" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief instructions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={isCreating}
              className="px-6 py-2 bg-gray-900 hover:bg-black text-white font-medium rounded-lg transition flex items-center gap-2 shadow-lg shadow-gray-200"
            >
              {isCreating ? <Loader2 className="animate-spin" size={16} /> : "Create Assignment"}
            </button>
          </div>
        </form>
      </div>

      {/* --- ACTIVE ASSIGNMENTS LIST (With Date Fix) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
           <h3 className="font-semibold text-gray-800 flex items-center gap-2">
             <ListChecks size={18} /> Active Assignments ({tasks.length})
           </h3>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading assignments...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                    <tr>
                        <th className="px-6 py-3">Task</th>
                        <th className="px-6 py-3">Assigned To</th>
                        <th className="px-6 py-3">Priority</th>
                        <th className="px-6 py-3">Timeline</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tasks.map(task => (
                        <tr key={task.id} className="hover:bg-gray-50 group">
                            <td className="px-6 py-3">
                                <p className="font-medium text-gray-900">{task.title}</p>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{task.description}</p>
                            </td>
                            <td className="px-6 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs">
                                        {task.assignee ? task.assignee.name.charAt(0) : '?'}
                                    </div>
                                    <span className="text-gray-700">{task.assignee ? task.assignee.name : 'Unassigned'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-3">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                    <Flag size={10} /> {task.priority}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-gray-600 text-xs">
                                {/* DATES ARE NOW FORMATTED */}
                                <div className="flex items-center gap-1"><Calendar size={12}/> {formatDate(task.start_date)}</div>
                                <div className="flex items-center gap-1 mt-1 text-red-500"><AlertCircle size={12}/> {formatDate(task.deadline)}</div>
                            </td>
                            <td className="px-6 py-3">
                                <span className="inline-flex px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs border border-gray-200">
                                    {task.status}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <button 
                                    onClick={() => handleDelete(task.id)}
                                    className="text-gray-400 hover:text-red-600 transition"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {tasks.length === 0 && (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-400 italic">No tasks assigned yet.</td></tr>
                    )}
                </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}