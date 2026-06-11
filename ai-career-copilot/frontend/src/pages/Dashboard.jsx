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

  const [apiKey, setApiKey] = useState('')
  const [hasApiKey, setHasApiKey] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [savingKey, setSavingKey] = useState(false)
  const [keyMsg, setKeyMsg] = useState('')

  const [analysesCount, setAnalysesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setResume(data.resume || '')
      setSavedResume(data.resume || '')
      setHasApiKey(data.has_api_key || false)
      setAnalysesCount(data.analyses_count || 0)
    }).finally(() => setLoading(false))
  }, [])

  const saveResume = async () => {
    setSaving(true); setSaveMsg('')
    try {
      await api.put('/profile/resume', { resume })
      setSavedResume(resume)
      setSaveMsg('Resume saved!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch { setSaveMsg('Failed to save. Try again.') }
    finally { setSaving(false) }
  }

  const saveApiKey = async () => {
    setSavingKey(true); setKeyMsg('')
    try {
      await api.put('/profile/apikey', { anthropic_key: apiKey })
      setHasApiKey(true)
      setApiKey('')
      setKeyMsg('API key saved!')
      setShowApiKey(false)
      setTimeout(() => setKeyMsg(''), 3000)
    } catch (err) {
      setKeyMsg(err.response?.data?.detail || 'Failed to save key.')
    } finally { setSavingKey(false) }
  }

  const removeApiKey = async () => {
    try {
      await api.delete('/profile/apikey')
      setHasApiKey(false)
      setKeyMsg('API key removed.')
      setTimeout(() => setKeyMsg(''), 3000)
    } catch { setKeyMsg('Failed to remove key.') }
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-slate-500">Loading…</div>
    </div>
  )

  const needsKey = analysesCount >= 1 && !hasApiKey

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-blue-700">Career Copilot</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">{email}</span>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-600 transition-colors">Sign out</button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">

        {/* Free trial banner */}
        {analysesCount === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="font-semibold text-blue-800">Your first analysis is on us!</p>
              <p className="text-blue-600 text-sm mt-0.5">
                We'll use our API key for your first job analysis — free. After that, add your own{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="underline">Anthropic API key</a> to continue.
              </p>
            </div>
          </div>
        )}

        {/* Used free trial — needs key */}
        {needsKey && (
          <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-800">Free trial used — add your API key to continue</p>
              <p className="text-amber-700 text-sm mt-0.5">
                Get a free key at{' '}
                <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" className="underline">console.anthropic.com</a>{' '}
                and paste it below.
              </p>
            </div>
          </div>
        )}

        {/* Anthropic API Key */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-slate-800">Anthropic API Key</h3>
              <p className="text-xs text-slate-500 mt-0.5">Required after your free first analysis</p>
            </div>
            {hasApiKey ? (
              <span className="text-xs bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full">✓ Saved</span>
            ) : (
              <span className="text-xs bg-slate-100 text-slate-500 font-medium px-3 py-1 rounded-full">Not set</span>
            )}
          </div>

          {keyMsg && (
            <p className={`text-sm mb-3 ${keyMsg.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{keyMsg}</p>
          )}

          {hasApiKey ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500 font-mono">sk-ant-••••••••••••••••</span>
              <button onClick={removeApiKey} className="text-xs text-red-500 hover:underline">Remove</button>
              <button onClick={() => setShowApiKey(!showApiKey)} className="text-xs text-blue-500 hover:underline">Replace</button>
            </div>
          ) : (
            <button onClick={() => setShowApiKey(!showApiKey)} className="text-sm text-blue-600 hover:underline">
              {showApiKey ? '▲ Hide' : '▼ Add API key'}
            </button>
          )}

          {showApiKey && (
            <div className="mt-3 flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={saveApiKey}
                disabled={savingKey || !apiKey.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
              >
                {savingKey ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {/* Resume */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="mb-3">
            <h3 className="font-semibold text-slate-800">
              My Resume
              {savedResume && <span className="ml-2 text-xs text-green-600 font-normal">✓ Saved</span>}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Save once — reuse across every job analysis</p>
          </div>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            rows={16}
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Paste your full resume text here…"
          />
          <div className="flex items-center justify-between mt-3">
            {saveMsg
              ? <span className={`text-sm ${saveMsg.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{saveMsg}</span>
              : <span className="text-xs text-slate-400">{resume.length} characters</span>
            }
            <button
              onClick={saveResume}
              disabled={saving || resume === savedResume}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-5 py-2 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Resume'}
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          disabled={!savedResume || (analysesCount >= 1 && !hasApiKey)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-4 text-lg transition-all shadow-lg"
        >
          {!savedResume
            ? 'Save your resume first'
            : needsKey
            ? 'Add your API key above to continue'
            : 'Analyze a Job Description →'}
        </button>

        {analysesCount > 0 && (
          <p className="text-center text-xs text-slate-400">{analysesCount} total {analysesCount === 1 ? 'analysis' : 'analyses'} run</p>
        )}
      </main>
    </div>
  )
}
