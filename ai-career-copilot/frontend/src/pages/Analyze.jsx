import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../api'
import Results from '../components/Results'

export default function Analyze() {
  const { logout, email } = useAuth()
  const navigate = useNavigate()
  const [jd, setJd] = useState('')
  const [resume, setResume] = useState('')
  const [showResumeOverride, setShowResumeOverride] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const analyze = async () => {
    if (!jd.trim()) { setError('Please paste a job description.'); return }
    setError('')
    setLoading(true)
    setResult(null)
    try {
      const payload = { job_description: jd }
      if (resume.trim()) payload.resume = resume
      const { data } = await api.post('/analyze', payload)
      setResult(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      if (err.response?.status === 402) {
        setError('Free trial used! Please add your Anthropic API key on the Dashboard to continue.')
      } else {
        setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-700 transition-colors text-sm">
            ← Dashboard
          </button>
          <span className="text-xl font-bold text-blue-700">Career Copilot</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{email}</span>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600 transition-colors">Sign out</button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {result ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Analysis Results</h2>
              <button
                onClick={() => setResult(null)}
                className="text-sm text-blue-600 hover:underline"
              >
                ← Analyze another job
              </button>
            </div>
            <Results data={result} onGoToProfile={() => navigate('/')} />
          </>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Analyze a Job</h2>
              <p className="text-slate-500 text-sm">Paste the job description below. We'll use your saved resume automatically.</p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">{error}</div>}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Description *</label>
              <textarea
                value={jd} onChange={e => setJd(e.target.value)}
                rows={12}
                className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Paste the full job description here…"
              />
            </div>

            <div className="mb-5">
              <button
                onClick={() => setShowResumeOverride(!showResumeOverride)}
                className="text-sm text-blue-600 hover:underline"
              >
                {showResumeOverride ? '▲ Hide' : '▼ Use a different resume for this analysis'}
              </button>
              {showResumeOverride && (
                <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 mt-3">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Override Resume (optional)</label>
                  <textarea
                    value={resume} onChange={e => setResume(e.target.value)}
                    rows={10}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Paste alternate resume text here (will also update your saved resume)…"
                  />
                </div>
              )}
            </div>

            <button
              onClick={analyze} disabled={loading || !jd.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-4 text-lg transition-all shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analyzing with Claude AI…
                </span>
              ) : 'Analyze Job →'}
            </button>
          </>
        )}
      </main>
    </div>
  )
}
