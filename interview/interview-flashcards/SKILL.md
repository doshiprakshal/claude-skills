---
name: interview-flashcards
description: Generate interactive flip-card flashcards for DevOps, SRE, Cloud, Infrastructure, MLOps, and AIOps interview prep and open them in the browser. Tracks "Got it" vs "Still learning" cards with a restart-unseen option. No backend, no npm, no API key required. Triggers on /interview-flashcards, "flashcards for kubernetes", "make me flashcards on AWS", "study cards for SRE", "flip cards for docker".
user-invocable: true
---

# Interview Flashcards Generator

Generate concept flashcards for DevOps/SRE/Cloud/MLOps/AIOps roles, delivered as a self-contained HTML flip-card deck that opens directly in the browser.

## Steps

### 1. Collect inputs

If the skill was invoked with args, parse them (e.g. `/interview-flashcards kubernetes 20` → category=Kubernetes, n=20). Otherwise ask:

- **Category** (required) — one of:

  *DevOps & Infrastructure:*
  `Kubernetes`, `Docker`, `Linux`, `Nginx`, `CI/CD`, `Ansible`, `Terraform`, `Helm`, `Istio`

  *Cloud:*
  `AWS`, `GCP`, `Azure`

  *Observability & Data:*
  `Prometheus & Grafana`, `Elasticsearch`, `PostgreSQL`

  *SRE:*
  `SRE Fundamentals`, `Incident Management`, `Chaos Engineering`, `On-Call Practices`

  *MLOps:*
  `MLflow`, `Kubeflow`, `Model Serving`, `Feature Stores`, `Data Versioning`, `ML Pipelines`

  *AIOps:*
  `Observability AI`, `Anomaly Detection`, `AIOps Platforms`, `Log Analytics`, `AI-Driven Incident Response`

- **Number of cards** (optional, default 15, max 30)
- **Specific topic within the category** (optional — e.g. "networking", "error budgets", "model drift")

### 2. Generate flashcards

Using your own knowledge, produce exactly N flashcards for the chosen category (and topic if given).

Quality rules:
- **Front:** a clear, specific question or concept prompt. Not too long — a single sentence or a term to define.
- **Back:** a concise but complete answer. 2–4 sentences max. Include a concrete example or command where it adds clarity.
- Cover a range of sub-topics within the category — don't cluster around one concept.
- Mix definition cards ("What is X?"), distinction cards ("X vs Y"), and command/config cards ("How do you do Z?").
- Practical enough that a working practitioner would find each card useful, not trivial.

Format each card as a JSON object:
```json
{
  "front": "What is the difference between a liveness probe and a readiness probe in Kubernetes?",
  "back": "A liveness probe tells Kubernetes whether to restart a container (used when the app is deadlocked or stuck). A readiness probe tells Kubernetes whether to send traffic to the pod (used during startup or when the app is temporarily unavailable). A pod can be alive but not ready."
}
```

### 3. Write the HTML file

Write a single self-contained HTML file to `/tmp/interview-flashcards-{slug}.html` where `{slug}` is the category lowercased with spaces replaced by hyphens.

All CSS and JS must be inline — no CDN, no external fonts, no fetch calls. Use system font stack.

**Use this exact structure** (fill in the generated cards JSON, category name, and card count):

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Flashcards — {CATEGORY}</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0f172a;color:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:2rem 1rem}
#app{width:100%;max-width:680px}
h1{font-size:1.2rem;font-weight:700;color:#818cf8;margin-bottom:.2rem}
#subtitle{font-size:.78rem;color:#475569;margin-bottom:1.5rem}
#stats-bar{display:flex;gap:1rem;margin-bottom:1.25rem;font-size:.78rem}
.stat{display:flex;align-items:center;gap:.4rem;color:#64748b}
.stat-dot{width:8px;height:8px;border-radius:50%}
.dot-total{background:#334155}
.dot-ok{background:#22c55e}
.dot-review{background:#f59e0b}
#progress-wrap{background:#1e293b;border-radius:9999px;height:5px;margin-bottom:1.75rem;overflow:hidden}
#progress-bar{height:100%;background:linear-gradient(90deg,#6366f1,#8b5cf6);border-radius:9999px;transition:width .3s ease}
/* Card */
#scene{width:100%;perspective:1000px;margin-bottom:1.25rem;cursor:pointer}
#card{width:100%;min-height:260px;position:relative;transform-style:preserve-3d;transition:transform .45s ease;border-radius:1rem}
#card.flipped{transform:rotateY(180deg)}
.face{position:absolute;width:100%;min-height:260px;backface-visibility:hidden;-webkit-backface-visibility:hidden;border-radius:1rem;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;text-align:center}
.front-face{background:#1e293b;border:1.5px solid #334155}
.back-face{background:#1e1b4b;border:1.5px solid #4338ca;transform:rotateY(180deg)}
.face-label{font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:1rem;opacity:.5}
.front-face .face-label{color:#94a3b8}
.back-face .face-label{color:#a5b4fc}
#front-text{font-size:1.1rem;line-height:1.6;color:#e2e8f0;font-weight:500}
#back-text{font-size:.95rem;line-height:1.65;color:#c7d2fe}
#flip-hint{font-size:.72rem;color:#475569;text-align:center;margin-bottom:1rem}
/* Action buttons */
#actions{display:none;gap:.75rem;margin-bottom:1rem}
#actions.show{display:flex}
#btn-ok,#btn-review{flex:1;padding:.8rem;border:none;border-radius:.65rem;font-size:.9rem;font-weight:600;cursor:pointer;transition:opacity .15s}
#btn-ok{background:#166534;color:#86efac}
#btn-ok:hover{opacity:.85}
#btn-review{background:#78350f;color:#fcd34d}
#btn-review:hover{opacity:.85}
#skip{display:block;text-align:center;font-size:.75rem;color:#475569;cursor:pointer;margin-bottom:.5rem;background:none;border:none;padding:.25rem}
#skip:hover{color:#94a3b8}
/* Results */
#results{display:none;text-align:center;padding:2rem 1rem}
#results.show{display:block}
#res-score{font-size:3rem;font-weight:800;margin-bottom:.25rem}
#res-sub{font-size:.85rem;color:#64748b;margin-bottom:1.75rem}
.res-actions{display:flex;gap:.75rem;flex-direction:column}
#btn-restart-all,#btn-restart-unseen{padding:.85rem;border:none;border-radius:.65rem;font-size:.9rem;font-weight:600;cursor:pointer}
#btn-restart-all{background:#1e293b;color:#94a3b8;border:1px solid #334155}
#btn-restart-all:hover{background:#334155}
#btn-restart-unseen{background:#4f46e5;color:#fff}
#btn-restart-unseen:hover{background:#4338ca}
#btn-restart-unseen:disabled{opacity:.35;cursor:not-allowed}
kbd{display:inline-block;background:#1e293b;border:1px solid #334155;border-radius:4px;padding:.1rem .35rem;font-size:.7rem;font-family:monospace;color:#94a3b8}
</style>
</head>
<body>
<div id="app">
  <h1>Flashcards — {CATEGORY}</h1>
  <div id="subtitle" id="subtitle"></div>
  <div id="stats-bar">
    <span class="stat"><span class="stat-dot dot-total"></span><span id="stat-remaining">0 remaining</span></span>
    <span class="stat"><span class="stat-dot dot-ok"></span><span id="stat-ok">0 got it</span></span>
    <span class="stat"><span class="stat-dot dot-review"></span><span id="stat-review">0 reviewing</span></span>
  </div>
  <div id="progress-wrap"><div id="progress-bar" style="width:0%"></div></div>
  <div id="scene" onclick="flip()">
    <div id="card">
      <div class="face front-face">
        <div class="face-label">Question</div>
        <p id="front-text"></p>
      </div>
      <div class="face back-face">
        <div class="face-label">Answer</div>
        <p id="back-text"></p>
      </div>
    </div>
  </div>
  <p id="flip-hint">Click card or press <kbd>Space</kbd> to flip</p>
  <div id="actions">
    <button id="btn-ok" onclick="mark('ok')">✓ Got it</button>
    <button id="btn-review" onclick="mark('review')">↩ Still learning</button>
  </div>
  <button id="skip" onclick="skip()">Skip →</button>
  <div id="results">
    <div id="res-score"></div>
    <div id="res-sub"></div>
    <div class="res-actions">
      <button id="btn-restart-unseen" onclick="restartUnseen()">↩ Restart — Still Learning cards only</button>
      <button id="btn-restart-all" onclick="restartAll()">Restart full deck</button>
    </div>
  </div>
</div>
<script>
const CARDS = {CARDS_JSON};
let deck=[...CARDS],okSet=new Set(),reviewSet=new Set(),flipped=false,total=CARDS.length;

const $=id=>document.getElementById(id);

function updateStats(){
  const remaining=deck.length,ok=okSet.size,review=reviewSet.size;
  $('stat-remaining').textContent=`${remaining} remaining`;
  $('stat-ok').textContent=`${ok} got it`;
  $('stat-review').textContent=`${review} reviewing`;
  const done=ok+review;
  $('progress-bar').style.width=`${Math.round((done/total)*100)}%`;
  $('subtitle').textContent=`${total} cards · DevOps / SRE / Cloud interview prep`;
}

function render(){
  if(!deck.length){showResults();return;}
  const c=deck[0];
  flipped=false;
  $('card').classList.remove('flipped');
  $('front-text').textContent=c.front;
  $('back-text').textContent=c.back;
  $('actions').className='';
  $('flip-hint').style.display='';
  $('skip').style.display='';
  updateStats();
}

function flip(){
  if(!deck.length)return;
  flipped=!flipped;
  $('card').classList.toggle('flipped',flipped);
  if(flipped){
    $('actions').className='show';
    $('flip-hint').style.display='none';
  }
}

function mark(type){
  if(!deck.length)return;
  const c=deck.shift();
  if(type==='ok'){okSet.add(c.front);reviewSet.delete(c.front);}
  else{reviewSet.add(c.front);okSet.delete(c.front);}
  render();
}

function skip(){
  if(!deck.length)return;
  deck.push(deck.shift());
  flipped=false;
  $('card').classList.remove('flipped');
  $('actions').className='';
  $('flip-hint').style.display='';
  const c=deck[0];
  $('front-text').textContent=c.front;
  $('back-text').textContent=c.back;
}

function showResults(){
  $('scene').style.display='none';
  $('flip-hint').style.display='none';
  $('actions').style.display='none';
  $('skip').style.display='none';
  $('progress-bar').style.width='100%';
  const ok=okSet.size,review=reviewSet.size;
  const pct=Math.round((ok/total)*100);
  $('res-score').textContent=`${ok}/${total}`;
  $('res-sub').textContent=`${pct}% mastered · ${review} card${review!==1?'s':''} to review`;
  $('btn-restart-unseen').disabled=review===0;
  $('results').className='show';
}

function restartAll(){
  okSet.clear();reviewSet.clear();deck=[...CARDS];
  $('scene').style.display='';$('flip-hint').style.display='';$('skip').style.display='';
  $('results').className='';
  render();
}

function restartUnseen(){
  const unseen=CARDS.filter(c=>reviewSet.has(c.front));
  if(!unseen.length)return;
  okSet.clear();reviewSet.clear();deck=[...unseen];total=deck.length;
  $('scene').style.display='';$('flip-hint').style.display='';$('skip').style.display='';
  $('results').className='';
  render();
}

document.addEventListener('keydown',e=>{
  if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!flipped)flip();}
  else if(e.key==='1'&&flipped)mark('ok');
  else if(e.key==='2'&&flipped)mark('review');
  else if(e.key==='ArrowRight'&&!flipped)skip();
});

render();
</script>
</body>
</html>
```

Replace `{CATEGORY}` with the display name (e.g. `Kubernetes`), and `{CARDS_JSON}` with the JSON array of card objects.

### 4. Open the file

Run:
```bash
open /tmp/interview-flashcards-{slug}.html
```

On Linux use `xdg-open` instead of `open`. On Windows use `start`.

### 5. Report to the user

Tell the user:
- The flashcard deck is open in their browser
- How many cards, which category/topic
- Keyboard shortcuts: Space/Enter to flip, 1 = Got it, 2 = Still learning, → to skip

## Notes

- Do not call any external API — use your own knowledge to generate the cards.
- Always write the full HTML in one Write tool call.
- The HTML is self-contained: no CDN links, no external images, no fetch calls.
- "Still learning" cards are tracked so the user can restart with only those cards for focused review.
