import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import { 
  DatabaseIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  CalendarIcon, 
  TimerIcon, 
  TrendingUpIcon,
  DownloadIcon,
  CopyIcon,
  EyeIcon,
  SearchIcon,
  LightningIcon
} from '../components/icons.jsx'

const DUMMY_QUERIES = [
  { 
    id: 48, 
    question: "Show top 5 customers by revenue", 
    sql: "SELECT name, SUM(amount)...", 
    time: "2m ago", 
    rows: 5, 
    status: "success" 
  }, 
  { 
    id: 47, 
    question: "Find average order value per region", 
    sql: "SELECT region, AVG...", 
    time: "15m ago", 
    rows: 12, 
    status: "success" 
  }, 
  { 
    id: 46, 
    question: "List products with low stock", 
    sql: "SELECT * FROM...", 
    time: "1h ago", 
    rows: 0, 
    status: "failed" 
  }, 
  { 
    id: 45, 
    question: "Who is the top sales rep today", 
    sql: "SELECT rep_name FROM...", 
    time: "3h ago", 
    rows: 1, 
    status: "success" 
  }, 
  { 
    id: 44, 
    question: "Monthly growth of user signups", 
    sql: "SELECT DATE_TRUNC...", 
    time: "5h ago", 
    rows: 12, 
    status: "success" 
  }, 
  { 
    id: 43, 
    question: "Total refund amount by reason", 
    sql: "SELECT reason, SUM...", 
    time: "Yesterday", 
    rows: 8, 
    status: "success" 
  }, 
  { 
    id: 42, 
    question: "Are there any duplicate transactions", 
    sql: "SELECT tx_id, COUNT...", 
    time: "Yesterday", 
    rows: 0, 
    status: "success" 
  }, 
  { 
    id: 41, 
    question: "Get list of active subscriptions", 
    sql: "SELECT email FROM...", 
    time: "Yesterday", 
    rows: 142, 
    status: "success" 
  } 
]

export default function History() {
  const [queries] = useState(DUMMY_QUERIES)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [copyId, setCopyId] = useState(null)

  const filteredQueries = queries.filter(q => {
    const matchesFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'successful' && q.status === 'success') || 
      (activeFilter === 'failed' && q.status === 'failed')
      
    const matchesSearch = 
      q.question.toLowerCase().includes(searchText.toLowerCase())
      
    return matchesFilter && matchesSearch
  })

  const handleCopy = (id, sql) => {
    navigator.clipboard.writeText(sql)
    setCopyId(id)
    setTimeout(() => setCopyId(null), 2000)
  }

  const handleView = (q) => {
    alert(`Question: ${q.question}\n\nSQL: ${q.sql}`)
  }

  return (
    <DashboardLayout 
      title="Query History"
      rightAction={
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
          <input 
            type="text"
            placeholder="Search queries..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-[280px] pl-10 pr-4 py-2 rounded-lg border border-[#e2e8f0] bg-white text-sm outline-none focus:border-[#2563EB] transition-colors"
          />
        </div>
      }
    >
      <div className="max-w-6xl mx-auto">
        {/* STATS ROW */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 relative shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-[#64748b]">Total Queries</span>
              <div className="bg-[#EFF6FF] p-2 rounded-lg">
                <DatabaseIcon className="h-5 w-5 text-[#2563EB]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2563EB] mb-2">48</div>
            <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
              <ClockIcon className="h-3.5 w-3.5" />
              All time records
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 relative shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-[#64748b]">Successful</span>
              <div className="bg-[#F0FDF4] p-2 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-[#22c55e]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#2563EB] mb-2">45</div>
            <div className="flex items-center gap-1.5 text-xs text-[#22c55e]">
              <TrendingUpIcon className="h-3.5 w-3.5" />
              93.7% success rate
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 relative shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-[#64748b]">This Week</span>
              <div className="bg-[#F5F3FF] p-2 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-[#7c3aed]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#7c3aed] mb-2">12</div>
            <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
              <CalendarIcon className="h-3.5 w-3.5" />
              queries this week
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 relative shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-[#64748b]">Avg Response</span>
              <div className="bg-[#FFF7ED] p-2 rounded-lg">
                <TimerIcon className="h-5 w-5 text-[#ea580c]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#ea580c] mb-2">1.2s</div>
            <div className="flex items-center gap-1.5 text-xs text-[#94a3b8]">
              <LightningIcon className="h-3.5 w-3.5" />
              per query execution
            </div>
          </div>
        </div>

        {/* FILTER ROW */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex bg-white border border-[#e2e8f0] rounded-full p-1">
            {['all', 'successful', 'failed'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  activeFilter === f 
                    ? 'bg-[#2563EB] text-white shadow-sm' 
                    : 'text-[#64748b] hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none border border-[#e2e8f0] rounded-lg px-3 py-2 pr-10 text-sm text-[#475569] bg-white outline-none focus:border-[#2563EB] transition-colors">
                <option>Today</option>
                <option selected>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>All time</option>
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748b] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <button className="flex items-center gap-2 border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#475569] bg-white hover:bg-slate-50 transition-colors">
              <DownloadIcon className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        {/* HISTORY TABLE */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b] w-12">#</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">Question</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">Generated SQL</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">Time</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b] text-center">Rows</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueries.map((q) => (
                  <tr key={q.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 py-3.5 text-sm text-[#94a3b8] font-mono">{q.id}</td>
                    <td className="px-4 py-3.5 text-sm text-[#0f172a] font-medium max-w-[200px] truncate" title={q.question}>
                      {q.question}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-[11px] text-[#64748b] bg-[#f8fafc] px-2 py-1 rounded max-w-[160px] truncate block">
                        {q.sql}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#94a3b8] whitespace-nowrap">{q.time}</td>
                    <td className="px-4 py-3.5 text-sm text-[#0f172a] text-center">{q.rows}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        q.status === 'success' 
                          ? 'bg-[#DCFCE7] text-[#16a34a]' 
                          : 'bg-[#FEE2E2] text-[#dc2626]'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleView(q)}
                          className="text-[#94a3b8] hover:text-[#2563EB] transition-colors"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {q.status === 'success' && (
                          <button 
                            onClick={() => handleCopy(q.id, q.sql)}
                            className={`${copyId === q.id ? 'text-[#22c55e]' : 'text-[#94a3b8] hover:text-[#2563EB]'} transition-colors`}
                          >
                            {copyId === q.id ? <CheckCircleIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4 border-top border-[#f1f5f9]">
            <div className="text-sm text-[#64748b]">
              Showing <span className="font-bold">1-8</span> of <span className="font-bold">48</span> queries
            </div>
            
            <div className="flex items-center gap-1">
              <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] text-[#475569] opacity-40 cursor-not-allowed">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {[1, 2, 3, '...', 6].map((p, i) => (
                <button 
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center text-sm rounded-lg border transition-colors ${
                    p === 1 
                      ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                      : 'bg-white text-[#475569] border-[#e2e8f0] hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e2e8f0] text-[#475569] hover:bg-slate-50 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
