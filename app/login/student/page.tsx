"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, ArrowLeft, Users, BookOpen } from "lucide-react";
import Link from "next/link";


export default function StudentLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    sessionCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.class.trim() ||
      !formData.sessionCode.trim()
    ) {
      setError("Semua field harus diisi!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/login/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal bergabung dengan sesi');
      }

      // Store student data in localStorage
      localStorage.setItem(
        'studentData',
        JSON.stringify({
          id: result.id,
          name: result.name,
          class: result.class,
          sessionCode: result.sessionCode,
          role: 'student',
        }),
      );

      // Redirect to lobby
      router.push(`/lobby/${result.sessionCode}`);

    } catch (error: any) {
      console.error('Error joining session:', error);
      setError(error.message || 'Gagal bergabung dengan sesi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Login Siswa
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Bergabung dalam sesi SPLDV Math Monopoly
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
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

              {/* Class Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="class"
                  className="text-sm font-medium text-gray-700"
                >
                  Kelas
                </Label>
                <Input
                  id="class"
                  name="class"
                  type="text"
                  value={formData.class}
                  onChange={handleInputChange}
                  placeholder="Contoh: X-1, XI IPA 2"
                  className="h-12"
                  disabled={isLoading}
                />
              </div>

              {/* Session Code Input */}
              <div className="space-y-2">
                <Label
                  htmlFor="sessionCode"
                  className="text-sm font-medium text-gray-700"
                >
                  Kode Sesi
                </Label>
                <Input
                  id="sessionCode"
                  name="sessionCode"
                  type="text"
                  value={formData.sessionCode}
                  onChange={handleInputChange}
                  placeholder="Masukkan kode sesi dari guru"
                  className="h-12 font-mono text-center text-lg tracking-wider"
                  maxLength={6}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Kode sesi 6 karakter yang diberikan oleh guru Anda
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Bergabung...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4 mr-2" />
                    Bergabung ke Sesi
                  </>
                )}
              </Button>
            </form>

            {/* Info Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                Tentang Permainan
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Permainan monopoli dengan soal-soal SPLDV</li>
                <li>• Bermain bersama teman sekelas secara real-time</li>
                <li>• Jawab soal untuk mendapatkan uang dan maju</li>
                <li>• Pemain dengan posisi terdepan menang</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
