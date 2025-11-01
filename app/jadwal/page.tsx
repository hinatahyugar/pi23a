"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CalendarDays, Clock, ArrowLeft, MapPin, User, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function JadwalPage() {
  const [currentTime, setCurrentTime] = useState("")
  // Inisialisasi progress values langsung dengan nilai random
  const [progressValues, setProgressValues] = useState<number[]>(() =>
  Array(6).fill(0).map(() => Math.floor(Math.random() * 100))
  );


  // Inisialisasi state dengan nilai default
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const d = new Date()
  const today = hari[d.getDay()]
  
  const [hariIni] = useState(today)
  const [activeDay, setActiveDay] = useState(today)

  useEffect(() => {
    // Real-time clock dengan update progress values
    const updateTimeAndProgress = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }))
      
      // Update progress values secara berkala (setiap 30 detik)
      if (now.getSeconds() % 30 === 0) {
        setProgressValues(prev => 
          prev.map(value => {
            // Random kecil untuk simulasi progress berubah
            const change = Math.floor(Math.random() * 5) - 2 // -2 to +2
            return Math.max(0, Math.min(100, value + change))
          })
        )
      }
    }
    
    updateTimeAndProgress()
    const interval = setInterval(updateTimeAndProgress, 1000)
    return () => clearInterval(interval)
  }, []) // Empty dependency array untuk interval

  const jadwal = [
    {
      hari: "Senin",
      mataKuliah: "Sistem Keamanan Informasi",
      kode: "P786222",
      sks: 3,
      jam: "08.00–10.00 WITA",
      ruang: "Ruang PI-2",
      dosen: "Meilian Ardi Sadiki, M.Pd",
      color: "from-blue-500 to-cyan-500",
      icon: "🔒"
    },
    {
      hari: "Selasa",
      mataKuliah: "Kecerdasan Buatan",
      kode: "P786224",
      sks: 3,
      jam: "08.00–10.00 WITA",
      ruang: "Ruang PI-1",
      dosen: "Meilian Ardi Sadiki, M.Pd",
      color: "from-purple-500 to-pink-500",
      icon: "🤖"
    },
    {
      hari: "Selasa",
      mataKuliah: "Mobile Learning",
      kode: "P786225",
      sks: 3,
      jam: "13.00–15.00 WITA",
      ruang: "Ruang PI-2",
      dosen: "Dianah F. Alilo, S.Kom., M.T",
      color: "from-green-500 to-emerald-500",
      icon: "📱"
    },
    {
      hari: "Rabu",
      mataKuliah: "Pengembangan Media dan Game",
      kode: "P786226",
      sks: 3,
      jam: "13.00–16.00 WITA",
      ruang: "Ruang PI-1",
      dosen: "Ilom Einstein, S.Kom., M.Cs",
      color: "from-orange-500 to-red-500",
      icon: "🎮"
    },
    {
      hari: "Kamis",
      mataKuliah: "Pengembangan Bahan Ajar",
      kode: "P786301",
      sks: 2,
      jam: "13.00–15.00 WITA",
      ruang: "Lab. Kom",
      dosen: "Dr. Maria M. Sogen, S.Kom., M.Pd",
      color: "from-indigo-500 to-purple-500",
      icon: "📚"
    },
    {
      hari: "Jumat",
      mataKuliah: "Pemrograman Web",
      kode: "P786222",
      sks: 3,
      jam: "07.00–Selesai",
      ruang: "Ruang PI-3",
      dosen: "Meilian Budi Basronama, S.Kom., M.Kom",
      color: "from-yellow-500 to-amber-500",
      icon: "💻"
    },
  ]

  const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
  const filteredJadwal = activeDay ? jadwal.filter(item => item.hari === activeDay) : jadwal

  const stats = [
    { label: "Total Mata Kuliah", value: "6", icon: BookOpen },
    { label: "SKS Semester", value: "17", icon: Clock },
    { label: "Hari Aktif", value: "5", icon: CalendarDays },
    { label: "Dosen", value: "5", icon: User },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-7xl mx-auto pt-8"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
            <div className="text-center lg:text-left">
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-4 mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <CalendarDays className="text-cyan-400 w-10 h-10 lg:w-12 lg:h-12" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-3 border-2 border-cyan-400/30 rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Jadwal Kuliah
                  </h1>
                  <p className="text-lg text-purple-300/80 mt-2">
                    Rencana pembelajaran semester <span className="text-cyan-300">PI23A</span>
                  </p>
                </div>
              </motion.div>
              
              {/* Time & Quick Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-purple-300/70"
              >
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{currentTime}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                  <CalendarDays className="w-4 h-4" />
                  <span>Hari ini: <strong className="text-cyan-300">{hariIni}</strong></span>
                </div>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/kelas"
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-3 rounded-2xl transition-all duration-300 text-purple-200 hover:text-white backdrop-blur-md shadow-lg hover:shadow-purple-500/20"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Kembali</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-white/10 hover:border-white/20 transition-all duration-300 text-center"
                >
                  <IconComponent className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-purple-300/70">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Day Filter */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-7xl mx-auto mb-8"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Filter Berdasarkan Hari
            </h3>
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveDay("")}
                className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeDay === "" 
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg" 
                    : "bg-white/5 text-purple-300 hover:bg-white/10"
                }`}
              >
                Semua Hari
              </motion.button>
              {days.map((day) => (
                <motion.button
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeDay === day 
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                      : "bg-white/5 text-purple-300 hover:bg-white/10"
                  } ${day === hariIni ? "ring-2 ring-cyan-400" : ""}`}
                >
                  {day} {day === hariIni && "✨"}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Jadwal List */}
        <section className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredJadwal.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -5,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className={`relative group cursor-pointer ${
                    item.hari === hariIni ? "ring-2 ring-cyan-400 shadow-xl" : ""
                  }`}
                >
                  {/* Gradient Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg text-white text-lg`}
                        >
                          {item.icon}
                        </motion.div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{item.hari}</h2>
                          <div className="flex items-center gap-2 text-sm text-purple-300">
                            <Clock className="w-4 h-4" />
                            {item.jam}
                          </div>
                        </div>
                      </div>
                      
                      {/* Today Badge */}
                      {item.hari === hariIni && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full border border-cyan-400/30"
                        >
                          Hari Ini
                        </motion.div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1 leading-tight">
                          {item.mataKuliah}
                        </h3>
                        <p className="text-sm text-purple-300">
                          {item.kode} • {item.sks} SKS
                        </p>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-purple-300">
                          <MapPin className="w-4 h-4" />
                          <span>{item.ruang}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-purple-300">
                          <User className="w-4 h-4" />
                          <span className="italic">{item.dosen}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-purple-400 mb-1">
                        <span>Progress Kelas</span>
                        <span>{progressValues[i] || 0}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressValues[i] || 0}%` }}
                          transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                          className={`h-2 rounded-full bg-gradient-to-r ${item.color}`}
                        />
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredJadwal.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <CalendarDays className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Tidak ada jadwal</h3>
                <p className="text-purple-300">
                  Tidak ada jadwal kuliah untuk hari {activeDay}
                </p>
              </div>
            </motion.div>
          )}
        </section>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="max-w-7xl mx-auto mt-12 text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="text-sm text-purple-300/70">Semester Aktif 2023/2024</span>
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-sm text-purple-300/60">
              Program Studi Pendidikan Informatika • FKIP Universitas Nusa Cendana •
              <span className="text-cyan-400 ml-1">Kelas PI23A</span>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  )
}