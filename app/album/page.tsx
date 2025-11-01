"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, Upload, Trash2, Image as ImageIcon } from "lucide-react"
import Image from "next/image"

export default function AlbumPage() {
  const [photos, setPhotos] = useState<string[]>(() => {
    // Initialize state from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("album_pi23a")
      return stored ? JSON.parse(stored) : []
    }
    return []
  })
  const [selected, setSelected] = useState<string | null>(null)

  // Simpan setiap kali ada perubahan
  useEffect(() => {
    localStorage.setItem("album_pi23a", JSON.stringify(photos))
  }, [photos])

  // Fungsi upload gambar
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Hapus foto
  const handleDelete = (src: string) => {
    setPhotos((prev) => prev.filter((p) => p !== src))
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 text-white px-6 pt-8 pb-20 overflow-x-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center gap-2">
            <ImageIcon className="text-pink-400" />
            Album Foto PI23A
          </h1>
          <p className="text-purple-300">
            Simpan dan bagikan momen terbaik bersama teman seperjuangan 💜
          </p>
        </div>

        <label className="flex items-center gap-2 cursor-pointer bg-purple-600 hover:bg-purple-700 px-5 py-2 rounded-full shadow-lg transition-all">
          <Upload size={18} />
          <span>Upload Foto</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </motion.div>

      {/* Grid Foto */}
      <section className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {photos.length === 0 && (
          <p className="col-span-full text-center text-purple-300 italic">
            Belum ada foto yang diunggah. Yuk upload kenangan kalian! 📸
          </p>
        )}

        {photos.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.03 }}
            className="relative rounded-xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer"
          >
            <div className="w-full h-56 relative">
              <Image
                src={src}
                alt={`Foto ${i + 1}`}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                onClick={() => setSelected(src)}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-between p-3 text-sm text-purple-200">
              <span>Klik untuk perbesar</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(src)
                }}
                className="p-1 bg-white/10 hover:bg-red-600/70 rounded-full transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      {/* Modal Preview */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative max-w-3xl w-full p-4"
            >
              <div className="relative w-full h-[80vh]">
                <Image
                  src={selected}
                  alt="Preview"
                  fill
                  className="rounded-2xl object-contain shadow-[0_0_30px_rgba(168,85,247,0.4)]"
                />
              </div>
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2"
              >
                <X size={20} className="text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}