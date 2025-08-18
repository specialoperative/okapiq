"use client"

import { useEffect, useRef } from "react"

export function JungleBanner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = window.innerWidth
    canvas.height = 100

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
    gradient.addColorStop(0, "#2ecc71")
    gradient.addColorStop(0.5, "#27ae60")
    gradient.addColorStop(1, "#2ecc71")

    // Animation variables
    let offset = 0
    const speed = 0.5

    function drawJungle() {
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw jungle pattern
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      for (let i = 0; i < 10; i++) {
        ctx.beginPath()
        ctx.moveTo((i * 100 + offset) % canvas.width, 0)
        ctx.lineTo((i * 100 + 50 + offset) % canvas.width, canvas.height)
        ctx.lineTo((i * 100 + 100 + offset) % canvas.width, 0)
        ctx.fill()
      }

      // Update offset for animation
      offset += speed
      if (offset > 100) offset = 0

      requestAnimationFrame(drawJungle)
    }

    drawJungle()

    // Cleanup
    return () => {
      // Cancel animation frame if needed
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-24" />
}
