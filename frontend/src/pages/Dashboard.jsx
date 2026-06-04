import { useState } from 'react'
import DashboardLayout from '../components/DashboardLayout.jsx'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend
} from 'recharts'

const INITIAL_RECENT_QUERIES = [
  "Show top 10 customers by revenue",
  "Count orders by status",
  "Average fulfillment time",
  "Inventory stock alert threshold",
  "Active subscriptions growth"
]

const CHART_COLORS = [
  '#2563EB', '#7c3aed', '#059669', 
  '#ea580c', '#dc2626', '#0891b2',
  '#65a30d', '#d97706', '#db2777', '#6366f1'
]

export default function Dashboard() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState('Results')
  const [error, setError] = useState('')
  const [recentQueries, setRecentQueries] = useState(INITIAL_RECENT_QUERIES)
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(0)
  const [chartType, setChartType] = useState('bar')

  const getChartData = () => {
    if (!results || !results.rows || results.rows.length === 0) return null
    
    const rows = results.rows
    
    let nameColIndex = -1
    let valueColIndex = -1
    
    if (rows.length > 0) {
      rows[0].forEach((val, idx) => {
        const num = parseFloat(val)
        if (!isNaN(num) && valueColIndex === -1) {
          valueColIndex = idx
        } else if (isNaN(num) && nameColIndex === -1) {
          nameColIndex = idx
        }
      })
    }
    
    if (nameColIndex === -1) nameColIndex = 0
    if (valueColIndex === -1) valueColIndex = 1
    
    return rows.slice(0, 10).map(row => ({
      name: String(row[nameColIndex]).slice(0, 15),
      value: parseFloat(row[valueColIndex]) || 0,
      fullName: String(row[nameColIndex])
    }))
  }

  const handleRunQuery = async () => {
    if (!query.trim()) return
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/query/ask`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ question: query })
        }
      )
      const data = await response.json()
      if (!response.ok) {
        setError(data.detail || 'Query failed')
      } else {
        setResults(data)
        setActiveTab('Results')
        setRecentQueries(prev => {
          const newQueries = [query, ...prev.filter(q => q !== query)]
          return newQueries.slice(0, 5)
        })
        setActiveHistoryIndex(0)
      }
    } catch (err) {
      setError('Network error. Is backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleNewQuery = () => {
    setQuery('')
    setResults(null)
    setError('')
  }

  const handleHistoryClick = (text, index) => {
    setQuery(text)
    setActiveHistoryIndex(index)
  }

  const handleExportCSV = () => {
    if (!results || !results.rows) return

    const csvContent = [
      results.columns.join(','),
      ...results.rows.map(row => 
        row.map(val => {
          const str = String(val === null ? '' : val)
          return str.includes(',') ? `"${str}"` : str
        }).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `query_results_${new Date().getTime()}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <DashboardLayout title="Query Workspace">
      <div className="max-w-6xl mx-auto">
        {/* CARD 1: QUERY INPUT */}
        <div className="mb-4 rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <svg className="h-4 w-4 text-[#2563EB]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
            </svg>
            <span className="text-sm font-medium text-[#0f172a]">Ask anything about your database</span>
          </div>

          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'Enter') {
                handleRunQuery()
              }
            }}
            placeholder="e.g. Show me top 5 customers by total purchase amount this month"
            className="min-h-[100px] w-full resize-none border-none bg-transparent p-3 text-[15px] text-[#0f172a] placeholder-[#94a3b8] focus:ring-0"
          />

          <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4">
            <div className="flex items-center gap-1.5 text-[11px] text-[#64748b]">
              <span className="rounded border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-0.5 font-medium">Ctrl</span>
              <span>+</span>
              <span className="rounded border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-0.5 font-medium">Enter</span>
              <span className="ml-1">to run</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleNewQuery}
                className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-medium text-[#64748b] transition-colors hover:bg-slate-50"
              >
                Clear
              </button>
              <button
                onClick={handleRunQuery}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 22v-20l18 10-18 10z" />
                  </svg>
                )}
                {loading ? 'Running...' : 'Run Query'}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Query Error
            </div>
            {error}
          </div>
        )}

        {results && (
          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              AI Explanation
            </div>
            {results.explanation}
          </div>
        )}

        {/* CARD 2: RESULTS AREA */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2e8f0] px-4">
            <div className="flex">
              {['Results', 'SQL', 'Chart'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm transition-all ${
                    activeTab === tab
                      ? 'border-[#2563EB] font-semibold text-[#2563EB]'
                      : 'border-transparent text-[#64748b] hover:text-[#475569]'
                  }`}
                >
                  {tab === 'Results' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {tab === 'SQL' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  )}
                  {tab === 'Chart' && (
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-[#94a3b8]">{results ? results.row_count : 0} rows</span>
              <button 
                onClick={handleExportCSV}
                disabled={!results}
                className="flex items-center gap-2 rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-xs font-medium text-[#475569] transition-colors hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>

          <div className="min-h-[300px]">
            {activeTab === 'Results' && (
              <>
                {results ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                          {results.columns.map((col, i) => (
                            <th key={i} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#64748b]">{col.replace(/_/g, ' ')}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {results.rows.map((row, i) => (
                          <tr key={i} className="border-b border-[#f1f5f9] transition-colors hover:bg-[#f8fafc]">
                            {row.map((val, j) => (
                              <td key={j} className="px-4 py-3.5 text-sm text-[#0f172a]">{val === null ? 'NULL' : val}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-[#64748b]">
                    <svg className="mb-4 h-12 w-12 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-medium">Run a query to see results</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'SQL' && (
              <div className="p-6">
                <pre className="overflow-x-auto rounded-lg bg-[#0f172a] p-5 font-mono text-sm leading-relaxed text-[#e2e8f0]">
                  <code>{results ? results.sql : '-- Run a query to see generated SQL'}</code>
                </pre>
              </div>
            )}

            {activeTab === 'Chart' && (
              <div className="p-6">
                {!results || !results.rows || results.rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                      📊
                    </div>
                    <p className="text-sm font-medium">Run a query to see the chart</p>
                    <p className="text-xs mt-1">Charts appear automatically after query results</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Data Visualization</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{results.row_count} data points</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChartType('bar')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            chartType === 'bar' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Bar Chart
                        </button>
                        <button
                          onClick={() => setChartType('pie')}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            chartType === 'pie' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Pie Chart
                        </button>
                      </div>
                    </div>

                    <div className="w-full h-[320px]">
                      {chartType === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} angle={-35} textAnchor="end" interval={0} />
                            <YAxis
                              tick={{ fontSize: 12, fill: '#64748b' }}
                              tickFormatter={(val) => {
                                if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M'
                                if (val >= 1000) return (val / 1000).toFixed(1) + 'K'
                                return val
                              }}
                            />
                            <Tooltip
                              contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px' }}
                              formatter={(value) => [Number(value).toLocaleString(), results.columns[1] || 'Value']}
                              labelFormatter={(label) => getChartData()?.find(d => d.name === label)?.fullName || label}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                              {getChartData()?.map((entry, index) => (
                                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={getChartData()}
                              cx="50%"
                              cy="45%"
                              outerRadius={110}
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={true}
                            >
                              {getChartData()?.map((entry, index) => (
                                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '8px', color: 'white', fontSize: '12px' }}
                              formatter={(value) => [Number(value).toLocaleString(), 'Value']}
                            />
                            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6">
                      <div><span className="text-xs text-gray-500">X Axis:</span><span className="text-xs font-medium text-gray-700 ml-1">{results.columns[0]}</span></div>
                      <div><span className="text-xs text-gray-500">Y Axis:</span><span className="text-xs font-medium text-gray-700 ml-1">{results.columns[1]}</span></div>
                      <div><span className="text-xs text-gray-500">Data points:</span><span className="text-xs font-medium text-gray-700 ml-1">{results.row_count}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
