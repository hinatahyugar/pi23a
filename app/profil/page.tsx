"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, User, Mail, Instagram, Github, Heart, Sparkles, Crown, Zap, Star } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import Image from "next/image"

interface Anggota {
  nama: string
  nim: string
  role: string
  hobi: string
  foto: string
  quote?: string
  socials?: {
    instagram?: string
    github?: string
    email?: string
  }
}

interface Particle {
  id: number
  x: number
  y: number
}

export default function ProfilPage() {
  const [flipped, setFlipped] = useState<number | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isClient, setIsClient] = useState(false)

  // Initialize particles hanya di client side
  useEffect(() => {
    if (!isClient) setIsClient(true);
    
    const handleResize = () => {
      const initialParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }));
      setParticles(initialParticles);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isClient]);

  const anggota: Anggota[] = [
    {
      nama: "Rey Langko",
      nim: "2301001",
      role: "Ketua Kelas",
      hobi: "Ngoding & Nonton Anime",
      foto: "/assets/gg.jpg",
      quote: "Code today, slay tomorrow 💻",
      socials: {
        instagram: "@reylangko",
        github: "reylangko",
        email: "rey@pi23a.ac.id"
      }
    },
    {
      nama: "Alya Nuraeni",
      nim: "2301002",
      role: "Wakil Ketua",
      hobi: "Desain UI/UX",
      foto: "https://i.pinimg.com/564x/3d/2f/13/3d2f13c568bc14c7cfb32b02b1cc79cc.jpg",
      quote: "Design with purpose, create with passion 🎨",
      socials: {
        instagram: "@alya.nuraeni",
        github: "alyanuraeni",
        email: "alya@pi23a.ac.id"
      }
    },
    {
      nama: "Naila Pratiwi",
      nim: "2301003",
      role: "Sekretaris",
      hobi: "Menulis & Membaca",
      foto: "https://i.pinimg.com/564x/89/10/ed/8910edfa9e7c232b902b51d95da3d36d.jpg",
      quote: "Words have power, use them wisely 📚",
      socials: {
        instagram: "@nailapratiwi",
        github: "nailapratiwi",
        email: "naila@pi23a.ac.id"
      }
    },
    {
      nama: "Farel Pradana",
      nim: "2301004",
      role: "Bendahara",
      hobi: "Fotografi & Traveling",
      foto: "https://i.pinimg.com/564x/f4/50/03/f450034c5839de9a9869d4e01ef7f46e.jpg",
      quote: "Capture moments, create memories 📸",
      socials: {
        instagram: "@farelpradana",
        github: "farelpradana",
        email: "farel@pi23a.ac.id"
      }
    },
  ]

  const getRoleIcon = (role: string) => {
    switch(role) {
      case "Ketua Kelas": return Crown
      case "Wakil Ketua": return Zap
      case "Sekretaris": return Star
      case "Bendahara": return Sparkles
      default: return User
    }
  }

  const getRoleColor = (role: string) => {
    switch(role) {
      case "Ketua Kelas": return "from-purple-500 to-pink-500"
      case "Wakil Ketua": return "from-orange-500 to-red-500"
      case "Sekretaris": return "from-blue-500 to-cyan-500"
      case "Bendahara": return "from-green-500 to-emerald-500"
      default: return "from-gray-500 to-slate-500"
    }
  }

  // Component untuk particle yang aman
  const FloatingParticle = ({ particle }: { particle: Particle }) => (
    <motion.div
      className="absolute w-2 h-2 bg-cyan-400/30 rounded-full"
      initial={{
        x: particle.x,
        y: particle.y,
        opacity: 0.3
      }}
      animate={{
        y: [particle.y, particle.y - 30, particle.y],
        opacity: [0.3, 1, 0.3],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-56 h-56 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating Particles */}
        {isClient && particles.map((particle) => (
          <FloatingParticle key={particle.id} particle={particle} />
        ))}
      </div>

      <div className="relative z-10 px-4 sm:px-6 pt-6 pb-20">
        {/* Header */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-8">
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center justify-center lg:justify-start gap-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="relative">
                  <User className="text-cyan-400" size={24} />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-3 border-2 border-cyan-400/30 rounded-full"
                  />
                </div>
                <span>Profil Anggota <span className="text-cyan-200">PI23A</span></span>
              </motion.h1>
              <motion.p 
                className="text-lg text-purple-300/80 mt-3 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Kenali lebih dekat teman-teman satu perjuangan di kelas kita ✨
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

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-7xl mx-auto mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Anggota", value: anggota.length, icon: User },
              { label: "Pengurus Aktif", value: 4, icon: Crown },
              { label: "Tahun Ajaran", value: "2024", icon: Star },
              { label: "Kelas", value: "PI23A", icon: Heart },
            ].map((stat, i) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center"
                >
                  <IconComponent className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-purple-300/70">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Grid Profil */}
        <section className="max-w-7xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {anggota.map((mhs, i) => {
              const RoleIcon = getRoleIcon(mhs.role)
              const roleColor = getRoleColor(mhs.role)
              
              return (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  whileHover={{ y: -8 }}
                  className="relative group cursor-pointer"
                  onClick={() => setFlipped(flipped === i ? null : i)}
                >
                  {/* Hover Effect Glow */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${roleColor} rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-300`} />
                  
                  {/* Main Card */}
                  <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-all duration-300 h-full">
                    
                    {/* Front Side */}
                    <AnimatePresence mode="wait">
                      {flipped !== i && (
                        <motion.div
                          initial={{ opacity: 1, rotateY: 0 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: -90 }}
                          transition={{ duration: 0.6 }}
                          className="h-full flex flex-col"
                        >
                          {/* Photo Section */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={mhs.foto}
                              alt={mhs.nama}
                              fill
                              className="object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                            
                            {/* Role Badge */}
                            <div className={`absolute top-4 right-4 bg-gradient-to-r ${roleColor} rounded-full px-3 py-1 text-xs font-semibold text-white flex items-center gap-1 shadow-lg`}>
                              <RoleIcon size={12} />
                              {mhs.role}
                            </div>
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 flex items-center justify-center">
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                whileHover={{ scale: 1, opacity: 1 }}
                                className="bg-white/20 backdrop-blur-md rounded-full p-3 text-white"
                              >
                                <Sparkles size={20} />
                              </motion.div>
                            </div>
                          </div>

                          {/* Info Section */}
                          <div className="p-6 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all">
                              {mhs.nama}
                            </h3>
                            <p className="text-purple-300 text-sm mb-3">NIM: {mhs.nim}</p>
                            <p className="text-sm text-purple-200/80 italic line-clamp-2">
                              &quot;{mhs.quote}&quot;
                            </p>
                            
                            {/* Hobi Tags */}
                            <div className="mt-4 flex flex-wrap gap-1">
                              {mhs.hobi.split('&').map((hobi, idx) => (
                                <span
                                  key={idx}
                                  className="bg-white/10 text-purple-200 text-xs px-2 py-1 rounded-full border border-white/10"
                                >
                                  {hobi.trim()}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Flip Hint */}
                          <div className="px-6 pb-4">
                            <div className="text-xs text-purple-400/60 text-center group-hover:text-purple-300 transition-colors">
                              Klik untuk lihat detail →
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Back Side */}
                    <AnimatePresence>
                      {flipped === i && (
                        <motion.div
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: -90 }}
                          transition={{ duration: 0.6 }}
                          className={`absolute inset-0 bg-gradient-to-br ${roleColor} p-6 rounded-2xl text-white backdrop-blur-md`}
                        >
                          <div className="h-full flex flex-col justify-between">
                            {/* Header */}
                            <div>
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-xl">{mhs.nama}</h3>
                                <motion.div
                                  whileHover={{ scale: 1.2, rotate: 180 }}
                                  transition={{ type: "spring" }}
                                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setFlipped(null)
                                  }}
                                >
                                  <ArrowLeft size={16} />
                                </motion.div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="bg-white/10 rounded-lg p-3">
                                  <p className="text-sm font-semibold">NIM</p>
                                  <p className="text-white/90">{mhs.nim}</p>
                                </div>
                                
                                <div className="bg-white/10 rounded-lg p-3">
                                  <p className="text-sm font-semibold">Jabatan</p>
                                  <p className="text-white/90 flex items-center gap-2">
                                    <RoleIcon size={14} />
                                    {mhs.role}
                                  </p>
                                </div>
                                
                                <div className="bg-white/10 rounded-lg p-3">
                                  <p className="text-sm font-semibold">Hobi</p>
                                  <p className="text-white/90">{mhs.hobi}</p>
                                </div>
                              </div>
                            </div>

                            {/* Social Links */}
                            {mhs.socials && (
                              <div className="mt-6">
                                <p className="text-sm font-semibold mb-3">Connect with {mhs.nama.split(' ')[0]}</p>
                                <div className="flex justify-center gap-4">
                                  {mhs.socials.instagram && (
                                    <motion.a
                                      whileHover={{ scale: 1.2, y: -2 }}
                                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                      href={`https://instagram.com/${mhs.socials.instagram.replace('@', '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Instagram size={18} />
                                    </motion.a>
                                  )}
                                  {mhs.socials.github && (
                                    <motion.a
                                      whileHover={{ scale: 1.2, y: -2 }}
                                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                      href={`https://github.com/${mhs.socials.github}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Github size={18} />
                                    </motion.a>
                                  )}
                                  {mhs.socials.email && (
                                    <motion.a
                                      whileHover={{ scale: 1.2, y: -2 }}
                                      className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                                      href={`mailto:${mhs.socials.email}`}
                                    >
                                      <Mail size={18} />
                                    </motion.a>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Quote */}
                            <div className="mt-4 text-center">
                              <p className="text-sm italic text-white/80">&quot;{mhs.quote}&quot;</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </section>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="max-w-2xl mx-auto mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
            <Sparkles className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Temukan Potensi Setiap Anggota</h3>
            <p className="text-purple-300/80 mb-4">
              Setiap individu di kelas PI23A memiliki keunikan dan bakat yang luar biasa
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Kenali Lebih Dekat
            </motion.button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}