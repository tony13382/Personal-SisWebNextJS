import './globals.css'
import { cookies } from 'next/headers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" precedence="default" ></link>
      <body>{children}</body>
    </html>
  )
}