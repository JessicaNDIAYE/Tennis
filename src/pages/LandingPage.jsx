// Landing page inspired by the top-down tennis court illustration:
// dark green court surface, net visible, orange/yellow tennis balls with shadows

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">

      {/* LEFT PANEL — Court illustration */}
      <div className="relative flex-1 min-h-[50vh] md:min-h-screen overflow-hidden"
        style={{ background: '#2A5C38' }}>

        {/* Court surface texture */}
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 20% 80%, #1E4B2E 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, #1A4226 0%, transparent 50%),
              #2A5C38
            `,
          }} />

        {/* Court lines — top-down view, partial */}
        <div className="absolute inset-0">
          {/* Main baseline */}
          <div className="absolute bottom-0 left-0 right-0 h-[3px]"
            style={{ background: 'rgba(255,255,255,0.9)', bottom: '15%' }} />

          {/* Service line */}
          <div className="absolute left-0 right-0 h-[2px]"
            style={{ background: 'rgba(255,255,255,0.7)', top: '35%' }} />

          {/* Center line vertical */}
          <div className="absolute top-0 bottom-0 w-[2px]"
            style={{ background: 'rgba(255,255,255,0.5)', left: '50%' }} />

          {/* Singles sidelines */}
          <div className="absolute top-0 bottom-0 w-[2px]"
            style={{ background: 'rgba(255,255,255,0.6)', left: '12%' }} />
          <div className="absolute top-0 bottom-0 w-[2px]"
            style={{ background: 'rgba(255,255,255,0.6)', right: '12%' }} />

          {/* NET — the hero element */}
          <div className="absolute left-0 right-0"
            style={{ top: '42%' }}>
            {/* Net frame */}
            <div className="absolute inset-x-0 h-[18px]"
              style={{ background: 'rgba(40,20,10,0.85)' }}>
              {/* Net mesh */}
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="absolute top-0 bottom-0 w-[1px]"
                  style={{
                    left: `${(i + 1) * (100 / 29)}%`,
                    background: 'rgba(60,30,10,0.6)',
                  }} />
              ))}
              {/* Net horizontal wires */}
              {[25, 50, 75].map(pct => (
                <div key={pct} className="absolute inset-x-0 h-[1px]"
                  style={{ top: `${pct}%`, background: 'rgba(60,30,10,0.5)' }} />
              ))}
            </div>
            {/* Net shadow */}
            <div className="absolute inset-x-0 h-[6px] -bottom-1.5"
              style={{ background: 'rgba(0,0,0,0.3)', filter: 'blur(3px)' }} />
            {/* Net posts */}
            <div className="absolute -left-1 -top-4 w-2 h-[26px] rounded-sm"
              style={{ background: '#7a5230' }} />
            <div className="absolute -right-1 -top-4 w-2 h-[26px] rounded-sm"
              style={{ background: '#7a5230' }} />
          </div>
        </div>

        {/* Light streaks — diagonal court shadows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{
              background: `
                linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.04) 45%, transparent 55%),
                linear-gradient(315deg, transparent 0%, rgba(0,0,0,0.15) 50%, transparent 100%)
              `
            }} />
        </div>

        {/* Tennis balls — scattered like in the illustration */}
        <TennisBallSVG style={{ position: 'absolute', top: '18%', right: '28%', width: 56, height: 56 }} shadowDir="right" />
        <TennisBallSVG style={{ position: 'absolute', top: '55%', right: '22%', width: 44, height: 44 }} shadowDir="right" />
        <TennisBallSVG style={{ position: 'absolute', top: '68%', right: '38%', width: 50, height: 50 }} shadowDir="bottom" />
        <TennisBallSVG style={{ position: 'absolute', top: '72%', left: '55%', width: 36, height: 36 }} shadowDir="right" opacity={0.7} />

        {/* Small ambient ball (partially off screen) */}
        <TennisBallSVG style={{ position: 'absolute', bottom: '-10px', left: '30%', width: 48, height: 48 }} shadowDir="top" opacity={0.8} />

        {/* Brand watermark */}
        <div className="absolute bottom-6 left-6 opacity-30">
          <p className="text-white text-xs font-light tracking-widest uppercase">ACE Tennis Hub · 2026</p>
        </div>
      </div>

      {/* RIGHT PANEL — Content & CTA */}
      <div className="relative flex flex-col justify-center px-10 py-16 md:py-0 md:w-[480px] bg-court-cream">

        {/* Decorative dot grid */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.2" fill="#2A5C38" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-sm">

          {/* Logo badge */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-court-green flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎾</span>
            </div>
            <div>
              <p className="font-display text-2xl text-court-green tracking-widest leading-none">ACE</p>
              <p className="text-court-green/50 text-xs tracking-widest uppercase font-medium">Tennis Hub</p>
            </div>
          </div>

          {/* Headline */}
          <h1 className="font-display text-6xl sm:text-7xl text-court-green leading-[0.9] mb-4 tracking-tight">
            LEVEL<br />
            <span className="text-court-blue">UP</span><br />
            YOUR<br />
            GAME.
          </h1>

          {/* Subtitle */}
          <p className="text-gray-500 text-base leading-relaxed mb-8 font-medium">
            Suis tes matchs, compare-toi à tes amis, connecte ta montre et reçois les meilleurs conseils tennis — tout en un seul endroit.
          </p>

          {/* Features list */}
          <div className="space-y-3 mb-10">
            {[
              { icon: '🏆', text: 'Classement entre amis en temps réel' },
              { icon: '⌚', text: 'Sync Xiaomi Band, Apple Watch, Wear OS' },
              { icon: '💡', text: 'Conseils et articles tennis lisibles complets' },
              { icon: '🎖️', text: 'Badges & achievements à débloquer' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-court-green/10 flex items-center justify-center text-lg flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-gray-600 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={onEnter}
            className="w-full bg-court-green text-white font-black text-lg py-4 px-8 rounded-2xl
              hover:bg-court-blue transition-all duration-300 shadow-lg hover:shadow-xl
              active:scale-95 group flex items-center justify-center gap-3"
          >
            <span>Jouer maintenant</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">🎾</span>
          </button>

          <p className="text-center text-gray-400 text-xs mt-4 font-medium">
            Gratuit · Pour toi et tes amis · Aucune CB requise
          </p>
        </div>

        {/* Score decoration */}
        <div className="absolute top-8 right-8 hidden md:block">
          <div className="bg-white rounded-2xl shadow-md p-4 text-center border border-gray-100">
            <p className="font-display text-3xl text-court-green">6-4</p>
            <p className="font-display text-3xl text-court-blue">6-2</p>
            <p className="text-xs text-gray-400 mt-1 font-medium">Score du jour</p>
          </div>
        </div>

        {/* Bottom pill */}
        <div className="absolute bottom-8 right-8 hidden md:block">
          <div className="bg-court-yellow rounded-full px-4 py-2 shadow flex items-center gap-2">
            <div className="w-2 h-2 bg-court-green rounded-full animate-pulse" />
            <span className="text-court-green text-xs font-black">5 joueurs en ligne</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TennisBallSVG({ style, shadowDir = 'right', opacity = 1 }) {
  const shadowOffsets = {
    right:  { x: 10, y: 6 },
    bottom: { x: 4, y: 12 },
    top:    { x: -4, y: -8 },
  };
  const { x, y } = shadowOffsets[shadowDir] || shadowOffsets.right;

  return (
    <div style={{ ...style, opacity }}>
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {/* Shadow ellipse */}
        <ellipse cx={30 + x} cy={50 + y * 0.3} rx={18} ry={7}
          fill="rgba(0,0,0,0.35)" filter="url(#blur)" />
        <defs>
          <filter id="blur">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        {/* Ball body */}
        <circle cx="28" cy="26" r="22" fill="#E8A830" />
        {/* Highlight */}
        <ellipse cx="22" cy="18" rx="7" ry="5" fill="rgba(255,220,120,0.5)" transform="rotate(-20 22 18)" />
        {/* Seam lines */}
        <path d="M28 4 C20 10 16 18 20 26 C24 34 20 40 14 46"
          stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M28 4 C36 10 40 18 36 26 C32 34 36 40 42 46"
          stroke="rgba(255,255,255,0.55)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Darker edge shading */}
        <circle cx="28" cy="26" r="22" fill="none"
          stroke="rgba(150,80,10,0.25)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
