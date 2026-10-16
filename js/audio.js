/* ============================================================
   东方正在刷新 —— 音频
   由于静态部署不依赖外部资源，使用 Web Audio API 实时合成：
   ============================================================ */
(function (global) {
  'use strict';

  let ctx = null;
  let bgmGain = null;
  let isOn = false;
  let bgmTimer = null;

  function ensureCtx() {
    if (ctx) return ctx;
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      ctx = new C();
    } catch (e) {
      console.warn('AudioContext unsupported');
      return null;
    }
    return ctx;
  }

  function envGain(now, attack, decay, peak) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);
    return g;
  }

  function playFlip() {
    if (!isOn) return;
    const c = ensureCtx(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    const now = c.currentTime;
    const buf = c.createBuffer(1, c.sampleRate * 0.18, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length) * 0.6;
    }
    const src = c.createBufferSource();
    src.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3500;
    filter.Q.value = 1.2;
    const g = envGain(now, 0.005, 0.16, 0.18);
    src.connect(filter).connect(g).connect(c.destination);
    src.start(now);
    src.stop(now + 0.2);
  }

  function playLight() {
    if (!isOn) return;
    const c = ensureCtx(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    const now = c.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = c.createGain();
      const t0 = now + i * 0.07;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.18, t0 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.4);
      o.connect(g).connect(c.destination);
      o.start(t0);
      o.stop(t0 + 0.5);
    });
  }

  function playDone() {
    if (!isOn) return;
    const c = ensureCtx(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    const now = c.currentTime;
    [
      [1046.5, 0.15, 0.6],
      [1568,   0.20, 0.5],
      [1975.5, 0.25, 0.5]
    ].forEach(([f, peak, dur]) => {
      const o = c.createOscillator();
      o.type = 'triangle';
      o.frequency.value = f;
      const g = c.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(peak, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + dur);
      o.connect(g).connect(c.destination);
      o.start(now);
      o.stop(now + dur + 0.05);
    });
  }

  const MELODY = [
    { n: 5, dur: 0.5 }, { n: 5, dur: 0.5 }, { n: 6, dur: 0.5 }, { n: 2, dur: 0.5 },
    { n: 1, dur: 1.0 }, { n: 6, dur: 0.4 }, { n: 2, dur: 0.6 },
    { n: 1, dur: 1.0 }, { n: 5, dur: 0.5 }, { n: 5, dur: 0.5 },
    { n: 6, dur: 0.5 }, { n: 2, dur: 0.5 }, { n: 1, dur: 1.0 }
  ];
  const SCALE = [0, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];

  function playNote(freq, time, dur, gain) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, time + dur);
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.value = freq * 2;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0, time);
    g2.gain.linearRampToValueAtTime(gain * 0.3, time + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.001, time + dur);
    o.connect(g).connect(bgmGain);
    o2.connect(g2).connect(bgmGain);
    o.start(time);  o.stop(time + dur + 0.05);
    o2.start(time); o2.stop(time + dur + 0.05);
  }

  function bgmLoop() {
    if (!isOn || !ctx || !bgmGain) return;
    const c = ctx;
    const start = c.currentTime + 0.05;
    const totalDur = MELODY.reduce((s, m) => s + m.dur, 0);
    let t = start;
    MELODY.forEach(m => {
      if (m.n > 0) {
        playNote(SCALE[m.n], t, m.dur * 0.95, 0.10);
      }
      t += m.dur;
    });
    let t2 = start;
    MELODY.forEach(m => {
      if (m.n > 0) {
        playNote(SCALE[m.n] / 2, t2 + 0.25, 0.5, 0.06);
      }
      t2 += m.dur;
    });
    bgmTimer = setTimeout(bgmLoop, totalDur * 1000 - 50);
  }

  function start() {
    const c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') c.resume();
    if (!bgmGain) {
      bgmGain = c.createGain();
      bgmGain.gain.value = 0;
      bgmGain.connect(c.destination);
    }
    isOn = true;
    bgmGain.gain.cancelScheduledValues(c.currentTime);
    bgmGain.gain.setTargetAtTime(0.6, c.currentTime, 0.15);
    if (!bgmTimer) bgmLoop();
  }

  function stop() {
    isOn = false;
    if (bgmGain && ctx) {
      bgmGain.gain.cancelScheduledValues(ctx.currentTime);
      bgmGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    }
    if (bgmTimer) {
      clearTimeout(bgmTimer);
      bgmTimer = null;
    }
  }

  function bindToggle() {
    const btn = document.getElementById('musicToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (isOn) {
        stop();
        btn.classList.remove('is-on');
      } else {
        start();
        btn.classList.toggle('is-on', isOn);
      }
      btn.setAttribute('aria-pressed', String(isOn));
      btn.setAttribute('aria-label', isOn ? '关闭背景音乐' : '开启背景音乐');
      btn.title = isOn ? '关闭背景音乐' : '开启背景音乐';
      btn.querySelector('.music-state').textContent = isOn ? '播放中' : '音乐';
    });
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      document.hidden ? ctx.suspend() : (isOn && ctx.resume());
    });
  }

  global.H5_Audio = {
    init: bindToggle,
    playFlip, playLight, playDone,
    start, stop, isOn: () => isOn
  };
})(window);