/* ============================================================
   MattDESIGN.AI — Dashboard JavaScript
   ============================================================ */

'use strict';

/* ---- HTML ESCAPE HELPER ---- */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ---- VIEW SWITCHING ---- */
function switchView(viewName) {
  // Update sidebar items
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-view') === viewName);
  });

  // Update views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.toggle('active', view.id === `view-${viewName}`);
  });

  // Update breadcrumb
  const labels = {
    'dashboard': 'Dashboard',
    'new-project': 'Nouveau projet',
    'projects': 'Mes projets',
    'brand-dna': 'Brand DNA',
    'assets': 'Asset Gallery',
    'generation': 'Génération en cours',
    'export': 'Export Center',
    'history': 'Historique',
    'settings': 'Paramètres'
  };
  const breadcrumb = document.getElementById('breadcrumbCurrent');
  if (breadcrumb) breadcrumb.textContent = labels[viewName] || viewName;

  // Close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  if (sidebar && window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }

  // Scroll to top
  const viewsContainer = document.querySelector('.views-container');
  if (viewsContainer) viewsContainer.scrollTop = 0;
}

// Sidebar nav items
document.querySelectorAll('.sidebar-item[data-view]').forEach(item => {
  item.addEventListener('click', () => {
    const view = item.getAttribute('data-view');
    if (view) switchView(view);
  });
});

/* ---- SIDEBAR TOGGLE (mobile) ---- */
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
  // Close on backdrop click
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

/* ---- NEW PROJECT: TYPE SELECTION ---- */
document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.querySelectorAll('.style-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

document.querySelectorAll('.color-btn:not(.color-custom)').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ---- GENERATION BUTTON ---- */
const startBtn = document.getElementById('startGenerationBtn');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    const name = document.getElementById('projectName')?.value;
    const desc = document.getElementById('projectDesc')?.value;
    
    if (!name && !desc) {
      // Show empty state feedback
      const nameInput = document.getElementById('projectName');
      if (nameInput) {
        nameInput.style.borderColor = 'var(--accent-violet)';
        nameInput.focus();
        setTimeout(() => { nameInput.style.borderColor = ''; }, 2000);
      }
      return;
    }
    
    // Animate button
    startBtn.innerHTML = '<div class="agent-spinner" style="width:16px;height:16px;border-width:2px;"></div> Démarrage…';
    startBtn.disabled = true;
    
    setTimeout(() => {
      switchView('generation');
      startBtn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Lancer la génération';
      startBtn.disabled = false;
    }, 1200);
  });
}

/* ---- GENERATION TIMER ---- */
let genSeconds = 192; // 3:12
const timerEl = document.getElementById('genTimerDisplay');

function updateTimer() {
  genSeconds++;
  const mins = Math.floor(genSeconds / 60).toString().padStart(2, '0');
  const secs = (genSeconds % 60).toString().padStart(2, '0');
  if (timerEl) timerEl.textContent = `${mins}:${secs}`;
}
setInterval(updateTimer, 1000);

/* ---- LIVE LOG UPDATES ---- */
const logMessages = [
  { time: '03:15', text: '→ Génération hero section — variante C...', type: 'info' },
  { time: '03:28', text: '→ Génération features section — variante C...', type: 'info' },
  { time: '03:45', text: '→ Génération pricing section — variante C...', type: 'info' },
  { time: '04:02', text: '✓ Variante C générée avec succès', type: 'success' },
  { time: '04:05', text: '→ QA Critic — Analyse en cours...', type: 'info' },
];
let logIdx = 0;

function addLogEntry(entry) {
  const logEntries = document.getElementById('logEntries');
  if (!logEntries) return;
  
  // Remove pulse from last
  const lastRunning = logEntries.querySelector('.log-entry.running');
  if (lastRunning) {
    lastRunning.classList.remove('running');
    lastRunning.classList.add(entry.type === 'success' ? 'success' : 'info');
    const span = lastRunning.querySelector('.pulse-text');
    if (span) span.classList.remove('pulse-text');
  }
  
  const div = document.createElement('div');
  div.className = `log-entry ${entry.type === 'success' ? 'success' : entry.type === 'info' ? 'running' : 'info'}`;
  div.innerHTML = `<span class="log-time">${entry.time}</span><span class="${entry.type !== 'success' ? 'pulse-text' : ''}">${entry.text}</span>`;
  logEntries.appendChild(div);
  logEntries.scrollTop = logEntries.scrollHeight;
}

setInterval(() => {
  if (logIdx < logMessages.length) {
    addLogEntry(logMessages[logIdx]);
    logIdx++;
  }
}, 5000);

/* ---- ASSET FILTERS ---- */
document.querySelectorAll('.asset-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.asset-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

/* ---- DNA PREVIEW (on new project input) ---- */
function updateDNAPreview() {
  const name = document.getElementById('projectName')?.value || '';
  const previewDNA = document.getElementById('previewDNA');
  if (!previewDNA) return;
  
  if (name.length > 2) {
    const activeColor = document.querySelector('.color-btn.active')?.getAttribute('data-color') || '#6366F1';
    const activeStyle = document.querySelector('.style-btn.active')?.getAttribute('data-style') || 'dark-premium';
    const safeName = escapeHtml(name);
    const safeFirstChar = escapeHtml(name[0].toUpperCase());
    const safeColor = escapeHtml(activeColor);
    const safeStyle = escapeHtml(activeStyle);
    
    previewDNA.innerHTML = `
      <div class="dna-preview-content" style="width:100%;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <div style="width:36px;height:36px;border-radius:8px;background:${safeColor};display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;">${safeFirstChar}</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:var(--text-primary);">${safeName}</div>
            <div style="font-size:11px;color:var(--text-muted);">Brand DNA généré</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;margin-bottom:12px;">
          <div style="width:32px;height:32px;border-radius:6px;background:#08090D;border:1px solid rgba(255,255,255,0.1);"></div>
          <div style="width:32px;height:32px;border-radius:6px;background:${safeColor};"></div>
          <div style="width:32px;height:32px;border-radius:6px;background:#D6B36A;"></div>
          <div style="width:32px;height:32px;border-radius:6px;background:#F6F4EF;"></div>
          <div style="width:32px;height:32px;border-radius:6px;background:#9CA3AF;"></div>
        </div>
        <div style="font-size:12px;color:var(--text-muted);font-family:var(--font-mono);">
          Style: ${safeStyle} · Typographie: Inter<br>
          Accent: ${safeColor} · Fond: #08090D
        </div>
      </div>
    `;
  } else {
    previewDNA.innerHTML = `
      <div class="dna-waiting" style="text-align:center;">
        <i class="fa-solid fa-dna fa-2x" style="color:var(--text-muted);"></i>
        <p class="t-body-sm c-muted mt-3" style="margin-top:12px;">Remplissez le brief pour voir une prévisualisation du Brand DNA</p>
      </div>
    `;
  }
}

const projectNameInput = document.getElementById('projectName');
if (projectNameInput) {
  projectNameInput.addEventListener('input', updateDNAPreview);
}
document.querySelectorAll('.color-btn, .style-btn').forEach(btn => {
  btn.addEventListener('click', updateDNAPreview);
});

/* ---- INIT ---- */
console.log('%cMattDESIGN.AI Dashboard', 'color:#6366F1;font-size:16px;font-weight:800;');
