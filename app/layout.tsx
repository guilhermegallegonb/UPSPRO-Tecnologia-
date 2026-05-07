import type { Metadata } from 'next'
import { Playfair_Display, Dancing_Script, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MotherRoll — Homenagens Emocionais',
  description: 'Transforme fotos e memórias em uma homenagem emocionante em menos de 2 minutos. Mensagens, música e animações especiais.',
  keywords: ['homenagem', 'dia das mães', 'presente', 'emocional', 'memorial', 'família'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_BASE_URL,
    title: 'MotherRoll — O presente que toca a alma',
    description: 'Crie uma homenagem emocionante com fotos, música e mensagens especiais.',
    siteName: 'MotherRoll',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'MotherRoll',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MotherRoll — Homenagens Emocionais',
    description: 'Transforme memórias em uma homenagem inesquecível.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${dancing.variable}`}>
      <head>
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer=window.dataLayer||[];
              function gtag(){dataLayer.push(arguments);}
              gtag('js',new Date());
              gtag('config','${gaId}');
            `}} />
          </>
        )}
        {metaPixelId && (
          <script dangerouslySetInnerHTML={{ __html: `
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${metaPixelId}');fbq('track','PageView');
          `}} />
        )}
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
