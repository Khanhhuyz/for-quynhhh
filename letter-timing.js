/* Pure timing functions shared by the letter player and its checks. */
globalThis.LetterTiming = (() => {
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  function createCues(entries, start, end) {
    if (!entries.length || !(end > start)) return [];
    const weights = entries.map(entry => clamp(entry.text.length, 24, 100));
    const total = weights.reduce((a, b) => a + b, 0);
    // Leave a quiet ending after the signature, rather than revealing it at the last instant.
    const span = Math.max(0, end - start - Math.min(4, (end - start) / 10));
    let consumed = 0;
    let previous = start;
    return entries.map((entry, i) => {
      const auto = start + (consumed / total) * span;
      const custom = Number.isFinite(entry.at) ? start + Math.max(0, entry.at) : auto;
      const at = clamp(Math.max(previous, custom), start, end);
      previous = at;
      consumed += weights[i];
      return {...entry, time: at};
    });
  }
  function snapshot(cues, time, start, end) {
    const current = Number.isFinite(time) ? time : start;
    return {
      visible: cues.reduce((count, cue) => count + Number(current >= cue.time), 0),
      elapsed: clamp(current - start, 0, end - start),
      finished: current >= end,
    };
  }
  const formatTime = seconds => { const s = Math.max(0, Math.floor(Number(seconds) || 0)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  return Object.freeze({createCues, snapshot, formatTime});
})();
