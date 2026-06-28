---
name: interview-mcq
description: Generate an interactive MCQ quiz for DevOps/cloud interview prep and open it in the browser. No backend or frontend required — Claude generates the questions and writes a self-contained HTML file. Triggers on /interview-mcq, "make me a quiz on kubernetes", "practice MCQs for docker", "generate devops questions", "quiz me on AWS".
user-invocable: true
---

# Interview MCQ Quiz Generator

Generate DevOps/cloud multiple-choice questions and deliver them as a self-contained HTML quiz that opens directly in the browser.

## Steps

### 1. Collect inputs

If the skill was invoked with args, parse them (e.g. `/interview-mcq kubernetes 15` → category=Kubernetes, n=15). Otherwise ask:

- **Category** (required) — one of:
  `Kubernetes`, `Docker`, `AWS`, `GCP`, `Azure`, `Terraform`, `Prometheus & Grafana`, `Linux`, `Nginx`, `CI/CD`, `Helm`, `Istio`, `Ansible`, `Elasticsearch`, `PostgreSQL`
- **Number of questions** (optional, default 10, max 20)
- **Specific topic within the category** (optional — e.g. "Pod scheduling", "IAM roles", "Helm hooks")

### 2. Generate questions

Using your own knowledge, produce exactly N multiple-choice questions for the chosen category (and topic if given).

Quality rules:
- Each question must have exactly 4 options (A–D), one correct answer, and a 1–2 sentence explanation of why the correct answer is right and the others are wrong.
- Mix difficulty: roughly 30% beginner, 50% intermediate, 20% advanced.
- Questions must be specific and practical — no trivia. A real SRE/DevOps engineer should recognize why the answer matters.
- Never repeat the same concept twice.
- Avoid questions whose answer is obvious from the phrasing.

Format each question as a JSON object:
```json
{
  "q": "What does the Kubernetes Horizontal Pod Autoscaler use by default to make scaling decisions?",
  "opts": ["CPU utilization", "Memory usage", "Custom metrics", "Pod restart count"],
  "ans": 0,
  "exp": "By default, HPA scales based on CPU utilization (target average utilization across pods). Memory and custom metrics require additional configuration with metrics-server or custom/external metric adapters."
}
```

`ans` is the 0-based index of the correct option in `opts`.

### 3. Write the HTML file

Write a single self-contained HTML file to `/tmp/interview-mcq-{slug}.html` where `{slug}` is the category lowercased with spaces replaced by hyphens (e.g. `kubernetes`, `prometheus-grafana`).

The file must contain all CSS and JS inline — no CDN, no external fonts, no fetch calls. Use system font stack.

**Use this exact structure** (fill in the generated questions JSON and the category name):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>MCQ Quiz — {CATEGORY}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0f172a;color:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:2rem 1rem}
#app{width:100%;max-width:720px}
h1{font-size:1.25rem;font-weight:700;color:#818cf8;letter-spacing:.02em;margin-bottom:.25rem}
#subtitle{font-size:.8rem;color:#64748b;margin-bottom:1.5rem}
#progress-wrap{background:#1e293b;border-radius:9999px;height:6px;margin-bottom:1.75rem;overflow:hidden}
#progress-bar{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);border-radius:9999px;transition:width .35s ease}
#q-counter{font-size:.75rem;color:#64748b;text-align:right;margin-top:.4rem;margin-bottom:1.25rem}
#question-card{background:#1e293b;border:1px solid #334155;border-radius:1rem;padding:1.75rem;margin-bottom:1.25rem}
#question-text{font-size:1.05rem;line-height:1.65;color:#e2e8f0}
#options{display:grid;gap:.6rem;margin-bottom:1rem}
.opt{display:flex;align-items:center;gap:.85rem;background:#0f172a;border:1.5px solid #334155;border-radius:.65rem;padding:.85rem 1rem;cursor:pointer;font-size:.9rem;color:#cbd5e1;transition:border-color .15s,background .15s;text-align:left}
.opt:hover:not([disabled]){border-color:#6366f1;background:#1e1b4b}
.opt .badge{flex-shrink:0;width:28px;height:28px;border-radius:6px;background:#1e293b;border:1.5px solid #475569;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:#94a3b8;transition:all .15s}
.opt.correct{border-color:#22c55e;background:#052e16}
.opt.correct .badge{background:#166534;border-color:#22c55e;color:#86efac}
.opt.wrong{border-color:#ef4444;background:#2d0d0d}
.opt.wrong .badge{background:#7f1d1d;border-color:#ef4444;color:#fca5a5}
.opt.dimmed{opacity:.4}
#explanation{display:none;background:#1e1b4b;border:1px solid #4338ca;border-radius:.65rem;padding:1rem 1.1rem;font-size:.85rem;color:#c7d2fe;line-height:1.6;margin-bottom:1rem}
#explanation.show{display:block}
#explanation strong{color:#a5b4fc}
#next-btn,#retry-btn{display:none;width:100%;padding:.85rem;background:#4f46e5;color:#fff;border:none;border-radius:.65rem;font-size:.95rem;font-weight:600;cursor:pointer;transition:background .15s}
#next-btn:hover,#retry-btn:hover{background:#4338ca}
#next-btn.show,#retry-btn.show{display:block}
#shortcuts{font-size:.72rem;color:#475569;text-align:center;margin-top:.5rem}
#results{display:none;text-align:center;padding:2.5rem 1rem}
#results.show{display:block}
#score-ring{width:120px;height:120px;margin:0 auto 1.25rem}
#score-ring circle{fill:none;stroke-width:10}
#score-track{stroke:#1e293b}
#score-fill{stroke:#6366f1;stroke-linecap:round;transform-origin:center;transform:rotate(-90deg);transition:stroke-dashoffset .6s ease}
#score-label{font-size:1.8rem;font-weight:800;color:#f1f5f9;margin-bottom:.25rem}
#score-sub{font-size:.85rem;color:#64748b;margin-bottom:2rem}
#results h2{font-size:1.4rem;font-weight:700;margin-bottom:.5rem}
.grade{display:inline-block;font-size:2rem;margin-bottom:.5rem}
</style>
</head>
<body>
<div id="app">
  <h1>MCQ Quiz — {CATEGORY}</h1>
  <div id="subtitle">{N} questions · DevOps Interview Prep</div>
  <div id="progress-wrap"><div id="progress-bar" style="width:0%"></div></div>
  <div id="q-counter"></div>
  <div id="question-card">
    <p id="question-text"></p>
  </div>
  <div id="options"></div>
  <div id="explanation"><strong>Explanation:</strong> <span id="exp-text"></span></div>
  <button id="next-btn">Next Question →</button>
  <div id="shortcuts">Keyboard: <kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd> · <kbd>Enter</kbd> to advance</div>
  <div id="results">
    <svg id="score-ring" viewBox="0 0 120 120">
      <circle id="score-track" cx="60" cy="60" r="52"/>
      <circle id="score-fill" cx="60" cy="60" r="52" stroke-dasharray="326.7" stroke-dashoffset="326.7"/>
    </svg>
    <div id="score-label"></div>
    <div id="score-sub"></div>
    <div class="grade" id="grade-emoji"></div>
    <h2 id="results-heading"></h2>
    <p id="results-sub" style="color:#64748b;font-size:.85rem;margin-bottom:1.5rem"></p>
    <button id="retry-btn" class="show">Try Again</button>
  </div>
</div>
<script>
const QUESTIONS = {QUESTIONS_JSON};
let idx=0,score=0,answered=false;
const LABELS=['A','B','C','D'];
const $ = id => document.getElementById(id);

function render(){
  const q=QUESTIONS[idx];
  answered=false;
  $('progress-bar').style.width=`${(idx/QUESTIONS.length)*100}%`;
  $('q-counter').textContent=`Question ${idx+1} of ${QUESTIONS.length}`;
  $('question-text').textContent=q.q;
  $('options').innerHTML=q.opts.map((o,i)=>`
    <button class="opt" data-i="${i}" onclick="pick(${i})">
      <span class="badge">${LABELS[i]}</span>${o}
    </button>`).join('');
  $('explanation').className='';
  $('exp-text').textContent='';
  $('next-btn').className='';
}

function pick(i){
  if(answered)return;
  answered=true;
  const q=QUESTIONS[idx];
  const opts=document.querySelectorAll('.opt');
  opts.forEach(o=>o.setAttribute('disabled',''));
  opts[q.ans].classList.add('correct');
  if(i!==q.ans)opts[i].classList.add('wrong');
  opts.forEach((o,j)=>{if(j!==q.ans&&j!==i)o.classList.add('dimmed');});
  if(i===q.ans)score++;
  $('exp-text').textContent=q.exp;
  $('explanation').className='show';
  if(idx<QUESTIONS.length-1){$('next-btn').className='show';}
  else{setTimeout(showResults,600);}
}

function showResults(){
  $('question-card').style.display='none';
  $('options').style.display='none';
  $('explanation').style.display='none';
  $('next-btn').style.display='none';
  $('q-counter').style.display='none';
  $('shortcuts').style.display='none';
  const pct=Math.round((score/QUESTIONS.length)*100);
  $('score-label').textContent=`${score}/${QUESTIONS.length}`;
  $('score-sub').textContent=`${pct}% correct`;
  const circ=326.7,offset=circ*(1-pct/100);
  setTimeout(()=>$('score-fill').style.strokeDashoffset=offset,50);
  const g=pct>=90?'🏆':pct>=75?'🎯':pct>=60?'📚':'💪';
  const h=pct>=90?'Excellent!':pct>=75?'Good job!':pct>=60?'Keep practicing':'More study needed';
  $('grade-emoji').textContent=g;
  $('results-heading').textContent=h;
  $('results-sub').textContent=pct>=75?'You\'re ready for DevOps interviews.':'Review the explanations and try again.';
  $('progress-bar').style.width='100%';
  $('results').className='show';
}

$('next-btn').onclick=()=>{idx++;render();};
$('retry-btn').onclick=()=>{
  idx=0;score=0;
  $('results').className='';
  ['question-card','options','q-counter','shortcuts'].forEach(id=>$('question-card').style.display!=='none'||($( id).style.display=''));
  $('question-card').style.display='';
  $('options').style.display='';
  $('q-counter').style.display='';
  $('shortcuts').style.display='';
  render();
};
document.addEventListener('keydown',e=>{
  const map={a:0,b:1,c:2,d:3,'1':0,'2':1,'3':2,'4':3};
  if(!answered&&e.key.toLowerCase() in map){pick(map[e.key.toLowerCase()]);}
  else if(answered&&e.key==='Enter'){
    if(idx<QUESTIONS.length-1){idx++;render();}
  }
});
render();
</script>
</body>
</html>
```

Replace `{CATEGORY}` with the display name (e.g. `Kubernetes`), `{N}` with the number of questions, and `{QUESTIONS_JSON}` with the JSON array of question objects.

### 4. Open the file

Run:
```bash
open /tmp/interview-mcq-{slug}.html
```

On Linux use `xdg-open` instead of `open`. On Windows use `start`.

### 5. Report to the user

Tell the user:
- The quiz is open in their browser
- How many questions, which category/topic
- Keyboard shortcuts: A/B/C/D or 1/2/3/4 to answer, Enter to advance

## Notes

- Do not call any external API to generate questions — use your own knowledge.
- Always write the full HTML to the file in one Write tool call.
- The HTML file is self-contained: no CDN links, no external images, no fetch calls.
- If the user asks for a different use case (labs, flashcards, etc.) after seeing the quiz, note that those are separate skills coming soon.
