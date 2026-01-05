interface CountryFlagProps {
  country: string
  size?: 'small' | 'medium' | 'large'
}

export function CountryFlag({ country, size = 'medium' }: CountryFlagProps) {
  const countryCode = country.toUpperCase()

  // Size configurations - matching Instagram canvas sizes
  const sizes = {
    small: { width: 32, height: 21, borderPadding: 2 },
    medium: { width: 48, height: 32, borderPadding: 3 },
    large: { width: 64, height: 43, borderPadding: 4 }
  }

  const { width, height, borderPadding } = sizes[size]
  const totalWidth = width + (borderPadding * 2)
  const totalHeight = height + (borderPadding * 2)

  // Determine which flag to render
  const renderFlag = () => {
    if (countryCode === 'BE' || countryCode === 'BELGIUM') {
      // Belgian flag (vertical stripes: black, yellow, red)
      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Border */}
          <rect x={borderPadding} y={borderPadding} width={width} height={height} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          {/* Flag stripes */}
          <rect x={borderPadding} y={borderPadding} width={width / 3} height={height} fill="#000000" />
          <rect x={borderPadding + width / 3} y={borderPadding} width={width / 3} height={height} fill="#FDDA24" />
          <rect x={borderPadding + (2 * width) / 3} y={borderPadding} width={width / 3} height={height} fill="#EF3340" />
        </svg>
      )
    } else if (countryCode === 'DE' || countryCode === 'GERMANY' || countryCode === 'DEUTSCHLAND') {
      // German flag (horizontal stripes: black, red, gold)
      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Border */}
          <rect x={borderPadding} y={borderPadding} width={width} height={height} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          {/* Flag stripes */}
          <rect x={borderPadding} y={borderPadding} width={width} height={height / 3} fill="#000000" />
          <rect x={borderPadding} y={borderPadding + height / 3} width={width} height={height / 3} fill="#DD0000" />
          <rect x={borderPadding} y={borderPadding + (2 * height) / 3} width={width} height={height / 3} fill="#FFCE00" />
        </svg>
      )
    } else if (countryCode === 'GB' || countryCode === 'UK' || countryCode === 'UNITED KINGDOM' || countryCode === 'GREAT BRITAIN') {
      // UK flag - simplified version matching Instagram canvas
      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Border */}
          <rect x={borderPadding} y={borderPadding} width={width} height={height} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          {/* Blue background */}
          <rect x={borderPadding} y={borderPadding} width={width} height={height} fill="#012169" />
          {/* White cross background (St. George's Cross) */}
          <rect x={borderPadding} y={borderPadding + (height / 2) - 7} width={width} height="14" fill="#FFFFFF" />
          <rect x={borderPadding + (width / 2) - 7} y={borderPadding} width="14" height={height} fill="#FFFFFF" />
          {/* Red cross (St. George's Cross) */}
          <rect x={borderPadding} y={borderPadding + (height / 2) - 4} width={width} height="8" fill="#C8102E" />
          <rect x={borderPadding + (width / 2) - 4} y={borderPadding} width="8" height={height} fill="#C8102E" />
        </svg>
      )
    } else {
      // Dutch flag (default) - horizontal stripes: red, white, blue
      return (
        <svg width={totalWidth} height={totalHeight} viewBox={`0 0 ${totalWidth} ${totalHeight}`}>
          {/* Border */}
          <rect x={borderPadding} y={borderPadding} width={width} height={height} fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="2" />
          {/* Flag stripes */}
          <rect x={borderPadding} y={borderPadding} width={width} height={height / 3} fill="#AE1C28" />
          <rect x={borderPadding} y={borderPadding + height / 3} width={width} height={height / 3} fill="#FFFFFF" />
          <rect x={borderPadding} y={borderPadding + (2 * height) / 3} width={width} height={height / 3} fill="#21468B" />
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
