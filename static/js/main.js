const input = document.getElementById('textInput');
const charCount = document.getElementById('charCount');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultBadge = document.getElementById('resultBadge');
const confidenceVal = document.getElementById('confidenceVal');
const posBar = document.getElementById('posBar');
const neuBar = document.getElementById('neuBar');
const negBar = document.getElementById('negBar');
const posVal = document.getElementById('posVal');
const neuVal = document.getElementById('neuVal');
const negVal = document.getElementById('negVal');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const historyList = document.getElementById('historyList');

let history = [];
let lastResult = null;

input.addEventListener('input', () => {
    const len = input.value.length;
    charCount.textContent = `${len} / 512`;
    charCount.classList.toggle('warn', len > 450);
});

function resetBars() {
    posBar.style.width = '0%';
    neuBar.style.width = '0%';
    negBar.style.width = '0%';
    posVal.textContent = '—';
    neuVal.textContent = '—';
    negVal.textContent = '—';
}

function updateUI(data) {
    const label = data.label.toUpperCase();

    resultBadge.textContent = label;
    resultBadge.className = 'result-badge';
    if (label === 'NEGATIVE') resultBadge.classList.add('neg');
    if (label === 'NEUTRAL') resultBadge.classList.add('neu');

    confidenceVal.textContent = data.confidence.toFixed(2) + '%';

    const pos = data.scores['Positive'] || 0;
    const neu = data.scores['Neutral'] || 0;
    const neg = data.scores['Negative'] || 0;

    setTimeout(() => {
        posBar.style.width = pos.toFixed(1) + '%';
        posVal.textContent = pos.toFixed(2) + '%';
    }, 80);

    setTimeout(() => {
        neuBar.style.width = neu.toFixed(1) + '%';
        neuVal.textContent = neu.toFixed(2) + '%';
    }, 200);

    setTimeout(() => {
        negBar.style.width = neg.toFixed(1) + '%';
        negVal.textContent = neg.toFixed(2) + '%';
    }, 320);
}

analyzeBtn.addEventListener('click', async () => {
    const text = input.value.trim();
    if (!text) return;

    analyzeBtn.textContent = '⟳  analyzing...';
    analyzeBtn.classList.add('loading');
    resetBars();

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        lastResult = data;

        updateUI(data);
        addToHistory(text, data);

        const color = data.label === 'Positive' ? '#00ffe7' : data.label === 'Negative' ? '#ff3aff' : '#b44fff';
        addRipple(W * 0.5, H * 0.5, color);

    } catch (error) {
        resultBadge.textContent = 'ERROR';
        resultBadge.className = 'result-badge neg';
        confidenceVal.textContent = '—';
    }

    analyzeBtn.textContent = '▶  analyze';
    analyzeBtn.classList.remove('loading');
});

function addToHistory(text, data) {
    history.unshift({ text, label: data.label.toUpperCase(), confidence: data.confidence });
    if (history.length > 6) history.pop();
    renderHistory();
}

function renderHistory() {
    if (history.length === 0) {
        historyList.innerHTML = '<p class="history-empty">// No analyses yet</p>';
        return;
    }

    historyList.innerHTML = history.map((item, index) => `
        <div class="history-row" data-index="${index}">
            <span class="history-row__text">${item.text}</span>
            <span class="history-row__label ${item.label === 'POSITIVE' ? 'pos' : item.label === 'NEUTRAL' ? 'neu' : 'neg'}">${item.label} (${item.confidence.toFixed(0)}%)</span>
        </div>
    `).join('');

    historyList.querySelectorAll('.history-row').forEach(row => {
        row.addEventListener('click', () => {
            input.value = history[parseInt(row.dataset.index)].text;
            const len = input.value.length;
            charCount.textContent = `${len} / 512`;
            charCount.classList.toggle('warn', len > 450);
        });
    });
}

copyBtn.addEventListener('click', () => {
    if (!lastResult) return;

    const text = `label: ${lastResult.label} | Confidence: ${lastResult.confidence.toFixed(2)}% | Positive: ${(lastResult.scores['Positive'] || 0).toFixed(2)}% | Neutral: ${(lastResult.scores['Neutral'] || 0).toFixed(2)}% | Negative: ${(lastResult.scores['Negative'] || 0).toFixed(2)}%`;

    navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => { copyBtn.textContent = '⎘ copy result'; }, 1500);
    });
});

clearBtn.addEventListener('click', () => {
    history = [];
    renderHistory();
});

const canvas = document.getElementById('swCanvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], ripples = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function initParticles() {
  particles = [];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      color: ['#ff3aff', '#00ffe7', '#b44fff', '#7b3fff'][Math.floor(Math.random() * 4)]
    });
  }
}
initParticles();

let gridOffset = 0;

function drawBackground() {
  ctx.clearRect(0, 0, W, H);

  gridOffset = (gridOffset + 0.4) % 40;
  const horizon = H * 0.55;
  const vpx = W / 2;

  ctx.save();
  ctx.globalAlpha = 0.18;
  for (let i = 0; i <= 14; i++) {
    const x = (i / 14) * W;
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.lineTo(vpx, horizon);
    ctx.strokeStyle = '#b44fff';
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
  for (let j = 0; j <= 10; j++) {
    const t = (j / 10 + gridOffset / (H * 0.45)) % 1;
    const ease = Math.pow(t, 2);
    const y = horizon + ease * (H - horizon);
    const spread = ease;
    ctx.beginPath();
    ctx.moveTo(vpx - spread * W * 0.5, y);
    ctx.lineTo(vpx + spread * W * 0.5, y);
    ctx.strokeStyle = '#ff3aff';
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.12;
  const grad = ctx.createLinearGradient(0, horizon - 40, 0, horizon + 40);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, '#ff3aff');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, horizon - 40, W, 80);
  ctx.restore();

  for (const rp of ripples) {
    ctx.save();
    ctx.globalAlpha = rp.alpha;
    ctx.beginPath();
    ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
    ctx.strokeStyle = rp.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
    rp.r += 2.5;
    rp.alpha -= 0.012;
  }
  ripples = ripples.filter(r => r.alpha > 0);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 90) * 0.18;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  requestAnimationFrame(drawBackground);
}
drawBackground();

function addRipple(x, y, color) {
  for (let i = 0; i < 3; i++) {
    ripples.push({ x, y, r: i * 18, alpha: 0.5 - i * 0.1, color });
  }
}