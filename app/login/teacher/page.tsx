"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, ArrowLeft, BookOpen, Settings } from "lucide-react"
import Link from "next/link"


export default function TeacherLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    subject: "Matematika",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.school.trim()) {
      setError("Nama dan sekolah harus diisi!")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch('/api/login/teacher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal membuat sesi');
      }

      // Store teacher data in localStorage
      localStorage.setItem(
        'teacherData',
        JSON.stringify({
          id: result.id,
          name: formData.name.trim(),
          school: formData.school.trim(),
          subject: formData.subject,
          sessionCode: result.sessionCode,
          role: 'teacher',
        }),
      );

      // Redirect to the lobby
      router.push(`/lobby/${result.sessionCode}`);

    } catch (error: any) {
      console.error('Error creating session:', error);
      setError(error.message || 'Gagal membuat sesi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Login Guru</CardTitle>
            <p className="text-gray-600 mt-2">Buat sesi pembelajaran SPLDV Math Monopoly</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Masukkan nama lengkap Anda"
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              {/* School Input */}
              <div className="space-y-2">
                <Label htmlFor="school" className="text-sm font-medium text-gray-700">
                  Nama Sekolah
                </Label>
                <Input
                  id="school"
                  name="school"
                  type="text"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Contoh: SMA Negeri 1 Jakarta"
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              {/* Subject Input */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Mata Pelajaran
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="h-12"
                  disabled={isLoading}
                  readOnly
                />
                <p className="text-xs text-gray-500">Khusus untuk mata pelajaran Matematika SMA</p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Membuat Sesi...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Buat Sesi Pembelajaran
                  </>
                )}
              </Button>
            </form>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Fitur Dashboard Guru
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Kelola sesi pembelajaran SPLDV</li>
                <li>• Pantau progress siswa secara real-time</li>
                <li>• Lihat hasil dan analisis pembelajaran</li>
                <li>• Kontrol jalannya permainan</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
