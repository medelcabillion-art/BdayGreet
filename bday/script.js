(function(){
  'use strict';
  var $ = function(s){ return document.querySelector(s); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- state ---------- */
  var DEFAULTS = {
    n: 'Ate',
    f: 'Ading',
    m: `Happy Birthday, Ate! Ading 🎂💗
I’m so thankful to God for blessing my life with someone like you. You’re not just an Ate to me, but also someone I look up to and learn so much from. Thank you for always being there, for your guidance, your kindness, and for being someone I can count on. 🥹❤️
I’m also so blessed to see you serve God through worship leading. The way you use your gift to lead people into His presence is truly inspiring. And as a Children’s Church teacher, I know how much love, patience, and effort you give to the kids. You’re helping them know and love God, and I’m sure the seeds you’re planting in their hearts will mean so much someday. 🙏✨
And of course, I’m so proud of you as you continue your journey in nursing! 🩺🤍 You’re getting closer and closer to becoming a nurse, and I know all the hard work, sleepless nights, stress, and sacrifices will be worth it. Next year, you’ll finally graduate, and I can’t wait to see you reach that dream! 🎓✨
May God continue to strengthen you, guide you, and bless everything you do. May He give you more wisdom as you serve Him, more patience as you teach, and more strength as you continue your nursing journey.
Always remember that you’re loved, appreciated, and prayed for. Keep being the amazing Ate, worship leader, teacher, and future nurse that God has called you to be. ❤️
Happy Birthday again, Ate! 🎉🥳
I’m so proud of you, and I’m excited to see all the beautiful things God has prepared for your life. God bless you always! 🤍🙏`
  };
  var state = { n: DEFAULTS.n, f: DEFAULTS.f, m: DEFAULTS.m };
  try {
    var hp = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (hp.get('n')) state.n = hp.get('n').slice(0, 24);
    if (hp.get('f')) state.f = hp.get('f').slice(0, 28);
    if (hp.get('m')) state.m = hp.get('m').slice(0, 2000);
  } catch (e) {}

  /* ---------- sound ---------- */
  var soundOn = false, ac = null;
  function actx(){
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (ac && ac.state === 'suspended') { ac.resume(); }
    return ac;
  }
  function tone(freq, t0, dur, type, vol){
    var a = actx(); if (!a) return;
    var o = a.createOscillator(), g = a.createGain(), t = a.currentTime + t0;
    o.type = type || 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol || 0.14, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(a.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function sfx(kind){
    if (!soundOn) return;
    if (kind === 'light') tone(640 + Math.random() * 240, 0, 0.12, 'sine', 0.1);
    if (kind === 'pock') { tone(1500, 0, 0.05, 'square', 0.07); tone(950, 0.012, 0.08, 'sine', 0.12); }
    if (kind === 'flip') { tone(520, 0, 0.1, 'sine', 0.1); tone(780, 0.08, 0.14, 'sine', 0.1); }
    if (kind === 'wish') {
      [[392, 0, .28], [392, .3, .2], [440, .55, .5], [392, 1.1, .5], [523.25, 1.65, .5], [493.88, 2.2, .9]]
        .forEach(function(n){ tone(n[0], n[1], n[2], 'triangle', 0.14); });
    }
  }
  var soundBtn = $('#soundBtn');
  soundBtn.addEventListener('click', function(){
    soundOn = !soundOn;
    soundBtn.textContent = 'Sound: ' + (soundOn ? 'on' : 'off');
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) { actx(); tone(660, 0, .12, 'sine', .1); }
  });

  /* ---------- confetti ---------- */
  var cv = $('#confetti'), cx = cv.getContext('2d');
  var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), parts = [], raf = 0;
  var COLORS = ['#8B5CF6', '#C4B5FD', '#FF5FAE', '#FFC933', '#FFFFFF', '#6D28D9', '#FF9AD0', '#D9F53C'];
  function size(){
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', size); size();
  function burst(x, y, n, spread, angle, speed){
    if (reduce) return;
    for (var i = 0; i < n; i++) {
      var a = angle + (Math.random() - .5) * spread;
      var v = speed * (.4 + Math.random() * .8);
      parts.push({
        x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        r: 4 + Math.random() * 5, rot: Math.random() * 6.28, vr: (Math.random() - .5) * .35,
        c: COLORS[Math.floor(Math.random() * COLORS.length)], round: Math.random() < .35,
        life: 0, max: 90 + Math.random() * 70
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick(){
    cx.clearRect(0, 0, W, H);
    parts = parts.filter(function(p){ return p.life < p.max && p.y < H + 30; });
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.life++; p.vy += .28; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
      cx.globalAlpha = Math.max(0, Math.min(1, (p.max - p.life) / 25));
      cx.fillStyle = p.c;
      if (p.round) { cx.beginPath(); cx.arc(0, 0, p.r / 1.6, 0, 6.283); cx.fill(); }
      else { cx.fillRect(-p.r, -p.r / 2.5, p.r * 2, p.r / 1.25); }
      cx.restore();
    }
    if (parts.length) raf = requestAnimationFrame(tick);
    else { raf = 0; cx.clearRect(0, 0, W, H); }
  }
  function cannon(){
    burst(0, H, 70, .7, -0.95, 15);
    burst(W, H, 70, .7, -Math.PI + 0.95, 15);
  }

  /* ---------- headline ---------- */
  var PAL = ['#9B6BFF', '#FF6FB8', '#FFC933', '#D2C2FF', '#FFFFFF'];
  var title = $('#title'), l1 = $('#l1'), l2 = $('#l2');
  function letters(target, text, offset){
    target.textContent = '';
    var idx = offset, words = text.split(' ');
    words.forEach(function(word, wi){
      var w = document.createElement('span'); w.className = 'w';
      Array.from(word).forEach(function(chr){
        var s = document.createElement('span'); s.className = 'ch'; s.textContent = chr;
        s.style.setProperty('--c', PAL[idx % PAL.length]);
        s.style.setProperty('--i', idx);
        idx++; w.appendChild(s);
      });
      target.appendChild(w);
      if (wi < words.length - 1) { target.appendChild(document.createTextNode(' ')); idx++; }
    });
    return idx;
  }
  function shownName(){ return (state.n || '').trim() || 'Friend'; }
  function renderTitle(){
    var name = shownName();
    var next = letters(l1, 'Happy Birthday,', 0);
    letters(l2, name + '!', next);
    l2.style.setProperty('--k', Math.min(1, 9 / (name.length + 1)));
    title.setAttribute('aria-label', 'Happy Birthday, ' + name);
  }
  function cheer(){
    if (reduce) return;
    title.classList.remove('cheer'); void title.offsetWidth; title.classList.add('cheer');
    setTimeout(function(){ title.classList.remove('cheer'); }, 1600);
  }

  /* ---------- cake decoration ---------- */
  function frost(id, x, y, w, fill, seed){
    var n = Math.max(3, Math.floor(w / 38)), shapes = '';
    shapes += '<rect x="' + (x - 3) + '" y="' + y + '" width="' + (w + 6) + '" height="22" rx="11"/>';
    for (var i = 0; i < n; i++) {
      var cxp = x + 16 + i * ((w - 32) / (n - 1));
      var h = 14 + ((i * 5 + seed) % 4) * 9;
      shapes += '<rect x="' + (cxp - 8) + '" y="' + (y + 6) + '" width="16" height="' + (h + 10) + '" rx="8"/>';
    }
    $(id).innerHTML = '<g class="fr-o">' + shapes + '</g><g class="fr-f" style="fill:' + fill + '">' + shapes + '</g>';
  }
  function sprinkles(id, x, y, w, h, count, seed){
    var cols = ['#FFC933', '#FFFFFF', '#FF5FAE', '#C4B5FD', '#FFF3FB'], out = '', r = seed;
    function rnd(){ r = (r * 9301 + 49297) % 233280; return r / 233280; }
    for (var i = 0; i < count; i++) {
      var sx = x + 14 + rnd() * (w - 28), sy = y + 34 + rnd() * (h - 44), rot = Math.floor(rnd() * 180);
      out += '<rect x="' + sx.toFixed(1) + '" y="' + sy.toFixed(1) + '" width="9" height="3.6" rx="1.8" fill="' + cols[i % cols.length] + '" transform="rotate(' + rot + ' ' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')"/>';
    }
    $(id).innerHTML = out;
  }
  frost('#f1', 35, 214, 290, '#FF8CC8', 1);  sprinkles('#s1', 35, 214, 290, 76, 22, 7);
  frost('#f2', 75, 150, 210, '#FFF3FB', 2);  sprinkles('#s2', 75, 150, 210, 68, 14, 19);
  frost('#f3', 115, 90, 130, '#FF8CC8', 3);  sprinkles('#s3', 115, 90, 130, 64, 7, 31);

  /* ---------- candles ---------- */
  var candles = Array.prototype.slice.call(document.querySelectorAll('.candle'));
  var lit = candles.map(function(){ return false; });
  var status = $('#status'), mainBtn = $('#mainBtn'), afterMsg = '', busy = false;

  function update(){
    var n = lit.filter(Boolean).length;
    mainBtn.textContent = n === candles.length ? 'Blow them out!' : 'Light the candles';
    if (n === 0) status.textContent = afterMsg || 'Tap a candle to light it, or light them all at once.';
    else if (n < candles.length) status.textContent = n + ' of ' + candles.length + ' candles lit.';
    else status.textContent = 'All lit. Make a wish, then blow them out.';
  }
  function setCandle(i, on){
    lit[i] = on;
    var c = candles[i];
    c.classList.toggle('lit', on);
    c.setAttribute('aria-pressed', String(on));
    c.setAttribute('aria-label', 'Candle ' + (i + 1) + ', ' + (on ? 'lit' : 'unlit'));
    if (on) afterMsg = '';
    update();
  }
  candles.forEach(function(c, i){
    c.addEventListener('click', function(){ if (busy) return; setCandle(i, !lit[i]); sfx('light'); });
    c.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.dispatchEvent(new Event('click')); }
    });
  });
  function lightAll(){
    busy = true;
    var k = 0;
    candles.forEach(function(_, i){
      if (!lit[i]) { setTimeout(function(){ setCandle(i, true); sfx('light'); }, k * 110); k++; }
    });
    setTimeout(function(){ busy = false; }, k * 110 + 50);
  }
  function blowOut(){
    busy = true; sfx('wish');
    var k = 0;
    candles.forEach(function(c, i){
      if (lit[i]) {
        setTimeout(function(){
          setCandle(i, false);
          c.classList.add('puff');
          setTimeout(function(){ c.classList.remove('puff'); }, 1200);
        }, k * 70);
        k++;
      }
    });
    setTimeout(function(){
      afterMsg = 'Ace! Wish sent. Now go eat cake.';
      update();
      var r = $('#cake').getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height * .3, 110, Math.PI * 2, -Math.PI / 2, 11);
      cannon(); cheer();
      busy = false;
    }, k * 70 + 200);
  }
  mainBtn.addEventListener('click', function(){
    if (busy) return;
    if (lit.every(Boolean)) blowOut(); else lightAll();
  });

  /* ---------- pickleballs ---------- */
  var BALL_COUNT = 6;
  var WISHES = [
    'May your dinks be soft and your third-shot drops be perfect, {name}.',
    'The only kitchen you\u2019re allowed in today is the one with cake.',
    'Wishing you a year of great rallies and creative excuses.',
    'May every line call go your way and every serve land in.',
    'Have a big dill of a birthday, {name}. Sorry, not sorry.',
    'Another year older and still winning by two.'
  ];
  var wishes = [], hitCount = 0;
  var wishEl = $('#wish'), countEl = $('#count'), againEl = $('#again');
  function shuffle(a){
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function showWish(text){
    wishEl.textContent = text;
    wishEl.classList.remove('pop-in'); void wishEl.offsetWidth; wishEl.classList.add('pop-in');
  }
  function renderBalls(){
    var wrap = $('#balloons'); wrap.textContent = '';
    hitCount = 0; wishes = shuffle(WISHES);
    countEl.textContent = '0 of ' + BALL_COUNT + ' hit';
    againEl.hidden = true;
    showWish('Tap a ball to hit it.');
    for (var i = 0; i < BALL_COUNT; i++) {
      (function(i){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'ball';
        b.style.setProperty('--d', (i * .18) + 's');
        b.setAttribute('aria-label', 'Hit ball ' + (i + 1));
        b.addEventListener('click', function(){
          var r = b.getBoundingClientRect();
          b.classList.add('hit'); b.disabled = true;
          sfx('pock');
          burst(r.left + r.width / 2, r.top + r.height / 2, 28, Math.PI * 2, -Math.PI / 2, 6);
          showWish(wishes[i].replace('{name}', shownName()));
          hitCount++;
          countEl.textContent = hitCount + ' of ' + BALL_COUNT + ' hit';
          if (hitCount === BALL_COUNT) againEl.hidden = false;
        });
        wrap.appendChild(b);
      })(i);
    }
  }
  $('#againBtn').addEventListener('click', renderBalls);

  /* ---------- card + editor ---------- */
  var flip = $('#flip'), flipBtn = $('#flipBtn');
  function renderCard(){
    var name = shownName();
    $('#cardFor').textContent = name;
    $('#cardName').textContent = name;
    var msgBox = $('#cardMsg');
    msgBox.textContent = '';
    ((state.m || '').trim() || DEFAULTS.m).split(/\n+/).forEach(function(line){
      if (!line.trim()) return;
      var p = document.createElement('p'); p.textContent = line.trim(); msgBox.appendChild(p);
    });
    $('#cardFrom').textContent = (state.f || '').trim() || DEFAULTS.f;
  }
  function toggleCard(){
    var open = !flip.classList.contains('open');
    flip.classList.toggle('open', open);
    flipBtn.textContent = open ? 'Close the card' : 'Open the card';
    flipBtn.setAttribute('aria-pressed', String(open));
    sfx('flip');
    if (open) {
      var r = flip.getBoundingClientRect();
      burst(r.left + r.width / 2, r.top + r.height / 2, 60, Math.PI * 2, -Math.PI / 2, 9);
    }
  }
  flip.addEventListener('click', function(){ if (!flip.classList.contains('open')) toggleCard(); });
  flipBtn.addEventListener('click', toggleCard);

  var inName = $('#inName'), inFrom = $('#inFrom'), inMsg = $('#inMsg'), note = $('#note');
  inName.value = state.n === DEFAULTS.n ? '' : state.n;
  inFrom.value = state.f === DEFAULTS.f ? '' : state.f;
  inMsg.value  = state.m === DEFAULTS.m ? '' : state.m;
  function sync(){
    state.n = inName.value || DEFAULTS.n;
    state.f = inFrom.value || DEFAULTS.f;
    state.m = inMsg.value || DEFAULTS.m;
    renderTitle(); renderCard();
  }
  [inName, inFrom, inMsg].forEach(function(el){ el.addEventListener('input', sync); });

  function buildLink(){
    var p = new URLSearchParams({ n: state.n, f: state.f, m: state.m }).toString();
    var base = '';
    try { base = location.href.split('#')[0]; } catch (e) {}
    return base + '#' + p;
  }
  $('#copyBtn').addEventListener('click', function(){
    var url = buildLink(), out = $('#linkOut');
    out.hidden = false; out.value = url; out.focus(); out.select();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function(){ note.textContent = 'Link copied. Send it to someone you love.'; },
        function(){ note.textContent = 'Copy the link from the box above.'; }
      );
    } else {
      note.textContent = 'Copy the link from the box above.';
    }
  });

  /* ---------- go ---------- */
  renderTitle(); renderCard(); renderBalls(); update();
  setTimeout(function(){ title.classList.remove('animate'); }, 2400);
})();
