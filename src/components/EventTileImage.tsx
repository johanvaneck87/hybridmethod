import { useEffect, useRef } from 'preact/hooks'
import type { RaceEvent as Event } from '../types/Event'



interface EventTileImageProps {
  event: Event
}

export function EventTileImage({ event }: EventTileImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateRange = (startDateString: string, endDateString: string) => {
    const startDate = new Date(startDateString)
    const endDate = new Date(endDateString)

    const startDay = startDate.toLocaleDateString('en-US', { day: 'numeric' })
    const startMonth = startDate.toLocaleDateString('en-US', { month: 'long' })
    const endDay = endDate.toLocaleDateString('en-US', { day: 'numeric' })
    const endMonth = endDate.toLocaleDateString('en-US', { month: 'long' })
    const year = endDate.toLocaleDateString('en-US', { year: 'numeric' })

    return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`
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
      // Draw background image with cover/crop (like CSS background-size: cover)
      const imgAspect = img.width / img.height
      const canvasAspect = size / size // 1:1 square

      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height

      if (imgAspect > canvasAspect) {
        // Image is wider than canvas - crop width
        sWidth = img.height * canvasAspect
        sx = (img.width - sWidth) / 2
      } else {
        // Image is taller than canvas - crop height
        sHeight = img.width / canvasAspect
        sy = (img.height - sHeight) / 2
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size)

      // Draw gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, size)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.6)')
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.7)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, size, size)

      // Draw flag in top right corner
      const flagWidth = 64
      const flagHeight = 43
      const flagX = size - flagWidth - 24
      const flagY = 24

      // Draw subtle border around flag (similar to filter bar)
      const borderPadding = 4
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(flagX - borderPadding, flagY - borderPadding, flagWidth + (borderPadding * 2), flagHeight + (borderPadding * 2))

      // Draw flag based on country
      if (event.country === 'BE') {
        // Belgian flag (vertical stripes: black, yellow, red)
        // Black stripe
        ctx.fillStyle = '#000000'
        ctx.fillRect(flagX, flagY, flagWidth / 3, flagHeight)

        // Yellow stripe
        ctx.fillStyle = '#FDDA24'
        ctx.fillRect(flagX + flagWidth / 3, flagY, flagWidth / 3, flagHeight)

        // Red stripe
        ctx.fillStyle = '#EF3340'
        ctx.fillRect(flagX + (2 * flagWidth / 3), flagY, flagWidth / 3, flagHeight)
      } else {
        // Dutch flag (horizontal stripes: red, white, blue)
        // Red stripe
        ctx.fillStyle = '#AE1C28'
        ctx.fillRect(flagX, flagY, flagWidth, flagHeight / 3)

        // White stripe
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(flagX, flagY + flagHeight / 3, flagWidth, flagHeight / 3)

        // Blue stripe
        ctx.fillStyle = '#21468B'
        ctx.fillRect(flagX, flagY + (2 * flagHeight / 3), flagWidth, flagHeight / 3)
      }

      // Draw event name - with word wrapping if needed (matching desktop event tile size)
      ctx.fillStyle = '#FFFFFF'
      const name = event.eventname.toUpperCase()
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

      // Draw event details - ALWAYS at same position (reserve space for 2 lines of event name)
      const reservedNameHeight = (lineHeight * 2) + extraLineSpacing // Space for 2 lines max
      let detailsStartY = yPos + reservedNameHeight + 10 // Small spacing between name and details (similar to mb-1)
      ctx.font = '42px Arial' // Increased from 36px for larger text

      // Helper function to wrap text with emoji centered on text height
      const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number): number => {
        // Split text into emoji and rest
        const emojiMatch = text.match(/^([\u{1F300}-\u{1F9FF}])\s*/u)
        const emoji = emojiMatch ? emojiMatch[1] + ' ' : ''
        const textWithoutEmoji = emoji && emojiMatch ? text.slice(emojiMatch[0].length) : text

        const words = textWithoutEmoji.split(' ')
        const allLines: string[] = []
        let line = ''

        // Measure emoji width to account for it in first line
        const emojiWidth = emoji ? ctx.measureText(emoji).width : 0

        // First pass: collect all lines
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' '
          const lineWidth = ctx.measureText(testLine).width
          const totalWidth = (allLines.length === 0 ? emojiWidth : 0) + lineWidth

          if (totalWidth > maxWidth && i > 0) {
            allLines.push(line.trim())
            line = words[i] + ' '
          } else {
            line = testLine
          }
        }
        allLines.push(line.trim())

        // Calculate total text height and emoji vertical offset
        const totalTextHeight = allLines.length * lineHeight
        const emojiVerticalOffset = allLines.length > 1 ? (totalTextHeight - lineHeight) / 2 : 0

        // Draw emoji vertically centered
        if (emoji) {
          ctx.fillText(emoji, x, y + emojiVerticalOffset)
        }

        // Draw all text lines aligned with emoji width offset
        for (let i = 0; i < allLines.length; i++) {
          ctx.fillText(allLines[i], x + emojiWidth, y + (i * lineHeight))
        }

        return totalTextHeight // Return total height used
      }

      const detailMaxWidth = size - 100 // Same max width as event name
      const detailLineHeight = 50 // Line height for wrapped detail text
      const itemSpacing = 30 // Spacing between items (similar to space-y-2)

      const formattedDate = event.enddate
        ? formatDateRange(event.startdate, event.enddate)
        : formatDate(event.startdate)

      let currentY = detailsStartY
      currentY += wrapText(`📅 ${formattedDate}`, 50, currentY, detailMaxWidth, detailLineHeight)
      currentY += itemSpacing
      currentY += wrapText(`📍 ${event.location}`, 50, currentY, detailMaxWidth, detailLineHeight)
      currentY += itemSpacing

      // Draw race types or difficulty
      if (event.typerace) {
        // For race types, don't use wrapText to avoid extracting the runner emoji
        const raceText = event.typerace.join(', ')
        const words = raceText.split(' ')
        const lines: string[] = []
        let line = ''

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' '
          const lineWidth = ctx.measureText(testLine).width

          if (lineWidth > detailMaxWidth && i > 0) {
            lines.push(line.trim())
            line = words[i] + ' '
          } else {
            line = testLine
          }
        }
        lines.push(line.trim())

        // Draw runner emoji at base position
        ctx.fillText('🏃‍♂️', 50, currentY)
        const emojiWidth = ctx.measureText('🏃‍♂️ ').width

        // Draw text lines offset by emoji width
        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], 50 + emojiWidth, currentY + (i * detailLineHeight))
        }

        currentY += lines.length * detailLineHeight
      }

      // Draw organization if present (as last item)
      if (event.organizationgym) {
        currentY += itemSpacing
        wrapText(`🏢 ${event.organizationgym}`, 50, currentY, detailMaxWidth, detailLineHeight)
      }

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

  return (
    <canvas ref={canvasRef} className="w-full h-auto" />
  )
}
