"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Clock, CheckCircle, Gamepad2, BookOpen, Target, Trophy, ArrowLeft, RefreshCw } from "lucide-react"


interface Student {
  id: string
  name: string
  class: string
  isReady: boolean
}

interface Teacher {
  name: string
  school: string
  status: string
}

export default function LobbyPage() {
  const params = useParams()
  const router = useRouter()
  const sessionCode = params.sessionCode as string

  const [currentStudent, setCurrentStudent] = useState<any>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize current student
  useEffect(() => {
    const studentData = localStorage.getItem("studentData")
    if (!studentData) {
      router.push("/login/student")
      return
    }
    setCurrentStudent(JSON.parse(studentData))
  }, [])

  // Poll for lobby updates
  useEffect(() => {
    if (!sessionCode) return

    const fetchLobbyData = async () => {
      try {
        const response = await fetch(`/api/lobby/${sessionCode}`)
        if (!response.ok) {
          console.error("Failed to fetch lobby data")
          return
        }
        const data = await response.json()
        setStudents(data.students || [])
        setTeacher(data.teacher || null)

        if (data.teacher?.status === "started") {
          setGameStarted(true)
          router.push(`/game/${sessionCode}`)
        }
      } catch (error) {
        console.error("Error fetching lobby data:", error)
      }
    }

    const intervalId = setInterval(fetchLobbyData, 3000) // Poll every 3 seconds
    fetchLobbyData() // Initial fetch

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [sessionCode, router])

  const toggleReady = async () => {
    if (!currentStudent) return

    const newReadyState = !isReady
    try {
      const response = await fetch(`/api/lobby/${sessionCode}/ready`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          studentId: currentStudent.id, 
          isReady: newReadyState 
        }),
      });

      if (response.ok) {
        setIsReady(newReadyState);
      } else {
        console.error('Failed to update ready status');
      }
    } catch (error) {
      console.error('Error updating ready status:', error);
    }
  }

  const handleLeave = () => {
    localStorage.removeItem("studentData")
    router.push("/")
  }

  if (!currentStudent) {
    return <div>Loading...</div>
  }

  if (gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Permainan Dimulai!</h2>
            <p className="text-gray-600 mb-4">Anda akan diarahkan ke permainan...</p>
            <div className="flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm text-gray-500">Memuat permainan...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Lobby Permainan</h1>
            <p className="text-gray-600">Sesi: {sessionCode}</p>
          </div>
          <Button
            onClick={handleLeave}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Session Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Informasi Sesi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teacher && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Guru</label>
                      <p className="font-semibold">{teacher.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Sekolah</label>
                      <p className="text-gray-800">{teacher.school}</p>
                    </div>
                  </>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Mata Pelajaran</label>
                  <p className="text-gray-800">Matematika - SPLDV</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Target Kelas</label>
                  <p className="text-gray-800">SMA Kelas 10-11</p>
                </div>
              </CardContent>
            </Card>

            {/* Player Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Status Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nama</label>
                  <p className="font-semibold">{currentStudent.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Kelas</label>
                  <p className="text-gray-800">{currentStudent.class}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status Kesiapan</label>
                  <div className="mt-2">
                    <Button
                      onClick={toggleReady}
                      className={`w-full ${
                        isReady ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"
                      }`}
                    >
                      {isReady ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Siap Bermain
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Belum Siap
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  Aturan Permainan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Permainan monopoli dengan soal SPLDV</li>
                  <li>• Lempar dadu untuk bergerak di papan</li>
                  <li>• Jawab soal untuk mendapat uang</li>
                  <li>• Kotak khusus memberikan bonus/penalty</li>
                  <li>• Pemain pertama mencapai finish menang</li>
                  <li>• Uang habis = tereliminasi</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Players List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Daftar Pemain
                  </div>
                  <Badge variant="secondary">{students.length} pemain</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Menunggu Pemain Lain</h3>
                    <p className="text-gray-500">Anda adalah pemain pertama yang bergabung</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.map((student, index) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          student.name === currentStudent.name
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              student.name === currentStudent.name ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            <span
                              className={`font-semibold ${
                                student.name === currentStudent.name ? "text-blue-600" : "text-gray-600"
                              }`}
                            >
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {student.name}
                              {student.name === currentStudent.name && (
                                <span className="text-blue-600 ml-2">(Anda)</span>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600">Kelas {student.class}</p>
                          </div>
                        </div>

                        <Badge
                          className={student.isReady ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                        >
                          {student.isReady ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Siap
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              Menunggu
                            </>
                          )}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Waiting for Teacher */}
            <Alert className="mt-6">
              <Clock className="w-4 h-4" />
              <AlertDescription>
                Menunggu guru memulai permainan. Pastikan Anda sudah menekan tombol "Siap Bermain" agar guru tahu Anda
                sudah siap.
              </AlertDescription>
            </Alert>

            {/* SPLDV Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Preview Materi SPLDV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Contoh Soal SPLDV:</h4>
                  <div className="text-center mb-3">
                    <p className="font-mono text-lg text-blue-700">2x + 3y = 12</p>
                    <p className="font-mono text-lg text-blue-700">x - y = 1</p>
                  </div>
                  <p className="text-blue-600 text-sm">Tentukan nilai x dan y dari sistem persamaan di atas!</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">Metode Substitusi:</h5>
                    <p className="text-gray-600">Ganti salah satu variabel dengan persamaan lain</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-700 mb-1">Metode Eliminasi:</h5>
                    <p className="text-gray-600">Hilangkan salah satu variabel dengan operasi</p>
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
