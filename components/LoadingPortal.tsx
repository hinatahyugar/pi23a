"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function LoadingPortal() {
  const [isAnimating, setIsAnimating] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const startAnimation = () => {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 800)
      return timer
    }

    const timer = startAnimation()
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 flex items-center justify-center z-[9999] backdrop-blur-md bg-black/40"
        >
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [1, 1.5, 1], rotate: 360 }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="w-32 h-32 rounded-full border-4 border-purple-400 border-t-transparent shadow-[0_0_40px_#a855f7]"
            style={{
              boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}