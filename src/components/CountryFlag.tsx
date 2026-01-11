interface CountryFlagProps {
  country: string
  size?: 'small' | 'medium' | 'large'
}

export function CountryFlag({ country, size = 'medium' }: CountryFlagProps) {
  const countryCode = country.toUpperCase()

  // Size configurations - matching Instagram canvas sizes
  const sizes = {
    small: { width: 28, height: 19, borderPadding: 4 },
    medium: { width: 48, height: 32, borderPadding: 4 },
    large: { width: 72, height: 48, borderPadding: 4 }
  }

  const { width, height, borderPadding } = sizes[size]
  const strokeWidth = 2
  const internalPadding = 2 // Padding between flag colors and border
  const totalWidth = width + (borderPadding * 2) + strokeWidth + (internalPadding * 2)
  const totalHeight = height + (borderPadding * 2) + strokeWidth + (internalPadding * 2)

  // Determine which flag to render
  const renderFlag = () => {
    const flagX = borderPadding + (strokeWidth / 2) + internalPadding
    const flagY = borderPadding + (strokeWidth / 2) + internalPadding
    const borderX = borderPadding + (strokeWidth / 2)
    const borderY = borderPadding + (strokeWidth / 2)
    const borderWidth = width + (internalPadding * 2)
    const borderHeight = height + (internalPadding * 2)

    if (countryCode === 'BE' || countryCode === 'BELGIUM') {
      // Belgian flag (vertical stripes: black, yellow, red)
      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Flag stripes */}
          <rect x={flagX} y={flagY} width={width / 3} height={height} fill="#000000" />
          <rect x={flagX + width / 3} y={flagY} width={width / 3} height={height} fill="#FDDA24" />
          <rect x={flagX + (2 * width) / 3} y={flagY} width={width / 3} height={height} fill="#EF3340" />
          {/* Border around flag */}
          <rect x={borderX} y={borderY} width={borderWidth} height={borderHeight} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={strokeWidth} />
        </svg>
      )
    } else if (countryCode === 'DE' || countryCode === 'GERMANY' || countryCode === 'DEUTSCHLAND') {
      // German flag (horizontal stripes: black, red, gold)
      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Flag stripes */}
          <rect x={flagX} y={flagY} width={width} height={height / 3} fill="#000000" />
          <rect x={flagX} y={flagY + height / 3} width={width} height={height / 3} fill="#DD0000" />
          <rect x={flagX} y={flagY + (2 * height) / 3} width={width} height={height / 3} fill="#FFCE00" />
          {/* Border around flag */}
          <rect x={borderX} y={borderY} width={borderWidth} height={borderHeight} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={strokeWidth} />
        </svg>
      )
    } else if (countryCode === 'GB' || countryCode === 'UK' || countryCode === 'UNITED KINGDOM' || countryCode === 'GREAT BRITAIN') {
      // UK flag - simplified version matching Instagram canvas
      // Calculate proportional cross widths based on flag size
      const whiteBarWidth = Math.max(6, width * 0.22)   // ~22% of flag width, min 6px for small flags
      const redBarWidth = Math.max(3, width * 0.125)    // ~12.5% of flag width, min 3px for small flags

      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Blue background */}
          <rect x={flagX} y={flagY} width={width} height={height} fill="#012169" />
          {/* White cross background (St. George's Cross) */}
          <rect x={flagX} y={flagY + (height / 2) - (whiteBarWidth / 2)} width={width} height={whiteBarWidth} fill="#FFFFFF" />
          <rect x={flagX + (width / 2) - (whiteBarWidth / 2)} y={flagY} width={whiteBarWidth} height={height} fill="#FFFFFF" />
          {/* Red cross (St. George's Cross) */}
          <rect x={flagX} y={flagY + (height / 2) - (redBarWidth / 2)} width={width} height={redBarWidth} fill="#C8102E" />
          <rect x={flagX + (width / 2) - (redBarWidth / 2)} y={flagY} width={redBarWidth} height={height} fill="#C8102E" />
          {/* Border around flag */}
          <rect x={borderX} y={borderY} width={borderWidth} height={borderHeight} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={strokeWidth} />
        </svg>
      )
    } else {
      // Dutch flag (default) - horizontal stripes: red, white, blue
      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Flag stripes */}
          <rect x={flagX} y={flagY} width={width} height={height / 3} fill="#AE1C28" />
          <rect x={flagX} y={flagY + height / 3} width={width} height={height / 3} fill="#FFFFFF" />
          <rect x={flagX} y={flagY + (2 * height) / 3} width={width} height={height / 3} fill="#21468B" />
          {/* Border around flag */}
          <rect x={borderX} y={borderY} width={borderWidth} height={borderHeight} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth={strokeWidth} />
        </svg>
      )
    }
  }

  return (
    <div className="inline-block">
      {renderFlag()}
    </div>
  )
}


