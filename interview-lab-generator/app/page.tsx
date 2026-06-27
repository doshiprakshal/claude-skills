"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Terminal,
  FlaskConical,
  Bug,
  Wrench,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  BookOpen,
} from "lucide-react";

const CATEGORIES = [
  "Kubernetes",
  "Docker",
  "AWS",
  "GCP",
  "Azure",
  "Terraform",
  "Prometheus & Grafana",
  "Linux",
  "Nginx",
  "CI/CD",
  "Helm",
  "Istio / Service Mesh",
  "Ansible",
  "Elasticsearch",
  "PostgreSQL",
];

interface LabStep {
  step: number;
  title: string;
  description: string;
  command?: string;
}

interface Config {
  filename: string;
  language: string;
  description: string;
  content: string;
}

interface DebugStep {
  step: number;
  action: string;
  command?: string;
  expectedOutput: string;
  finding: string;
}

interface Lab {
  title: string;
  difficulty: string;
  duration: string;
  objective: string;
  miniLab: {
    overview: string;
    prerequisites: string[];
    steps: LabStep[];
  };
  configs: Config[];
  brokenSetup: {
    description: string;
    configs: Config[];
    symptoms: string[];
  };
  debugging: {
    approach: string;
    steps: DebugStep[];
    rootCause: string;
    fix: string;
    fixedConfig: string;
  };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded hover:bg-white/10 transition-colors"
      title="Copy"
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <Copy className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
}

function CodeBlock({
  code,
  language,
  filename,
}: {
  code: string;
  language: string;
  filename?: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-700">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="text-xs text-gray-400 font-mono">{filename}</span>
          <CopyButton text={code} />
        </div>
      )}
      <SyntaxHighlighter
        language={language || "bash"}
        style={oneDark}
        customStyle={{ margin: 0, borderRadius: 0, fontSize: "0.8rem" }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
  defaultOpen = true,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 ${color} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-3 font-semibold text-white">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-white/70" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/70" />
        )}
      </button>
      {open && <div className="p-5 bg-gray-900 space-y-4">{children}</div>}
    </div>
  );
}

export default function Home() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lab, setLab] = useState<Lab | null>(null);

  const generate = async () => {
    setError("");
    setLoading(true);
    setLab(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, topic: topic || category }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setLab(data.lab);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (d: string) => {
    if (d === "Beginner") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (d === "Advanced") return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-indigo-400" />
            <span className="font-bold text-lg">Interview → Lab</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Generator form */}
        <div className="rounded-xl border border-gray-700 bg-gray-900 p-6 space-y-4">
          <h1 className="text-xl font-bold">Generate a Practice Lab</h1>
          <p className="text-sm text-gray-400">
            Pick a technology category and optionally specify a topic. Get a
            full hands-on lab with configs, a broken setup, and debugging steps.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                Specific Topic{" "}
                <span className="text-gray-600 normal-case">(optional)</span>
              </label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Pod OOMKilled, IAM roles, HPA"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating lab...
              </>
            ) : (
              <>
                <FlaskConical className="w-5 h-5" />
                Generate Lab
              </>
            )}
          </button>
        </div>

        {/* Lab output */}
        {lab && (
          <div className="space-y-4">
            {/* Lab header */}
            <div className="rounded-xl border border-gray-700 bg-gray-900 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">{lab.title}</h2>
                  <p className="text-gray-400 mt-1">{lab.objective}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-medium ${difficultyColor(lab.difficulty)}`}
                  >
                    {lab.difficulty}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full border border-gray-600 text-gray-400">
                    ⏱ {lab.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Mini Lab */}
            <Section
              icon={<BookOpen className="w-5 h-5" />}
              title="Mini Lab"
              color="bg-indigo-600"
            >
              <p className="text-gray-300">{lab.miniLab.overview}</p>

              {lab.miniLab.prerequisites.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-2">
                    Prerequisites
                  </p>
                  <ul className="space-y-1">
                    {lab.miniLab.prerequisites.map((p, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-300">
                        <span className="text-indigo-400">•</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3">
                {lab.miniLab.steps.map((s) => (
                  <div
                    key={s.step}
                    className="rounded-lg border border-gray-700 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-800">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {s.step}
                      </span>
                      <span className="font-medium text-sm">{s.title}</span>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      <p className="text-sm text-gray-300">{s.description}</p>
                      {s.command && (
                        <div className="rounded-lg bg-gray-950 border border-gray-700 overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Terminal className="w-3 h-3" /> bash
                            </div>
                            <CopyButton text={s.command} />
                          </div>
                          <pre className="px-3 py-2.5 text-xs text-green-400 font-mono overflow-x-auto">
                            {s.command}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Configs */}
            {lab.configs.length > 0 && (
              <Section
                icon={<Terminal className="w-5 h-5" />}
                title="Config / YAML Files"
                color="bg-cyan-700"
              >
                {lab.configs.map((c, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm text-gray-400">{c.description}</p>
                    <CodeBlock
                      code={c.content}
                      language={c.language}
                      filename={c.filename}
                    />
                  </div>
                ))}
              </Section>
            )}

            {/* Broken Setup */}
            <Section
              icon={<Bug className="w-5 h-5" />}
              title="Broken Setup — Can You Fix It?"
              color="bg-rose-700"
            >
              <p className="text-gray-300">{lab.brokenSetup.description}</p>

              <div>
                <p className="text-sm font-semibold text-rose-400 mb-2">
                  Symptoms
                </p>
                <ul className="space-y-1">
                  {lab.brokenSetup.symptoms.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-rose-400">⚠</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {lab.brokenSetup.configs.map((c, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm text-gray-400">{c.description}</p>
                  <CodeBlock
                    code={c.content}
                    language={c.language}
                    filename={c.filename}
                  />
                </div>
              ))}
            </Section>

            {/* Debugging */}
            <Section
              icon={<Wrench className="w-5 h-5" />}
              title="Expected Debugging"
              color="bg-amber-700"
              defaultOpen={false}
            >
              <p className="text-gray-300">{lab.debugging.approach}</p>

              <div className="space-y-3">
                {lab.debugging.steps.map((s) => (
                  <div
                    key={s.step}
                    className="rounded-lg border border-gray-700 overflow-hidden"
                  >
                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-800">
                      <span className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {s.step}
                      </span>
                      <span className="font-medium text-sm">{s.action}</span>
                    </div>
                    <div className="px-4 py-3 space-y-2">
                      {s.command && (
                        <div className="rounded-lg bg-gray-950 border border-gray-700 overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Terminal className="w-3 h-3" /> bash
                            </div>
                            <CopyButton text={s.command} />
                          </div>
                          <pre className="px-3 py-2.5 text-xs text-green-400 font-mono overflow-x-auto">
                            {s.command}
                          </pre>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        Expected:{" "}
                        <span className="text-gray-300">{s.expectedOutput}</span>
                      </p>
                      <p className="text-xs text-amber-400">→ {s.finding}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-gray-800 border border-gray-700 p-4 space-y-2">
                <p className="text-sm font-semibold text-rose-400">Root Cause</p>
                <p className="text-sm text-gray-300">{lab.debugging.rootCause}</p>
              </div>

              <div className="rounded-lg bg-gray-800 border border-gray-700 p-4 space-y-2">
                <p className="text-sm font-semibold text-green-400">The Fix</p>
                <p className="text-sm text-gray-300">{lab.debugging.fix}</p>
              </div>

              {lab.debugging.fixedConfig && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Fixed Configuration</p>
                  <CodeBlock
                    code={lab.debugging.fixedConfig}
                    language="yaml"
                    filename="fixed.yaml"
                  />
                </div>
              )}
            </Section>
          </div>
        )}
      </main>
    </div>
  );
}
