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

    let rafId: number
    const pixelSize = 2.7 // bigger -> more pixelated
    const speed = 30 // small-canvas pixels per second

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect()
      // keep canvas backing store same as CSS size for crisp drawing
      canvas.width = Math.max(1, Math.floor(rect.width))
      canvas.height = Math.max(1, Math.floor(rect.height))
    }
    resize()
    window.addEventListener('resize', resize)

    const start = performance.now()

    function render(now: number) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect()
      const dispW = Math.max(1, Math.floor(rect.width))
      const dispH = Math.max(1, Math.floor(rect.height))

      // small offscreen canvas (low-res)
      const smallW = Math.max(1, Math.floor(dispW / pixelSize))
      const smallH = Math.max(1, Math.floor(dispH / pixelSize))

      const off = document.createElement('canvas')
      off.width = smallW
      off.height = smallH
      const offCtx = off.getContext('2d')!
      offCtx.clearRect(0, 0, smallW, smallH)

      // text styling in offscreen pixels
      const fontSize = Math.max(8, Math.floor(smallH * 0.5))
      offCtx.font = `${fontSize}px myCustomFont, Tahoma, Geneva, Verdana, sans-serif`
      offCtx.textBaseline = 'middle'
      offCtx.fillStyle = 'white'
      offCtx.strokeStyle = 'black'
      offCtx.lineJoin = 'round'
      offCtx.miterLimit = 2
      offCtx.letterSpacing = '0.1rem'
      offCtx.lineWidth = Math.max(1, Math.floor(fontSize * 0.16))

      // measure single phrase width in small coords
      const text = phrase
      const m = offCtx.measureText(text)
      const textW = Math.max(1, Math.ceil(m.width))

      // compute offset (wrap)
      const elapsed = (now - start) / 1000
      const offset = Math.floor((elapsed * speed) % textW)

      // draw repeated text across offscreen
      let x = -offset
      while (x < smallW) {
        offCtx.strokeText(text, x, smallH / 2)
        offCtx.fillText(text, x, smallH / 2)
        x += textW
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

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
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