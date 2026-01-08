import { useEffect, useRef } from 'preact/hooks'
import type { RaceEvent as Event } from '../types/Event'

interface EventTileImageProps {
  event: Event
  aspect?: 'square' | 'instagram'
}

export function EventTileImage({
  event,
  aspect = 'square',
}: EventTileImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    return `${s.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - ${e.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 800
    const height = aspect === 'instagram' ? 1000 : 800
    canvas.width = width
    canvas.height = height

    const img = new Image()
    if (event.image.includes('unsplash.com')) img.crossOrigin = 'anonymous'
    img.src = event.image

    img.onload = () => {
      const imgAspect = img.width / img.height
      const canvasAspect = width / height
      let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height

      if (imgAspect > canvasAspect) {
        sWidth = img.height * canvasAspect
        sx = (img.width - sWidth) / 2
      } else {
        sHeight = img.width / canvasAspect
        sy = (img.height - sHeight) / 2
      }

      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height)
      drawOverlay()
    }

    const drawOverlay = () => {
      const padding = 70
      const contentWidth = width - padding * 2

      // ========== GRADIENT ==========
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgba(0,0,0,0.55)')
      gradient.addColorStop(0.6, 'rgba(0,0,0,0.7)')
      gradient.addColorStop(1, 'rgba(0,0,0,0.9)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // ========== FLAG (bovenin) ==========
      const flagWidth = 90
      const flagHeight = 60
      const flagX = padding + contentWidth - flagWidth
      const flagY = 50
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 2
      ctx.strokeRect(flagX - 4, flagY - 4, flagWidth + 8, flagHeight + 8)

      const country = event.country.toUpperCase()
      const drawRect = (x: number, y: number, w: number, h: number, col: string) => {
        ctx.fillStyle = col
        ctx.fillRect(x, y, w, h)
      }

      if (country === 'BE') {
        drawRect(flagX, flagY, flagWidth / 3, flagHeight, '#000')
        drawRect(flagX + flagWidth / 3, flagY, flagWidth / 3, flagHeight, '#FDDA24')
        drawRect(flagX + (2 * flagWidth) / 3, flagY, flagWidth / 3, flagHeight, '#EF3340')
      } else if (country === 'DE') {
        drawRect(flagX, flagY, flagWidth, flagHeight / 3, '#000')
        drawRect(flagX, flagY + flagHeight / 3, flagWidth, flagHeight / 3, '#DD0000')
        drawRect(flagX, flagY + (2 * flagHeight) / 3, flagWidth, flagHeight / 3, '#FFCE00')
      } else {
        drawRect(flagX, flagY, flagWidth, flagHeight / 3, '#AE1C28')
        drawRect(flagX, flagY + flagHeight / 3, flagWidth, flagHeight / 3, '#FFF')
        drawRect(flagX, flagY + (2 * flagHeight) / 3, flagWidth, flagHeight / 3, '#21468B')
      }

      // ========== EVENT NAME ==========
      ctx.fillStyle = '#FFF'
      ctx.font = 'bold 58px Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      const titleY = 140

      const eventWords = event.eventname.toUpperCase().split(' ')
      let line = ''
      const lines: string[] = []
      for (const word of eventWords) {
        const testLine = line ? line + ' ' + word : word
        if (ctx.measureText(testLine).width > contentWidth && line) {
          lines.push(line)
          line = word
        } else {
          line = testLine
        }
      }
      if (line) lines.push(line)

      const eventLineHeight = 80
      lines.forEach((l, i) => ctx.fillText(l, padding, titleY + i * eventLineHeight))

      // ========== SUB INFORMATION ==========
      ctx.font = '46px Arial'
      ctx.fillStyle = '#FFF'
      let y = 360
      const lineHeight = 50
      const iconOffset = 70
      const itemSpacing = 40

      const drawSubInfo = (icon: string, text: string) => {
        const words = text.split(' ')
        const lines: string[] = []
        let line = ''
        for (const word of words) {
          const testLine = line ? line + ' ' + word : word
          if (ctx.measureText(testLine).width > contentWidth - iconOffset && line) {
            lines.push(line)
            line = word
          } else {
            line = testLine
          }
        }
        if (line) lines.push(line)

        const totalHeight = lines.length * lineHeight
        const iconY = y + totalHeight / 2 - lineHeight / 2
        ctx.fillText(icon, padding, iconY)

        lines.forEach((l, i) => ctx.fillText(l, padding + iconOffset, y + i * lineHeight))
        y += totalHeight + itemSpacing
      }

      drawSubInfo('📅', event.enddate ? formatDateRange(event.startdate, event.enddate) : formatDate(event.startdate))
      drawSubInfo('📍', event.location)
      if (event.typerace?.length) drawSubInfo('🏃‍♂️', event.typerace.join(', '))
      if (event.organizationgym) drawSubInfo('🏢', event.organizationgym)

      // ========== ORANGE BAR ==========
      const barHeight = 80
      const bottomMargin = 50
      const extraTopPadding = 10 // schuift balk omhoog
      const barY = height - barHeight - bottomMargin - extraTopPadding
      ctx.fillStyle = '#D94800'
      ctx.beginPath()
      ctx.roundRect(padding, barY, contentWidth, barHeight, 8)
      ctx.fill()

      // HYBRIDRACES.FIT (iets groter)
      const text = 'HYBRIDRACES.FIT'
      ctx.fillStyle = '#000'
      ctx.font = 'bold 44px Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      const letterSpacing = 10
      let totalWidth = 0
      for (let i = 0; i < text.length; i++) totalWidth += ctx.measureText(text[i]).width + (i < text.length - 1 ? letterSpacing : 0)
      let startX = padding + contentWidth / 2 - totalWidth / 2
      const textY = barY + barHeight / 2
      for (let i = 0; i < text.length; i++) {
        ctx.fillText(text[i], startX, textY)
        startX += ctx.measureText(text[i]).width + letterSpacing
      }
    }
  }, [event, aspect])

  return <canvas ref={canvasRef} className="w-full h-full block" />
}
















