"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, Target, ArrowLeft, RefreshCw, Gamepad2 } from "lucide-react"

// NEW: Updated data structures to match the API response
interface Player {
  id: number
  name: string
}

interface Session {
  id: number
  code: string
  teacherName: string
  school: string
  subject: string
  status: string
}

interface CurrentPlayerInfo {
  id: number
  name: string
  sessionCode: string
}

export default function LobbyPage() {
  const params = useParams()
  const router = useRouter()
  const sessionCode = params.sessionCode as string

  // NEW: State variables aligned with the new data structures
  const [currentPlayer, setCurrentPlayer] = useState<CurrentPlayerInfo | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [session, setSession] = useState<Session | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize current player from localStorage
  useEffect(() => {
    const playerData = localStorage.getItem("playerSession")
    if (!playerData) {
      router.push("/login/student")
      return
    }
    try {
      const parsedData = JSON.parse(playerData)
      // Ensure the stored data is for the correct session
      if (parsedData.sessionCode !== sessionCode) {
        setError("Sesi tidak valid. Silakan join kembali.")
        localStorage.removeItem("playerSession")
        router.push(`/login/student?sessionCode=${sessionCode}`)
        return
      }
      setCurrentPlayer(parsedData)
    } catch (e) {
      console.error("Failed to parse player data from localStorage", e)
      router.push("/login/student")
    }
  }, [router, sessionCode])

  // Poll for lobby updates
  useEffect(() => {
    if (!sessionCode) return

    const fetchLobbyData = async () => {
      try {
        const response = await fetch(`/api/lobby/${sessionCode}`)
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Gagal mengambil data lobby")
        }
        // NEW: Correctly destructure the response from the API
        const data = await response.json()
        setSession(data.session)
        setPlayers(data.players)
        setError(null)

        // Check if game has started
        if (data.session?.status === "started") {
          router.push(`/game/${sessionCode}`)
        }
      } catch (err: any) {
        console.error("Error fetching lobby data:", err)
        setError(err.message)
      }
    }

    const intervalId = setInterval(fetchLobbyData, 3000) // Poll every 3 seconds
    fetchLobbyData() // Initial fetch

    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [sessionCode, router])

  const handleLeave = () => {
    // Here you might want to call an API to remove the player from the database
    localStorage.removeItem("playerSession")
    router.push("/")
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push('/login/student')} className="mt-4">Kembali ke Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session || !currentPlayer) {
    return (
       <div className="min-h-screen flex items-center justify-center">
         <RefreshCw className="w-8 h-8 animate-spin text-gray-500" />
         <p className="ml-4 text-gray-600">Memuat data lobby...</p>
       </div>
    )
  }
  
  if (session.status === "started") {
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
            <p className="text-gray-600">Kode Sesi: {session.code}</p>
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
          {/* Left Column */}
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
                <div>
                  <label className="text-sm font-medium text-gray-600">Guru</label>
                  <p className="font-semibold">{session.teacherName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Sekolah</label>
                  <p className="text-gray-800">{session.school}</p>
                </div>
                 <div>
                  <label className="text-sm font-medium text-gray-600">Mata Pelajaran</label>
                  <p className="text-gray-800">{session.subject}</p>
                </div>
              </CardContent>
            </Card>

            {/* Your Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Info Anda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg">{currentPlayer.name}</p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column (Player List) */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Siswa di Lobby ({players.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Menunggu guru memulai permainan...</p>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {players.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{player.name}</p>
                      {player.id === currentPlayer.id && (
                        <Badge variant="outline">Ini Anda</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

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
