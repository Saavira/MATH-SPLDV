"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Play,
  Copy,
  CheckCircle,
  Clock,
  BookOpen,
  Settings,
  LogOut,
  RefreshCw,
  UserCheck,
  GamepadIcon,
} from "lucide-react"
import { initializeApp } from "firebase/app"
import { getFirestore, collection, onSnapshot, query, where, updateDoc, doc, getDocs } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBMOGpYzm_krm66Xtkh9CXriP2jJlMVfTs",
  authDomain: "math-education-c09a8.firebaseapp.com",
  projectId: "math-education-c09a8",
  storageBucket: "math-education-c09a8.firebasestorage.app",
  messagingSenderId: "522545520014",
  appId: "1:522545520014:web:a1c8da693e67c6acfb58df",
  measurementId: "G-LSPV4M26WE",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface Student {
  id: string
  name: string
  class: string
  joinedAt: Date
  isReady: boolean
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [teacherData, setTeacherData] = useState<any>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [gameStatus, setGameStatus] = useState<"waiting" | "playing" | "finished">("waiting")
  const [copied, setCopied] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  // Initialize teacher data
  useEffect(() => {
    const data = localStorage.getItem("teacherData")
    if (!data) {
      router.push("/login/teacher")
      return
    }
    setTeacherData(JSON.parse(data))
  }, [])

  // Listen to students joining
  useEffect(() => {
    if (!teacherData?.sessionCode) return

    const q = query(
      collection(db, "students"),
      where("sessionCode", "==", teacherData.sessionCode),
      where("role", "==", "student"),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentList: Student[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        studentList.push({
          id: doc.id,
          name: data.name,
          class: data.class,
          joinedAt: data.joinedAt?.toDate() || new Date(),
          isReady: data.isReady || false,
        })
      })
      setStudents(studentList)
    })

    return () => unsubscribe()
  }, [teacherData?.sessionCode])

  const copySessionCode = async () => {
    if (teacherData?.sessionCode) {
      await navigator.clipboard.writeText(teacherData.sessionCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const startGame = async () => {
    if (students.length === 0) {
      alert("Tidak ada siswa yang bergabung!")
      return
    }

    setIsStarting(true)

    try {
      // Update teacher status to playing
      const teacherQuery = query(
        collection(db, "students"),
        where("sessionCode", "==", teacherData.sessionCode),
        where("role", "==", "teacher"),
      )
      const teacherSnapshot = await getDocs(teacherQuery)

      if (!teacherSnapshot.empty) {
        const teacherDoc = teacherSnapshot.docs[0]
        await updateDoc(doc(db, "students", teacherDoc.id), {
          status: "playing",
        })
      }

      setGameStatus("playing")

      // Redirect to game monitoring (or stay on dashboard)
      // You can create a separate monitoring page if needed
      alert(`Permainan dimulai dengan ${students.length} siswa!`)
    } catch (error) {
      console.error("Error starting game:", error)
      alert("Gagal memulai permainan. Silakan coba lagi.")
    } finally {
      setIsStarting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("teacherData")
    router.push("/")
  }

  if (!teacherData) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Guru</h1>
            <p className="text-gray-600">Kelola sesi pembelajaran SPLDV Math Monopoly</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Session Info */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Informasi Sesi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nama Guru</label>
                  <p className="text-lg font-semibold">{teacherData.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Sekolah</label>
                  <p className="text-gray-800">{teacherData.school}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Mata Pelajaran</label>
                  <p className="text-gray-800">{teacherData.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Kode Sesi</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 px-3 py-2 rounded font-mono text-lg font-bold tracking-wider">
                      {teacherData.sessionCode}
                    </code>
                    <Button onClick={copySessionCode} size="sm" variant="outline" className="h-10 bg-transparent">
                      {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Bagikan kode ini kepada siswa untuk bergabung</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Status Sesi</label>
                  <div className="mt-1">
                    <Badge
                      className={
                        gameStatus === "waiting"
                          ? "bg-yellow-100 text-yellow-800"
                          : gameStatus === "playing"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }
                    >
                      {gameStatus === "waiting" && <Clock className="w-3 h-3 mr-1" />}
                      {gameStatus === "playing" && <Play className="w-3 h-3 mr-1" />}
                      {gameStatus === "waiting"
                        ? "Menunggu Siswa"
                        : gameStatus === "playing"
                          ? "Sedang Bermain"
                          : "Selesai"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GamepadIcon className="w-5 h-5" />
                  Kontrol Permainan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {gameStatus === "waiting" && (
                  <>
                    <Alert>
                      <AlertDescription>
                        Pastikan semua siswa sudah bergabung sebelum memulai permainan.
                      </AlertDescription>
                    </Alert>

                    <Button
                      onClick={startGame}
                      disabled={students.length === 0 || isStarting}
                      className="w-full bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isStarting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Memulai...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Mulai Permainan
                        </>
                      )}
                    </Button>
                  </>
                )}

                {gameStatus === "playing" && (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Play className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-green-700 font-medium">Permainan Sedang Berlangsung</p>
                    <p className="text-sm text-gray-600 mt-1">Siswa sedang bermain SPLDV Math Monopoly</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Students List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Daftar Siswa
                  </div>
                  <Badge variant="secondary">{students.length} siswa</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Belum Ada Siswa</h3>
                    <p className="text-gray-500 mb-4">Bagikan kode sesi kepada siswa untuk bergabung</p>
                    <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                      <p className="text-sm text-blue-700">
                        <strong>Kode Sesi:</strong> {teacherData.sessionCode}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.map((student, index) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{student.name}</h4>
                            <p className="text-sm text-gray-600">Kelas {student.class}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              student.isReady ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {student.isReady ? (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Siap
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Menunggu
                              </>
                            )}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {student.joinedAt.toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Tujuan Pembelajaran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Kompetensi Dasar</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Memahami konsep SPLDV</li>
                      <li>• Menyelesaikan SPLDV dengan metode substitusi</li>
                      <li>• Menyelesaikan SPLDV dengan metode eliminasi</li>
                      <li>• Menerapkan SPLDV dalam masalah kontekstual</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Indikator Pencapaian</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Siswa dapat mengidentifikasi SPLDV</li>
                      <li>• Siswa dapat menyelesaikan soal SPLDV</li>
                      <li>• Siswa dapat menerapkan konsep dalam permainan</li>
                      <li>• Siswa termotivasi belajar matematika</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
