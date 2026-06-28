import { useEffect, useMemo, useState } from 'react'
import { OpasLogo } from './components/OpasLogo'

const tokenomicsData = [
  { label: 'Pioneer Airdrop', value: 5, color: '#34ff8a' },
  { label: 'ITO', value: 20, color: '#8df5a6' },
  { label: 'Ecosystem Rewards (Tentative)', value: 20, color: '#1bc86a' },
  { label: 'Utility Reserve (TBD)', value: 12.5, color: '#42e5ff' },
  { label: 'Treasury & Liquidity (Tentative)', value: 12, color: '#5b8dff' },
  { label: 'Development Fund (Tentative)', value: 10, color: '#b07bff' },
  { label: 'Strategic Partners (Tentative)', value: 8, color: '#ff7ad9' },
  { label: 'Team Tokens', value: 6.2, color: '#ffd166' },
  { label: 'CSR / Charity Tokens', value: 6.3, color: '#9cff7b' },
]

const propositionBlocks = [
  {
    id: 'A',
    tone: 'a',
    title: 'Potential Equity Projection',
    tag: '5% Share',
    synopsis: 'High-velocity user growth scenario with recurring subscription expansion.',
    summary: 'Maps 100K to 1M users into revenue and 5% share outcomes over a 1-7 month window.',
    note: 'Repeat subscriptions will contribute additionally.',
    scaleColumns: [3, 4],
    headers: ['Users', 'Timeline', 'Revenue', 'Avg. Potential Earning', '5% Share'],
    rows: [
      ['100K', '1-2 months', '1M', '300K', '25,000'],
      ['500K', '4-5 months', '5M', '1.5M', '75,000'],
      ['1M', '6-7 months', '10M', '3M', '150,000'],
    ],
  },
  {
    id: 'B',
    tone: 'b',
    title: 'OPAI ID',
    tag: 'Capped Model',
    synopsis: 'Lower-entry participation route built around a capped value frame.',
    summary: 'Shows a 50,000 user path with a 6-month revenue target and capped participation value.',
    note: 'Single capped scenario extracted from the proposition PDF.',
    scaleColumns: [3, 4],
    headers: ['Users', 'Timeline', 'Revenue', 'Avg. Potential Earning', 'Capping'],
    rows: [['50,000', '6 months', '500,000', '400,000', '500,000']],
  },
  {
    id: 'C',
    tone: 'c',
    title: 'OPAS',
    tag: 'Token Position',
    synopsis: 'Token-side upside framed through ITO and listing value translation.',
    summary: 'Connects team token allocation, ITO pricing, and listing valuation into one value story.',
    note: 'Priority exit at ITO. Team token note preserved from the source proposition.',
    scaleColumns: [1, 3, 5],
    headers: ['Total Supply', '5% of Team Tokens', 'ITO Price', 'ITO Value', 'Listing Price', 'Listing Value'],
    rows: [['21,000,000,000', '31,500,000', '0.02', '630,000', '0.5', '15,750,000']],
  },
  {
    id: 'D',
    tone: 'd',
    title: 'Trading Bot',
    tag: 'Performance Layer',
    synopsis: 'Execution-based yield layer attached to a fixed capital allocation.',
    summary: 'Presents the 5% monthly assumption and its annualized result in a simplified performance model.',
    note: 'Monthly return assumption taken directly from the proposition.',
    scaleColumns: [0, 2, 3],
    headers: ['Allocation', 'Anticipated Performance', 'Monthly AR', '1 Year'],
    rows: [['100,000', '5%', '5,000', '60,000']],
  },
]

const projectionSummary = [
  { label: 'A', title: 'Potential Equity Projection', synopsis: 'Growth scenario', summary: '5% share path', tone: 'a', value: 75000 },
  { label: 'B', title: 'OPAI ID', synopsis: 'Capped route', summary: 'Recurring entry model', tone: 'b', value: 400000 },
  { label: 'C', title: 'OPAS', synopsis: 'Token value lens', summary: 'ITO to listing bridge', tone: 'c', value: 630000 },
  { label: 'D', title: 'Trading Bot', synopsis: 'Performance layer', summary: '12-month output view', tone: 'd', value: 60000 },
]

const propositionIntro = {
  title: 'Introduction',
  body:
    'OPAI is positioned as an educational and personal development platform focused on communication, leadership, digital skills, and AI literacy. This deal room frames the expansion opportunity, the value logic, and the operating scenarios in one place.',
}

const propositionExtracts = [
  { title: 'Small Entry', body: 'The proposition is built around a low-friction starting point so users can enter without a heavy upfront barrier.' },
  { title: 'Free Package', body: 'A free package for all users is positioned as a first-time industry move designed to widen access and participation.' },
  { title: 'No Liability', body: 'The structure is presented as non-liability focused, reducing complexity and keeping the offer easier to understand.' },
  { title: '5X Potential', body: 'The core upside message stays centered on a visible 5X potential theme that is easy for users to grasp quickly.' },
  { title: 'Non Complicated', body: 'The message stays simple: clear entry, understandable flow, and no over-engineered explanation.' },
  { title: 'Instant Income & Withdrawal', body: 'Immediate earning and withdrawal language is treated as a key attraction point in the proposition story.' },
  { title: 'Expansion Promos', body: 'Promotional activity is positioned as expansion-focused, helping growth, reach, and repeated system momentum.' },
  { title: 'Ecosystem Backing', body: 'Backed by a hyper-innovative, virtually unlimited ecosystem designed to stay compliant across both Web2 and Web3 environments.' },
]

const onboardingTiers = [
  {
    id: 'starter',
    label: 'Foundation Entry',
    amount: 500000,
  },
  {
    id: 'growth',
    label: 'Growth Acceleration',
    amount: 1000000,
  },
  {
    id: 'strategic',
    label: 'Strategic Expansion',
    amount: 3000000,
  },
  {
    id: 'enterprise',
    label: 'Enterprise Integration',
    amount: 5000000,
  },
]

function normalizeRoute(pathname) {
  return pathname === '/dealroom' ? '/dealroom' : '/'
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatScaledFigure(value, source) {
  const decimals = String(source).includes('.') ? String(source).split('.')[1].length : 0

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

function parseCompactNumber(cell) {
  const match = String(cell).trim().match(/^([\d.]+)\s*([KM])$/i)
  if (!match) {
    return null
  }

  const value = Number(match[1])
  const unit = match[2].toUpperCase()
  const multiplier = unit === 'M' ? 1000000 : 1000

  return value * multiplier
}

function formatCompactNumber(value, source) {
  const match = String(source).trim().match(/^([\d.]+)\s*([KM])$/i)
  if (!match) {
    return formatScaledFigure(value, source)
  }

  const decimals = String(match[1]).includes('.') ? String(match[1]).split('.')[1].length : 0
  const unit = match[2].toUpperCase()
  const divisor = unit === 'M' ? 1000000 : 1000
  const scaled = value / divisor

  return `${scaled.toFixed(decimals).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1')}${unit}`
}

function scaleRowCell(cell, multiplier) {
  if (typeof cell !== 'string' || cell.includes('%') || /month/i.test(cell) || /K$|M$/i.test(cell)) {
    return cell
  }

  const numeric = Number(cell.replace(/,/g, ''))
  if (Number.isNaN(numeric)) {
    return cell
  }

  return formatScaledFigure(numeric * multiplier, cell)
}

function scaleUserCell(cell, multiplier) {
  const compactValue = parseCompactNumber(cell)
  if (compactValue !== null) {
    return formatCompactNumber(compactValue * multiplier, cell)
  }

  const numeric = Number(String(cell).replace(/,/g, ''))
  if (Number.isNaN(numeric)) {
    return cell
  }

  return formatScaledFigure(numeric * multiplier, cell)
}

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

function HomeLanding() {
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
    <div className={`page ${hidden ? 'header-hidden' : ''}`}>
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
          <span className="price-ticker-item">Phase 1 <span className="price-ticker-price">$0.001</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item price-ticker-next">Phase 2 <span className="price-ticker-price">$0.002</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 1 <span className="price-ticker-price">$0.001</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item price-ticker-next">Phase 2 <span className="price-ticker-price">$0.002</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 1 <span className="price-ticker-price">$0.001</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item price-ticker-next">Phase 2 <span className="price-ticker-price">$0.002</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item">Phase 1 <span className="price-ticker-price">$0.001</span></span>
          <span className="price-ticker-sep">|</span>
          <span className="price-ticker-item price-ticker-next">Phase 2 <span className="price-ticker-price">$0.002</span></span>
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
            <div className="deploy-probe" aria-label="Deployment check banner">
              <span className="deploy-dot" aria-hidden="true" />
              <strong className="deploy-inline">Live Deployment</strong>
            </div>
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
                <div className="orb-core">
                  <div className="reactor-outer-disc" aria-hidden="true" />
                  <div className="reactor-rim" aria-hidden="true" />
                  <div className="reactor-plasma" aria-hidden="true" />
                  <div className="reactor-amber-rings" aria-hidden="true">
                    <div className="reactor-amber-ring ring-1" />
                    <div className="reactor-amber-ring ring-2" />
                    <div className="reactor-amber-ring ring-3" />
                  </div>
                  <div className="reactor-core">
                    <div className="reactor-core__ring" />
                    <div className="orb-sub"></div>
                  </div>
                </div>
                <div className="orb-grid" aria-hidden="true" />
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
                      <span className="phase-percent">12.5%</span>
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
                    <span className="phase-name">Team Tokens</span>
                    <div className="phase-line">
                      <span className="phase-percent">6.2%</span>
                      <span className="phase-desc">Reserved for core team allocation.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">CSR / Charity Tokens</span>
                    <div className="phase-line">
                      <span className="phase-percent">6.3%</span>
                      <span className="phase-desc">Dedicated to CSR and charity initiatives.</span>
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

        <footer>
          <span>2026 OPAS Token - OPAI Ecosystem. All rights reserved.</span>
          <a className="footer-dealroom-link" href="/dealroom">Value Proposition</a>
        </footer>
      </main>
    </div>
  )
}

function DealRoomPage() {
  const [selectedTierId, setSelectedTierId] = useState(onboardingTiers[0].id)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const selectedTier = onboardingTiers.find((tier) => tier.id === selectedTierId) ?? onboardingTiers[0]
  const baseTierAmount = onboardingTiers[0].amount
  const selectedTierIndex = onboardingTiers.findIndex((tier) => tier.id === selectedTier.id)
  const capitalMultiple = selectedTier.amount / baseTierAmount
  const tierBonusRate = selectedTierIndex * 0.05
  const userAcquisitionMultiplier = 1 + selectedTierIndex * 0.6
  const tierBenefitMultiplier = capitalMultiple * (1 + tierBonusRate)
  const tierBenefitLabel =
    selectedTierIndex === 0
      ? `1x base allocation from ${formatCurrency(baseTierAmount)}`
      : `${capitalMultiple}x base allocation with ${selectedTierIndex * 5}% extra token benefit`
  const activeProjectionSummary = projectionSummary.map((item) => ({
    ...item,
    benefitValue: Math.round(item.value * tierBenefitMultiplier),
  }))
  const activePropositionBlocks = propositionBlocks.map((block, index) => ({
    ...block,
    benefitValue: activeProjectionSummary[index]?.benefitValue ?? 0,
    benefitLabel: tierBenefitLabel,
    scaledRows: block.rows.map((row) =>
      row.map((cell, cellIndex) => {
        if (cellIndex === 0 && block.headers[cellIndex] === 'Users') {
          return scaleUserCell(cell, userAcquisitionMultiplier)
        }

        return block.scaleColumns.includes(cellIndex) ? scaleRowCell(cell, tierBenefitMultiplier) : cell
      })
    ),
  }))
  const totalProjection = activeProjectionSummary.reduce((sum, item) => sum + item.benefitValue, 0)

  return (
    <div className={`dealroom-shell dealroom-shell--${selectedTier.id}`}>
      <div className="dealroom-topbar">
        <a className="dealroom-brand" href="/">
          <OpasLogo className="dealroom-brand-mark" />
          <div>
            <span className="dealroom-brand-name">OPAS</span>
            <span className="dealroom-brand-sub">Deal Room</span>
          </div>
        </a>
        <div className="dealroom-topbar-actions">
          <a className="dealroom-ghost-link" href="/">Back to Home</a>
          <a className="dealroom-primary-link" href="/assets/VP-June-26.pdf" target="_blank" rel="noreferrer">
            Open Original PDF
          </a>
        </div>
      </div>

      <main className="dealroom-main">
        <div className={`dealroom-layout${isSidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
          <aside className={`dealroom-sidebar${isSidebarCollapsed ? ' is-collapsed' : ''}`}>
            <section className="dealroom-sidebar-card">
              <button
                type="button"
                className="dealroom-sidebar-toggle"
                onClick={() => setIsSidebarCollapsed((current) => !current)}
                aria-expanded={!isSidebarCollapsed}
              >
                <span>{isSidebarCollapsed ? 'Open Classes' : 'Hide Classes'}</span>
                <strong>{selectedTier.label}</strong>
              </button>

              {isSidebarCollapsed ? null : (
                <>
                  <div className="dealroom-sidebar-head">
                    <span className="eyebrow">Onboarding Classes</span>
                    <h2>Select a capital class.</h2>
                  </div>
                  <div className="tier-tab-stack" role="tablist" aria-label="Onboarding classes">
                    {onboardingTiers.map((tier) => {
                      const isActive = tier.id === selectedTier.id

                      return (
                        <button
                          key={tier.id}
                          type="button"
                          className={`tier-tab tier-tab--${tier.id}${isActive ? ' is-active' : ''}`}
                          onClick={() => {
                            setSelectedTierId(tier.id)
                            setIsSidebarCollapsed(true)
                          }}
                          aria-pressed={isActive}
                        >
                          <span>{tier.label}</span>
                          <strong>{formatCurrency(tier.amount)}</strong>
                        </button>
                      )
                    })}
                  </div>
                </>
              )}
            </section>
          </aside>

          <div className="dealroom-content-column">
            <section className="prop-hero">
              <div className="prop-hero-copy-wrap">
                <div className="prop-hero-copy">
                  <span className="eyebrow">Investor Opportunity</span>
                  <h1>
                    An early-position opportunity to scale with <span className="brand-word brand-word-opai">OPAI</span> and the{' '}
                    <span className="brand-word brand-word-opas">OPAS</span> expansion curve.
                  </h1>
                  <p className="lede">
                    {selectedTier.label} begins at {formatCurrency(selectedTier.amount)} and follows the {capitalMultiple}x base allocation model with {selectedTierIndex * 5}% extra token benefit over the {formatCurrency(baseTierAmount)} base ask.
                  </p>
                </div>
                <div className="prop-summary">
                  <article className="summary-pill summary-pill-ask">
                    <span>{selectedTier.label} Capital Ask</span>
                    <strong>{formatCurrency(selectedTier.amount)}</strong>
                  </article>
                  <article className="summary-pill summary-pill-projection">
                    <span>12-Month Projection</span>
                    <strong>{formatCurrency(totalProjection)}</strong>
                  </article>
                  <article className="summary-pill summary-pill-ito">
                    <span>OPAS ITO Value</span>
                    <strong>{formatCurrency(630000)}</strong>
                  </article>
                </div>
              </div>
            </section>

            <section className="prop-context">
              <article className="context-card context-card--intro">
                <span className="eyebrow">{propositionIntro.title}</span>
                <h2>Position the opportunity before the numbers.</h2>
                <p>{propositionIntro.body}</p>
              </article>
              <article className="context-card context-card--extracts">
                <span className="eyebrow">Main Extracts</span>
                <div className="extract-grid">
                  {propositionExtracts.map((extract) => (
                    <div key={extract.title} className="extract-card">
                      <strong>{extract.title}</strong>
                      <p>{extract.body}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="projection-band-wrap">
              <div className="projection-band-heading">
                <span className="eyebrow">Snapshot</span>
                <h2>Segment snapshot across the four value engines.</h2>
              </div>
              <div className="projection-band">
                {activeProjectionSummary.map((item) => (
                  <a key={item.label} className={`projection-chip projection-chip--${item.tone}`} href={`#segment-${item.label.toLowerCase()}`}>
                    <span>Segment {item.label}</span>
                    <h3>{item.title}</h3>
                    <small>{item.synopsis}</small>
                    <strong>{formatCurrency(item.benefitValue)}</strong>
                    <b>{item.summary}</b>
                  </a>
                ))}
              </div>
              <div className="projection-band-total">
                <span>Combined Four-Segment Total</span>
                <strong>{formatCurrency(totalProjection)}</strong>
              </div>
            </section>

            <section className="prop-grid">
              {activePropositionBlocks.map((block) => (
                <article key={block.id} className={`prop-card prop-card--${block.tone}`} id={`segment-${block.id.toLowerCase()}`}>
                  <div className="prop-card-head">
                    <div>
                      <span className="card-kicker">
                        {block.id}. {block.tag}
                      </span>
                      <h2>{block.title}</h2>
                    </div>
                    <div className="accent-orb" aria-hidden="true" />
                  </div>
                  <div className="prop-card-summary">
                    <div className="prop-summary-line">
                      <span>Synopsis</span>
                      <p>{block.synopsis}</p>
                    </div>
                    <div className="prop-summary-line">
                      <span>Summary</span>
                      <p>{block.summary}</p>
                    </div>
                    <div className="prop-summary-line">
                      <span>Benefit</span>
                      <p>
                        {formatCurrency(block.benefitValue)} under the {selectedTier.label} ask with {block.benefitLabel}.
                      </p>
                    </div>
                  </div>
                  <div className="prop-table-wrap">
                    <table className="prop-table">
                      <thead>
                        <tr>
                          {block.headers.map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.scaledRows.map((row) => (
                          <tr key={row.join('-')}>
                            {row.map((cell, index) => (
                              <td
                                key={`${block.id}-${cell}-${index}`}
                                className={index === row.length - 1 || /(^\d+M$)|(^\d+\.\d+M$)|(^\d{1,3}(,\d{3})+$)/.test(cell) ? 'table-figure' : ''}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="prop-mobile-rows">
                    {block.scaledRows.map((row) => (
                      <article key={`${block.id}-${row.join('-')}`} className="prop-mobile-row">
                        {row.map((cell, index) => (
                          <div key={`${block.id}-mobile-${cell}-${index}`} className="prop-mobile-cell">
                            <span>{block.headers[index]}</span>
                            <strong
                              className={index === row.length - 1 || /(^\d+M$)|(^\d+\.\d+M$)|(^\d{1,3}(,\d{3})+$)/.test(cell) ? 'table-figure' : ''}
                            >
                              {cell}
                            </strong>
                          </div>
                        ))}
                      </article>
                    ))}
                  </div>
                  <p className="prop-note">
                    {block.note}
                    {block.id === 'A' ? ' Scenario A in the deck reinforces repeat-paying system behavior.' : ''}
                    {block.id === 'B' ? ' Scenario B presents a lower-entry but still recurring participation path.' : ''}
                    {block.id === 'C' ? ' The deck also frames OPAS as part of a broader long-horizon value narrative.' : ''}
                    {block.id === 'D' ? ' This aligns with the deck message that effort and execution drive results.' : ''}
                  </p>
                </article>
              ))}
            </section>

            <section className="projection-total">
              <div>
                <span className="eyebrow">12 Months Projection</span>
                <h2>Total extracted proposition value: {formatCurrency(totalProjection)}</h2>
                <p>
                  The source PDF combines A, B, C, and D at a total of 1,165,000. This page preserves that total while
                  making the mechanics legible enough to present directly on-site.
                </p>
              </div>
              <div className="projection-total-box">
                <span>Combined Total</span>
                <strong>{formatCurrency(totalProjection)}</strong>
                <a href="/assets/VP-June-26.pdf" target="_blank" rel="noreferrer">
                  Review the original document
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="dealroom-footer">
        <a href="/">Return to OPAS Home</a>
      </footer>
    </div>
  )
}

const ACCESS_PASSWORD = 'Saturday1!1'
const ACCESS_STORAGE_KEY = 'opai-access-granted'

function PasswordGate({ onUnlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    if (password === ACCESS_PASSWORD) {
      window.sessionStorage.setItem(ACCESS_STORAGE_KEY, 'true')
      setError('')
      onUnlock()
      return
    }

    setError('Incorrect password.')
  }

  return (
    <main className="password-gate-shell">
      <section className="password-gate-card">
        <span className="password-gate-kicker">Restricted Access</span>
        <h1>Enter password to continue.</h1>
        <p>This build is locked behind a single shared password.</p>
        <form className="password-gate-form" onSubmit={handleSubmit}>
          <label className="password-gate-field" htmlFor="access-password">
            <span>Password</span>
            <input
              id="access-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                if (error) setError('')
              }}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="password-gate-error">{error}</p> : null}
          <button type="submit" className="password-gate-submit">
            Unlock
          </button>
        </form>
      </section>
    </main>
  )
}

function App() {
  const [route, setRoute] = useState(() => normalizeRoute(window.location.pathname))
  const [hasAccess, setHasAccess] = useState(() => window.sessionStorage.getItem(ACCESS_STORAGE_KEY) === 'true')

  useEffect(() => {
    const onPopState = () => setRoute(normalizeRoute(window.location.pathname))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    document.title = route === '/dealroom' ? 'OPAS | Deal Room' : 'OPAS | OPAI Ecosystem'
  }, [route])

  if (route === '/dealroom' && !hasAccess) {
    return <PasswordGate onUnlock={() => setHasAccess(true)} />
  }

  return route === '/dealroom' ? <DealRoomPage /> : <HomeLanding />
}

export default App
