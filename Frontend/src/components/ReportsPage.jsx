import { useState } from 'react'
import api from '../axios'
import { Calendar, Search, FileText, Download } from 'lucide-react'

export default function ReportsPage() {
  // Default to current month
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
  const lastDay = new Date().toISOString().split('T')[0]

  const [startDate, setStartDate] = useState(firstDay)
  const [endDate, setEndDate] = useState(lastDay)
  const [reportData, setReportData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setReportData([])
    
    try {
      // REQUIREMENT 5: Query based on custom durations
      const response = await api.get('/activities/report', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      })
      setReportData(response.data.data)
      setHasSearched(true)
    } catch (error) {
      console.error("Report error:", error)
      alert("Failed to generate report")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Activity Reports</h2>
        <p className="text-gray-500">Generate history logs based on custom date ranges.</p>
      </div>

      {/* Filter Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="w-full md:w-auto">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Search size={18} />
              {isLoading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Table */}
      {hasSearched && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Results ({reportData.length})</h3>
            <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              <Download size={16} /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                <tr>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Staff Member</th>
                  <th className="px-6 py-3">Activity</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reportData.length > 0 ? (
                  reportData.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 text-gray-500">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {entry.user.name}
                      </td>
                      <td className="px-6 py-3 text-gray-800">
                        {entry.task.title}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          entry.status === 'done' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {entry.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-600 max-w-xs truncate" title={entry.remark}>
                        {entry.remark}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <FileText size={32} className="text-gray-300" />
                        <p>No records found for this date range.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}