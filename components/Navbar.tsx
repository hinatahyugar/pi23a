"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ✅ Tambahkan item baru "VSCode"
  const navItems = [
    { name: "Dashboard", href: "/kelas" },
    { name: "Jadwal", href: "/jadwal" },
    { name: "Forum", href: "/forum" },
    { name: "Struktur", href: "/struktur" },
    { name: "Album", href: "/album" },
    { name: "Profil", href: "/profil" },
    { name: "VSCode", href: "/vscode" }, // 🔹 item baru
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b backdrop-blur-md ${
        scrolled
          ? "bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-blue-950/90 border-purple-400/30 shadow-[0_4px_25px_rgba(147,51,234,0.4)]"
          : "bg-gradient-to-r from-indigo-950/80 via-purple-950/70 to-blue-950/80 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO + NAMA */}
        <Link href="/kelas" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: 12 }}
            transition={{ type: "spring", stiffness: 150 }}
          >
            <Image
              src="/assets/gg.png"
              alt="Logo PI23A"
              width={40}
              height={40}
              className="rounded-full border border-purple-400/40 shadow-md"
            />
          </motion.div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent group-hover:scale-105 transition-all">
            PI23A Portal
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center space-x-6 text-sm lg:text-base">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={item.href}
                className="relative group text-purple-200 hover:text-white transition"
              >
                {item.name}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* TOGGLE MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden flex flex-col items-center gap-4 py-4 bg-black/60 border-t border-white/10 backdrop-blur-md"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-purple-200 hover:text-white transition text-lg"
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.nav>
  )
}
