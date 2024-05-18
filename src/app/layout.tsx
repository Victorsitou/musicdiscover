"use client";

import { Inter } from 'next/font/google'
import { StrictMode } from 'react'
import { SessionProvider } from 'next-auth/react'
import ToastProvider from './components/ToastProvider';
import { Analytics } from "@vercel/analytics/react"
import "./i18n"

import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

const metadata = {
  title: 'Music Discover',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StrictMode>
      <SessionProvider
        baseUrl="/"
      >
        
          <html data-color-mode="dark">
            <head>
              <title>Music Discover</title>
            </head>
            <body className={inter.className}>
              <ToastProvider>
                {children}
                <Analytics />
              </ToastProvider>
            </body>
          </html>
      </SessionProvider>
    </StrictMode>
  )
}
