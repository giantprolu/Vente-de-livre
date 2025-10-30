import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Blissody",
    template: "%s - Blissody",
  },
  description: "Livre témoignage, histoire vraie, édition limitée.",
  robots: "index, follow",
  openGraph: {
    title: "Blissody",
    description: "Livre témoignage, histoire vraie, édition limitée.",
    type: "website",
    url: "https://votre-domaine.fr",
    images: [
      {
        url: "/book-cover-with-elegant-design.jpg",
        width: 800,
        height: 1200,
        alt: "Couverture du livre Blissody",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
