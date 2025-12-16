import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"
import "./globals.css"
import { AuthProviderWrapper } from "@/components/providers/auth-provider-wrapper"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  title: "True Star Executive Dashboard",
  description: "Executive Dashboard for property management KPIs and metrics",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={notoSans.variable} style={{ fontFamily: 'var(--font-noto-sans), sans-serif' }}>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  )
}

