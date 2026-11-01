/* =====================================================
   1. FONDO DE PARTÍCULAS
   ===================================================== */
(function particles(){
  const canvas = document.getElementById('stars');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0;
  const parts = [];
  const COLORS = ['#6ee7ff', '#f7df1e', '#ff5ea8'];

  function resize(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = window.innerWidth < 700 ? 45 : 85;
  for (let i = 0; i < COUNT; i++){
    parts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .34,
      vy: (Math.random() - .5) * .34,
      r: Math.random() * 1.8 + .6,
      c: COLORS[(Math.random() * COLORS.length) | 0]
    });
  }

  const LINK = 13000;

  function loop(){
    ctx.clearRect(0, 0, W, H);

    for (const p of parts){
      if (!reduceMotion){
        p.x += p.vx;  p.y += p.vy;
        if (p.x < 0) p.x = W; else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; else if (p.y > H) p.y = 0;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = .55;
      ctx.fill();
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#6ee7ff';
    for (let i = 0; i < parts.length; i++){
      for (let j = i + 1; j < parts.length; j++){
        const dx = parts[i].x - parts[j].x;
        const dy = parts[i].y - parts[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK){
          ctx.globalAlpha = (1 - d2 / LINK) * .12;
          ctx.beginPath();
          ctx.moveTo(parts[i].x, parts[i].y);
          ctx.lineTo(parts[j].x, parts[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
})();

/* =====================================================
   2. REVELADO DE EVENTOS + ALTERNANCIA IZQ/DER
   ===================================================== */
(function reveal(){
  const events = Array.from(document.querySelectorAll('.event'));

  events.forEach((el, i) => {
    if (!el.classList.contains('wide')){
      el.classList.add(i % 2 === 0 ? 'left' : 'right');
    }
  });

  if (!('IntersectionObserver' in window)){
    events.forEach(el => el.classList.add('visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

  events.forEach(el => io.observe(el));
})();

/* =====================================================
   3. BARRA DE PROGRESO + RELLENO DE LA LÍNEA
   ===================================================== */
(function progress(){
  const bar      = document.getElementById('bar');
  const tlFill   = document.getElementById('tlFill');
  const timeline = document.querySelector('.timeline');
  let ticking = false;

  function update(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';

    const rect   = timeline.getBoundingClientRect();
    const total  = timeline.offsetHeight;
    const passed = Math.min(Math.max(window.innerHeight * 0.55 - rect.top, 0), total);
    tlFill.style.height = (total > 0 ? (passed / total) * 100 : 0) + '%';

    ticking = false;
  }

  function onScroll(){
    if (!ticking){
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* =====================================================
   4. PARALLAX DEL HERO
   ===================================================== */
(function parallax(){
  const glow = document.getElementById('heroGlow');
  const hero = document.querySelector('.hero');
  if (!glow || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    glow.style.transform = `translate(calc(-50% + ${x * 60}px), calc(-50% + ${y * 60}px))`;
  });
  hero.addEventListener('mouseleave', () => {
    glow.style.transform = 'translate(-50%,-50%)';
  });
})();

/* =====================================================
   5. RECORRIDO AUTOMÁTICO
   ===================================================== */
(function tour(){
  const btn = document.getElementById('tourBtn');
  let playing = false;
  let rafId = null;

  function stop(){
    playing = false;
    cancelAnimationFrame(rafId);
    btn.textContent = '▶ Recorrido automático';
    btn.classList.remove('playing');
  }

  function step(){
    if (!playing) return;
    window.scrollBy(0, 2.4);

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4){
      stop();
      return;
    }
    rafId = requestAnimationFrame(step);
  }

  btn.addEventListener('click', () => {
    if (playing){ stop(); return; }

    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    playing = true;
    btn.textContent = '⏸ Pausar recorrido';
    btn.classList.add('playing');
    rafId = requestAnimationFrame(step);
  });

  ['wheel', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, () => { if (playing) stop(); }, { passive: true });
  });
})();

/* =====================================================
   6. FLECHA DEL HERO
   ===================================================== */
document.getElementById('hint').addEventListener('click', () => {
  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
});

/* =====================================================
   7. TOAST
   ===================================================== */
const toast = (function(){
  const el = document.getElementById('toast');
  let timer = null;
  return function(msg, duration = 2400){
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.remove('show'), duration);
  };
})();

/* =====================================================
   8. EFECTOS: BURST, CONFETI, DAÑO
   ===================================================== */
function burst(x, y, color = '#f7df1e', count = 14){
  for (let i = 0; i < count; i++){
    const b = document.createElement('div');
    b.className = 'burst';
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
    const dist  = 40 + Math.random() * 60;
    b.style.left = x + 'px';
    b.style.top  = y + 'px';
    b.style.background = color;
    b.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    b.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(b);
    setTimeout(() => b.remove(), 900);
  }
}

function confetti(x, y, count = 60){
  const colors = ['#f7df1e', '#6ee7ff', '#ff5ea8', '#42d392', '#ffffff'];
  for (let i = 0; i < count; i++){
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = x + 'px';
    c.style.top  = y + 'px';
    c.style.background = colors[(Math.random() * colors.length) | 0];
    const angle = Math.random() * Math.PI * 2;
    const dist  = 100 + Math.random() * 260;
    c.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    c.style.setProperty('--dy', Math.sin(angle) * dist - 80 + 'px');
    c.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 1400);
  }
}

function damagePop(x, y, text = '¡POW!', color = '#ff2e63'){
  const p = document.createElement('div');
  p.className = 'damage-pop';
  p.textContent = text;
  p.style.left = x + 'px';
  p.style.top  = y + 'px';
  p.style.color = color;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 950);
}

/* =====================================================
   9. MINIJUEGO: GUERRA DE NAVEGADORES
   ===================================================== */
(function browserWar(){
  const MAX_HP = 100;
  const state = { netscape: MAX_HP, ie: MAX_HP, over: false };

  const hpEls = {
    netscape: document.querySelector('[data-hp="netscape"]'),
    ie:       document.querySelector('[data-hp="ie"]')
  };
  const fighters = {
    netscape: document.querySelector('.fighter--netscape'),
    ie:       document.querySelector('.fighter--ie')
  };
  const msgEl     = document.getElementById('warMsg');
  const resetBtn  = document.getElementById('warReset');
  const attackBtns = document.querySelectorAll('.attack-btn');

  const ATTACKS = {
    netscape: ['DHTML!', 'Capas!', '¡Plugin!', '¡Frame!', '¡Marquee!', '¡Blink!'],
    ie:       ['JScript!', 'ActiveX!', 'VB Script!', '¡DCOM!', '¡IE 6!', '¡Gratis con Win!']
  };

  const TAUNTS = {
    netscape: [
      'Netscape contraataca con su motor de render…',
      '¡El plugin de Flash entra en acción!',
      'Los <blink> brillan con furia…',
      '¡Una capa flotante bloquea el ataque!'
    ],
    ie: [
      'IE usa su carta: ¡venir preinstalado!',
      '¡ActiveX se activa desde las sombras!',
      'Error de script: ¡el enemigo pierde 8s!',
      'IE 6 aparece… nadie sabe cómo detenerlo.'
    ]
  };

  function render(){
    hpEls.netscape.style.width = state.netscape + '%';
    hpEls.ie.style.width       = state.ie + '%';

    hpEls.netscape.style.background =
      state.netscape > 50 ? 'linear-gradient(90deg,#42d392,#8fe388)' :
      state.netscape > 25 ? 'linear-gradient(90deg,#f7df1e,#ffb800)' :
                             'linear-gradient(90deg,#ff2e63,#ff5ea8)';

    hpEls.ie.style.background =
      state.ie > 50 ? 'linear-gradient(90deg,#42d392,#8fe388)' :
      state.ie > 25 ? 'linear-gradient(90deg,#f7df1e,#ffb800)' :
                      'linear-gradient(90deg,#ff2e63,#ff5ea8)';
  }

  function setButtonsDisabled(disabled){
    attackBtns.forEach(b => b.disabled = disabled);
  }

  function centerOf(el){
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 3 };
  }

  function attack(attacker){
    if (state.over) return;
    const defender = attacker === 'netscape' ? 'ie' : 'netscape';

    const atkEl = fighters[attacker];
    const defEl = fighters[defender];
    const atkCenter = centerOf(atkEl);
    const defCenter = centerOf(defEl);

    // animación de golpe
    atkEl.classList.add('punching');
    setTimeout(() => atkEl.classList.remove('punching'), 400);

    // animación de daño
    defEl.classList.add('hurt');
    setTimeout(() => defEl.classList.remove('hurt'), 400);

    // daño aleatorio
    const dmg = 6 + Math.floor(Math.random() * 12);
    state[defender] = Math.max(0, state[defender] - dmg);
    render();

    // popup
    const atkText = ATTACKS[attacker][(Math.random() * ATTACKS[attacker].length) | 0];
    damagePop(defCenter.x, defCenter.y, `-${dmg}`, '#ff2e63');
    setTimeout(() => damagePop(atkCenter.x, atkCenter.y - 30, atkText, '#f7df1e'), 100);

    // burst de partículas
    burst(defCenter.x, defCenter.y, attacker === 'netscape' ? '#6ee7ff' : '#ff5ea8', 16);

    // mensaje
    const tauntList = TAUNTS[attacker];
    msgEl.textContent = tauntList[(Math.random() * tauntList.length) | 0];

    // fin del juego
    if (state[defender] <= 0) endGame(attacker);
  }

  function endGame(winner){
    state.over = true;
    setButtonsDisabled(true);

    const loser = winner === 'netscape' ? 'ie' : 'netscape';
    const winnerEl = fighters[winner];

    msgEl.textContent = winner === 'netscape'
      ? '🏆 ¡Netscape ha ganado la batalla! …pero IE vencerá la guerra.'
      : '🏆 ¡Internet Explorer ha ganado la batalla! El monopolio comienza…';

    const c = centerOf(winnerEl);
    confetti(c.x, c.y, 80);
    burst(c.x, c.y, '#f7df1e', 24);

    toast(winner === 'netscape'
      ? 'Netscape resiste… por ahora.'
      : 'IE gana. La fragmentación comienza.', 3500);
  }

  function reset(){
    state.netscape = MAX_HP;
    state.ie       = MAX_HP;
    state.over     = false;
    render();
    setButtonsDisabled(false);
    msgEl.textContent = 'Cada golpe resta vida al rival. IE tiene un as bajo la manga…';
  }

  // click en luchador
  Object.entries(fighters).forEach(([name, el]) => {
    el.addEventListener('click', () => attack(name));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        attack(name);
      }
    });
  });

  // botones
  attackBtns.forEach(btn => {
    btn.addEventListener('click', () => attack(btn.dataset.attack));
  });

  resetBtn.addEventListener('click', reset);

  render();
})();

/* =====================================================
   10. EASTER EGG: LOGO JS DEL HERO
   ===================================================== */
(function easterEgg(){
  const logo = document.getElementById('jsLogo');
  if (!logo) return;
  let clicks = 0;
  let lastClick = 0;

  function activate(){
    const r = logo.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    confetti(x, y, 100);
    burst(x, y, '#f7df1e', 30);
    toast('🎉 ¡Easter egg! JS nació en 10 días y hoy mueve la web.', 3200);
  }

  logo.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastClick > 1200) clicks = 0;
    lastClick = now;
    clicks++;

    if (clicks >= 5){
      clicks = 0;
      activate();
    } else {
      // pequeño rebote
      logo.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }],
        { duration: 220, easing: 'ease-out' }
      );
    }
  });

  // también con teclado
  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      logo.click();
    }
  });
})();

/* =====================================================
   11. MENSAJE DE BIENVENIDA
   ===================================================== */
window.addEventListener('load', () => {
  setTimeout(() => {
    toast('👇 Desliza para recorrer la historia. Prueba el minijuego de la Guerra de Navegadores.', 4200);
  }, 900);
});