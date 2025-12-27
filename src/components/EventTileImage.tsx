import { useEffect, useRef } from 'preact/hooks'

interface Event {
  id: string
  name: string
  date: string
  location: string
  difficulty: string
  image: string
}

interface EventTileImageProps {
  event: Event
}

export function EventTileImage({ event }: EventTileImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size (square)
    const size = 800
    canvas.width = size
    canvas.height = size

    // Load and draw background image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = event.image

    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, size, size)

      // Draw gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, size)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)')
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)

      // Draw event name - with word wrapping if needed (matching desktop event tile size)
      ctx.fillStyle = '#FFFFFF'
      const name = event.name.toUpperCase()
      const maxWidth = size - 100 // Leave 50px padding on each side

      // Start with desktop tile font size
      let fontSize = 64
      ctx.font = `bold ${fontSize}px Arial`

      // If still too long, wrap to multiple lines
      const words = name.split(' ')
      const lines: string[] = []
      let currentLine = words[0]

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i]
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth) {
          lines.push(currentLine)
          currentLine = words[i]
        } else {
          currentLine = testLine
        }
      }
      lines.push(currentLine)

      // Draw each line with extra spacing between lines
      const lineHeight = fontSize * 1.15
      const extraLineSpacing = 20 // Extra space between first and second line
      let yPos = 130 // Increased from 100 for more space above event name
      lines.forEach((line, index) => {
        const additionalSpacing = index > 0 ? extraLineSpacing : 0
        ctx.fillText(line, 50, yPos + (index * lineHeight) + additionalSpacing)
      })

      // Draw event details - positioned lower if multiple lines of text
      const totalExtraSpacing = lines.length > 1 ? extraLineSpacing * (lines.length - 1) : 0
      const detailsStartY = yPos + ((lines.length - 1) * lineHeight) + totalExtraSpacing + 80 // Increased from 70
      ctx.font = '36px Arial'
      const formattedDate = formatDate(event.date)
      ctx.fillText(`📅 ${formattedDate}`, 50, detailsStartY)
      ctx.fillText(`📍 ${event.location}`, 50, detailsStartY + 70) // Increased from 60
      ctx.fillText(`⚡ ${event.difficulty}`, 50, detailsStartY + 140) // Increased from 120

      // Draw orange bar at bottom with rounded corners
      ctx.fillStyle = '#D94800'
      const barHeight = 80
      const barY = size - barHeight - 48 // 48px from bottom (6 * 8px)
      const borderRadius = 8

      // Draw rounded rectangle for orange bar
      ctx.beginPath()
      ctx.moveTo(48 + borderRadius, barY)
      ctx.lineTo(size - 48 - borderRadius, barY)
      ctx.quadraticCurveTo(size - 48, barY, size - 48, barY + borderRadius)
      ctx.lineTo(size - 48, barY + barHeight - borderRadius)
      ctx.quadraticCurveTo(size - 48, barY + barHeight, size - 48 - borderRadius, barY + barHeight)
      ctx.lineTo(48 + borderRadius, barY + barHeight)
      ctx.quadraticCurveTo(48, barY + barHeight, 48, barY + barHeight - borderRadius)
      ctx.lineTo(48, barY + borderRadius)
      ctx.quadraticCurveTo(48, barY, 48 + borderRadius, barY)
      ctx.closePath()
      ctx.fill()

      // Draw text on orange bar with letter spacing
      ctx.fillStyle = '#000000'
      ctx.font = 'bold 36px Arial' // Increased from 28px
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle' // Align text vertically in the middle
      const text = 'HYBRIDRACES.FIT'
      const letterSpacing = 10 // Increased from 8 to maintain proportions

      // Manual letter spacing
      let textX = size / 2
      const textY = barY + barHeight / 2

      // Measure total width with spacing
      let totalWidth = 0
      for (let i = 0; i < text.length; i++) {
        totalWidth += ctx.measureText(text[i]).width + (i < text.length - 1 ? letterSpacing : 0)
      }

      // Start position (centered)
      let currentX = textX - totalWidth / 2

      // Draw each character with spacing
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], currentX, textY)
        currentX += ctx.measureText(text[i]).width + letterSpacing
      }
    }
  }, [event])

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${event.id}-tile.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <canvas ref={canvasRef} className="w-full h-auto" />
  )
}
