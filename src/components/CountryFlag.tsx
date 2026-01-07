interface CountryFlagProps {
  country: string
  size?: 'small' | 'medium' | 'large'
}

export function CountryFlag({ country, size = 'medium' }: CountryFlagProps) {
  const countryCode = country.toUpperCase()

  const sizes = {
    small: { width: 28, height: 19, borderPadding: 4 },
    medium: { width: 48, height: 32, borderPadding: 4 },
    large: { width: 72, height: 48, borderPadding: 4 },
  }

  const { width, height, borderPadding } = sizes[size]
  const strokeWidth = 2
  const internalPadding = 2
  const totalWidth = width + borderPadding * 2 + strokeWidth + internalPadding * 2
  const totalHeight = height + borderPadding * 2 + strokeWidth + internalPadding * 2

  // Return only <rect> shapes, no <svg>
  const renderFlagShapes = () => {
    const flagX = borderPadding + strokeWidth / 2 + internalPadding
    const flagY = borderPadding + strokeWidth / 2 + internalPadding
    const borderX = borderPadding + strokeWidth / 2
    const borderY = borderPadding + strokeWidth / 2
    const borderWidth = width + internalPadding * 2
    const borderHeight = height + internalPadding * 2

    if (countryCode === 'BE' || countryCode === 'BELGIUM') {
      return (
        <>
          <rect x={flagX} y={flagY} width={width / 3} height={height} fill="#000000" />
          <rect x={flagX + width / 3} y={flagY} width={width / 3} height={height} fill="#FDDA24" />
          <rect x={flagX + (2 * width) / 3} y={flagY} width={width / 3} height={height} fill="#EF3340" />
          <rect
            x={borderX}
            y={borderY}
            width={borderWidth}
            height={borderHeight}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={strokeWidth}
          />
        </>
      )
    }

    if (countryCode === 'DE' || countryCode === 'GERMANY' || countryCode === 'DEUTSCHLAND') {
      return (
        <>
          <rect x={flagX} y={flagY} width={width} height={height / 3} fill="#000000" />
          <rect x={flagX} y={flagY + height / 3} width={width} height={height / 3} fill="#DD0000" />
          <rect x={flagX} y={flagY + (2 * height) / 3} width={width} height={height / 3} fill="#FFCE00" />
          <rect
            x={borderX}
            y={borderY}
            width={borderWidth}
            height={borderHeight}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={strokeWidth}
          />
        </>
      )
    }

    if (
      countryCode === 'GB' ||
      countryCode === 'UK' ||
      countryCode === 'UNITED KINGDOM' ||
      countryCode === 'GREAT BRITAIN'
    ) {
      const whiteBarWidth = Math.max(6, width * 0.22)
      const redBarWidth = Math.max(3, width * 0.125)
      return (
        <>
          <rect x={flagX} y={flagY} width={width} height={height} fill="#012169" />
          <rect x={flagX} y={flagY + height / 2 - whiteBarWidth / 2} width={width} height={whiteBarWidth} fill="#FFFFFF" />
          <rect x={flagX + width / 2 - whiteBarWidth / 2} y={flagY} width={whiteBarWidth} height={height} fill="#FFFFFF" />
          <rect x={flagX} y={flagY + height / 2 - redBarWidth / 2} width={width} height={redBarWidth} fill="#C8102E" />
          <rect x={flagX + width / 2 - redBarWidth / 2} y={flagY} width={redBarWidth} height={height} fill="#C8102E" />
          <rect
            x={borderX}
            y={borderY}
            width={borderWidth}
            height={borderHeight}
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth={strokeWidth}
          />
        </>
      )
    }

    // Default: Dutch flag
    return (
      <>
        <rect x={flagX} y={flagY} width={width} height={height / 3} fill="#AE1C28" />
        <rect x={flagX} y={flagY + height / 3} width={width} height={height / 3} fill="#FFFFFF" />
        <rect x={flagX} y={flagY + (2 * height) / 3} width={width} height={height / 3} fill="#21468B" />
        <rect
          x={borderX}
          y={borderY}
          width={borderWidth}
          height={borderHeight}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={strokeWidth}
        />
      </>
    )
  }

  // For large flags, scale with text; small/medium remain fixed
  const svgProps = size === 'large'
    ? { width: 'auto', height: '1em' }
    : { width: totalWidth, height: totalHeight }

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      {...svgProps}
      style={{ display: 'inline-block', verticalAlign: 'text-bottom' }}
    >
      {renderFlagShapes()}
    </svg>
  )
}
