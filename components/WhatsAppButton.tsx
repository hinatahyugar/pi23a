"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function WhatsAppButton() {
  const [showText, setShowText] = useState(true)

  useEffect(() => {
    // Setelah 2 detik, teks disedot
    const timer = setTimeout(() => setShowText(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.a
      href="https://wa.me/6282266158487?text=Halo%20saya%20ingin%20tanya%20tentang%20pengembangan%20web%20PI23A"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-4 right-6 flex items-center gap-2 bg-green-500/90 hover:bg-green-600 text-white font-medium shadow-lg shadow-green-700/40 rounded-full transition-all duration-300 hover:scale-105 px-3 py-2"
    >
      {/* TEKS di kiri */}
      <AnimatePresence>
        {showText && (
          <motion.span
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: 20,        // bergerak ke arah logo
              scale: 0.6,   // mengecil seperti disedot
              transition: { duration: 0.7, ease: [0.55, 0.06, 0.68, 0.19] },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-xs whitespace-nowrap mr-1"
          >
            Hub Development
          </motion.span>
        )}
      </AnimatePresence>

      {/* LOGO di kanan (tetap diam) */}
      <motion.div
        className="w-9 h-9 flex items-center justify-center bg-green-600 rounded-full shadow-md"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M16.001 2.002A13.951 13.951 0 0 0 2 16.001c0 2.454.64 4.847 1.854 6.96L2 30l7.282-1.853A13.951 13.951 0 0 0 16.001 30a13.998 13.998 0 1 0 0-27.998zM16 27.602c-2.206 0-4.348-.58-6.228-1.679l-.447-.26-4.322 1.101 1.155-4.206-.289-.433A11.585 11.585 0 0 1 4.4 16C4.4 9.813 9.813 4.4 16 4.4c6.187 0 11.6 5.413 11.6 11.6S22.187 27.602 16 27.602zm6.391-8.569c-.348-.174-2.057-1.014-2.375-1.132-.317-.117-.549-.174-.781.174-.232.348-.896 1.132-1.099 1.364-.203.232-.406.261-.754.087-.348-.174-1.47-.542-2.802-1.727-1.036-.924-1.735-2.064-1.938-2.412-.203-.348-.021-.535.153-.708.157-.157.348-.406.522-.609.174-.203.232-.348.348-.58.116-.232.058-.435-.029-.609-.087-.174-.781-1.888-1.07-2.584-.282-.678-.57-.586-.781-.597-.203-.009-.435-.012-.667-.012-.232 0-.609.087-.928.435-.319.348-1.218 1.19-1.218 2.9s1.248 3.366 1.422 3.597c.174.232 2.453 3.748 5.942 5.249 3.49 1.501 3.49 1.001 4.116.938.626-.064 2.058-.838 2.35-1.645.29-.806.29-1.497.203-1.646-.087-.145-.319-.232-.667-.406z" />
        </svg>
      </motion.div>
    </motion.a>
  )
}
