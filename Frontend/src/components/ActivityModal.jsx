import { useState, useEffect } from 'react'
import { X, Save, Loader2, User, Flag, CheckCircle2, AlertTriangle } from 'lucide-react'
import api from '../axios'

export default function ActivityModal({ isOpen, onClose, task, users = [], onSuccess }) {
  const [remark, setRemark] = useState('')
  const [status, setStatus] = useState('Pending')
  const [priority, setPriority] = useState('Medium')
  const [assignedTo, setAssignedTo] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load task details
  useEffect(() => {
    if (task) {
      setStatus(task.status || 'Pending')
      setPriority(task.priority || 'Medium')
      setAssignedTo(task.assigned_user_id || '')
      setRemark('')
      setError('')
    }
  }, [task, isOpen])

  if (!isOpen || !task) return null

  // --- LOGIC: Real World Rules ---
  
  // Rule 1: Is the task currently marked as completed in this specific form session?
  const isMarkingCompleted = status === 'Completed';
  
  // Rule 2: Was the task ALREADY completed before we opened this modal?
  const wasAlreadyCompleted = task.status === 'Completed';

  // Rule 3: If status is 'Completed', lock other fields. 
  // You cannot reassign a completed task unless you reopen it (change status back to Pending/In-Progress)
  const isLocked = status === 'Completed';

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    // LOGIC CHECK: Require remark for accountability
    if ((status === 'Completed' || status === 'On-Hold') && !remark.trim()) {
        setError(`You must provide a remark when marking a task as ${status}.`)
        setIsSubmitting(false)
        return
    }

    try {
      await api.put(`/tasks/${task.id}`, {
        status: status,
        priority: priority,
        assigned_user_id: assignedTo
      })

      if (remark.trim()) {
          await api.post('/activities', {
            task_id: task.id,
            status: status.toLowerCase() === 'completed' ? 'done' : 'pending',
            remark: remark
          })
      }

      onSuccess()
      onClose()
    } catch (err) {
      console.error(err)
      setError("Failed to save updates. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className={`px-6 py-4 border-b flex justify-between items-center ${wasAlreadyCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div>
            <h3 className="font-semibold text-gray-900">
                {wasAlreadyCompleted ? 'View Completed Activity' : 'Update Activity'}
            </h3>
            <p className="text-xs text-gray-500">Ref: {task.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Warning Banner for Completed Tasks */}
        {wasAlreadyCompleted && status === 'Completed' && (
            <div className="bg-yellow-50 px-6 py-2 text-xs text-yellow-800 flex items-center gap-2 border-b border-yellow-100">
                <AlertTriangle size={12} />
                To edit Priority or Assignment, you must first Reopen this task (Change Status).
            </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="text-red-600 text-sm bg-red-50 p-2 rounded animate-pulse">{error}</div>}

          <div className="grid grid-cols-2 gap-4">
             {/* Status Dropdown */}
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                    <CheckCircle2 className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                    >
                        <option>Pending</option>
                        <option>In-Progress</option>
                        <option>On-Hold</option>
                        <option className="text-green-600 font-bold">Completed</option>
                    </select>
                </div>
             </div>

             {/* Priority Dropdown - LOCKED if Completed */}
             <div className={isLocked ? 'opacity-50 pointer-events-none' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority {isLocked && <span className="text-xs text-gray-400">(Locked)</span>}
                </label>
                <div className="relative">
                    <Flag className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        disabled={isLocked}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                </div>
             </div>
          </div>

          {/* Reassign User - LOCKED if Completed */}
          <div className={isLocked ? 'opacity-50 pointer-events-none' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned To {isLocked && <span className="text-xs text-gray-400">(Locked)</span>}
            </label>
            <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    disabled={isLocked}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                    <option value="">-- Unassigned --</option>
                    {users.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
            </div>
            {isLocked && <p className="text-xs text-gray-400 mt-1">Reopen task to reassign personnel.</p>}
          </div>

          {/* Remark Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remark {isMarkingCompleted && <span className="text-red-500">* Required</span>}
            </label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={isMarkingCompleted ? "Please explain the resolution..." : "Progress update..."}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition resize-none ${
                isMarkingCompleted && !remark ? 'border-red-300 ring-red-200' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex justify-end gap-3 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm transition flex items-center gap-2 ${
                isMarkingCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {isMarkingCompleted ? 'Complete Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}