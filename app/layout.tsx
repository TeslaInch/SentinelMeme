import type { Metadata } from 'next'
import { JetBrains_Mono, Syne } from 'next/font/google'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SentinelMeme | AI Rug Pull Scanner — BNB Chain',
  description: 'Real-time AI-powered meme token risk analysis on BNB Chain.',
  icons: {
    icon: '/logo-static.svg',
    shortcut: '/logo-static.svg',
    apple: '/logo-static.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${syne.variable}`}>
      <body>{children}</body>
    </html>
  )
}
