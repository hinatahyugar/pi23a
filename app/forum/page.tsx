"use client"

import { motion } from "framer-motion"
import { Send, ArrowLeft, MessageCircle, Smile } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { db } from "@/lib/firebaseConfig"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface Pesan {
  id: string
  nama: string
  isi: string
  waktu: string
}

export default function ForumPage() {
  const [pesan, setPesan] = useState<Pesan[]>([])
  const [input, setInput] = useState("")
  const [nama] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("namaUser") || "Mahasiswa PI23A"
    }
    return "Mahasiswa PI23A"
  })
  const [tema, setTema] = useState("dark")
  const [showEmoji, setShowEmoji] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef(false)

  // 🔹 Ambil pesan realtime dari Firestore
  useEffect(() => {
    const q = query(collection(db, "pesan"), orderBy("timestamp"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        nama: doc.data().nama,
        isi: doc.data().isi,
        waktu: doc.data().waktu,
      })) as Pesan[]

      if (pesan.length > 0 && data.length > pesan.length) {
        const lastMsg = data[data.length - 1]
        if (lastMsg.nama !== nama && notifRef.current) {
          toast.info(`${lastMsg.nama} mengirim pesan baru!`, {
            icon: <span>💬</span>,
            theme: tema === "dark" ? "dark" : "light",
            position: "bottom-right",
          })
        }
      }
      notifRef.current = true
      setPesan(data)
    })
    return () => unsubscribe()
  }, [nama, tema, pesan.length]) // Added pesan.length to dependencies

  // 🔹 Auto scroll
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    })
  }, [pesan])

  // 🔹 Kirim pesan
  const kirimPesan = async () => {
    if (input.trim() === "") return
    const waktu = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    await addDoc(collection(db, "pesan"), {
      nama,
      isi: input,
      waktu,
      timestamp: serverTimestamp(),
    })
    setInput("")
    setShowEmoji(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") kirimPesan()
  }

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji)
  }

  // 🌈 Tema hanya untuk kotak chat
  const boxTheme =
    tema === "dark"
      ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-950 border-purple-700/30 text-white"
      : tema === "light"
      ? "bg-gradient-to-br from-white to-gray-100 border-gray-200 text-gray-900"
      : "bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 border-purple-500/40 text-pink-100"

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-950 text-white px-6 pt-10 pb-20 transition-colors duration-700">
      <ToastContainer />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left"
      >
        {/* Judul dan deskripsi */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent flex items-center justify-center md:justify-start gap-2">
            <MessageCircle className="text-pink-400" />
            Forum Diskusi Kelas
          </h1>
          <p className="text-purple-300 text-sm md:text-base">
            Tempat ngobrol, curhat, dan berbagi ilmu 👾
          </p>
        </div>

        {/* Tombol tema + kembali */}
        <div className="flex flex-wrap justify-center md:justify-end gap-3">
          <select
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            className="bg-white/10 text-purple-200 rounded-full px-3 py-1 text-sm focus:outline-none"
          >
            <option value="dark">🌌 Gelap</option>
            <option value="light">🌤 Terang</option>
            <option value="galaxy">🌈 Galaxy</option>
          </select>

          <Link
            href="/kelas"
            className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all text-purple-300 text-sm"
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>
        </div>
      </motion.div>

      {/* Wrapper Chat + Emoji Picker */}
      <div className="relative max-w-5xl mx-auto mt-10">
        {/* Chat Box */}
        <section
          className={`border backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col flex-1 h-[70vh] shadow-[0_0_25px_rgba(147,51,234,0.3)] transition-all duration-500 ${boxTheme}`}
        >
          {/* Area pesan */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-700/50 pb-[1rem]"
          >
            {pesan.length === 0 ? (
              <p
                className={`text-center italic mt-20 ${
                  tema === "light"
                    ? "text-gray-500"
                    : tema === "galaxy"
                    ? "text-pink-200/70"
                    : "text-purple-300/70"
                }`}
              >
                Belum ada pesan. Jadilah yang pertama menyapa! 🌸
              </p>
            ) : (
              pesan.map((msg) => {
                const isUser = msg.nama === nama
                const bubbleColor =
                  tema === "light"
                    ? isUser
                      ? "bg-purple-500 text-white"
                      : "bg-gray-200 text-gray-900"
                    : tema === "galaxy"
                    ? isUser
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "bg-gradient-to-r from-purple-800/60 to-indigo-800/40 text-pink-100"
                    : isUser
                    ? "bg-purple-600/70 text-white"
                    : "bg-white/20 text-purple-100"

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[80%] ${
                      isUser ? "ml-auto text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block p-3 rounded-2xl ${bubbleColor} ${
                        isUser ? "rounded-tr-none" : "rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm font-semibold mb-1 opacity-80">{msg.nama}</p>
                      <p>{msg.isi}</p>
                      <p className="text-xs opacity-70 mt-1">{msg.waktu}</p>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>

          {/* Input chat */}
          <div className="border-t border-white/20 bg-white/10 backdrop-blur-lg p-3 flex items-center gap-2 relative">
            {/* Tombol emoji */}
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="p-2 bg-purple-600/70 hover:bg-purple-700 rounded-full transition"
            >
              <Smile size={20} />
            </button>

            {/* Input teks */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pesan..."
              className={`flex-1 bg-transparent outline-none px-4 text-sm ${
                tema === "dark"
                  ? "text-white placeholder-purple-300"
                  : tema === "light"
                  ? "text-gray-800 placeholder-gray-500"
                  : "text-pink-100 placeholder-pink-300"
              }`}
            />

            {/* Tombol kirim */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={kirimPesan}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </section>

        {/* 🌟 Emoji keyboard */}
        {showEmoji && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 left-16 z-[9999]"
          >
            <div className="scale-75 origin-bottom-left">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme={tema === "dark" ? Theme.DARK : Theme.LIGHT}
              />
            </div>
          </motion.div>
        )}
      </div>
    </main>
  )
}