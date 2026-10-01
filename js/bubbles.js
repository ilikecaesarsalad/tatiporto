/**
 * Subtle ambient bubble sound effect for the portfolio.
 * Uses Web Audio API to synthesize tiny bubble pops at random intervals.
 * Extremely quiet and relaxing — barely noticeable background ambience.
 * Activates only after the user's first interaction (autoplay-policy safe).
 * Respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (sessionStorage.getItem("bubbles-muted") === "1") return;

  var ctx = null;
  var started = false;
  var MIN_INTERVAL = 4000;
  var MAX_INTERVAL = 12000;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createBubble() {
    if (!ctx || ctx.state !== "running") return;

    var now = ctx.currentTime;
    var freq = rand(250, 620);
    var duration = rand(0.04, 0.09);
    var volume = rand(0.015, 0.04);

    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * rand(1.3, 1.8), now + duration);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + duration * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);

    // Occasionally play 2-3 tiny bubbles in quick succession for a natural feel
    if (Math.random() < 0.35) {
      var delay = rand(80, 200);
      setTimeout(function () { createBubble(); }, delay);
    }
  }

  function scheduleNext() {
    var wait = rand(MIN_INTERVAL, MAX_INTERVAL);
    setTimeout(function () {
      createBubble();
      scheduleNext();
    }, wait);
  }

  function init() {
    if (started) return;
    started = true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      // Start the first bubble after a gentle delay
      setTimeout(function () {
        createBubble();
        scheduleNext();
      }, 2000);
    } catch (e) {
      // Web Audio not supported — fail silently
    }
  }

  // Activate on first user interaction
  var events = ["click", "scroll", "keydown", "touchstart"];
  function onInteraction() {
    events.forEach(function (evt) {
      document.removeEventListener(evt, onInteraction, { capture: true });
    });
    init();
  }
  events.forEach(function (evt) {
    document.addEventListener(evt, onInteraction, { capture: true, once: false, passive: true });
  });
})();
