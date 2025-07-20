"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ArrowLeft, Send } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, addDoc, doc, getDoc } from "firebase/firestore"

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const sessionCode = params.sessionCode as string

  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [understanding, setUnderstanding] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionData, setSessionData] = useState<any>(null)
  const [playerName, setPlayerName] = useState("")

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const sessionRef = doc(db, "sessions", sessionCode)
        const sessionSnap = await getDoc(sessionRef)

        if (sessionSnap.exists()) {
          setSessionData(sessionSnap.data())
        }
      } catch (error) {
        console.error("Error fetching session:", error)
      }
    }

    const storedPlayerName = localStorage.getItem("playerName")
    if (storedPlayerName) {
      setPlayerName(storedPlayerName)
    }

    fetchSessionData()
  }, [sessionCode])

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || !rating || !difficulty || !understanding) {
      alert("Mohon lengkapi semua field feedback")
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, "feedback"), {
        sessionCode,
        playerName,
        feedback: feedback.trim(),
        rating: Number.parseInt(rating),
        difficulty,
        understanding,
        timestamp: new Date(),
        createdAt: new Date().toISOString(),
      })

      alert("Terima kasih atas feedback Anda!")
      router.push("/")
    } catch (error) {
      console.error("Error submitting feedback:", error)
      alert("Gagal mengirim feedback. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          index < currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => setRating((index + 1).toString())}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback Permainan</h1>
            <p className="text-gray-600">
              Sesi: {sessionCode} | Pemain: {playerName}
            </p>
          </div>
        </div>

        {/* Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Berikan Feedback Anda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating Keseluruhan Permainan</label>
              <div className="flex gap-1">{renderStars(Number.parseInt(rating) || 0)}</div>
              <p className="text-xs text-gray-500 mt-1">Klik bintang untuk memberikan rating (1-5)</p>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tingkat Kesulitan Soal</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sangat-mudah">Sangat Mudah</SelectItem>
                  <SelectItem value="mudah">Mudah</SelectItem>
                  <SelectItem value="sedang">Sedang</SelectItem>
                  <SelectItem value="sulit">Sulit</SelectItem>
                  <SelectItem value="sangat-sulit">Sangat Sulit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Understanding */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pemahaman Materi SPLDV</label>
              <Select value={understanding} onValueChange={setUnderstanding}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat pemahaman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sangat-paham">Sangat Paham</SelectItem>
                  <SelectItem value="paham">Paham</SelectItem>
                  <SelectItem value="cukup-paham">Cukup Paham</SelectItem>
                  <SelectItem value="kurang-paham">Kurang Paham</SelectItem>
                  <SelectItem value="tidak-paham">Tidak Paham</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Saran dan Komentar</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Berikan saran, komentar, atau masukan untuk perbaikan permainan..."
                className="min-h-[120px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{feedback.length}/500 karakter</p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmitFeedback}
              disabled={isSubmitting || !feedback.trim() || !rating || !difficulty || !understanding}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengirim Feedback...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Kirim Feedback
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Game Summary */}
        {sessionData && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Ringkasan Permainan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Kode Sesi:</span>
                  <p className="text-gray-600">{sessionCode}</p>
                </div>
                <div>
                  <span className="font-medium">Guru:</span>
                  <p className="text-gray-600">{sessionData.teacherName}</p>
                </div>
                <div>
                  <span className="font-medium">Jumlah Pemain:</span>
                  <p className="text-gray-600">{sessionData.players?.length || 0} siswa</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <p className="text-gray-600 capitalize">{sessionData.status}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tentang Math Monopoly</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm leading-relaxed">
              Math Monopoly adalah permainan edukatif yang dirancang khusus untuk membantu siswa SMA kelas 10-11
              memahami materi Sistem Persamaan Linear Dua Variabel (SPLDV) dengan cara yang menyenangkan dan interaktif.
              Permainan ini menggabungkan konsep monopoli klasik dengan soal-soal matematika yang menantang.
            </p>
            <div className="mt-4 text-xs text-gray-500">
              <p>Dikembangkan oleh:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Mahasiswa Pendidikan Matematika</li>
                <li>Dosen Pembimbing</li>
                <li>Guru Matematika SMA</li>
                <li>Developer & Designer</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
