interface CountryFlagProps {
  country: string
  size?: 'small' | 'medium' | 'large'
}

export function CountryFlag({ country, size = 'medium' }: CountryFlagProps) {
  const countryCode = country.toUpperCase()

  // Size configurations
  const sizes = {
    small: { width: 32, height: 21 },
    medium: { width: 48, height: 32 },
    large: { width: 64, height: 43 }
  }

  const { width, height } = sizes[size]

  // Determine which flag to render
  const renderFlag = () => {
    if (countryCode === 'BE' || countryCode === 'BELGIUM') {
      // Belgian flag (vertical stripes: black, yellow, red)
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <rect x="0" y="0" width={width / 3} height={height} fill="#000000" />
          <rect x={width / 3} y="0" width={width / 3} height={height} fill="#FDDA24" />
          <rect x={(2 * width) / 3} y="0" width={width / 3} height={height} fill="#EF3340" />
        </svg>
      )
    } else if (countryCode === 'DE' || countryCode === 'GERMANY' || countryCode === 'DEUTSCHLAND') {
      // German flag (horizontal stripes: black, red, gold)
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <rect x="0" y="0" width={width} height={height / 3} fill="#000000" />
          <rect x="0" y={height / 3} width={width} height={height / 3} fill="#DD0000" />
          <rect x="0" y={(2 * height) / 3} width={width} height={height / 3} fill="#FFCE00" />
        </svg>
      )
    } else if (countryCode === 'GB' || countryCode === 'UK' || countryCode === 'UNITED KINGDOM' || countryCode === 'GREAT BRITAIN') {
      // UK flag - simplified version
      const barWidth = width * 0.22
      const barHeight = height * 0.325
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <rect x="0" y="0" width={width} height={height} fill="#012169" />
          {/* White cross background */}
          <rect x="0" y={(height - barHeight) / 2} width={width} height={barHeight} fill="#FFFFFF" />
          <rect x={(width - barWidth) / 2} y="0" width={barWidth} height={height} fill="#FFFFFF" />
          {/* Red cross */}
          <rect x="0" y={(height - barHeight * 0.57) / 2} width={width} height={barHeight * 0.57} fill="#C8102E" />
          <rect x={(width - barWidth * 0.57) / 2} y="0" width={barWidth * 0.57} height={height} fill="#C8102E" />
        </svg>
      )
    } else {
      // Dutch flag (default) - horizontal stripes: red, white, blue
      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <rect x="0" y="0" width={width} height={height / 3} fill="#AE1C28" />
          <rect x="0" y={height / 3} width={width} height={height / 3} fill="#FFFFFF" />
          <rect x="0" y={(2 * height) / 3} width={width} height={height / 3} fill="#21468B" />
        </svg>
      )
    }
  }

  return (
    <div className="inline-block border-2 border-white/30 rounded overflow-hidden">
      {renderFlag()}
    </div>
  )
}
