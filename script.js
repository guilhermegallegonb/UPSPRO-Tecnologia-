/* ══════════════════════════════════════════════════════════════
   MotherRoll V9 — script.js
   Vanilla JS — Sem frameworks externos
══════════════════════════════════════════════════════════════ */

'use strict';

// ── ESTADO GLOBAL ──
const STATE = {
  currentStep: 1,
  totalSteps: 5,
  data: {
    momName: '',
    senderName: '',
    occasion: 'Dia das Mães',
    message: '',
    phrases: [],
    photos: [],     // Array de { dataUrl, file }
    track: null,    // { name, artist, previewUrl, artworkUrl }
    theme: 'rose',
  },
  audio: null,
  slideTimer: null,
  currentSlide: 0,
  saveTimer: null,
};

// ── ELEMENTOS DO DOM ──
const $ = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

// ══════════════════════════════════════════════════════════════
// PARTÍCULAS — Canvas background
// ══════════════════════════════════════════════════════════════
function initParticles() {
  const canvas = $('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function getColor() {
    const theme = document.body.dataset.theme || 'rose';
    const colors = {
      rose:      ['rgba(232,160,180,', 'rgba(255,107,158,'],
      gold:      ['rgba(212,175,55,',  'rgba(245,208,96,'],
      floral:    ['rgba(134,197,120,', 'rgba(232,160,180,'],
      dark:      ['rgba(200,200,200,', 'rgba(255,255,255,'],
      parchment: ['rgba(205,170,110,', 'rgba(232,200,122,'],
    };
    const c = colors[theme] || colors.rose;
    return c[Math.floor(Math.random() * c.length)];
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + .5,
      speedX: (Math.random() - .5) * .4,
      speedY: (Math.random() - .5) * .4,
      alpha: Math.random() * .5 + .1,
      color: getColor(),
    };
  }

  function init() {
    particles = [];
    const count = Math.min(Math.floor((W * H) / 12000), 80);
    for (let i = 0; i < count; i++) particles.push(createParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    }
    requestAnimationFrame(draw);
  }

  resize();
  init();
  draw();

  window.addEventListener('resize', () => { resize(); init(); });
}

// ══════════════════════════════════════════════════════════════
// NAVEGAÇÃO DE TELAS
// ══════════════════════════════════════════════════════════════
function showScreen(id) {
  $$('.screen').forEach(s => s.classList.remove('active'));
  const target = $(id);
  if (target) {
    target.classList.add('active');
    target.style.display = 'flex';
    window.scrollTo(0, 0);
  }
}

// ══════════════════════════════════════════════════════════════
// EDITOR — STEPS
// ══════════════════════════════════════════════════════════════
function goToStep(n) {
  const prev = STATE.currentStep;
  STATE.currentStep = n;

  // Painéis
  $$('.step-panel').forEach(p => p.classList.remove('active'));
  const panel = $(`step-${n}`);
  if (panel) panel.classList.add('active');

  // Nodes de progresso
  $$('.step-node').forEach(node => {
    const s = parseInt(node.dataset.step);
    node.classList.remove('active', 'done');
    if (s < n) node.classList.add('done');
    else if (s === n) node.classList.add('active');
  });

  // Botões de navegação
  const btnPrev = $('btn-prev');
  const btnNext = $('btn-next');
  const btnGen  = $('btn-generate');

  btnPrev.style.visibility = n === 1 ? 'hidden' : 'visible';

  if (n === STATE.totalSteps) {
    btnNext.style.display = 'none';
    btnGen.style.display = 'inline-flex';
  } else {
    btnNext.style.display = 'inline-flex';
    btnGen.style.display = 'none';
  }

  autoSave();
}

function validateCurrentStep() {
  const n = STATE.currentStep;
  if (n === 1) {
    const mom = $('mom-name').value.trim();
    const sender = $('sender-name').value.trim();
    if (!mom || !sender) {
      shake($('mom-name').closest('.field'));
      showToast('Preencha o nome da mãe e o seu nome 💛', 'warn');
      return false;
    }
    STATE.data.momName = mom;
    STATE.data.senderName = sender;
  }
  return true;
}

function collectData() {
  STATE.data.momName = $('mom-name').value.trim();
  STATE.data.senderName = $('sender-name').value.trim();
  const occ = $('custom-occ-wrap').style.display !== 'none'
    ? $('custom-occasion').value.trim()
    : STATE.data.occasion;
  STATE.data.occasion = occ || STATE.data.occasion;
  STATE.data.message = $('main-message').value.trim();
}

// ══════════════════════════════════════════════════════════════
// AUTO-SAVE — localStorage
// ══════════════════════════════════════════════════════════════
function autoSave() {
  clearTimeout(STATE.saveTimer);
  const label = $('save-label');
  if (label) label.textContent = 'Salvando…';
  STATE.saveTimer = setTimeout(() => {
    try {
      collectData();
      const saved = {
        step: STATE.currentStep,
        data: {
          momName: STATE.data.momName,
          senderName: STATE.data.senderName,
          occasion: STATE.data.occasion,
          message: STATE.data.message,
          phrases: STATE.data.phrases,
          theme: STATE.data.theme,
          track: STATE.data.track,
        },
      };
      localStorage.setItem('motherroll_v9', JSON.stringify(saved));
      if (label) label.textContent = 'Salvo';
    } catch(e) { /* Storage cheio ou bloqueado */ }
  }, 1000);
}

function loadSavedData() {
  try {
    const raw = localStorage.getItem('motherroll_v9');
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (!saved.data) return;

    const d = saved.data;
    STATE.data.momName   = d.momName   || '';
    STATE.data.senderName = d.senderName || '';
    STATE.data.occasion  = d.occasion  || 'Dia das Mães';
    STATE.data.message   = d.message   || '';
    STATE.data.phrases   = d.phrases   || [];
    STATE.data.theme     = d.theme     || 'rose';
    STATE.data.track     = d.track     || null;

    // Preencher inputs
    if ($('mom-name'))    $('mom-name').value    = STATE.data.momName;
    if ($('sender-name')) $('sender-name').value = STATE.data.senderName;
    if ($('main-message')) $('main-message').value = STATE.data.message;
    updateCharCount();

    // Ocasião
    $$('.occ-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.occasion === STATE.data.occasion) btn.classList.add('active');
    });

    // Frases
    renderPhrases();

    // Tema
    applyTheme(STATE.data.theme);
    $$('.theme-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.theme === STATE.data.theme);
    });

    // Faixa musical
    if (STATE.data.track) restoreTrack(STATE.data.track);

    showToast('Seu rascunho foi restaurado ✦', 'info');
  } catch(e) { /* Dado corrompido */ }
}

// ══════════════════════════════════════════════════════════════
// FRASES ESPECIAIS
// ══════════════════════════════════════════════════════════════
function renderPhrases() {
  const list = $('phrases-list');
  if (!list) return;
  list.innerHTML = '';
  STATE.data.phrases.forEach((ph, i) => {
    const div = document.createElement('div');
    div.className = 'phrase-item';
    div.innerHTML = `
      <span class="phrase-item-text">${escHtml(ph)}</span>
      <button class="phrase-del-btn" data-index="${i}" title="Remover">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;
    list.appendChild(div);
  });
}

function addPhrase() {
  const input = $('phrase-input');
  const val = input.value.trim();
  if (!val) return;
  if (STATE.data.phrases.length >= 12) {
    showToast('Máximo de 12 frases especiais', 'warn');
    return;
  }
  STATE.data.phrases.push(val);
  input.value = '';
  renderPhrases();
  autoSave();
}

// ══════════════════════════════════════════════════════════════
// FOTOS — Upload
// ══════════════════════════════════════════════════════════════
function handlePhotoFiles(files) {
  const remaining = 10 - STATE.data.photos.length;
  const toProcess = Array.from(files).slice(0, remaining);

  if (toProcess.length === 0) {
    showToast('Limite de 10 fotos atingido', 'warn');
    return;
  }

  toProcess.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      STATE.data.photos.push({ dataUrl: e.target.result, name: file.name });
      renderPhotos();
      autoSave();
    };
    reader.readAsDataURL(file);
  });
}

function renderPhotos() {
  const grid = $('photos-grid');
  const placeholder = $('upload-placeholder');
  const footer = $('upload-footer');
  const numEl = $('photo-num');

  if (!grid) return;

  if (STATE.data.photos.length > 0) {
    placeholder.style.display = 'none';
    footer.style.display = 'flex';
    numEl.textContent = STATE.data.photos.length;
  } else {
    placeholder.style.display = 'flex';
    footer.style.display = 'none';
  }

  grid.innerHTML = '';
  STATE.data.photos.forEach((ph, i) => {
    const div = document.createElement('div');
    div.className = 'photo-thumb';
    div.innerHTML = `
      <img src="${ph.dataUrl}" alt="Foto ${i+1}" loading="lazy">
      <button class="remove-photo" data-index="${i}" title="Remover">✕</button>`;
    grid.appendChild(div);
  });
}

// ══════════════════════════════════════════════════════════════
// MÚSICA — iTunes Search API (CORS nativo, gratuito)
// ══════════════════════════════════════════════════════════════
async function searchMusic(query) {
  if (!query.trim()) return;
  const resultsEl = $('music-results');
  const loader    = $('music-loader');
  const noSel     = $('music-no-select');

  resultsEl.innerHTML = '';
  loader.style.display = 'flex';
  noSel.style.display  = 'none';

  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=8&country=BR`;
    const res  = await fetch(url);
    const json = await res.json();

    loader.style.display = 'none';

    if (!json.results || json.results.length === 0) {
      resultsEl.innerHTML = '<p style="text-align:center;padding:16px;color:var(--c-text2);font-size:.85rem">Nenhuma música encontrada. Tente outro termo.</p>';
      return;
    }

    json.results.forEach((track, i) => {
      if (!track.previewUrl) return;
      const art = track.artworkUrl100 || '';
      const name = track.trackName || 'Desconhecido';
      const artist = track.artistName || '';

      const item = document.createElement('div');
      item.className = 'music-result-item';
      item.style.animationDelay = `${i * .05}s`;
      item.innerHTML = `
        <img class="music-result-art" src="${art}" alt="" loading="lazy">
        <div class="music-result-info">
          <span class="music-result-name">${escHtml(name)}</span>
          <span class="music-result-artist">${escHtml(artist)}</span>
        </div>
        <button class="music-result-select">Selecionar</button>`;

      item.querySelector('.music-result-select').addEventListener('click', () => {
        selectTrack({ name, artist, previewUrl: track.previewUrl, artworkUrl: art });
        resultsEl.innerHTML = '';
      });

      resultsEl.appendChild(item);
    });

  } catch(err) {
    loader.style.display = 'none';
    resultsEl.innerHTML = '<p style="text-align:center;padding:16px;color:var(--c-text2);font-size:.85rem">Erro na busca. Verifique sua conexão.</p>';
  }
}

function selectTrack(track) {
  STATE.data.track = track;
  $('track-artwork').src     = track.artworkUrl || '';
  $('track-name').textContent   = track.name;
  $('track-artist').textContent = track.artist;
  $('selected-track').style.display = 'flex';
  $('music-no-select').style.display = 'none';
  $('music-results').innerHTML = '';

  setupMiniPlayer(track.previewUrl);
  autoSave();
}

function restoreTrack(track) {
  STATE.data.track = track;
  if ($('track-artwork'))  $('track-artwork').src     = track.artworkUrl || '';
  if ($('track-name'))     $('track-name').textContent   = track.name;
  if ($('track-artist'))   $('track-artist').textContent = track.artist;
  if ($('selected-track')) $('selected-track').style.display = 'flex';
  if ($('music-no-select')) $('music-no-select').style.display = 'none';
  if (track.previewUrl) setupMiniPlayer(track.previewUrl);
}

function removeTrack() {
  STATE.data.track = null;
  stopAudio();
  if ($('selected-track')) $('selected-track').style.display = 'none';
  if ($('music-no-select')) $('music-no-select').style.display = 'block';
  autoSave();
}

// ── Mini Player ──
function setupMiniPlayer(url) {
  const audio = $('global-audio');
  audio.src = url;
  audio.load();

  STATE.audio = audio;

  audio.ontimeupdate = () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    const fill = $('mini-progress-fill');
    if (fill) fill.style.width = pct + '%';
    const cur = $('mini-current');
    if (cur) cur.textContent = formatTime(audio.currentTime);
    // Experiência
    const expFill = $('float-bar-fill');
    if (expFill) expFill.style.width = pct + '%';
  };

  audio.onended = () => {
    setPlayState(false);
  };

  audio.ondurationchange = () => {
    const dur = $('mini-duration');
    if (dur) dur.textContent = formatTime(audio.duration);
  };
}

function togglePlay() {
  const audio = $('global-audio');
  if (!audio.src || audio.src === window.location.href) return;
  if (audio.paused) {
    audio.play().catch(() => {});
    setPlayState(true);
  } else {
    audio.pause();
    setPlayState(false);
  }
}

function setPlayState(playing) {
  // Mini player
  const play1  = $('mini-icon-play');
  const pause1 = $('mini-icon-pause');
  if (play1 && pause1) {
    play1.style.display  = playing ? 'none' : 'block';
    pause1.style.display = playing ? 'block' : 'none';
  }
  // Float player
  const play2  = $('exp-play-icon');
  const pause2 = $('exp-pause-icon');
  if (play2 && pause2) {
    play2.style.display  = playing ? 'none' : 'block';
    pause2.style.display = playing ? 'block' : 'none';
  }
}

function stopAudio() {
  const audio = $('global-audio');
  if (audio) { audio.pause(); audio.currentTime = 0; }
  setPlayState(false);
}

// ══════════════════════════════════════════════════════════════
// TEMA
// ══════════════════════════════════════════════════════════════
function applyTheme(name) {
  STATE.data.theme = name;
  document.body.dataset.theme = name;
  autoSave();
}

// ══════════════════════════════════════════════════════════════
// GERAÇÃO DA EXPERIÊNCIA DIGITAL
// ══════════════════════════════════════════════════════════════
function generateExperience() {
  collectData();
  const d = STATE.data;

  if (!d.momName || !d.senderName) {
    showToast('Volte ao Passo 1 e preencha os nomes 💛', 'warn');
    return;
  }

  const canvas = $('exp-canvas');
  canvas.innerHTML = '';

  // ── Bloco 1: Cover ──
  const cover = document.createElement('div');
  cover.className = 'exp-block exp-cover';
  cover.innerHTML = `
    <div class="exp-occasion">${escHtml(d.occasion)}</div>
    <div class="exp-to-name">${escHtml(d.momName)}</div>
    <p class="exp-from">Uma mensagem de <em>${escHtml(d.senderName)}</em></p>
    <div class="exp-divider"></div>`;
  canvas.appendChild(cover);

  // ── Bloco 2: Mensagem ──
  if (d.message) {
    const msgBlock = document.createElement('div');
    msgBlock.className = 'exp-block exp-message-block reveal';
    msgBlock.innerHTML = `<p>${escHtml(d.message)}</p>`;
    canvas.appendChild(msgBlock);
  }

  // ── Blocos de Frases ──
  if (d.phrases.length > 0) {
    d.phrases.forEach((ph, i) => {
      const phraseBlock = document.createElement('div');
      phraseBlock.className = 'exp-block exp-phrase-block reveal';
      phraseBlock.innerHTML = `<div class="exp-phrase-text">${escHtml(ph)}</div>`;
      if (i > 0 && i % 2 === 0 && d.photos.length > 0) {
        // Intercalar foto a cada 2 frases
        const photoIdx = Math.floor(i / 2) % d.photos.length;
        canvas.appendChild(buildSlideshowBlock([d.photos[photoIdx]]));
      }
      canvas.appendChild(phraseBlock);
    });
  }

  // ── Slideshow de Fotos ──
  if (d.photos.length > 0) {
    const ssBlock = buildSlideshowBlock(d.photos);
    canvas.appendChild(ssBlock);
  }

  // ── Fechamento ──
  const closing = document.createElement('div');
  closing.className = 'exp-block exp-cover reveal';
  closing.innerHTML = `
    <div class="exp-phrase-text" style="font-size:clamp(1.5rem,4vw,2.5rem)">Com todo o amor do mundo…</div>
    <div class="exp-divider"></div>
    <div class="exp-from" style="font-size:1.1rem">— <em>${escHtml(d.senderName)}</em></div>
    <div style="margin-top:32px;font-size:2.5rem;letter-spacing:.3em">♥</div>`;
  canvas.appendChild(closing);

  // Player flutuante
  if (d.track) {
    const fp = $('float-player');
    $('float-track-name').textContent   = d.track.name;
    $('float-track-artist').textContent = d.track.artist;
    fp.style.display = 'flex';
    setupMiniPlayer(d.track.previewUrl);
    setTimeout(() => {
      const audio = $('global-audio');
      audio.play().catch(() => {});
      setPlayState(true);
    }, 1200);
  } else {
    $('float-player').style.display = 'none';
  }

  showScreen('experience');

  // Slideshow auto
  startSlideshow();

  // Scroll reveal
  initScrollReveal();
}

function buildSlideshowBlock(photos) {
  const block = document.createElement('div');
  block.className = 'exp-block exp-slideshow';

  let slidesHtml = '';
  let dotsHtml   = '';
  photos.forEach((ph, i) => {
    slidesHtml += `<div class="slide${i === 0 ? ' active' : ''}"><img src="${ph.dataUrl}" alt="Foto ${i+1}" loading="lazy"></div>`;
    dotsHtml   += `<div class="slide-dot${i === 0 ? ' active' : ''}"></div>`;
  });

  block.innerHTML = `
    <div class="slideshow-container" data-index="0">${slidesHtml}</div>
    ${photos.length > 1 ? `<div class="slideshow-dots">${dotsHtml}</div>` : ''}`;

  return block;
}

function startSlideshow() {
  clearInterval(STATE.slideTimer);
  STATE.slideTimer = setInterval(() => {
    const containers = $$('.slideshow-container');
    containers.forEach(c => {
      const slides = c.querySelectorAll('.slide');
      const dots   = c.nextElementSibling?.querySelectorAll('.slide-dot');
      if (slides.length <= 1) return;

      let idx = parseInt(c.dataset.index) || 0;
      slides[idx].classList.remove('active');
      if (dots) dots[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
      if (dots) dots[idx].classList.add('active');
      c.dataset.index = idx;
    });
  }, 3500);
}

function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .15 });
  $$('.reveal').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════════════════════
// GERAÇÃO DO PERGAMINHO PARA IMPRESSÃO
// ══════════════════════════════════════════════════════════════
function generateScrollPrint() {
  collectData();
  const d = STATE.data;

  // Definir as variáveis CSS do tema no elemento de scroll
  const themeVars = getThemeVars(d.theme);

  // Montar o conteúdo em segmentos lógicos
  const segments = buildScrollSegments(d);

  // Agrupar em páginas A4 (2 segmentos por página = 2 colunas)
  const pagesEl = $('scroll-pages');
  pagesEl.innerHTML = '';

  let segIndex = 0;
  let pageNum  = 1;

  for (let i = 0; i < segments.length; i += 2) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'scroll-a4-page';

    // Aplicar vars de tema inline
    Object.entries(themeVars).forEach(([k,v]) => pageDiv.style.setProperty(k, v));

    // Seg A (esquerda)
    pageDiv.appendChild(buildSegmentEl(segments[i], i + 1));

    // Seg B (direita) — pode não existir na última página
    if (segments[i + 1]) {
      pageDiv.appendChild(buildSegmentEl(segments[i + 1], i + 2));
    } else {
      // Segmento em branco para completar
      const blank = document.createElement('div');
      blank.className = 'scroll-segment';
      Object.entries(themeVars).forEach(([k,v]) => blank.style.setProperty(k, v));
      blank.style.background = `var(--scroll-bg, #fff5f8)`;
      const blankNum = document.createElement('div');
      blankNum.className = 'segment-number';
      blankNum.textContent = i + 2;
      blank.appendChild(blankNum);
      pageDiv.appendChild(blank);
    }

    pagesEl.appendChild(pageDiv);
    pageNum++;
  }

  showScreen('print-screen');
}

function buildScrollSegments(d) {
  const segments = [];

  // SEG 1 — Capa
  segments.push({
    type: 'cover',
    occasion: d.occasion,
    momName: d.momName,
    senderName: d.senderName,
  });

  // SEG 2 — Início da mensagem
  if (d.message) {
    const words = d.message.split(' ');
    const half  = Math.ceil(words.length / 2);
    const part1 = words.slice(0, half).join(' ');
    const part2 = words.slice(half).join(' ');

    segments.push({ type: 'message', text: part1, continued: true });
    if (part2) segments.push({ type: 'message', text: part2, continued: false });
  }

  // Frases + Fotos intercaladas
  d.phrases.forEach((ph, i) => {
    segments.push({ type: 'phrase', text: ph });
    // Inserir foto após cada 2 frases
    if (d.photos.length > 0 && (i + 1) % 2 === 0) {
      const photoIdx = Math.floor((i + 1) / 2) % d.photos.length;
      segments.push({ type: 'photo', dataUrl: d.photos[photoIdx].dataUrl });
    }
  });

  // Fotos restantes
  const photosInSegments = Math.floor(d.phrases.length / 2);
  d.photos.slice(photosInSegments).forEach(ph => {
    segments.push({ type: 'photo', dataUrl: ph.dataUrl });
  });

  // SEG FINAL — Encerramento
  segments.push({
    type: 'closing',
    senderName: d.senderName,
    momName: d.momName,
  });

  return segments;
}

function buildSegmentEl(seg, num) {
  const el = document.createElement('div');
  el.className = 'scroll-segment';
  el.style.background = `var(--scroll-bg, #fff5f8)`;

  const numEl = document.createElement('div');
  numEl.className = 'segment-number';
  numEl.textContent = num;
  el.appendChild(numEl);

  const inner = document.createElement('div');
  inner.className = 'segment-inner';

  switch (seg.type) {
    case 'cover':
      inner.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:20px 0">
          <div class="seg-hearts">♥ ♥ ♥</div>
          <div class="seg-occasion-tag">${escHtml(seg.occasion)}</div>
          <div class="seg-title">${escHtml(seg.momName)}</div>
          <div style="font-size:8px;color:var(--scroll-acc,#c47b9a);letter-spacing:.08em;text-align:center">
            Uma mensagem especial de ${escHtml(seg.senderName)}
          </div>
          <div class="seg-hearts" style="font-size:20px;letter-spacing:.1em">♥</div>
        </div>
        <div class="seg-continuity">↓ continue abaixo ↓</div>`;
      break;

    case 'message':
      inner.innerHTML = `
        <div class="seg-message">${escHtml(seg.text)}${seg.continued ? '…' : ''}</div>
        <div class="seg-continuity">${seg.continued ? '↓ continua ↓' : '— ♥ —'}</div>`;
      break;

    case 'phrase':
      inner.innerHTML = `
        <div style="flex:1;display:flex;align-items:center;justify-content:center;">
          <div class="seg-phrase">${escHtml(seg.text)}</div>
        </div>`;
      break;

    case 'photo':
      inner.innerHTML = `
        <div style="flex:1;display:flex;align-items:center;justify-content:center;">
          <img class="seg-photo" src="${seg.dataUrl}" alt="Foto">
        </div>`;
      break;

    case 'closing':
      inner.innerHTML = `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center">
          <div class="seg-hearts" style="font-size:28px">♥</div>
          <div class="seg-phrase">Com todo o amor do mundo…</div>
          <div class="seg-from">— ${escHtml(seg.senderName)}</div>
          <div style="font-size:7px;color:var(--scroll-acc,#c47b9a);margin-top:8px;letter-spacing:.06em">
            Criado com MotherRoll ✦
          </div>
        </div>`;
      break;
  }

  el.appendChild(inner);
  return el;
}

function getThemeVars(theme) {
  const themes = {
    rose:      { '--scroll-bg':'#fff5f8', '--scroll-bg2':'#ffe8f0', '--scroll-text':'#2d1520', '--scroll-acc':'#c47b9a', '--scroll-dec':'rgba(196,123,154,.18)' },
    gold:      { '--scroll-bg':'#fefcf0', '--scroll-bg2':'#faf5d0', '--scroll-text':'#1a1500', '--scroll-acc':'#b8962c', '--scroll-dec':'rgba(184,150,44,.18)' },
    floral:    { '--scroll-bg':'#f4fff2', '--scroll-bg2':'#e8f5e0', '--scroll-text':'#0b1e08', '--scroll-acc':'#5fa850', '--scroll-dec':'rgba(95,168,80,.18)' },
    dark:      { '--scroll-bg':'#f8f8f8', '--scroll-bg2':'#ebebeb', '--scroll-text':'#111',    '--scroll-acc':'#333',    '--scroll-dec':'rgba(0,0,0,.12)' },
    parchment: { '--scroll-bg':'#fdf6e3', '--scroll-bg2':'#f5e8c0', '--scroll-text':'#2a1a00', '--scroll-acc':'#a8843c', '--scroll-dec':'rgba(168,132,60,.18)' },
  };
  return themes[theme] || themes.rose;
}

// ══════════════════════════════════════════════════════════════
// COMPARTILHAMENTO
// ══════════════════════════════════════════════════════════════
function openShareModal() {
  const modal = $('share-backdrop');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeShareModal() {
  const modal = $('share-backdrop');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function shareWhatsApp() {
  const d = STATE.data;
  const msg = `💌 *${d.senderName}* criou um pergaminho emocional especial para *${d.momName}*!\n\n✦ MotherRoll — o presente que toca a alma\n\n${window.location.href}`;
  const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

function copyLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast('Link copiado! 🔗', 'success');
    closeShareModal();
  }).catch(() => {
    // Fallback
    const el = document.createElement('input');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Link copiado! 🔗', 'success');
    closeShareModal();
  });
}

// ══════════════════════════════════════════════════════════════
// UTILIDADES
// ══════════════════════════════════════════════════════════════
function escHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function shake(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake .4s ease';
}

function updateCharCount() {
  const ta = $('main-message');
  const cnt = $('msg-chars');
  if (ta && cnt) cnt.textContent = ta.value.length;
}

// Toast notifications
let toastTimer;
function showToast(msg, type = 'info') {
  let toast = document.querySelector('.mr-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'mr-toast';
    // Injetar estilos inline para o toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '80px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '12px 24px',
      borderRadius: '100px',
      fontFamily: 'Inter, sans-serif',
      fontSize: '.85rem',
      fontWeight: '600',
      zIndex: '9999',
      backdropFilter: 'blur(16px)',
      boxShadow: '0 8px 32px rgba(0,0,0,.3)',
      transition: 'opacity .3s ease, transform .3s ease',
      opacity: '0',
      transform: 'translateX(-50%) translateY(10px)',
      whiteSpace: 'nowrap',
    });
    document.body.appendChild(toast);
  }

  const bg = type === 'warn' ? 'rgba(255,107,107,.9)' :
             type === 'success' ? 'rgba(74,222,128,.9)' :
             'rgba(30,30,40,.95)';
  toast.style.background = bg;
  toast.style.color = '#fff';
  toast.textContent = msg;

  clearTimeout(toastTimer);
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
  }, 3000);
}

// Shake CSS (injeto dinamicamente)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); }
    40% { transform: translateX(8px); }
    60% { transform: translateX(-5px); }
    80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(shakeStyle);

// ══════════════════════════════════════════════════════════════
// INICIALIZAÇÃO & EVENT LISTENERS
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  // Partículas
  initParticles();

  // Carregar dados salvos
  loadSavedData();

  // ── Tela de Abertura ──
  $('btn-start').addEventListener('click', () => {
    showScreen('editor');
    goToStep(1);
  });

  // ── Editor: Voltar para início ──
  $('btn-back-to-home').addEventListener('click', () => {
    stopAudio();
    showScreen('opening');
  });

  // ── Editor: Navegação de Steps ──
  $('btn-prev').addEventListener('click', () => {
    if (STATE.currentStep > 1) goToStep(STATE.currentStep - 1);
  });

  $('btn-next').addEventListener('click', () => {
    if (!validateCurrentStep()) return;
    if (STATE.currentStep < STATE.totalSteps) goToStep(STATE.currentStep + 1);
  });

  $('btn-generate').addEventListener('click', () => {
    collectData();
    generateExperience();
  });

  // Clicar nos nodes do stepper
  $$('.step-node').forEach(node => {
    node.addEventListener('click', () => {
      const target = parseInt(node.dataset.step);
      if (target <= STATE.currentStep) goToStep(target);
    });
  });

  // ── Step 1: Campos de identidade ──
  $('mom-name').addEventListener('input', autoSave);
  $('sender-name').addEventListener('input', autoSave);

  $$('.occ-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.occ-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.occasion === 'custom') {
        $('custom-occ-wrap').style.display = 'block';
        STATE.data.occasion = $('custom-occasion').value || '';
      } else {
        $('custom-occ-wrap').style.display = 'none';
        STATE.data.occasion = btn.dataset.occasion;
      }
      autoSave();
    });
  });

  $('custom-occasion')?.addEventListener('input', () => {
    STATE.data.occasion = $('custom-occasion').value;
    autoSave();
  });

  // ── Step 2: Mensagem ──
  $('main-message').addEventListener('input', () => {
    updateCharCount();
    autoSave();
  });

  $('btn-add-phrase').addEventListener('click', addPhrase);
  $('phrase-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); addPhrase(); }
  });

  // Delegação para remover frases
  $('phrases-list').addEventListener('click', e => {
    const btn = e.target.closest('.phrase-del-btn');
    if (!btn) return;
    const idx = parseInt(btn.dataset.index);
    STATE.data.phrases.splice(idx, 1);
    renderPhrases();
    autoSave();
  });

  // ── Step 3: Fotos ──
  const uploadZone = $('upload-zone');
  const photoInput = $('photo-input');

  uploadZone.addEventListener('click', e => {
    if (!e.target.closest('.remove-photo')) photoInput.click();
  });

  uploadZone.addEventListener('dragover', e => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
  uploadZone.addEventListener('drop', e => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');
    handlePhotoFiles(e.dataTransfer.files);
  });

  photoInput.addEventListener('change', () => {
    handlePhotoFiles(photoInput.files);
    photoInput.value = '';
  });

  $('btn-add-more').addEventListener('click', () => photoInput.click());

  // Delegação para remover fotos
  $('photos-grid').addEventListener('click', e => {
    const btn = e.target.closest('.remove-photo');
    if (!btn) return;
    const idx = parseInt(btn.dataset.index);
    STATE.data.photos.splice(idx, 1);
    renderPhotos();
  });

  // ── Step 4: Música ──
  $('btn-music-search').addEventListener('click', () => {
    searchMusic($('music-search').value);
  });
  $('music-search').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchMusic($('music-search').value);
  });

  $('player-toggle').addEventListener('click', togglePlay);
  $('btn-remove-track').addEventListener('click', removeTrack);

  // ── Step 5: Temas ──
  $$('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      $$('.theme-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      applyTheme(card.dataset.theme);
    });
  });

  // ── Experiência: Controles ──
  $('btn-back-to-editor').addEventListener('click', () => {
    stopAudio();
    clearInterval(STATE.slideTimer);
    showScreen('editor');
  });

  $('btn-go-print').addEventListener('click', () => {
    stopAudio();
    generateScrollPrint();
  });

  $('btn-share').addEventListener('click', openShareModal);

  $('exp-play-toggle').addEventListener('click', togglePlay);

  // ── Impressão: Controles ──
  $('btn-back-to-exp').addEventListener('click', () => {
    showScreen('experience');
    if (STATE.data.track) {
      $('float-player').style.display = 'flex';
    }
  });

  $('btn-print-now').addEventListener('click', () => window.print());

  // ── Modal de Compartilhamento ──
  $('close-share').addEventListener('click', closeShareModal);
  $('share-backdrop').addEventListener('click', e => {
    if (e.target === $('share-backdrop')) closeShareModal();
  });
  $('btn-whatsapp').addEventListener('click', shareWhatsApp);
  $('btn-copy-link').addEventListener('click', copyLink);

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeShareModal();
    if (e.key === ' ' && e.target === document.body) {
      e.preventDefault();
      togglePlay();
    }
  });

  // ── Inicializar contador de chars ──
  updateCharCount();

  // ── Verificar parâmetros URL (compartilhamento futuro) ──
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('view') === 'experience') {
    // Modo visualização direta (para links compartilhados)
    const saved = localStorage.getItem('motherroll_v9');
    if (saved) {
      loadSavedData();
      generateExperience();
    }
  }

});

// ══════════════════════════════════════════════════════════════
// SERVICE WORKER (Cache básico para offline)
// ══════════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW opcional — não bloqueia o app
    });
  });
}
