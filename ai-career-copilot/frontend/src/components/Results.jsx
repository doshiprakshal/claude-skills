import React, { useState } from 'react'

function ScoreRing({ score }) {
  const color = score >= 75 ? 'text-green-600' : score >= 50 ? 'text-yellow-500' : 'text-red-500'
  const bg = score >= 75 ? 'bg-green-50' : score >= 50 ? 'bg-yellow-50' : 'bg-red-50'
  const label = score >= 75 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Weak Match'
  return (
    <div className={`${bg} rounded-2xl p-8 flex flex-col items-center justify-center`}>
      <div className={`text-7xl font-black ${color}`}>{score}</div>
      <div className="text-slate-500 text-sm mt-1">/ 100</div>
      <div className={`${color} font-semibold mt-2`}>{label}</div>
      <div className="text-slate-500 text-xs mt-1">ATS Score</div>
    </div>
  )
}

function BarStat({ label, value }) {
  const color = value >= 75 ? 'bg-green-500' : value >= 50 ? 'bg-yellow-400' : 'bg-red-400'
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-600 capitalize">{label.replace(/_/g, ' ')}</span>
        <span className="font-medium text-slate-800">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function Results({ data, onGoToProfile }) {
  const [copiedCover, setCopiedCover] = useState(false)

  const copyCoverLetter = () => {
    navigator.clipboard.writeText(data.cover_letter)
    setCopiedCover(true)
    setTimeout(() => setCopiedCover(false), 2000)
  }

  const fmt = (n) => n?.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) ?? '—'

  return (
    <div className="space-y-6">
      {/* Post free-trial nudge */}
      {data.used_free_trial && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl px-6 py-5 flex items-start gap-4">
          <span className="text-3xl">🎉</span>
          <div className="flex-1">
            <p className="font-semibold text-amber-900">You just used your free analysis!</p>
            <p className="text-amber-700 text-sm mt-1">
              To run more analyses, add your own Anthropic API key — it takes 30 seconds and costs pennies per analysis.
            </p>
            <button
              onClick={onGoToProfile}
              className="mt-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              Add my API key →
            </button>
          </div>
        </div>
      )}

      {/* ATS Score + Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreRing score={data.ats_score} />
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Score Breakdown</h3>
          {Object.entries(data.ats_breakdown).map(([k, v]) => (
            <BarStat key={k} label={k} value={v} />
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Missing Skills & Keywords</h3>
        {data.missing_skills.length === 0 ? (
          <p className="text-green-600 text-sm">Great — no major gaps found!</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.missing_skills.map((s, i) => (
              <span key={i} className="bg-orange-50 border border-orange-200 text-orange-700 text-sm px-3 py-1 rounded-full">
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Salary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Salary Estimate</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[['Low', data.salary_estimate.range_low], ['Mid', data.salary_estimate.range_mid], ['High', data.salary_estimate.range_high]].map(([label, val]) => (
            <div key={label} className="text-center bg-slate-50 rounded-xl py-4">
              <div className="text-xs text-slate-500 mb-1">{label}</div>
              <div className="text-xl font-bold text-slate-800">{fmt(val)}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-600 bg-blue-50 rounded-lg px-4 py-3">
          <span className="font-medium text-blue-700">Live data: </span>
          {data.salary_estimate.live_data_summary}
        </p>
        {data.salary_estimate.basis && (
          <p className="text-xs text-slate-400 mt-2">{data.salary_estimate.basis}</p>
        )}
      </div>

      {/* Interview Questions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Interview Preparation</h3>
        <div className="space-y-4">
          {data.interview_questions.map((q, i) => (
            <div key={i} className="border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  q.category === 'Technical' ? 'bg-purple-100 text-purple-700'
                  : q.category === 'Behavioral' ? 'bg-blue-100 text-blue-700'
                  : 'bg-teal-100 text-teal-700'
                }`}>{q.category}</span>
              </div>
              <p className="text-slate-800 font-medium text-sm mb-2">{q.question}</p>
              <p className="text-slate-500 text-xs"><span className="font-medium text-slate-600">Tip: </span>{q.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cover Letter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Cover Letter</h3>
          <button
            onClick={copyCoverLetter}
            className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-1.5 rounded-lg transition-colors"
          >
            {copiedCover ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
        <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-700 whitespace-pre-line leading-relaxed font-serif">
          {data.cover_letter}
        </div>
      </div>
    </div>
  )
}
