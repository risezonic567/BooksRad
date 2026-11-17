import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let registered = false

export function ensureGsapPlugins() {
  if (registered || typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
  registered = true
}

/**
 * Smooth fade/slide reveal for BooksRad.
 * - Scroll reveals wait for trigger (no early clearProps kill)
 * - Mount reveals use a short safety net only
 * - Clears transform after complete so layout stays clean
 */
export function revealOnScroll(targets, { trigger, vars = {} } = {}) {
  ensureGsapPlugins()
  const elements = gsap.utils.toArray(targets)
  if (!elements.length) return null

  const hasTrigger = Boolean(trigger)
  const duration = vars.duration ?? (hasTrigger ? 0.85 : 0.9)
  const y = vars.y ?? (hasTrigger ? 36 : 28)

  // Hide up front so we never flash visible → hidden → fade
  gsap.set(elements, {
    autoAlpha: 0,
    y,
    ...(vars.scale != null ? { scale: vars.scale } : {}),
  })

  let safety = null
  if (!hasTrigger) {
    // Only for mount reveals — never wipe scroll tweens before they play
    safety = window.setTimeout(() => {
      gsap.set(elements, { clearProps: 'all' })
    }, Math.ceil((duration + (vars.delay || 0) + 1.2) * 1000))
  }

  const tween = gsap.to(elements, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration,
    stagger: vars.stagger ?? 0.12,
    delay: vars.delay ?? 0,
    ease: vars.ease ?? 'power3.out',
    overwrite: 'auto',
    scrollTrigger: hasTrigger
      ? {
          trigger,
          start: vars.start ?? 'top 78%',
          once: true,
          toggleActions: 'play none none none',
        }
      : undefined,
    onComplete: () => {
      if (safety) window.clearTimeout(safety)
      gsap.set(elements, { clearProps: 'transform' })
    },
  })

  tween._brSafety = safety
  return tween
}

export function safeRevert(ctx, restoreTargets) {
  try {
    ctx?.revert()
  } finally {
    if (restoreTargets) {
      gsap.set(restoreTargets, { clearProps: 'all' })
    }
  }
}

export function clearRevealSafety(tween) {
  if (tween?._brSafety) window.clearTimeout(tween._brSafety)
}
