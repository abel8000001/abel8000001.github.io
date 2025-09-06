import '../styles/Background.css'
import purplePlanetEarth from '../assets/purple-planet-earth.gif'
import { useRef, useEffect } from 'react'

const phrase = "THe WORLD IS yOURS - ";

function Background() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    // Detect mobile devices and use different pixel sizes
    const isMobile = window.innerWidth <= 768
    const pixelSize = isMobile ? 2 : 2.7
    const speed = 30 // small-canvas pixels per second
    const off = document.createElement('canvas')
    const offCtx = off.getContext('2d')!
    let start = performance.now()
    let lastSmallW = 0
    let lastSmallH = 0
    let measuredTextW = 1
    let dispW = 0
    let dispH = 0
    let pauseTime = 0
    let fontLoaded = false

    async function waitForFont() {
      try {
        await document.fonts.load('16px myCustomFont')
        fontLoaded = true
        rafId = requestAnimationFrame(render)
      } catch (error) {
        // Fallback if font loading fails
        setTimeout(() => {
          fontLoaded = true
          rafId = requestAnimationFrame(render)
        }, 100)
      }
    }

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const newW = Math.max(1, Math.floor(rect.width))
      const newH = Math.max(1, Math.floor(rect.height))
      // only update backing store when it actually changed
      if (canvas.width !== newW || canvas.height !== newH) {
        canvas.width = newW
        canvas.height = newH
        dispW = newW
        dispH = newH
        // update offscreen metrics for the new size
        updateOffscreenIfNeeded(dispW, dispH)
        // reset start so animation offset stays sensible after resize
        start = performance.now()
      } else {
        dispW = newW
        dispH = newH
      }
    }
    resize()
    window.addEventListener('resize', resize)

    function updateOffscreenIfNeeded(dispWParam: number, dispHParam: number) {
      const smallW = Math.max(1, Math.floor(dispWParam / pixelSize))
      const smallH = Math.max(1, Math.floor(dispHParam / pixelSize))
      if (smallW !== lastSmallW || smallH !== lastSmallH) {
        lastSmallW = smallW
        lastSmallH = smallH
        off.width = smallW
        off.height = smallH
        // recompute font and metrics only when small size changes
        const fontSize = Math.max(8, Math.floor(smallH * 0.5))
        offCtx.font = `${fontSize}px myCustomFont, Tahoma, Geneva, Verdana, sans-serif`
        offCtx.textBaseline = 'middle'
        offCtx.fillStyle = 'white'
        offCtx.strokeStyle = 'black'
        offCtx.lineJoin = 'round'
        offCtx.miterLimit = 2
        offCtx.lineWidth = isMobile ? Math.max(1, Math.floor(fontSize * 0.23)) : Math.max(1, Math.floor(fontSize * 0.16))
        // measure text width once for the current small canvas scale
        const m = offCtx.measureText(phrase)
        measuredTextW = Math.max(1, Math.ceil(m.width))
      }
      return { smallW: lastSmallW, smallH: lastSmallH }
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        // pause animation
        pauseTime = performance.now()
        cancelAnimationFrame(rafId)
      } else {
        // resume; adjust start so elapsed continues from where it left off
        const now = performance.now()
        start += (now - pauseTime)
        rafId = requestAnimationFrame(render)
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    function render(now: number) {
      if (!canvas || !fontLoaded) return
      // use cached sizes updated by resize handler (avoid getBoundingClientRect per-frame)
      const w = dispW || canvas.width
      const h = dispH || canvas.height
      const { smallW, smallH } = updateOffscreenIfNeeded(w, h)
      offCtx.clearRect(0, 0, smallW, smallH)
      const elapsed = (now - start) / 1000
      const offset = Math.floor((elapsed * speed) % measuredTextW)
      // draw repeated text across offscreen (low-res)
      let x = -offset
      while (x < smallW) {
        offCtx.strokeText(phrase, x, smallH / 2)
        offCtx.fillText(phrase, x, smallH / 2)
        x += measuredTextW
      }
      // draw the low-res offscreen canvas scaled up onto the visible canvas
      if (ctx) {
        ctx.imageSmoothingEnabled = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(off, 0, 0, canvas.width, canvas.height)
      }
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    waitForFont()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div className='background'>
      <div id="planet-screen">
        <img src={purplePlanetEarth} alt="Planet" />
      </div>

      <canvas ref={canvasRef} className="marquee-canvas" />
    </div>
  )
}

export default Background