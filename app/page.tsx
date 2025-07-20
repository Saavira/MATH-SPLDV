"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  GraduationCap,
  BookOpen,
  Trophy,
  Target,
  Clock,
  Gamepad2,
  ArrowRight,
  Star,
  Calculator,
  Brain,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null)

  const features = [
    {
      icon: Calculator,
      title: "Pembelajaran SPLDV",
      description: "Sistem Persamaan Linear Dua Variabel dengan metode interaktif",
    },
    {
      icon: Gamepad2,
      title: "Game-Based Learning",
      description: "Belajar matematika melalui permainan monopoli yang seru",
    },
    {
      icon: Users,
      title: "Multiplayer",
      description: "Bermain bersama teman sekelas dalam satu sesi",
    },
    {
      icon: Clock,
      title: "Real-time",
      description: "Permainan berlangsung secara real-time dengan timer",
    },
    {
      icon: Trophy,
      title: "Kompetitif",
      description: "Sistem peringkat dan reward untuk motivasi belajar",
    },
    {
      icon: Brain,
      title: "Adaptive Learning",
      description: "Soal yang disesuaikan dengan tingkat pemahaman siswa",
    },
  ]

  const benefits = [
    "Meningkatkan pemahaman konsep SPLDV",
    "Pembelajaran yang menyenangkan dan interaktif",
    "Melatih kemampuan berpikir logis dan sistematis",
    "Mengembangkan keterampilan pemecahan masalah",
    "Meningkatkan motivasi belajar matematika",
    "Pembelajaran kolaboratif dengan teman sekelas",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <Calculator className="w-12 h-12" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-6">SPLDV Math Monopoly</h1>

            <p className="text-xl sm:text-2xl mb-4 text-blue-100">Pembelajaran Sistem Persamaan Linear Dua Variabel</p>

            <p className="text-lg mb-8 text-blue-200 max-w-3xl mx-auto">
              Platform pembelajaran matematika interaktif untuk siswa SMA kelas 10-11 yang menggabungkan konsep
              permainan monopoli dengan materi SPLDV
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Badge className="bg-yellow-500 text-yellow-900 px-4 py-2 text-lg">
                <Star className="w-5 h-5 mr-2" />
                Untuk SMA Kelas 10-11
              </Badge>
              <Badge className="bg-green-500 text-green-900 px-4 py-2 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Game-Based Learning
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Pilih Peran Anda</h2>
          <p className="text-gray-600 text-lg">Masuk sebagai siswa untuk bermain atau guru untuk mengelola sesi</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-400">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl text-blue-700">Siswa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Bergabung dalam permainan SPLDV Math Monopoly dan belajar sambil bermain
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span>Bermain game monopoli matematika</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>Menjawab soal-soal SPLDV</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Trophy className="w-4 h-4 text-blue-500" />
                  <span>Berkompetisi dengan teman sekelas</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Pembelajaran kolaboratif</span>
                </div>
              </div>

              <Link href="/login/student" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Masuk sebagai Siswa
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Teacher Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-400">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-700">Guru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-center mb-6">
                Kelola sesi pembelajaran dan pantau progress siswa dalam permainan
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Target className="w-4 h-4 text-green-500" />
                  <span>Membuat dan mengelola sesi permainan</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-green-500" />
                  <span>Memantau progress pembelajaran</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Trophy className="w-4 h-4 text-green-500" />
                  <span>Melihat hasil dan analisis</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>Dashboard manajemen kelas</span>
                </div>
              </div>

              <Link href="/login/teacher" className="block">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                  <Users className="w-5 h-5 mr-2" />
                  Masuk sebagai Guru
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Fitur Unggulan</h2>
            <p className="text-gray-600 text-lg">Platform pembelajaran yang dirancang khusus untuk materi SPLDV</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Manfaat Pembelajaran</h2>
            <p className="text-purple-100 text-lg">Keunggulan metode game-based learning untuk materi SPLDV</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-900 font-bold text-sm">{index + 1}</span>
                </div>
                <p className="text-white">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About SPLDV Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Tentang SPLDV</h2>
            <p className="text-gray-600 text-lg">Sistem Persamaan Linear Dua Variabel</p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Apa itu SPLDV?</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Sistem Persamaan Linear Dua Variabel (SPLDV) adalah sistem yang terdiri dari dua persamaan linear
                  dengan dua variabel yang saling berkaitan. SPLDV memiliki bentuk umum:
                </p>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <div className="text-center">
                    <p className="text-lg font-mono text-blue-800 mb-2">ax + by = c</p>
                    <p className="text-lg font-mono text-blue-800">dx + ey = f</p>
                  </div>
                  <p className="text-sm text-blue-600 text-center mt-4">
                    dimana a, b, c, d, e, f adalah konstanta dan x, y adalah variabel
                  </p>
                </div>

                <h4 className="text-xl font-semibold text-gray-800 mb-3">Metode Penyelesaian:</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">1. Metode Substitusi</h5>
                    <p className="text-green-700 text-sm">Mengganti salah satu variabel dengan persamaan yang lain</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-800 mb-2">2. Metode Eliminasi</h5>
                    <p className="text-purple-700 text-sm">
                      Menghilangkan salah satu variabel dengan operasi matematika
                    </p>
                  </div>
                </div>

                <h4 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Contoh Soal:</h4>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-3">
                    <strong>Soal:</strong> Tentukan nilai x dan y dari sistem persamaan berikut:
                  </p>
                  <div className="text-center mb-4">
                    <p className="font-mono text-lg">2x + 3y = 12</p>
                    <p className="font-mono text-lg">x - y = 1</p>
                  </div>
                  <p className="text-gray-700">
                    <strong>Jawab:</strong> Dengan metode substitusi atau eliminasi, diperoleh x = 3 dan y = 2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SPLDV Math Monopoly</h3>
              <p className="text-gray-300 mb-4">
                Platform pembelajaran matematika interaktif untuk siswa SMA yang menggabungkan game-based learning
                dengan materi SPLDV.
              </p>
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400">Matematika SMA Kelas 10-11</span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Fitur Utama</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Pembelajaran SPLDV Interaktif</li>
                <li>• Game Monopoli Matematika</li>
                <li>• Multiplayer Real-time</li>
                <li>• Dashboard Guru</li>
                <li>• Analisis Progress Siswa</li>
                <li>• Feedback & Evaluasi</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Tim Pengembang</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Mahasiswa Pendidikan Matematika</li>
                <li>• Dosen Pembimbing</li>
                <li>• Guru Matematika SMA</li>
                <li>• Developer & Designer</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 SPLDV Math Monopoly. Dikembangkan untuk pembelajaran matematika SMA.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
