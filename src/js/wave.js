/**
 * Procedural Wave Generator
 * ─────────────────────────
 * Generates organic, non-repeating waves using superimposed sine functions
 * with irrational frequency ratios + simplex-inspired noise.
 * Renders on a <canvas> element positioned as footer edge.
 */

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618
const TAU = Math.PI * 2;

/* ── Wave layers ─────────────────────────────────────────────
   Each layer is a sine wave with its own frequency, amplitude & speed.
   Using irrational frequency ratios ensures the composite wave never
   visibly repeats. */
const LAYERS = [
  { freq: 1.0,         amp: 0.35, speed: 0.4,   phase: 0       },
  { freq: PHI,         amp: 0.25, speed: -0.3,   phase: 1.3     },
  { freq: Math.PI,     amp: 0.15, speed: 0.55,   phase: 2.7     },
  { freq: Math.E,      amp: 0.12, speed: -0.45,  phase: 0.8     },
  { freq: Math.SQRT2,  amp: 0.10, speed: 0.35,   phase: 4.1     },
  { freq: PHI * PHI,   amp: 0.08, speed: -0.25,  phase: 3.5     },
  { freq: 4.669,       amp: 0.06, speed: 0.6,    phase: 5.2     }, // Feigenbaum δ
];

/* ── Simple 1D value noise ──────────────────────────────────
   Adds subtle irregularity so it doesn't look "too mathy". */
function hashFloat(n) {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function smoothNoise(x) {
  const i = Math.floor(x);
  const f = x - i;
  const t = f * f * (3 - 2 * f); // smoothstep
  return hashFloat(i) * (1 - t) + hashFloat(i + 1) * t;
}

/* ── Main Wave class ──────────────────────────────────────── */
export class ProceduralWave {
  constructor(canvasEl, options = {}) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');

    // Config
    this.fillColor  = options.fillColor  || '#050505';
    this.resolution = options.resolution || 3;     // px per sample (lower = smoother)
    this.waveHeight = options.waveHeight || 0.65;  // 0-1, how much of canvas the wave occupies
    this.noiseAmp   = options.noiseAmp   || 0.08;  // Noise contribution
    this.noiseFreq  = options.noiseFreq  || 2.5;

    // State
    this.time = 0;
    this.raf = null;
    this.visible = true;
    this.dpr = 1;

    // Bind
    this._tick = this._tick.bind(this);
    this._resize = this._resize.bind(this);

    // Setup
    this._resize();
    window.addEventListener('resize', this._resize);
    this._setupObserver();
    this.start();
  }

  /* ── Resize handling ── */
  _resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width  = rect.width;
    this.height = rect.height;
    this.canvas.width  = this.width  * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width  = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /* ── IntersectionObserver for perf ── */
  _setupObserver() {
    if (!('IntersectionObserver' in window)) return;
    this._observer = new IntersectionObserver(
      ([entry]) => { this.visible = entry.isIntersecting; },
      { rootMargin: '200px' }
    );
    this._observer.observe(this.canvas);
  }

  /* ── Compute wave Y at position x (0..1) ── */
  _sampleWave(normalizedX) {
    let y = 0;

    // Superimpose all sine layers
    for (let i = 0; i < LAYERS.length; i++) {
      const l = LAYERS[i];
      y += l.amp * Math.sin(
        TAU * l.freq * normalizedX + l.phase + this.time * l.speed
      );
    }

    // Add value noise for organic irregularity
    const noiseInput = normalizedX * this.noiseFreq + this.time * 0.15;
    y += this.noiseAmp * (smoothNoise(noiseInput) * 2 - 1);

    return y;
  }

  /* ── Render one frame ── */
  _draw() {
    const { ctx, width, height } = this;
    const midY = height * (1 - this.waveHeight);
    const amplitude = height * this.waveHeight * 0.5;
    const step = this.resolution;
    const cols = Math.ceil(width / step) + 1;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, height); // Start bottom-left

    // Draw wave from left to right
    for (let i = 0; i <= cols; i++) {
      const px = i * step;
      const nx = px / width; // Normalized 0..1
      const waveY = this._sampleWave(nx);
      const screenY = midY + waveY * amplitude;
      if (i === 0) {
        ctx.lineTo(0, screenY);
      } else {
        ctx.lineTo(px, screenY);
      }
    }

    // Close path along bottom
    ctx.lineTo(width, height);
    ctx.closePath();

    ctx.fillStyle = this.fillColor;
    ctx.fill();
  }

  /* ── Animation loop ── */
  _tick(timestamp) {
    this.raf = requestAnimationFrame(this._tick);
    if (!this.visible) return;

    // Time in seconds, using performance-based delta for smoothness
    this.time = timestamp * 0.001;

    this._draw();
  }

  /* ── Public API ── */
  start() {
    if (this.raf) return;
    this.raf = requestAnimationFrame(this._tick);
  }

  stop() {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this._resize);
    if (this._observer) {
      this._observer.disconnect();
    }
  }
}

/* ── Auto-init ──────────────────────────────────────────────
   Looks for a canvas with [data-wave] and initializes automatically. */
export function initWave() {
  const canvas = document.querySelector('[data-wave]');
  if (!canvas) return null;
  return new ProceduralWave(canvas);
}
