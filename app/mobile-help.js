// ---- help me! (the button by the title): getting started first, then a tab each for the pages and the features ----
const HELP = [
  ['start', 'getting started', `<p>Elixir is a six voice drum machine: drum 1, 2 and 3, snare, cymbal and hihat. Three steps to a beat:</p>
<ol><li>Press <b>play</b>.</li><li>On <b>perf</b>, press <b>everything</b> until you like what you hear: each press is a new beat, kit, effects and mix.</li>
<li>Play the faders, or press <b>kit</b>, <b>pattern</b> or <b>alter</b> to change one part. <b>undo</b> takes back the last one.</li></ol>
<p>The buttons along the bottom change page; the page's name is at the top right. Drag a fader up or down; double tap its name to reset it. Hold a fader to give it a step sequencer.</p>
<p>When you like it, <b>prst</b> › <b>save new</b>. <b>rec</b> records a WAV, <b>loop</b> a loop that repeats seamlessly.</p>`],
  ['perf', 'perf: play it live', `<p>Twelve faders for playing, four by three, and the randomise buttons down the right.</p>
<ul><li><b>everything</b>: a new beat (genre, groove, kit, effects, mix). <b>kit</b>: new sounds. <b>pattern</b>: a new beat on the same sounds. <b>alter</b>: the sounds nudged about 10%.</li>
<li><b>crossfeed</b>: a new crossfeed patch (see fx). <b>random fx</b>: new effects and sends, echo times on musical lengths. <b>alter fx</b>: the effects nudged.</li>
<li>Tick <b>next bar</b> and every randomise waits for the start of the next bar.</li>
<li>Tick <b>assign</b>, then tap a fader to choose what it does: any fader from any page, or any drum's setting.</li>
<li>Hold a randomise button for its settings (see more).</li></ul>`],
  ['beat', 'beat: the pattern', `<p>Tempo, genre, beat and energy; fills, rush, rush on and velocity; groove, depth and accent.</p>
<ul><li><b>genre</b> picks a style, <b>beat</b> one of its grooves, <b>energy</b> how busy it is, <b>fills</b> how often it fills.</li>
<li><b>rush</b> builds a roll: the chosen drum (<b>rush on</b>) rolls faster and faster while the others drop out and a high-pass rises. Push it up for a build, drop it for the drop. Its curve is in settings (the gear).</li>
<li><b>groove</b> and <b>depth</b> give it swing or push; <b>accent</b> how loud the accents are.</li></ul>`],
  ['voice', 'voice: shape a drum', `<p>Every setting of one drum. Pick the drum along the top, then a tab:</p>
<ul><li><b>tone</b>: tuning, wave and fm. <b>shape</b>: the envelope, the pitch drop and the click (the attack's sample).</li>
<li><b>filter</b>: cutoff, resonance, type and drive, then the drum's volume, pan, sample rate and drive. <b>mod</b>: its lfo and what velocity does.</li></ul>`],
  ['x/y', 'x/y: two pads', `<p>Each pad moves two settings at once. Over each pad, pick what left-right (x) and up-down (y) do: first where (a drum, beat, perf, fx, mix or master), then what. Drag a finger around the pad.</p>`],
  ['fx', 'fx: echo, ring mod, crossfeed', `<ul><li><b>echo</b>: send, time (musical lengths), tone, feedback and width; tick <b>ping pong</b> to bounce it left and right.</li>
<li><b>ring mod</b>: send, wave and frequency, for metallic tones.</li>
<li><b>crossfeed</b>: drums feeding each other. A row is the drum it comes from, a column the drum it goes into; tap a column's name to pick what it changes there (fm, filter or ring). Drag a cell up or down to set it; double tap to clear.</li></ul>`],
  ['mix', 'mix: levels and sends', `<p>Each drum's level (the big faders), and how much of it goes to the echo and to the ring mod (the short rows above).</p>`],
  ['mstr', 'mstr: the master chain', `<p>The whole mix runs top to bottom:</p>
<ul><li><b>drum 1 sidechain</b>: drum 1 (the kick) ducks the rest; the meter shows how much. <b>space</b> carves the kick's room out of the others.</li>
<li><b>distortion</b>: mix, type, drive, colour, tone and volume.</li><li><b>compressor</b>: glues it together; the meter shows the gain reduction.</li></ul>`],
  ['prst', 'prst: presets', `<ul><li>Tap a preset to load it: it flashes until the next bar, then takes over. Untick the tempo box to keep your tempo.</li>
<li>The star makes it a favourite (favourites are listed first).</li>
<li><b>save new</b> keeps what you hear; <b>save over</b> replaces the one loaded.</li>
<li><b>export presets</b> saves your presets to a file (it never deletes anything); <b>import</b> reads one back.</li></ul>`],
  ['seq', 'step sequencers', `<p>Hold any fader for half a second and it gets a step sequencer: 2 to 64 steps, each moving the fader up or down from where you leave it, so you can still play it.</p>
<ul><li>Paint the steps with a finger: sixteen at a time, the buttons above them pick which sixteen (the one playing is underlined).</li>
<li><b>randomise</b> makes new steps; the button beside it picks the kind (tap to change): random, drunk (a wandering walk), wobbly (smooth waves that loop), ramp, s&amp;h (held steps) or sparse (now and then a spike).</li><li><b>speed</b> is each step's length, a 16th up to 8 bars. <b>slew</b> glides between steps. <b>depth</b> is how far they reach.</li>
<li><b>on</b> turns it on and off. A fader with a sequencer running has its name inverted. Presets keep them.</li>
<li>The steps follow the groove and its depth, landing with the swung hits; switch that off in the person button's <b>seq</b> tab.</li></ul>`],
  ['rec', 'recording', `<ul><li><b>rec</b> starts recording (and playing); press it again to stop, and the WAV downloads.</li>
<li><b>loop</b> records an exact loop from the next bar and downloads it, ready to loop in any other app. Hold it to choose 1, 2, 4, 8, 16, 32, 64 or 128 bars.</li></ul>`],
  ['more', 'more', `<ul><li>Hold a randomise button to open the randomisers' settings, the ranges and chances each one uses.</li>
<li>The person button: your settings. Its <b>midi</b> tab says which MIDI CC moves each perf fader, with presets (cc1 to cc12, cc13 to cc24) and your own.</li>
<li>The gear: settings, including the <b>rush</b> graph of how the rush builds (drag its squares).</li>
<li>Install it as an app: <b>install app</b> on the presets page, or your browser's "Add to home screen". It works offline.</li>
<li>The version number is by the title; the latest arrives when you open the app with a connection.</li></ul>`],
];
let mHelpTab = 0;
function mHelpDraw() {
  const tabs = $('m-help-tabs'); tabs.innerHTML = '';
  HELP.forEach(([name], i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'm-btn'; b.setAttribute('role', 'tab'); b.textContent = name;
    b.setAttribute('aria-selected', i === mHelpTab); b.addEventListener('click', () => { mHelpTab = i; mHelpDraw(); }); tabs.append(b);
  });
  const [, title, body] = HELP[mHelpTab];
  $('m-help-text').innerHTML = `<h3>${title}</h3>${body}`; $('m-help-text').scrollTop = 0;
}
$('m-help-open').addEventListener('click', () => { mHelpTab = 0; mHelpDraw(); $('m-help').hidden = false; });
mCloser('m-help');
