import { useEffect, useMemo, useState } from 'react'
import { OpasLogo } from './components/OpasLogo'

const tokenomicsData = [
  { label: 'Pioneer Airdrop', value: 5, color: '#34ff8a' },
  { label: 'ITO', value: 20, color: '#8df5a6' },
  { label: 'Ecosystem Rewards (Tentative)', value: 20, color: '#1bc86a' },
  { label: 'Utility Reserve (TBD)', value: 30, color: '#42e5ff' },
  { label: 'Treasury & Liquidity (Tentative)', value: 12, color: '#5b8dff' },
  { label: 'Development Fund (Tentative)', value: 10, color: '#b07bff' },
  { label: 'Strategic Partners (Tentative)', value: 8, color: '#ff7ad9' },
  { label: 'Governance Pool (Tentative)', value: 6, color: '#ffd166' },
  { label: 'Emergency Reserve (Tentative)', value: 5, color: '#9cff7b' },
]

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle - 90) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const value = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean
  const num = parseInt(value, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) => value.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function mixColor(source, target, amount) {
  const from = hexToRgb(source)
  const to = hexToRgb(target)
  const mix = (a, b) => Math.round(a + (b - a) * amount)
  return rgbToHex({
    r: mix(from.r, to.r),
    g: mix(from.g, to.g),
    b: mix(from.b, to.b)
  })
}

function TokenomicsChart() {
  const [active, setActive] = useState(0)
  const total = tokenomicsData.reduce((sum, item) => sum + item.value, 0)
  const slices = useMemo(() => {
    let angle = 0
    return tokenomicsData.map((item) => {
      const start = angle
      const end = angle + (item.value / total) * 360
      angle = end
      const mid = (start + end) / 2
      const rad = (mid - 90) * (Math.PI / 180)
      const lift = 8
      const dx = Math.cos(rad) * lift
      const dy = Math.sin(rad) * lift
      return { ...item, start, end, dx, dy }
    })
  }, [total])

  const gradients = useMemo(() => (
    tokenomicsData.map((item, idx) => {
      const highlight = mixColor(item.color, '#ffffff', 0.45)
      const mid = mixColor(item.color, '#ffffff', 0.12)
      const shadow = mixColor(item.color, '#000000', 0.35)
      return { id: `slice-grad-${idx}`, highlight, mid, shadow }
    })
  ), [])

  const legendItems = tokenomicsData

  return (
    <div className="tokenomics-chart">
      <svg viewBox="0 0 240 240" className="token-chart">
        <defs>
          {gradients.map((gradient) => (
            <linearGradient
              key={gradient.id}
              id={gradient.id}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={gradient.highlight} />
              <stop offset="45%" stopColor={gradient.mid} />
              <stop offset="100%" stopColor={gradient.shadow} />
            </linearGradient>
          ))}
          <radialGradient id="token-core" cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#0e1c2c" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#060e1c" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#01060e" stopOpacity="0.98" />
          </radialGradient>
          <linearGradient id="token-rim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {slices.map((slice, idx) => (
          <path
            key={slice.label}
            d={arcPath(120, 120, idx === active ? 106 : 100, slice.start, slice.end)}
            fill={`url(#slice-grad-${idx})`}
            opacity={idx === active ? 0.95 : 0.75}
            onMouseEnter={() => setActive(idx)}
            onClick={() => setActive(idx)}
            className="slice"
            style={{
              transformOrigin: '120px 120px',
              transform: idx === active
                ? `translate(${slice.dx}px, ${slice.dy}px) scale(1.06)`
                : 'translate(0px, 0px) scale(1)',
              transition: 'transform 0.35s ease, opacity 0.35s ease'
            }}
          />
        ))}
        <circle cx="120" cy="120" r="105" fill="none" stroke="url(#token-rim)" strokeWidth="2" opacity="0.55" />
        <circle cx="120" cy="120" r="98" fill="none" stroke="rgba(0, 0, 0, 0.4)" strokeWidth="6" opacity="0.35" />
        <circle cx="120" cy="120" r="58" fill="url(#token-core)" />
        <text x="120" y="112" textAnchor="middle" className="chart-label">
          {tokenomicsData[active].value}%
        </text>
        <text x="120" y="135" textAnchor="middle" className="chart-sub">
          {tokenomicsData[active].label}
        </text>
      </svg>
      <div className="token-focus">
        <div className="token-focus-badge" style={{ background: tokenomicsData[active].color }} />
        <div className="token-focus-text">
          <span>Selected</span>
          <strong>{tokenomicsData[active].label}</strong>
          <em>{tokenomicsData[active].value}% of total supply</em>
        </div>
      </div>
      <div className="token-legend">
        {legendItems.map((item, idx) => {
          const isActive = idx === active
          return (
          <div
            key={item.label}
            className={`legend-item ${isActive ? 'active' : ''}`}
            onMouseEnter={() => setActive(idx)}
            onClick={() => setActive(idx)}
          >
            <span className="legend-dot" style={{ background: item.color }} />
            <span>{item.label}</span>
            <strong>{item.value}%</strong>
          </div>
        )})}
      </div>
    </div>
  )
}

function App() {
  const [hidden, setHidden] = useState(false)
  const [walletBannerOpen, setWalletBannerOpen] = useState(false)
  const [prediction, setPrediction] = useState('0.5')
  const memberships = [
    { id: 'op5', label: 'OP 5', usd: 5, opas: 5000 },
    { id: 'op10', label: 'OP 10', usd: 10, opas: 10000 },
    { id: 'op25', label: 'OP 25', usd: 25, opas: 25000 },
    { id: 'op50', label: 'OP 50', usd: 50, opas: 50000 }
  ]
  const [activeMembership, setActiveMembership] = useState(memberships[0].id)
  const [customOpas, setCustomOpas] = useState('')
  const selectedMembership = memberships.find((plan) => plan.id === activeMembership) || memberships[0]
  const resolvedOpas = customOpas.trim() !== ''
    ? Number(customOpas)
    : selectedMembership.opas
  const predictionValue = Number.isFinite(Number(prediction))
    ? Number(prediction) * (Number.isFinite(resolvedOpas) ? resolvedOpas : 0)
    : 0
  const phasePrices = [
    { label: 'Phase 1', value: 0.001, tag: 'Live' },
    { label: 'Phase 2', value: 0.002, tag: 'Next' },
    { label: 'Phase 3', value: 0.004, tag: 'Planned' },
    { label: 'Phase 4', value: 0.008, tag: 'Planned' },
    { label: 'ITO', value: 0.02, tag: 'ITO', tone: 'ito' },
    { label: 'Listing', value: 0.5, tag: 'Listing', tone: 'listing' }
  ]

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false
    const onScroll = () => {
      const currentY = window.scrollY
      const delta = currentY - lastY
      if (currentY > 140 && delta > 12) {
        setHidden(true)
      } else if (delta < -8 || currentY < 140) {
        setHidden(false)
      }
      lastY = currentY
      ticking = false
    }
    const onScrollEvent = () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll)
        ticking = true
      }
    }
    window.addEventListener('scroll', onScrollEvent, { passive: true })
    return () => window.removeEventListener('scroll', onScrollEvent)
  }, [])

  return (
    <div className="page">
      <div className="bg-layer bg-grid" />
      <div className="bg-layer bg-lines" />
      <div className="art-layer contour" />
      <div className="vector-orb one" />
      <div className="vector-orb two" />

      <header className={hidden ? 'header--hidden' : ''}>
        <div className="nav">
          <a className="logo" href="#top">
            <div className="logo-stack">
              <OpasLogo className="logo-badge" />
            </div>
            <div className="logo-copy">
              <span className="logo-main">OPAS</span>
              <span className="logo-sub logo-sub-main">OPAI PERKS</span>
            </div>
          </a>
          <nav className="nav-links">
            <a href="#vision">Vision</a>
            <a href="#utility">Utility</a>
            <a href="#tokenomics">Tokenomics</a>
            <a href="#roadmap">Roadmap</a>
          </nav>
          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-wallet"
              onClick={() => setWalletBannerOpen(true)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="wallet-icon">
                <path d="M3.5 7.5A2.5 2.5 0 0 1 6 5h12a2.5 2.5 0 0 1 2.5 2.5v1.2h-4.2a3.3 3.3 0 0 0 0 6.6h4.2v1.2A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5z" />
                <path d="M16.3 9.8h4.2a1 1 0 0 1 1 1v2.4a1 1 0 0 1-1 1h-4.2a2.2 2.2 0 0 1 0-4.4z" />
                <circle cx="16.8" cy="12" r="0.9" />
              </svg>
              <span className="wallet-label-full">Connect Wallet</span>
              <span className="wallet-label-mobile">Wallet</span>
            </button>
          </div>
        </div>
      </header>

      <div className="price-ticker" aria-hidden="true">
        <div className="price-ticker-track">
          <span className="price-ticker-item">Phase 1 <span className="price-ticker-price">$0.001</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item price-ticker-next">Phase 2 <span className="price-ticker-price">$0.002</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 3 <span className="price-ticker-price">$0.004</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 4 <span className="price-ticker-price">$0.008</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">ITO <span className="price-ticker-price">$0.020</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Listing <span className="price-ticker-price">$0.500</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">OP 5 <span className="price-ticker-price">5,000 OPAS</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">OP 10 <span className="price-ticker-price">10,000 OPAS</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">OP 25 <span className="price-ticker-price">25,000 OPAS</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">OP 50 <span className="price-ticker-price">50,000 OPAS</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 1 <span className="price-ticker-price">$0.001</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item price-ticker-next">Phase 2 <span className="price-ticker-price">$0.002</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 3 <span className="price-ticker-price">$0.004</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 4 <span className="price-ticker-price">$0.008</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">ITO <span className="price-ticker-price">$0.020</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Listing <span className="price-ticker-price">$0.500</span></span>
        </div>
      </div>

      {walletBannerOpen && (
        <div className="wallet-overlay" onClick={() => setWalletBannerOpen(false)}>
          <div
            className="wallet-banner"
            role="dialog"
            aria-modal="true"
            aria-label="Wallet update"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="wallet-close"
              aria-label="Close banner"
              onClick={() => setWalletBannerOpen(false)}
            >
              ×
            </button>
            <span className="wallet-kicker">CONNECT WALLET</span>
            <h3>Team OPAI is crafting your best Web3 experience.</h3>
            <p>Wallet connection is in active build and launching soon with a premium, seamless flow.</p>
          </div>
        </div>
      )}

      <main id="top">
        <section className="hero">
          <div>
            <span className="kicker">OPAI ECOSYSTEM</span>
            <h1 className="hero-title">
              <span className="text-neon">OPAS</span> - THE SIGNAL TOKEN OF OPAI'S NEXT WAVE.
            </h1>
            <p>
              OPAS is designed for early believers in the OPAI growth cycle, where participation,
              visibility, and ecosystem momentum compound with every phase.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="https://ordinarypeopleai.com/">
                Explore Utility
              </a>
              <a className="btn" href="#tokenomics">
                Tokenomics
              </a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <strong>01</strong>
                <span>Unified Rewards</span>
              </div>
              <div className="stat">
                <strong>02</strong>
                <span>Deflationary Engine</span>
              </div>
              <div className="stat">
                <strong>03</strong>
                <span>Governance Locked</span>
              </div>
              <div className="stat stat-vector" aria-hidden="true">
                <svg viewBox="0 0 220 140" className="stat-orbit">
                  <defs>
                    <linearGradient id="orbitGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34ff8a" />
                      <stop offset="100%" stopColor="#7be6ff" />
                    </linearGradient>
                    <radialGradient id="orbitCorePulse" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#dffbff" />
                      <stop offset="45%" stopColor="#34ff8a" />
                      <stop offset="100%" stopColor="rgba(52,255,138,0)" />
                    </radialGradient>
                  </defs>
                  <g className="orbit-grid">
                    <path d="M34 70h152" className="orbit-grid-line" />
                    <path d="M42 50h136" className="orbit-grid-line" />
                    <path d="M42 90h136" className="orbit-grid-line" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-a">
                    <ellipse cx="110" cy="70" rx="72" ry="34" className="orbit-line" />
                    <circle cx="182" cy="70" r="4" className="orbit-dot orbit-dot-1" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-b">
                    <ellipse cx="110" cy="70" rx="56" ry="26" className="orbit-line inner" />
                    <circle cx="54" cy="70" r="3.4" className="orbit-dot orbit-dot-2" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-c">
                    <path d="M110 20c28 0 50 22 50 50s-22 50-50 50-50-22-50-50 22-50 50-50z" className="orbit-line ring" />
                    <circle cx="110" cy="20" r="3.2" className="orbit-dot orbit-dot-3" />
                  </g>
                  <path d="M40 70h140" className="orbit-axis" />
                  <path d="M110 18v104" className="orbit-axis v" />
                  <path d="M40 44l140 52" className="orbit-axis diag" />
                  <path d="M180 44l-140 52" className="orbit-axis diag-2" />
                  <g className="orbit-scan-wrap">
                    <rect x="44" y="58" width="132" height="24" rx="12" className="orbit-scan" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-d">
                    <polygon points="110,28 116,38 104,38" className="orbit-node orbit-node-a" />
                    <polygon points="190,70 180,76 180,64" className="orbit-node orbit-node-b" />
                    <polygon points="110,112 116,102 104,102" className="orbit-node orbit-node-c" />
                    <polygon points="30,70 40,76 40,64" className="orbit-node orbit-node-d" />
                  </g>
                  <circle cx="110" cy="70" r="16" className="orbit-core-glow" />
                  <circle cx="110" cy="70" r="7" className="orbit-core" />
                </svg>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-content">
              <div className="panel-title">OPAS AT A GLANCE</div>
              <div className="panel-desc">
                Designed for clarity, OPAS connects OPAI users, builders, and partners with a token layer that is
                elegant, transparent, and future-ready.
              </div>
              <div className="panel-strip" />
              <div className="panel-grid">
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 3l8 4v5c0 5-3.5 9-8 9s-8-4-8-9V7l8-4z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h4>Trust by design</h4>
                    <p>Clean mechanics and clear value exchange.</p>
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="narrow">Automation first</h4>
                    <p>Aligned incentives across AI workflows.</p>
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M6 12h12" />
                    </svg>
                  </div>
                  <div>
                    <h4>Unified access</h4>
                    <p>Perks, tiers, and tools under one layer.</p>
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12l6 6L20 6" />
                    </svg>
                  </div>
                  <div>
                    <h4>Smart growth</h4>
                    <p>Participation that compounds over time.</p>
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 4h8v16H8z" />
                      <path d="M10 8h4" />
                    </svg>
                  </div>
                  <div>
                    <h4>Stable mechanics</h4>
                    <p>Clear token flows built for longevity.</p>
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12h8" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                  <div>
                    <h4>Utility layers</h4>
                    <p>Access, perks, and rewards in sync.</p>
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2l3 7h7l-5.6 4.1 2.2 7L12 16l-6.6 4.1 2.2-7L2 9h7z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Secure access</h4>
                    <p>Protected flows for teams and users.</p>
                  </div>
                </div>
                <div className="panel-card">
                  <div className="panel-icon">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 12h12" />
                      <path d="M12 6v12" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h4>Always on</h4>
                    <p>24/7 availability for the ecosystem.</p>
                  </div>
                </div>
              </div>
            </div>
            <img className="panel-coin" src="/assets/elite/opx-coin.png" alt="" />
          </div>
        </section>

        <section id="vision">
          <div className="section-title">
            <h2>OPAS Token Master <span className="text-neon">Framework</span></h2>
            <p>Structured framework for OPAS supply and distribution.</p>
          </div>
          <div className="cards">
            <div className="card">
              <div className="tag">Supply</div>
              <h3>
                Total supply: <span className="supply-mask" aria-label="1111111111">██████████</span> OPAS
              </h3>
              <p>Fixed maximum supply with no additional minting beyond this cap.</p>
            </div>
            <div className="card">
              <div className="tag">Rationale</div>
              <h3>Why <span className="supply-mask" aria-label="1.11B">████</span>?</h3>
              <p>Designed as a scalable tentative base for broad OPAI adoption, campaign velocity, and future utility depth.</p>
            </div>
            <div className="card">
              <div className="tag">Status</div>
              <h3>Tokenomics in draft</h3>
              <p>Allocation and release mechanics are tentative and will be finalized with governance and utility rollout.</p>
            </div>
          </div>
        </section>

        <section id="utility" className="utility-section">
          <div className="section-title">
            <h2>Core <span className="text-neon">Utility</span> engine</h2>
            <p>Utilities are currently TBD and will be announced in the next OPAS release update.</p>
          </div>
          <div className="longform utility-longform">
            <div className="long-card utility-card">
              <div className="utility-beam" />
              <h3 className="heading-white">Utilities TBD</h3>
              <p>
                OPAS utility layers are being finalized. Use-cases, access tiers, burn routes, and reward loops
                will be published after internal validation.
              </p>
              <div className="utility-circuit" aria-hidden="true" />
            </div>
            <div className="long-card utility-card">
              <div className="utility-beam" />
              <h3 className="heading-white">Current phase</h3>
              <ul>
                <li>Finalizing OPAS utility map.</li>
                <li>Aligning utility with OPAI hype content flows.</li>
                <li>Preparing public release notes for utility launch.</li>
              </ul>
            </div>
          </div>
        </section>

      <section id="price-outlook" className="section-abstract price-outlook">
        <div className="section-title">
          <h2>Price Outlook & <span className="text-neon">Phases</span></h2>
          <p>OPAS rewards are complimentary for active OPAI members, with exclusive access to Phase 1-4 airdrops.</p>
        </div>
        <div className="price-outlook-grid">
          <div className="price-phase-grid">
            {phasePrices.map((phase) => (
              <div
                className={`price-phase-card ${phase.tone ? `price-phase-card--${phase.tone}` : ''}`}
                key={phase.label}
              >
                <div className="price-phase-label">
                  <span>{phase.label}</span>
                  <span className="price-phase-tag">{phase.tag}</span>
                </div>
                <strong>${phase.value.toFixed(3)}</strong>
              </div>
            ))}
          </div>
          <div className="price-calc">
            <div className="price-calc-head">
              <span className="price-calc-kicker">Our Prediction</span>
              <h3>Estimate Your OPAS Value</h3>
              <p>Select your active membership or enter your OPAS holding to forecast future value.</p>
            </div>
            <div className="membership-block">
              <span className="membership-label">Select Your Active Membership</span>
              <div className="membership-grid">
                {memberships.map((plan) => (
                  <button
                    type="button"
                    key={plan.id}
                    className={`membership-card ${activeMembership === plan.id ? 'active' : ''}`}
                    onClick={() => {
                      setActiveMembership(plan.id)
                      setCustomOpas('')
                    }}
                  >
                    <span>{plan.label}</span>
                    <strong>${plan.usd}</strong>
                    <em>{plan.opas.toLocaleString('en-US')} OPAS</em>
                  </button>
                ))}
              </div>
            </div>
            <div className="price-inputs">
              <label className="price-input">
                <span>Prediction price (USD)</span>
                <input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={prediction}
                  onChange={(event) => setPrediction(event.target.value)}
                />
              </label>
              <label className="price-input">
                <span>Enter your OPAS holding</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder={selectedMembership.opas.toString()}
                  value={customOpas}
                  onChange={(event) => setCustomOpas(event.target.value)}
                />
              </label>
            </div>
            <div className="price-output">
              <span>Estimated Value</span>
              <strong>${predictionValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
          </div>
        </div>
      </section>

      <section id="tokenomics" className="section-abstract">
        <div className="section-title">
          <h2>Distribution, deflation & <span className="text-neon">Safeguards</span></h2>
          <p>Chart slices reflect tentative OPAS values and may change before final tokenomics approval.</p>
        </div>
          <div className="tokenomics-layout">
            <div className="tokenomics-side">
              <TokenomicsChart />
              <div className="token-aux-vector" aria-hidden="true">
                <svg viewBox="0 0 220 140" className="stat-orbit stat-orbit-token">
                  <defs>
                    <linearGradient id="orbitGlowToken" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34ff8a" />
                      <stop offset="100%" stopColor="#7be6ff" />
                    </linearGradient>
                    <radialGradient id="orbitCorePulseToken" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#dffbff" />
                      <stop offset="45%" stopColor="#34ff8a" />
                      <stop offset="100%" stopColor="rgba(52,255,138,0)" />
                    </radialGradient>
                  </defs>
                  <g className="orbit-grid">
                    <path d="M34 70h152" className="orbit-grid-line" />
                    <path d="M42 50h136" className="orbit-grid-line" />
                    <path d="M42 90h136" className="orbit-grid-line" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-a">
                    <ellipse cx="110" cy="70" rx="72" ry="34" className="orbit-line" />
                    <circle cx="182" cy="70" r="4" className="orbit-dot orbit-dot-1" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-b">
                    <ellipse cx="110" cy="70" rx="56" ry="26" className="orbit-line inner" />
                    <circle cx="54" cy="70" r="3.4" className="orbit-dot orbit-dot-2" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-c">
                    <path d="M110 20c28 0 50 22 50 50s-22 50-50 50-50-22-50-50 22-50 50-50z" className="orbit-line ring" />
                    <circle cx="110" cy="20" r="3.2" className="orbit-dot orbit-dot-3" />
                  </g>
                  <path d="M40 70h140" className="orbit-axis" />
                  <path d="M110 18v104" className="orbit-axis v" />
                  <path d="M40 44l140 52" className="orbit-axis diag" />
                  <path d="M180 44l-140 52" className="orbit-axis diag-2" />
                  <g className="orbit-scan-wrap">
                    <rect x="44" y="58" width="132" height="24" rx="12" className="orbit-scan orbit-scan-token" />
                  </g>
                  <g className="orbit-rotator orbit-rotator-d">
                    <polygon points="110,28 116,38 104,38" className="orbit-node orbit-node-a" />
                    <polygon points="190,70 180,76 180,64" className="orbit-node orbit-node-b" />
                    <polygon points="110,112 116,102 104,102" className="orbit-node orbit-node-c" />
                    <polygon points="30,70 40,76 40,64" className="orbit-node orbit-node-d" />
                  </g>
                  <circle cx="110" cy="70" r="16" className="orbit-core-glow orbit-core-glow-token" />
                  <circle cx="110" cy="70" r="7" className="orbit-core" />
                </svg>
              </div>
            </div>
            <div className="longform">
              <div className="long-card">
                <h3>Phase-wise allocation (tentative)</h3>
                <ul className="phase-list">
                  <li>
                    <span className="phase-name">Pioneer Airdrop</span>
                    <div className="phase-line">
                      <span className="phase-percent">5%</span>
                      <span className="phase-desc">Community-first distribution.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">ITO</span>
                    <div className="phase-line">
                      <span className="phase-percent">20%</span>
                      <span className="phase-desc">Initial token offering allocation.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Ecosystem Rewards</span>
                    <div className="phase-line">
                      <span className="phase-percent">20%</span>
                      <span className="phase-desc">Tentative emission model.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Utility Reserve (TBD)</span>
                    <div className="phase-line">
                      <span className="phase-percent">30%</span>
                      <span className="phase-desc">Utility mapping in progress.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Treasury & Liquidity</span>
                    <div className="phase-line">
                      <span className="phase-percent">12%</span>
                      <span className="phase-desc">Liquidity for DEX and CEX.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Development Fund</span>
                    <div className="phase-line">
                      <span className="phase-percent">10%</span>
                      <span className="phase-desc">Tentative release schedule.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Strategic Partners</span>
                    <div className="phase-line">
                      <span className="phase-percent">8%</span>
                      <span className="phase-desc">Tentative milestone unlock.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Governance Pool</span>
                    <div className="phase-line">
                      <span className="phase-percent">6%</span>
                      <span className="phase-desc">Draft governance allocation.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Emergency Reserve</span>
                    <div className="phase-line">
                      <span className="phase-percent">5%</span>
                      <span className="phase-desc">Tentative safety reserve.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="long-card">
                <h3>Release model (TBD)</h3>
                <ul>
                  <li>Detailed release calendar is pending.</li>
                  <li>Vesting logic will follow finalized utility design.</li>
                  <li>Governance checkpoints will be announced before launch.</li>
                </ul>
              </div>
              <div className="long-card">
                <h3>Deflationary model (draft)</h3>
                <ul>
                  <li>Burn and buyback mechanisms are not finalized.</li>
                  <li>All deflation routes will be published with utilities.</li>
                  <li>On-chain reporting format is being defined.</li>
                </ul>
              </div>
              <div className="long-card">
                <h3>Risk controls (draft)</h3>
                <ul>
                  <li>Utility-first framework over speculation.</li>
                  <li>Vesting protections under review.</li>
                  <li>Governance and staking controls are TBD.</li>
                  <li>Treasury protections will be finalized pre-launch.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="roadmap">
          <div className="section-title">
            <h2>Long‑term price structure <span className="text-neon">Strategy</span></h2>
            <p>Value grows with usage, burn, and staking — not hype.</p>
          </div>
          <div className="roadmap">
            <div className="roadmap-item">
              <span>Phase 01</span>
              <div>
                <h4>Controlled launch (low float)</h4>
                <p>Fixed supply, phased distribution, and strict vesting.</p>
              </div>
            </div>
            <div className="roadmap-item">
              <span>Phase 02</span>
              <div>
                <h4>Utility expansion</h4>
                <p>Platform fuel, burn‑to‑unlock boosts, and leaderboard mechanics.</p>
              </div>
            </div>
            <div className="roadmap-item">
              <span>Phase 03</span>
              <div>
                <h4>Staking lock</h4>
                <p>Access privileges tied to staked OPAS to reduce circulating supply.</p>
              </div>
            </div>
            <div className="roadmap-item">
              <span>Phase 04</span>
              <div>
                <h4>Governance decentralization</h4>
                <p>Proposal rights, voting weight, treasury direction.</p>
              </div>
            </div>
            <div className="roadmap-item">
              <span>Phase 05</span>
              <div>
                <h4>Ecosystem integration</h4>
                <p>Marketplace, AI tools, advertising, B2B services, and on‑chain analytics.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="cta-band">
          <div>
            <h3>
              Build with <span className="text-neon">OPAS</span>. Grow with <span className="text-neon">OPAI</span>.
            </h3>
            <p>A clean, future-ready token layer designed to align access, rewards, and participation across the ecosystem.</p>
          </div>
          <div className="cta-actions">
            <a className="btn" href="https://whatsapp.com/channel/0029Vb73mX0002TBJI3gMp0E">
              Join Community
            </a>
            <a className="btn btn-primary" href="https://user.ordinarypeopleai.com/login">
              Launch App
            </a>
          </div>
        </div>

        <footer>2026 OPAS Token - OPAI Ecosystem. All rights reserved.</footer>
      </main>
    </div>
  )
}

export default App
