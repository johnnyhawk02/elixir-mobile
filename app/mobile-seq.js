// ---- step sequencers: holding a fader opens one for it: 2 to 64 steps (edited a page of 16 at a time), each an offset
// from the fader's setting (up or down, up to depth of its range) that it takes while playing (the step is the bar's 16th counted from the start,
// wrapped at the length, so short ones run against the bar), jumping to it or, with slew, gliding to it over up to a
// whole step; each step lasts a 16th note up to 8 bars. The fader still moves its setting meanwhile, and stopping
// (or switching the sequencer off) puts the setting back.
// Draw the steps with a finger (drag across to paint), randomise them (random, drunk, wobbly, ramp, s&h or sparse), or
// switch it off; a fader with one running is marked. Presets keep them ----
const mSeqSteps = Array.from({ length: 16 }, (_, i) => { const c = document.createElement('i'); c.dataset.i = i; $('m-seq-steps').append(c); return c; });
let mSeqF = null, mSeqPage = 0;
const SEQ_MAX = 64;
// (a sequence's steps, always 64 long: a shorter one, saved before, is padded with none)
const seqVals = (v) => Array.from({ length: SEQ_MAX }, (_, i) => (Number.isFinite(v[i]) ? v[i] : 0));
// speed: how long each step lasts, in 16ths: a 16th note (1) up to 8 bars (128); counted from the bar's 16ths, so every
// speed stays in time with the beat
const SEQ_STEPS = [1, 2, 4, 8, 16, 32, 64, 128];
const stepName = (v) => (v < 16 ? `1/${16 / v}` : v === 16 ? '1 bar' : `${v / 16} bars`);
// a step's offset, -1..1 of depth, in twentieths
const mSeqOff = (x) => Math.round(Math.max(-1, Math.min(1, x)) * 20) / 20;
const newSeq = () => ({ on: true, len: 16, slew: 0, step: 1, depth: 50, vals: new Array(SEQ_MAX).fill(0) });
// the value heard: the setting moved by the current offset
function mSeqApply(f) {
  const q = f.seq;
  if (f.base === null) f.base = f.get();
  f.put(f.base + f.off * (q ? q.depth / 100 : 0) * (f.hiOf() - f.min));
}
// back to the setting, the sequencer let go
function mSeqRelease(f) {
  if (f.base === null) return;
  const b = f.base; f.glide = null; f.off = 0; f.base = null; f.put(b);
}
function mSeqOpen(fd) {
  if (!fd.seq) fd.seq = newSeq();
  mSeqF = fd; mSeqPage = 0; $('m-seq-name').textContent = fd.label;
  $('m-seq').hidden = false; mSeqDraw();
}
function mSeqDraw() {
  const fd = mSeqF, q = fd.seq;
  const at = mSeqPage * 16;
  mSeqSteps.forEach((c, i) => {
    const v = q.vals[at + i];
    c.style.setProperty('--up', Math.max(0, v)); c.style.setProperty('--dn', Math.max(0, -v));
    c.classList.toggle('off', at + i >= q.len);
  });
  [...$('m-seq-pages').children].forEach((b, p) => { b.setAttribute('aria-selected', p === mSeqPage); b.classList.toggle('past', p * 16 >= q.len); });
  $('m-seq-type').textContent = SEQ_RAND[mSeqType][0];
  $('m-seq-depth').style.setProperty('--w', q.depth / 100); $('m-seq-depth-out').textContent = `±${q.depth}%`;
  $('m-seq-len').style.setProperty('--w', (q.len - 2) / (SEQ_MAX - 2)); $('m-seq-len-out').textContent = `${q.len} steps`;
  $('m-seq-slew').style.setProperty('--w', q.slew / 100); $('m-seq-slew-out').textContent = q.slew ? `${q.slew}%` : 'off';
  $('m-seq-speed').style.setProperty('--w', (SEQ_STEPS.indexOf(q.step) + 1) / SEQ_STEPS.length); $('m-seq-speed-out').textContent = stepName(q.step);
  $('m-seq-on').setAttribute('aria-pressed', q.on); $('m-seq-on').textContent = q.on ? 'on' : 'off';
  mSeqMarks();
}
const mSeqMarks = () => mFaders.forEach((f) => f.el.classList.toggle('seq', !!(f.seq && f.seq.on)));
// presets keep them: song.seqs, by fader (its box and label); a preset without one clears it
const mSnapSong = songSnapshot, mUseSong = useSong;
songSnapshot = function () {
  const seqs = {};
  // (with the settings, not the values heard, saved)
  const held = mFaders.filter((f) => f.base !== null).map((f) => [f, f.get()]);
  for (const [f] of held) f.put(f.base);
  for (const f of mFaders) if (f.seq) seqs[f.key] = { on: f.seq.on, len: f.seq.len, slew: f.seq.slew, step: f.seq.step, depth: f.seq.depth, rel: true, vals: f.seq.vals.slice() };
  const song = { ...mSnapSong(), seqs, xdepth: Number($('xdepth').value) };
  for (const [f, v] of held) f.put(v);
  return song;
};
useSong = function (g, keepTempo) {
  mUseSong(g, keepTempo);
  mXDepth(typeof g.xdepth === 'number' ? g.xdepth : 100);
  for (const f of mFaders) {
    const q = g.seqs && g.seqs[f.key];
    f.base = null; f.off = 0; f.glide = null;
    // (sequences saved before they were offsets held values: they become offsets from the middle of the range)
    const hi = f.hiOf(), vals = q ? (q.rel ? q.vals.slice() : q.vals.map((v) => mSeqOff(((v - f.min) / (hi - f.min || 1)) * 2 - 1))) : null;
    f.seq = q ? { on: !!q.on, len: Math.max(2, Math.min(SEQ_MAX, q.len | 0)), slew: q.slew || 0, step: SEQ_STEPS.includes(q.step) ? q.step : 1, depth: typeof q.depth === 'number' ? q.depth : 50, vals: seqVals(vals) } : null;
  }
  if (mSeqF) { if (mSeqF.seq) mSeqDraw(); else $('m-seq-close').click(); }
  mSeqMarks();
};
// painting: a step takes the offset at the finger's height (the middle is none); dragging across paints the steps it passes
{
  const box = $('m-seq-steps');
  let painting = false;
  const paint = (e) => {
    const r = box.getBoundingClientRect(), cols = 8, rows = 2;
    const col = Math.max(0, Math.min(cols - 1, Math.floor((e.clientX - r.left) / r.width * cols)));
    const row = Math.max(0, Math.min(rows - 1, Math.floor((e.clientY - r.top) / r.height * rows)));
    const c = mSeqSteps[row * cols + col], cr = c.getBoundingClientRect();
    if (c.classList.contains('off')) return;
    const o = mSeqF.seq.vals[mSeqPage * 16 + row * cols + col] = mSeqOff(1 - 2 * (e.clientY - cr.top) / cr.height);
    $('m-seq-val').textContent = `${o > 0 ? '+' : o < 0 ? '−' : ''}${Math.round(Math.abs(o) * mSeqF.seq.depth)}%`;
    mSeqDraw();
  };
  box.addEventListener('pointerdown', (e) => { box.setPointerCapture(e.pointerId); painting = true; paint(e); });
  box.addEventListener('pointermove', (e) => { if (painting) paint(e); });
  const stop = () => { painting = false; };
  box.addEventListener('pointerup', stop); box.addEventListener('pointercancel', stop);
}
// the length (2 at the left to 64 at the right) and the slew (off to a whole step): horizontal bars
function mSeqBar(bar, setFrac) {
  const at = (e) => { const r = bar.getBoundingClientRect(); setFrac(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))); mSeqDraw(); };
  let held = false;
  bar.addEventListener('pointerdown', (e) => { bar.setPointerCapture(e.pointerId); held = true; at(e); });
  bar.addEventListener('pointermove', (e) => { if (held) at(e); });
  bar.addEventListener('pointerup', () => { held = false; }); bar.addEventListener('pointercancel', () => { held = false; });
}
mSeqBar($('m-seq-len'), (x) => { mSeqF.seq.len = 2 + Math.round(x * (SEQ_MAX - 2)); });
mSeqBar($('m-seq-slew'), (x) => { mSeqF.seq.slew = Math.round(x * 20) * 5; });
mSeqBar($('m-seq-speed'), (x) => { mSeqF.seq.step = SEQ_STEPS[Math.min(SEQ_STEPS.length - 1, Math.floor(x * SEQ_STEPS.length))]; });
mSeqBar($('m-seq-depth'), (x) => { mSeqF.seq.depth = Math.round(x * 20) * 5; if (mSeqF.base !== null) mSeqApply(mSeqF); });
// the pages: 1-16, 17-32, 33-48, 49-64
for (let p = 0; p < SEQ_MAX / 16; p++) {
  const b = document.createElement('button'); b.type = 'button'; b.className = 'm-btn'; b.setAttribute('role', 'tab'); b.textContent = `${p * 16 + 1}-${p * 16 + 16}`;
  b.addEventListener('click', () => { mSeqPage = p; mSeqDraw(); }); $('m-seq-pages').append(b);
}
// the kinds of randomise, each making the steps over the length (and on past it, so a longer length carries on):
// random: any offset each step; drunk: a walk, a small step up or down from the last; wobbly: two slow waves together,
// a smooth wander that comes back round at the length; ramp: a rise or fall over the length; s&h: a new random
// offset held for 2 to 4 steps; sparse: mostly none, now and then a spike
const rr = () => Math.random() * 2 - 1;
const SEQ_RAND = [
  ['random', (n) => Array.from({ length: SEQ_MAX }, rr)],
  ['drunk', () => { let v = rr() * 0.5; return Array.from({ length: SEQ_MAX }, () => { v += rr() * 0.3; if (v > 1 || v < -1) v = Math.sign(v) * 2 - v; return v; }); }],
  ['wobbly', (n) => { const a = 1 + Math.floor(Math.random() * 2), b = 2 + Math.floor(Math.random() * 3), pa = Math.random() * 6.3, pb = Math.random() * 6.3, mix = 0.3 + Math.random() * 0.4;
    return Array.from({ length: SEQ_MAX }, (_, i) => (1 - mix) * Math.sin(2 * Math.PI * a * i / n + pa) + mix * Math.sin(2 * Math.PI * b * i / n + pb)); }],
  ['ramp', (n) => { const up = Math.random() < 0.5; return Array.from({ length: SEQ_MAX }, (_, i) => { const x = (i % n) / Math.max(1, n - 1) * 2 - 1; return up ? x : -x; }); }],
  ['s&h', () => { const hold = 2 + Math.floor(Math.random() * 3); let v = 0; return Array.from({ length: SEQ_MAX }, (_, i) => { if (i % hold === 0) v = rr(); return v; }); }],
  ['sparse', () => Array.from({ length: SEQ_MAX }, () => (Math.random() < 0.22 ? rr() : 0))],
];
const SEQ_TYPE_KEY = 'elixir-mobile-seqrand';
let mSeqType = (() => { try { const i = SEQ_RAND.findIndex(([n]) => n === localStorage.getItem(SEQ_TYPE_KEY)); return i < 0 ? 0 : i; } catch (e) { return 0; } })();
$('m-seq-type').addEventListener('click', () => { mSeqType = (mSeqType + 1) % SEQ_RAND.length; try { localStorage.setItem(SEQ_TYPE_KEY, SEQ_RAND[mSeqType][0]); } catch (e) {} mSeqDraw(); });
$('m-seq-rand').addEventListener('click', () => { const q = mSeqF.seq; q.vals = SEQ_RAND[mSeqType][1](q.len).map(mSeqOff); q.on = true; mSeqDraw(); });
$('m-seq-on').addEventListener('click', () => { mSeqF.seq.on = !mSeqF.seq.on; if (!mSeqF.seq.on) mSeqRelease(mSeqF); mSeqDraw(); });
mCloser('m-seq', () => { mSeqF = null; });
// the glides, a frame at a time while any is moving
let mGlideOn = false;
function mGlideRun() {
  if (mGlideOn) return;
  mGlideOn = true;
  const tick = () => {
    const now = performance.now();
    let any = false;
    for (const f of mFaders) {
      const g = f.glide; if (!g) continue;
      const k = Math.min(1, (now - g.t0) / g.ms);
      f.off = g.from + (g.to - g.from) * k; mSeqApply(f);
      if (k < 1 && f.seq && f.seq.on) any = true; else f.glide = null;
    }
    if (any) requestAnimationFrame(tick); else mGlideOn = false;
  };
  requestAnimationFrame(tick);
}
$('m').addEventListener('contextmenu', (e) => e.preventDefault());
// one step of a fader's sequencer: its offset, jumped to or, with slew, glided to over that share of the step
function mSeqStep(f, i, ms) {
  const q = f.seq, k = Math.floor(i) % q.len, to = q.vals[k] || 0;
  if (q.slew) { f.glide = { from: f.off, to, t0: performance.now(), ms: q.slew / 100 * ms }; mGlideRun(); } else { f.glide = null; f.off = to; mSeqApply(f); }
  if (f === mSeqF) {
    mSeqSteps.forEach((c, j) => c.classList.toggle('now', mSeqPage * 16 + j === k));
    [...$('m-seq-pages').children].forEach((b, p) => b.classList.toggle('now', p === Math.floor(k / 16)));
  }
}
// stopping puts every fader back to its setting
new MutationObserver(() => {
  if ($('play').getAttribute('aria-pressed') === 'true') return;
  mFaders.forEach(mSeqRelease); mSeqSteps.forEach((c) => c.classList.remove('now'));
  mBarBtns.forEach((b) => b.classList.remove('pending')); mBarBtns.clear();
  if (mPending) { mPending = null; mDrawPresets(); }
}).observe($('play'), { attributes: true, attributeFilter: ['aria-pressed'] });
// on each 16th (as the audio thread reaches it, ahead of the output), every running sequencer steps its fader
// following the groove (user settings, seq tab; on unless switched off, kept in this browser)
const SEQ_GROOVE_KEY = 'elixir-mobile-seqgroove';
let mSeqGroove = (() => { try { return localStorage.getItem(SEQ_GROOVE_KEY) !== '0'; } catch (e) { return true; } })();
let mSeqLast = -2;
// the drum (groove track) a fader belongs to: a voice page's drum, a perf slot set to a drum's setting; else -1
function mSeqTrack(f) {
  const v = /^m-voice-(\d)/.exec(f.key); if (v) return Number(v[1]) - 1;
  const sl = /^m-faders:slot(\d+)/.exec(f.key); if (sl) { const d = XN.indexOf(mSlots[Number(sl[1])][0]); if (d >= 0) return d; }
  return -1;
}
const mOnEvent = onEvent;
onEvent = function (ev) {
  // the bar waiting randomises come in on: stop their buttons' flash as that bar is heard
  if (ev.type === 'step' && ev.step === 0 && mBarBtns.size) {
    const bs = [...mBarBtns]; mBarBtns.clear();
    setTimeout(() => bs.forEach((b) => b.classList.remove('pending')), ctx && ctx.outputLatency ? ctx.outputLatency * 1000 : 0);
  }
  // the bar a waiting preset comes in on: stop its flash as that bar is heard
  if (ev.type === 'step' && ev.step === 0 && mPending) {
    const p = mPending; setTimeout(() => { if (mPending === p) { mPending = null; mDrawPresets(); } }, ctx && ctx.outputLatency ? ctx.outputLatency * 1000 : 0);
  }
  if (ev.type === 'step' && playing) {
    const n = ev.bar * 16 + ev.step, stepMs = 60000 / perf.tempo / 4, fresh = n !== mSeqLast + 1;
    mSeqLast = n;
    // a step each time the count reaches the step length: on the grid; or, following the groove, each 16th as late or
    // early as the groove puts that 16th's hits on the fader's drum (all the drums' average for a fader that isn't one
    // drum's), booked a 16th ahead so an early one can still land before its grid time
    const off = mSeqGroove ? grooveMsg().off : null;
    const due = (k) => mFaders.filter((f) => f.seq && f.seq.on && k % (f.seq.step || 1) === 0);
    if (!off || fresh) for (const f of due(n)) mSeqStep(f, n / (f.seq.step || 1), stepMs * (f.seq.step || 1));
    if (off) {
      const k = n + 1, s16 = k % 16;
      for (const f of due(k)) {
        const t = mSeqTrack(f), o = t >= 0 ? off[t][s16] : off.reduce((a, r) => a + r[s16], 0) / off.length, len = f.seq.step || 1;
        // (its step and length as booked: the speed may change before it lands)
        setTimeout(() => { if (playing && f.seq && f.seq.on) mSeqStep(f, k / len, stepMs * len); }, Math.max(0, stepMs * (1 + o)));
      }
    }
  } else if (ev.type === 'step') mSeqLast = -2;
  mOnEvent(ev);
};

