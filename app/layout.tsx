"use client"

import Navbar from "@/components/Navbar"
import { LoadingPortal } from '@/components/LoadingPortal'
import { usePathname } from "next/navigation"
import WhatsAppButtonWrapper from "@/components/WhatsAppButtonWrapper"
import "./globals.css"

function BodyWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = pathname === "/"
   const hideWhatsApp = pathname === "/vscode" 
    const isVsCodePage = pathname === "/vscode"

  return (
  <div
  className={`min-h-screen overflow-x-hidden transition-all duration-700 ${
    pathname === "/vscode"
      ? "bg-[#1e1e1e] text-white"
      : "bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white"
  }`}
>

      {!hideNavbar && <Navbar />}
      <div className={hideNavbar ? "" : "pt-18"}>{children}</div>
      <LoadingPortal />
      
      {/* ✅ Tampilkan tombol WhatsApp hanya jika bukan halaman /vscode */}
 {!hideWhatsApp && (
  <div className="fixed bottom-5 right-5 z-[9999]">
    <WhatsAppButtonWrapper />
  </div>
)}

    </div>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body suppressHydrationWarning={true}>
        <BodyWrapper>{children}</BodyWrapper>
      </body>
    </html>
  )
}