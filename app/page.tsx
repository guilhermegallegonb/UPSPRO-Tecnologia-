import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MotherRoll — Homenagens Emocionais que ficam para sempre',
  description: 'Transforme fotos e memórias em uma homenagem emocionante em menos de 2 minutos. Música, animações e mensagens especiais.',
}

const STEPS = [
  { n: '01', icon: '📸', title: 'Envie suas fotos', desc: 'Até 10 fotos das suas memórias favoritas.' },
  { n: '02', icon: '💌', title: 'Escreva a mensagem', desc: 'Do coração. Sem pressão — até sugerimos frases.' },
  { n: '03', icon: '🎵', title: 'Escolha a música', desc: 'Trilha sonora emocional que define o momento.' },
  { n: '04', icon: '✨', title: 'Receba a homenagem', desc: 'Uma experiência linda, pronta para compartilhar.' },
]

const TESTIMONIALS = [
  { name: 'Ana Paula', city: 'São Paulo', text: 'Minha mãe chorou muito. Disse que nunca recebeu nada tão bonito na vida. Valeu cada centavo!', stars: 5 },
  { name: 'Carlos M.', city: 'Belo Horizonte', text: 'Fiz para o aniversário da minha avó de 80 anos. Toda a família ficou emocionada quando ela abriu.', stars: 5 },
  { name: 'Juliana R.', city: 'Rio de Janeiro', text: 'Simplesmente incrível. Criei em 3 minutos e ficou como se tivesse levado horas para fazer.', stars: 5 },
  { name: 'Marcos S.', city: 'Curitiba', text: 'A música sincronizando com as fotos é demais. Minha mãe assistiu umas 10 vezes seguidas!', stars: 5 },
]

export default function HomePage() {
  return (
    <main style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }} className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 30% 40%, #3d1a2a 0%, #130a10 60%)' }}>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="absolute rounded-full animate-pulse-slow"
              style={{
                width: Math.random() * 4 + 1,
                height: Math.random() * 4 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: 'rgba(232,160,180,0.4)',
                animationDelay: `${Math.random() * 3}s`,
              }} />
          ))}
        </div>

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase glass"
            style={{ color: 'var(--c-primary)' }}>
            ✦ MotherRoll
          </div>

          <h1 className="font-serif font-semibold leading-tight"
            style={{ fontSize: 'clamp(2rem,6vw,4rem)', color: 'var(--c-text)' }}>
            Transforme fotos e memórias em uma{' '}
            <span style={{ background: 'linear-gradient(135deg,#e8a0b4,#ff6b9e,#c47b9a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              homenagem emocionante
            </span>{' '}
            em menos de 2 minutos.
          </h1>

          <p className="text-lg max-w-xl leading-relaxed" style={{ color: 'var(--c-text2)' }}>
            Crie experiências com música, animações e mensagens especiais.
            Um presente que toca a alma.
          </p>

          <Link href="/criar" className="btn-primary text-lg px-10 py-5 animate-pulse-slow"
            style={{ boxShadow: '0 0 40px rgba(232,160,180,0.4)' }}>
            Criar Minha Homenagem ✦
          </Link>

          <p className="text-sm" style={{ color: 'var(--c-text2)' }}>
            Grátis para criar · Pagamento só para desbloquear
          </p>

          {/* Mockup animado */}
          <div className="mt-12 relative w-64 flex flex-col items-center animate-scroll-float">
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl glass p-6 flex flex-col gap-4">
              <div className="text-center font-script text-3xl" style={{ color: 'var(--c-primary)' }}>♥</div>
              <div className="h-2 rounded-full w-3/4 mx-auto" style={{ background: 'var(--c-border)' }} />
              <div className="h-2 rounded-full w-1/2 mx-auto" style={{ background: 'var(--c-border)' }} />
              <div className="h-24 rounded-xl" style={{ background: 'var(--c-surface)' }} />
              <div className="h-2 rounded-full w-2/3 mx-auto" style={{ background: 'var(--c-border)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="py-24 px-6" style={{ background: 'var(--c-bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--c-primary)' }}>Como funciona</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--c-text)' }}>
              Pronto em menos de 2 minutos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map(s => (
              <div key={s.n} className="flex flex-col gap-4 p-6 rounded-2xl glass">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--c-primary)' }}>{s.n}</span>
                <h3 className="font-semibold text-base" style={{ color: 'var(--c-text)' }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text2)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREÇOS ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--c-primary)' }}>Planos</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--c-text)' }}>
              Simples e acessível
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Básico */}
            <div className="flex flex-col gap-4 p-7 rounded-3xl glass">
              <div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--c-text2)' }}>Básico</span>
                <div className="text-4xl font-bold mt-1" style={{ color: 'var(--c-text)' }}>R$ 14,90</div>
              </div>
              <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--c-text2)' }}>
                {['Remove marca d\'água', 'Impressão em A4', 'Link válido por 7 dias', 'Música completa (3 min)'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span style={{ color: 'var(--c-primary)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/criar" className="btn-secondary text-center w-full justify-center mt-auto">Criar agora</Link>
            </div>

            {/* Premium */}
            <div className="flex flex-col gap-4 p-7 rounded-3xl relative overflow-hidden"
              style={{ background: 'var(--c-surface)', border: '2px solid var(--c-primary)' }}>
              <div className="absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'var(--grad-btn)' }}>
                Mais escolhido
              </div>
              <div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--c-primary)' }}>Premium</span>
                <div className="text-4xl font-bold mt-1" style={{ color: 'var(--c-text)' }}>R$ 24,90</div>
              </div>
              <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--c-text2)' }}>
                {['Remove marca d\'água', 'Impressão em A4', 'Link permanente', 'Música ilimitada', 'Compartilhamento premium'].map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <span style={{ color: 'var(--c-primary)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/criar" className="btn-primary text-center w-full justify-center mt-auto">Criar agora</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="py-24 px-6" style={{ background: 'var(--c-bg2)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--c-primary)' }}>Depoimentos</p>
            <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--c-text)' }}>
              Quem já criou, amou
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl glass flex flex-col gap-3">
                <div className="flex gap-0.5">{Array.from({ length: t.stars }).map((_, j) => <span key={j} className="text-amber-400">★</span>)}</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text)' }}>&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--c-primary)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--c-text2)' }}>{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-6 text-center"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, #3d1a2a 0%, #130a10 70%)' }}>
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <div className="text-5xl animate-heart-beat">♥</div>
          <h2 className="font-serif text-3xl font-semibold" style={{ color: 'var(--c-text)' }}>
            Crie agora e surpreenda quem você ama
          </h2>
          <p style={{ color: 'var(--c-text2)' }}>Leva menos de 2 minutos. Emoção que dura para sempre.</p>
          <Link href="/criar" className="btn-primary text-lg px-10 py-5" style={{ boxShadow: '0 0 40px rgba(232,160,180,0.4)' }}>
            Começar Agora — É Grátis ✦
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-6 text-center border-t" style={{ borderColor: 'var(--c-border)' }}>
        <p className="font-script text-xl mb-2" style={{ color: 'var(--c-primary)' }}>MotherRoll</p>
        <p className="text-xs" style={{ color: 'var(--c-text2)' }}>© 2025 MotherRoll · Feito com ♥ no Brasil</p>
      </footer>
    </main>
  )
}
