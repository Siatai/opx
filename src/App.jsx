import { useEffect, useMemo, useState } from 'react'

const tokenomicsData = [
  { label: 'Pioneer Airdrop', value: 12, color: '#34ff8a' },
  { label: 'Ecosystem Rewards', value: 25, color: '#1bc86a' },
  { label: 'Platform Utility Reserve', value: 18, color: '#42e5ff' },
  { label: 'Treasury & Liquidity', value: 15, color: '#5b8dff' },
  { label: 'Development Fund', value: 10, color: '#b07bff' },
  { label: 'Strategic Partners', value: 8, color: '#ff7ad9' },
  { label: 'Governance Pool', value: 7, color: '#ffd166' },
  { label: 'Emergency Reserve', value: 5, color: '#9cff7b' },
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

  const legendItems = tokenomicsData

  return (
    <div className="tokenomics-chart">
      <svg viewBox="0 0 240 240" className="token-chart">
        {slices.map((slice, idx) => (
          <path
            key={slice.label}
            d={arcPath(120, 120, idx === active ? 106 : 100, slice.start, slice.end)}
            fill={slice.color}
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
        <circle cx="120" cy="120" r="58" fill="rgba(6,14,28,0.9)" />
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
            <div className="logo-badge">OPX</div>
            <span className="logo-text">TOKEN</span>
          </a>
          <nav className="nav-links">
            <a href="#vision">Vision</a>
            <a href="#utility">Utility</a>
            <a href="#tokenomics">Tokenomics</a>
            <a href="#roadmap">Roadmap</a>
          </nav>
          <div className="nav-actions">
            <a className="btn btn-primary" href="https://ordinarypeopleai.com/">
              Explore Utility
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <span className="kicker">OPAI ECOSYSTEM</span>
            <h1 className="hero-title">
              <span className="text-neon">OPX</span> · THE PRECISION TOKEN FOR SMART GROWTH.
            </h1>
            <p>
              OPAI is an AI-powered digital ecosystem that empowers individuals with intelligent automation,
              smart tools, and a transparent, future-ready platform for growth. OPX aligns rewards, access,
              and participation across every layer of the OPAI experience.
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
            </div>
          </div>

          <div className="hero-panel">
            <div className="hero-panel-content">
              <div className="panel-title">OPX AT A GLANCE</div>
              <div className="panel-desc">
                Designed for clarity, OPX connects OPAI users, builders, and partners with a token layer that is
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
            <h2>OPX Token Master <span className="text-neon">Framework</span></h2>
            <p>Utility-driven. Deflationary. Ecosystem-locked. Current price: $0.001.</p>
          </div>
          <div className="cards">
            <div className="card">
              <div className="tag">Supply</div>
              <h3>Total supply: 75,000,000 OPX</h3>
              <p>Fixed cap. No minting ever. Smart contract renounced or multi‑sig governed. Hard‑coded max supply.</p>
            </div>
            <div className="card">
              <div className="tag">Rationale</div>
              <h3>Why 75M?</h3>
              <p>Small enough for scarcity, large enough for ecosystem scaling, psychologically strong for sub‑$1 growth.</p>
            </div>
            <div className="card">
              <div className="tag">Anti‑Dump</div>
              <h3>Structured by design</h3>
              <p>No large unlocked founder wallets. No single wallet &gt;3%. Vesting enforced via smart contract.</p>
            </div>
          </div>
        </section>

        <section id="utility">
          <div className="section-title">
            <h2>Core <span className="text-neon">Utility</span> engine</h2>
            <p>OPX creates demand through burns, access, and platform-required actions.</p>
          </div>
          <div className="longform">
          <div className="long-card">
            <h3 className="heading-white">OPX as platform fuel (hard demand)</h3>
            <p>Mandatory OPX use for discounts and accelerators, all burned:</p>
              <div className="pill-row">
                <span className="pill">Withdrawal fee discount</span>
                <span className="pill">Internal transfer discount</span>
                <span className="pill">Package upgrades</span>
                <span className="pill">Reactivation fee</span>
                <span className="pill">Rank unlock acceleration</span>
                <span className="pill">Boosted level earnings</span>
                <span className="pill">Higher‑level education unlock</span>
              </div>
            </div>
          <div className="long-card">
            <h3 className="heading-white">Burn-to-unlock earnings boost</h3>
            <ul>
                <li>Remove earning caps temporarily.</li>
                <li>Increase uni‑level depth.</li>
                <li>Accelerate rank qualification.</li>
                <li>Boost matching bonus %.</li>
              </ul>
            </div>
          <div className="long-card">
            <h3 className="heading-white">Leaderboard + education access</h3>
            <ul>
                <li>500 OPX burn = 7‑day visibility boost.</li>
                <li>2,000 OPX burn = premium badge.</li>
                <li>Access via staking: AI tools, Forex modules, strategy rooms, closed signals, mastermind access.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="tokenomics" className="section-abstract">
          <div className="section-title">
            <h2>Distribution, deflation & <span className="text-neon">Safeguards</span></h2>
            <p>Anti‑dump structure with emissions capped and burns visible.</p>
          </div>
          <div className="tokenomics-layout">
            <TokenomicsChart />
            <div className="longform">
              <div className="long-card">
                <h3>Phase‑wise allocation</h3>
                <ul className="phase-list">
                  <li>
                    <span className="phase-name">Pioneer Airdrop</span>
                    <div className="phase-line">
                      <span className="phase-percent">12%</span>
                      <span className="phase-desc">24‑month vesting.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Ecosystem Rewards</span>
                    <div className="phase-line">
                      <span className="phase-percent">25%</span>
                      <span className="phase-desc">Emission‑based.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Platform Utility Reserve</span>
                    <div className="phase-line">
                      <span className="phase-percent">18%</span>
                      <span className="phase-desc">Usage‑based release.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Treasury & Liquidity</span>
                    <div className="phase-line">
                      <span className="phase-percent">15%</span>
                      <span className="phase-desc">Locked + strategic.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Development Fund</span>
                    <div className="phase-line">
                      <span className="phase-percent">10%</span>
                      <span className="phase-desc">36‑month vesting.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Strategic Partners</span>
                    <div className="phase-line">
                      <span className="phase-percent">8%</span>
                      <span className="phase-desc">Milestone unlock.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Governance Pool</span>
                    <div className="phase-line">
                      <span className="phase-percent">7%</span>
                      <span className="phase-desc">Voting + staking.</span>
                    </div>
                  </li>
                  <li>
                    <span className="phase-name">Emergency Reserve</span>
                    <div className="phase-line">
                      <span className="phase-percent">5%</span>
                      <span className="phase-desc">DAO controlled.</span>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="long-card">
                <h3>Pioneer release model</h3>
                <ul>
                  <li>30% liquid in first 6 months.</li>
                  <li>70% unlocked monthly over 24 months.</li>
                  <li>Early heavy selling reduces governance weight + leaderboard eligibility.</li>
                </ul>
              </div>
              <div className="long-card">
                <h3>Deflationary model</h3>
                <ul>
                  <li>Burn sources: platform utility, upgrade acceleration, leaderboard boosts, NFT mints (future), event access.</li>
                  <li>Monthly: 5% of platform revenue buys OPX from market and burns.</li>
                  <li>Quarterly: public on‑chain burn events.</li>
                  <li>Target burn 3–6% annually; emissions capped 2–3%.</li>
                </ul>
              </div>
              <div className="long-card">
                <h3>Anti‑dump architecture</h3>
                <ul>
                  <li>Utility &gt; speculation.</li>
                  <li>Vesting for team & pioneers.</li>
                  <li>Governance weight tied to holding.</li>
                  <li>Access privileges tied to staking.</li>
                  <li>Buybacks funded by platform revenue.</li>
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
                <p>Access privileges tied to staked OPX to reduce circulating supply.</p>
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
              Build with <span className="text-neon">OPX</span>. Grow with <span className="text-neon">OPAI</span>.
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

        <footer>2026 OPX Token - OPAI Ecosystem. All rights reserved.</footer>
      </main>
    </div>
  )
}

export default App
