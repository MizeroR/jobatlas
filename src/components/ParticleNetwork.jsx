import React, { useEffect, useRef, useCallback } from 'react'

class Particle {
  constructor(x, y, radius, isMainNode = false) {
    this.x = x
    this.y = y
    this.radius = radius
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = (Math.random() - 0.5) * 0.3
    this.originalRadius = radius
    this.isMainNode = isMainNode
    this.glowIntensity = Math.random() * 0.5 + 0.5
    this.pulsePhase = Math.random() * Math.PI * 2
    this.friction = 0.98
    this.centerAttraction = 0.0002
    this.repulsionRadius = isMainNode ? 80 : 50
    this.repulsionForce = isMainNode ? 0.5 : 0.3
  }

  update(canvasWidth, canvasHeight, particles) {
    // Center attraction
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    const distToCenter = Math.sqrt((centerX - this.x) ** 2 + (centerY - this.y) ** 2)
    
    if (distToCenter > 0) {
      this.vx += (centerX - this.x) * this.centerAttraction
      this.vy += (centerY - this.y) * this.centerAttraction
    }

    // Particle repulsion
    particles.forEach(other => {
      if (other === this) return
      
      const dx = this.x - other.x
      const dy = this.y - other.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < this.repulsionRadius && distance > 0) {
        const force = this.repulsionForce / distance
        this.vx += (dx / distance) * force
        this.vy += (dy / distance) * force
      }
    })

    // Random motion
    this.vx += (Math.random() - 0.5) * 0.02
    this.vy += (Math.random() - 0.5) * 0.02

    // Apply friction
    this.vx *= this.friction
    this.vy *= this.friction

    // Update position
    this.x += this.vx
    this.y += this.vy

    // Boundary collision with soft bounce
    const margin = this.radius + 20
    if (this.x < margin) {
      this.x = margin
      this.vx *= -0.8
    }
    if (this.x > canvasWidth - margin) {
      this.x = canvasWidth - margin
      this.vx *= -0.8
    }
    if (this.y < margin) {
      this.y = margin
      this.vy *= -0.8
    }
    if (this.y > canvasHeight - margin) {
      this.y = canvasHeight - margin
      this.vy *= -0.8
    }

    // Update pulse animation
    this.pulsePhase += 0.02
    this.radius = this.originalRadius + Math.sin(this.pulsePhase) * (this.isMainNode ? 2 : 1)
  }

  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3)
    
    if (this.isMainNode) {
      gradient.addColorStop(0, `rgba(255, 209, 102, ${this.glowIntensity})`)
      gradient.addColorStop(0.3, `rgba(255, 178, 36, ${this.glowIntensity * 0.8})`)
      gradient.addColorStop(0.6, `rgba(246, 146, 24, ${this.glowIntensity * 0.4})`)
      gradient.addColorStop(1, 'rgba(246, 146, 24, 0)')
    } else {
      gradient.addColorStop(0, `rgba(255, 178, 36, ${this.glowIntensity * 0.8})`)
      gradient.addColorStop(0.4, `rgba(246, 146, 24, ${this.glowIntensity * 0.6})`)
      gradient.addColorStop(1, 'rgba(246, 146, 24, 0)')
    }

    // Draw glow
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2)
    ctx.fill()

    // Draw core particle
    ctx.fillStyle = this.isMainNode ? '#FFD166' : '#FFB224'
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()

    // Draw inner glow
    const innerGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
    innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)')
    innerGradient.addColorStop(0.7, 'rgba(255, 209, 102, 0.4)')
    innerGradient.addColorStop(1, 'rgba(246, 146, 24, 0)')
    
    ctx.fillStyle = innerGradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
  }
}

const ParticleNetwork = () => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])

  // Detect device capabilities
  const getParticleCount = () => {
    const isMobile = window.innerWidth < 768
    const isLowEnd = navigator.hardwareConcurrency < 4
    
    if (isMobile || isLowEnd) return 40
    if (window.innerWidth > 1920) return 80
    return 60
  }

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const particleCount = getParticleCount()
    const mainNodeCount = Math.floor(particleCount * 0.15) // 15% main nodes
    
    particlesRef.current = []

    // Create main nodes first
    for (let i = 0; i < mainNodeCount; i++) {
      const x = Math.random() * (canvas.width - 200) + 100
      const y = Math.random() * (canvas.height - 200) + 100
      const radius = Math.random() * 4 + 6
      particlesRef.current.push(new Particle(x, y, radius, true))
    }

    // Create regular particles
    for (let i = mainNodeCount; i < particleCount; i++) {
      const x = Math.random() * (canvas.width - 100) + 50
      const y = Math.random() * (canvas.height - 100) + 50
      const radius = Math.random() * 2 + 2
      particlesRef.current.push(new Particle(x, y, radius, false))
    }
  }, [])

  const drawConnection = (ctx, p1, p2, distance, maxDistance) => {
    const strength = 1 - (distance / maxDistance)
    const opacity = strength * 0.6
    
    // Calculate line thickness based on distance
    const thickness = strength * 3 + 0.5
    
    // Create gradient for the line
    const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
    gradient.addColorStop(0, `rgba(255, 178, 36, ${opacity})`)
    gradient.addColorStop(0.5, `rgba(255, 209, 102, ${opacity * 1.2})`)
    gradient.addColorStop(1, `rgba(246, 146, 24, ${opacity})`)

    // Draw connection with glow effect
    ctx.strokeStyle = gradient
    ctx.lineWidth = thickness
    ctx.lineCap = 'round'
    
    // Outer glow
    ctx.shadowColor = '#F69218'
    ctx.shadowBlur = thickness * 2
    ctx.shadowOffsetX = 0
    ctx.shadowOffsetY = 0
    
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.stroke()
    
    // Reset shadow
    ctx.shadowBlur = 0
  }

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Clear canvas with slight trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const particles = particlesRef.current
    const maxConnectionDistance = 120
    const maxConnections = 3

    // Update particles
    particles.forEach(particle => {
      particle.update(canvas.width, canvas.height, particles)
    })

    // Draw connections with optimization
    particles.forEach((particle, i) => {
      let connectionCount = 0
      
      particles.slice(i + 1).forEach(otherParticle => {
        if (connectionCount >= maxConnections) return
        
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxConnectionDistance) {
          drawConnection(ctx, particle, otherParticle, distance, maxConnectionDistance)
          connectionCount++
        }
      })
    })

    // Draw particles
    particles.forEach(particle => {
      particle.draw(ctx)
    })
  }, [])

  useEffect(() => {
    let animationId
    const animationLoop = () => {
      animate()
      animationId = requestAnimationFrame(animationLoop)
    }
    animationLoop()
    return () => cancelAnimationFrame(animationId)
  }, [animate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ 
        zIndex: 1,
        background: 'transparent'
      }}
    />
  )
}

export default ParticleNetwork