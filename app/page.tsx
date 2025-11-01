"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [nama, setNama] = useState("")
  const [kode, setKode] = useState("")
  const [feedback, setFeedback] = useState("")
  const router = useRouter()

  useEffect(() => {
    const savedNama = localStorage.getItem("namaUser")
    const savedKode = localStorage.getItem("kodeKelas")

    // kalau user sudah isi sebelumnya, langsung masuk ke halaman kelas
    if (savedNama && savedKode === "PIA2023") {
      router.push("/kelas")
    }
  }, [router])

  const handleSubmit = () => {
    if (nama.trim() === "" || kode.trim() === "") {
      setFeedback("⚠️ Harap isi semua kolom terlebih dahulu!")
      return
    }

    if (kode !== "PIA2023") {
      setFeedback("❌ Kode kelas salah! Coba lagi.")
      return
    }

    // jika benar
    localStorage.setItem("namaUser", nama)
    localStorage.setItem("kodeKelas", kode)
    setFeedback("✅ Login Berhasil maimuna")
    setTimeout(() => router.push("/kelas"), 1500)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white relative overflow-hidden">
      {/* Aura background */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Konten utama */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 w-full max-w-md px-6"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide drop-shadow-lg mb-4">
          PI23A Portal
        </h1>
        <p className="text-purple-200 mb-10">
          Pendidikan Informatika – FKIP 2023
        </p>

        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center space-y-4"
        >
          <input
            type="text"
            placeholder="Masukkan nama kamu..."
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="px-5 py-3 w-full rounded-full text-black text-center outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="text"
            placeholder="Masukkan kode kelas..."
            value={kode}
            onChange={(e) => setKode(e.target.value)}
            className="px-5 py-3 w-full rounded-full text-black text-center outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Tombol */}
          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Masuk Kelas
          </motion.button>

          {/* Feedback Animasi */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mt-4 px-4 py-2 rounded-full text-sm font-medium ${
                  feedback.includes("✅")
                    ? "bg-green-500/20 text-green-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm text-purple-300">
        © 2025 PI23A | Made with ❤ by Rey Langko
      </footer>
    </main>
  )
}
