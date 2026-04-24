import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import  TargetCursor  from '@/components/mouse/TargetCursor'
import ClickSpark from '@/components/mouse/Click'
import FloatingChatAssistant from '@/components/ui/FloatChat'


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Revolution Gym - Transform Your Body, Transform Your Life',
  description: 'Premium fitness center with personalized training, nutrition plans, and progress tracking. Join Revolution Gym today!',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        
        <TargetCursor
              targetSelector=".cursor-target"
              spinDuration={2}
              hideDefaultCursor={true}
              hoverDuration={0.2}
              parallaxOn={true}
            />
            <ClickSpark sparkColor="#fff" sparkSize={22} sparkRadius={50} sparkCount={10} duration={600}>{children}</ClickSpark>
            <FloatingChatAssistant />
        
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
