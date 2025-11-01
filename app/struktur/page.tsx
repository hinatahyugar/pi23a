"use client"

import { motion } from "framer-motion"
import { Users, ArrowLeft, Crown, Star, Zap, Sparkles } from "lucide-react"
import Link from "next/link"

export default function StrukturPage() {
  const struktur = [
    {
      jabatan: "Ketua Kelas",
      nama: "Rey Langko",
      warna: "from-purple-500 via-pink-500 to-indigo-500",
      icon: Crown,
      level: "leader"
    },
    {
      jabatan: "Wakil Ketua",
      nama: "Alya Nuraeni",
      warna: "from-pink-500 via-purple-500 to-rose-500",
      icon: Zap,
      level: "vice"
    },
    {
      jabatan: "Sekretaris",
      nama: "Naila Pratiwi",
      warna: "from-indigo-400 via-blue-500 to-cyan-400",
      icon: Star,
      level: "secretary"
    },
    {
      jabatan: "Bendahara",
      nama: "Farel Pradana",
      warna: "from-emerald-400 via-teal-500 to-green-400",
      icon: Sparkles,
      level: "treasurer"
    },
  ]

  const anggota = [
    "Andi Saputra", "Bella Oktavia", "Citra Ramadhani", "Deni Maulana",
    "Eka Wijaya", "Fina Nurul", "Gilang Ramadhan", "Hana Putri",
    "Indra Kusuma", "Jihan Arum", "Kevin Pratama", "Luna Maya",
    "Mario Wijaya", "Nadia Putri", "Oscar Renaldo"
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-6 pt-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center lg:justify-start gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <Users className="text-cyan-400" size={40} />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-2 border-2 border-cyan-400/30 rounded-full"
                  ></motion.div>
                </div>
                Struktur Kelas PI23A
              </motion.h1>
              <motion.p 
                className="text-lg text-purple-300/80 mt-2 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Tim pengurus dan anggota kelas yang solid dan berdedikasi
              </motion.p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/kelas"
                className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-3 rounded-2xl transition-all duration-300 text-purple-200 hover:text-white backdrop-blur-md shadow-lg hover:shadow-purple-500/20"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Kembali</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Bagan Pengurus */}
        <section className="max-w-6xl mx-auto mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Tim Pengurus Kelas
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {struktur.map((orang, i) => {
              const IconComponent = orang.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  className={`relative group cursor-pointer`}
                >
                  {/* Gradient Border */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${orang.warna} rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-300`}></div>
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${orang.warna} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="text-white" size={28} />
                    </motion.div>

                    {/* Name */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
                      {orang.nama}
                    </h3>

                    {/* Position */}
                    <p className="text-sm text-purple-300/80 font-medium italic">
                      {orang.jabatan}
                    </p>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Garis pemisah animasi */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="max-w-4xl mx-auto my-16 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        />

        {/* Anggota Kelas */}
        <section className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Anggota Kelas
            </h2>
            <p className="text-purple-300/70 mt-2">
              {anggota.length} anggota aktif
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4"
          >
            {anggota.map((nama, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{
                  scale: 1.08,
                  y: -4,
                  rotate: -2, // PERBAIKAN: Hanya 1 nilai rotate, bukan array
                  transition: { type: "spring", stiffness: 400 }
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative cursor-pointer"
              >
                {/* Hover Effect Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                
                {/* Main Card */}
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10">
                  <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-sm font-medium text-purple-200 group-hover:text-white transition-colors">
                    {nama}
                  </p>
                  
                  {/* Animated Border on Hover */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-border opacity-0 group-hover:opacity-100 transition-opacity -z-10">
                    <div className="rounded-xl bg-slate-900 absolute inset-0.5"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="max-w-4xl mx-auto mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Anggota", value: anggota.length + struktur.length },
              { label: "Pengurus Inti", value: struktur.length },
              { label: "Anggota Aktif", value: anggota.length },
              { label: "Kelas", value: "PI23A" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10"
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-purple-300/70 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  )
}