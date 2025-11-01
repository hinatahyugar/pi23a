"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LogOut, Calendar, MessageCircle, Users, User, Image, Bell, Sparkles, Zap, Target, TrendingUp, Clock, BookOpen, GraduationCap, Settings, X } from "lucide-react"

// Interface untuk tipe data
interface Task {
  id: number
  title: string
  due: string
  course: string
}

interface ScheduleItem {
  time: string
  course: string
  room: string
}

interface ForumMessage {
  id: number
  user: string
  message: string
  timestamp: Date
  isNew: boolean
}

// Mock data untuk simulasi fungsi
const MOCK_DATA = {
  tasks: [
    { id: 1, title: "Tugas Algoritma", due: "2 jam lagi", course: "Algoritma & Pemrograman" },
    { id: 2, title: "Essay Pendidikan", due: "Besok", course: "Filsafat Pendidikan" },
  ] as Task[],
  schedule: [
    { time: "08:00", course: "Sistem Keamanan Informasi", room: "Ruang PI-2" },
    { time: "10:00", course: "Kecerdasan Buatan", room: "Ruang PI-1" },
    { time: "13:00", course: "Mobile Learning", room: "Ruang PI-2" }
  ] as ScheduleItem[]
}

// Firebase simulation untuk forum messages
let forumMessages: ForumMessage[] = []
let forumListeners: ((messages: ForumMessage[]) => void)[] = []

const forumSimulation = {
  subscribe: (callback: (messages: ForumMessage[]) => void) => {
    forumListeners.push(callback)
    callback(forumMessages)
    return () => {
      forumListeners = forumListeners.filter(listener => listener !== callback)
    }
  },
  addMessage: (message: ForumMessage) => {
    forumMessages = [...forumMessages, message]
    forumListeners.forEach(listener => listener(forumMessages))
  },
  getNewMessagesCount: () => {
    return forumMessages.filter(msg => msg.isNew).length
  }
}

export default function Dashboard() {
  const [nama] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("namaUser") || "Mahasiswa"
    }
    return "Mahasiswa"
  })
  const [currentTime, setCurrentTime] = useState("")
  const [activeHover, setActiveHover] = useState<number | null>(null)
  const [tasks] = useState<Task[]>(MOCK_DATA.tasks)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [newForumMessages, setNewForumMessages] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")

  useEffect(() => {
    // Update waktu real-time
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)

    // Subscribe to forum messages
    const unsubscribe = forumSimulation.subscribe((messages) => {
      const newMsgs = messages.filter(msg => msg.isNew).length
      setNewForumMessages(newMsgs)
    })

    // Simulate receiving new forum messages
    const forumInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newMsg: ForumMessage = {
          id: Date.now(),
          user: "Teman Kelas",
          message: "Ada yang bisa bantu tugas ini?",
          timestamp: new Date(),
          isNew: true
        }
        forumSimulation.addMessage(newMsg)
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearInterval(forumInterval)
      unsubscribe()
    }
  }, [])

  const showCustomFeedback = (message: string) => {
    setFeedbackMessage(message)
    setShowFeedback(true)
    setTimeout(() => {
      setShowFeedback(false)
    }, 3000)
  }

  const markForumAsRead = () => {
    forumMessages = forumMessages.map(msg => ({ ...msg, isNew: false }))
    setNewForumMessages(0)
    showCustomFeedback("Pesan forum ditandai sudah dibaca")
  }

  const stats = [
    { 
      label: "Total Mata Kuliah", 
      value: "12", 
      icon: BookOpen, 
      change: "+2",
      onClick: () => showCustomFeedback("Membuka daftar mata kuliah")
    },
    { 
      label: "Tugas Mendatang", 
      value: tasks.length.toString(), 
      icon: Target, 
      change: `${tasks.filter(t => t.due.includes('jam') || t.due.includes('Besok')).length} urgent`,
      onClick: () => setActiveHover(0)
    },
    { 
      label: "Kehadiran", 
      value: "94%", 
      icon: TrendingUp, 
      change: "+2%",
      onClick: () => showCustomFeedback("Melihat detail kehadiran")
    },
    { 
      label: "Diskusi Aktif", 
      value: newForumMessages.toString(), 
      icon: MessageCircle, 
      change: "Baru",
      onClick: () => window.location.href = '/forum'
    },
  ]

  const quickActions = [
    { 
      label: "Forum Baru", 
      icon: MessageCircle, 
      count: newForumMessages, 
      color: "from-purple-500 to-pink-500",
      onClick: markForumAsRead
    },
  ]

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    showCustomFeedback(`Mode ${!darkMode ? 'Gelap' : 'Terang'} diaktifkan`)
  }

  const handleLogout = () => {
    showCustomFeedback("Sampai jumpa! Keluar dari sistem...")
    setTimeout(() => {
      localStorage.removeItem("namaUser")
      window.location.href = "/"
    }, 1500)
  }

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50'
    } text-white relative overflow-hidden`}>
      
      {/* Custom Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <motion.div
              className={`${
                darkMode ? 'bg-slate-800/95' : 'bg-white/95'
              } rounded-2xl p-8 max-w-sm mx-4 border ${
                darkMode ? 'border-purple-500/50' : 'border-purple-300'
              } shadow-2xl backdrop-blur-sm`}
            >
              <div className="text-center">
                <Sparkles className={`w-12 h-12 mx-auto mb-4 ${
                  darkMode ? 'text-cyan-400' : 'text-cyan-600'
                }`} />
                <h3 className={`text-lg font-bold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Notifikasi
                </h3>
                <p className={`${
                  darkMode ? 'text-purple-200' : 'text-purple-700'
                }`}>
                  {feedbackMessage}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pb-20">
        {/* Header - Responsif */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-7xl mx-auto pt-6 lg:pt-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6 mb-6 lg:mb-8">
            {/* Title Section */}
            <div className="text-center lg:text-left order-1 lg:order-1">
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 mb-3 lg:mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <GraduationCap className={`${darkMode ? 'text-cyan-400' : 'text-cyan-600'} w-9 h-9 lg:w-11 lg:h-11`} />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className={`absolute -inset-2 lg:-inset-3 border-2 ${
                      darkMode ? 'border-cyan-400/30' : 'border-cyan-600/30'
                    } rounded-full`}
                  />
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r ${
                    darkMode 
                      ? 'from-purple-400 via-pink-400 to-cyan-400' 
                      : 'from-purple-600 via-pink-600 to-cyan-600'
                  } bg-clip-text text-transparent leading-tight`}>
                    Selamat Datang, {nama}! 👋
                  </h1>
                  <p className={`mt-1 lg:mt-2 text-sm lg:text-base ${
                    darkMode ? 'text-purple-300/80' : 'text-purple-600/80'
                  }`}>
                    Portal Kelas <b className={darkMode ? 'text-cyan-300' : 'text-cyan-600'}>PI23A</b> – Pendidikan Informatika FKIP 2023
                  </p>
                </div>
              </motion.div>
              
              {/* Time & Date */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 lg:gap-4 text-xs lg:text-sm ${
                  darkMode ? 'text-purple-300/70' : 'text-purple-600/70'
                }`}
              >
                <div className={`flex items-center gap-2 ${
                  darkMode ? 'bg-white/5' : 'bg-black/5'
                } px-3 py-1 rounded-full`}>
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>{currentTime}</span>
                </div>
                <div className={`flex items-center gap-2 ${
                  darkMode ? 'bg-white/5' : 'bg-black/5'
                } px-3 py-1 rounded-full`}>
                  <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span>{new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </motion.div>
            </div>

            {/* Quick Stats - Responsif */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center lg:justify-end order-2 lg:order-2 w-full lg:w-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex gap-2 lg:gap-3">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className={`bg-gradient-to-br ${action.color} rounded-xl lg:rounded-2xl p-3 lg:p-4 text-center min-w-[80px] lg:min-w-[100px] backdrop-blur-md border border-white/10 cursor-pointer shadow-lg`}
                  >
                    <action.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white mx-auto mb-1 lg:mb-2" />
                    <div className="text-lg lg:text-2xl font-bold text-white">{action.count}</div>
                    <div className="text-xs text-white/80 leading-tight">{action.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Overview - Responsif */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-7xl mx-auto mb-8 lg:mb-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={stat.onClick}
                  className={`${
                    darkMode ? 'bg-white/5' : 'bg-black/5'
                  } backdrop-blur-md rounded-xl lg:rounded-2xl p-4 lg:p-6 border ${
                    darkMode ? 'border-white/10 hover:border-white/20' : 'border-black/10 hover:border-black/20'
                  } transition-all duration-300 cursor-pointer text-left`}
                >
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <IconComponent className={`w-6 h-6 lg:w-8 lg:h-8 ${
                      darkMode ? 'text-cyan-400' : 'text-cyan-600'
                    }`} />
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                  <div className={`text-xl lg:text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-black'
                  } mb-1`}>{stat.value}</div>
                  <div className={`text-xs lg:text-sm ${
                    darkMode ? 'text-purple-300/70' : 'text-purple-600/70'
                  } leading-tight`}>{stat.label}</div>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        {/* Today's Schedule - Responsif */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="max-w-7xl mx-auto mb-6 lg:mb-8"
        >
          <div className={`${
            darkMode ? 'bg-white/5' : 'bg-black/5'
          } backdrop-blur-md rounded-xl lg:rounded-2xl p-4 lg:p-6 border ${
            darkMode ? 'border-white/10' : 'border-black/10'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 lg:mb-4 gap-2">
              <h3 className={`text-lg lg:text-xl font-bold ${
                darkMode ? 'text-white' : 'text-black'
              }`}>Jadwal Hari Ini</h3>
              <span className={`text-sm ${
                darkMode ? 'text-purple-300' : 'text-purple-600'
              }`}>{new Date().toLocaleDateString('id-ID', { weekday: 'long' })}</span>
            </div>
            <div className="space-y-2 lg:space-y-3">
              {MOCK_DATA.schedule.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-white/5' : 'bg-black/5'
                  } gap-2`}
                >
                  <div className="flex-1">
                    <div className={`font-semibold text-sm lg:text-base ${
                      darkMode ? 'text-white' : 'text-black'
                    }`}>{item.course}</div>
                    <div className={`text-xs lg:text-sm ${
                      darkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}>{item.room}</div>
                  </div>
                  <div className={`text-sm font-mono ${
                    darkMode ? 'text-cyan-400' : 'text-cyan-600'
                  }`}>{item.time}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Main Navigation Grid - Responsif */}
        <section className="max-w-7xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            <DashboardCard
              href="/jadwal"
              title="Jadwal Kuliah"
              icon={<Calendar className="w-6 h-6 lg:w-8 lg:h-8" />}
              desc="Lihat jadwal perkuliahan mingguan"
              gradient="from-blue-500 to-cyan-600"
              index={0}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Kalender Interaktif", "Pengingat Otomatis", "Export Schedule"]}
              darkMode={darkMode}
            />
            <DashboardCard
              href="/forum"
              title="Forum Diskusi"
              icon={<MessageCircle className="w-6 h-6 lg:w-8 lg:h-8" />}
              desc="Berbincang dan berdiskusi bersama teman"
              gradient="from-purple-500 to-pink-600"
              index={1}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Diskusi Real-time", "Share File", "Thread Terorganisir"]}
              darkMode={darkMode}
            />
            <DashboardCard
              href="/struktur"
              title="Struktur Kelas"
              icon={<Users className="w-6 h-6 lg:w-8 lg:h-8" />}
              desc="Lihat struktur organisasi kelas"
              gradient="from-indigo-500 to-purple-600"
              index={2}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Organigram Interaktif", "Kontak Dosen", "Team Roles"]}
              darkMode={darkMode}
            />
            <DashboardCard
              href="/profil"
              title="Profil Anggota"
              icon={<User className="w-6 h-6 lg:w-8 lg:h-8" />}
              desc="Kenali teman sekelas dan lihat biodata"
              gradient="from-pink-500 to-rose-600"
              index={3}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Profil 3D", "Social Links", "Skills & Hobbies"]}
              darkMode={darkMode}
            />
            <DashboardCard
              href="/album"
              title="Album Foto"
              icon={<Image className="w-6 h-6 lg:w-8 lg:h-8" />}
              desc="Koleksi foto kegiatan kelas"
              gradient="from-violet-500 to-blue-600"
              index={4}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Gallery Modern", "Photo Tags", "Memory Timeline"]}
              darkMode={darkMode}
            />
            <DashboardCard
              href="/pengumuman"
              title="Pengumuman"
              icon={<Bell className="w-6 h-6 lg:w-8 lg:h-8" />}
              desc="Informasi terbaru dan pemberitahuan"
              gradient="from-amber-500 to-orange-600"
              index={5}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
              features={["Notifikasi Push", "Arsip Lengkap", "Priority System"]}
              darkMode={darkMode}
            />
          </motion.div>
        </section>

        {/* Bottom Actions - Responsif */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="max-w-7xl mx-auto mt-8 lg:mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="group flex items-center gap-2 lg:gap-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl transition-all duration-300 text-purple-200 hover:text-red-300 backdrop-blur-md text-sm lg:text-base"
          >
            <LogOut className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-180 transition-transform" />
            <span className="font-semibold">Keluar Kelas</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(true)}
            className="group flex items-center gap-2 lg:gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-4 lg:px-6 py-2 lg:py-3 rounded-xl lg:rounded-2xl transition-all duration-300 text-purple-200 hover:text-white backdrop-blur-md text-sm lg:text-base"
          >
            <Settings className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-90 transition-transform" />
            <span className="font-semibold">Pengaturan</span>
          </motion.button>
        </motion.div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className={`${
                  darkMode ? 'bg-slate-800' : 'bg-white'
                } rounded-2xl p-6 w-96 max-w-[90vw] border ${
                  darkMode ? 'border-white/10' : 'border-black/10'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-black'
                  }`}>Pengaturan</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`p-2 rounded-full ${
                      darkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                    }`}
                  >
                    <X size={20} className={darkMode ? 'text-white' : 'text-black'} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={darkMode ? 'text-white' : 'text-black'}>Mode Gelap</span>
                    <button
                      onClick={toggleDarkMode}
                      className={`w-12 h-6 rounded-full transition-all ${
                        darkMode ? 'bg-cyan-500' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        animate={{ x: darkMode ? 24 : 0 }}
                        className="w-6 h-6 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    darkMode ? 'bg-white/5' : 'bg-black/5'
                  }`}>
                    <div className={`text-sm ${
                      darkMode ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      <strong>Fitur Aktif:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• Real-time clock</li>
                        <li>• Forum notifications</li>
                        <li>• Today&apos;s schedule</li>
                        <li>• Dark/Light mode</li>
                        <li>• Interactive stats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer - Responsif */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="max-w-7xl mx-auto mt-8 lg:mt-16 text-center"
        >
          <div className={`${
            darkMode ? 'bg-white/5' : 'bg-black/5'
          } backdrop-blur-md rounded-xl lg:rounded-2xl p-4 lg:p-6 border ${
            darkMode ? 'border-white/10' : 'border-black/10'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-2 lg:mb-3">
              <Sparkles className={`w-4 h-4 lg:w-5 lg:h-5 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`} />
              <span className={`text-xs lg:text-sm ${
                darkMode ? 'text-purple-300/70' : 'text-purple-600/70'
              }`}>Sistem Terkini - Semua Fitur Aktif</span>
              <Sparkles className={`w-4 h-4 lg:w-5 lg:h-5 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`} />
            </div>
            <p className={`text-xs lg:text-sm ${
              darkMode ? 'text-purple-300/60' : 'text-purple-600/60'
            }`}>
              Dashboard Kelas PI23A • Pendidikan Informatika FKIP 2023 • 
              <span className={`ml-1 ${
                darkMode ? 'text-cyan-400' : 'text-cyan-600'
              }`}>v2.0 Connected</span>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

// Enhanced Dashboard Card Component - Responsif
function DashboardCard({
  href,
  title,
  icon,
  desc,
  gradient,
  index,
  activeHover,
  setActiveHover,
  features = [],
  darkMode
}: {
  href: string
  title: string
  icon: React.ReactNode
  desc: string
  gradient: string
  index: number
  activeHover: number | null
  setActiveHover: (index: number | null) => void
  features?: string[]
  darkMode: boolean
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      whileHover={{ 
        scale: 1.03, 
        y: -4,
        transition: { type: "spring", stiffness: 300 }
      }}
      onHoverStart={() => setActiveHover(index)}
      onHoverEnd={() => setActiveHover(null)}
      className="relative group cursor-pointer"
    >
      {/* Animated Border Glow */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-2xl lg:rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
      
      {/* Main Card */}
      <div className={`relative ${
        darkMode ? 'bg-slate-900/80' : 'bg-white/80'
      } backdrop-blur-xl rounded-xl lg:rounded-2xl p-4 lg:p-6 border ${
        darkMode ? 'border-white/10 group-hover:border-white/20' : 'border-black/10 group-hover:border-black/20'
      } transition-all duration-300 h-full`}>
        <Link href={href}>
          <div className="flex flex-col h-full">
            {/* Icon Section */}
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
              >
                {icon}
              </motion.div>
              
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: activeHover === index ? 1 : 0 }}
                className={`${
                  darkMode ? 'bg-white/10' : 'bg-black/10'
                } rounded-full px-2 py-1 text-xs ${
                  darkMode ? 'text-purple-300' : 'text-purple-600'
                } border ${
                  darkMode ? 'border-white/10' : 'border-black/10'
                }`}
              >
                <Zap className="w-3 h-3 inline mr-1" />
                Cepat
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className={`text-base lg:text-xl font-bold ${
                darkMode ? 'text-white' : 'text-black'
              } mb-1 lg:mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all leading-tight`}>
                {title}
              </h3>
              <p className={`text-xs lg:text-sm ${
                darkMode ? 'text-purple-300/80' : 'text-purple-600/80'
              } mb-3 lg:mb-4 leading-relaxed`}>
                {desc}
              </p>

              {/* Features List */}
              <AnimatePresence>
                {activeHover === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 lg:space-y-2"
                  >
                    {features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-2 text-xs ${
                          darkMode ? 'text-purple-400' : 'text-purple-500'
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                        {feature}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Arrow */}
            <div className={`flex items-center justify-between mt-3 lg:mt-4 pt-3 lg:pt-4 border-t ${
              darkMode ? 'border-white/10 group-hover:border-white/20' : 'border-black/10 group-hover:border-black/20'
            } transition-colors`}>
              <span className={`text-xs ${
                darkMode ? 'text-purple-400/60 group-hover:text-purple-300' : 'text-purple-500/60 group-hover:text-purple-600'
              } transition-colors`}>
                Akses sekarang
              </span>
              <motion.div
                animate={{ x: activeHover === index ? 3 : 0 }}
                className={darkMode ? 'text-purple-400 group-hover:text-cyan-400' : 'text-purple-500 group-hover:text-cyan-500'}
              >
                →
              </motion.div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}