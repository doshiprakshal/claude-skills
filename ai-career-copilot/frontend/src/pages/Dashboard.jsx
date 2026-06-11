import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'
import api from '../api'

export default function Dashboard() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()
  const [resume, setResume] = useState('')
  const [savedResume, setSavedResume] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setResume(data.resume || '')
      setSavedResume(data.resume || '')
    }).finally(() => setLoading(false))
  }, [])

  const saveResume = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      await api.put('/profile/resume', { resume })
      setSavedResume(resume)
      setSaveMsg('Resume saved!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch {
      setSaveMsg('Failed to save. Try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500">Loading…</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-blue-700">Career Copilot</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{email}</span>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600 transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">My Resume</h2>
          <p className="text-slate-500 text-sm">
            Save your resume once — then just paste job descriptions to get instant analysis.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Resume Text
            {savedResume && <span className="ml-2 text-xs text-green-600 font-normal">✓ Saved</span>}
          </label>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            rows={16}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste your full resume text here…&#10;&#10;Include your work experience, skills, education, and any other relevant sections."
          />
          <div className="flex items-center justify-between mt-3">
            {saveMsg
              ? <span className={`text-sm ${saveMsg.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{saveMsg}</span>
              : <span className="text-xs text-slate-400">{resume.length} characters</span>
            }
            <button
              onClick={saveResume} disabled={saving || resume === savedResume}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-5 py-2 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Resume'}
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          disabled={!savedResume}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-4 text-lg transition-all shadow-lg"
        >
          {savedResume ? 'Analyze a Job Description →' : 'Save your resume first to analyze jobs'}
        </button>
      </main>
    </div>
  )
}
