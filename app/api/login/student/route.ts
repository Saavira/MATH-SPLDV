import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

// Fungsi untuk menghasilkan ID unik sederhana
function generateUniqueId() {
  return `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function POST(request: Request) {
  try {
    const { name, class: studentClass, sessionCode } = await request.json();

    if (!name || !studentClass || !sessionCode) {
      return NextResponse.json({ message: 'Semua field harus diisi' }, { status: 400 });
    }

    const upperSessionCode = sessionCode.toUpperCase();

    // 1. Validasi Sesi: Cek apakah ada guru dengan session code ini
    const teacherCheck = await query(
      'SELECT id FROM students WHERE sessionCode = ? AND role = ?',
      [upperSessionCode, 'teacher']
    );

    if (!Array.isArray(teacherCheck) || teacherCheck.length === 0) {
      return NextResponse.json({ message: 'Kode sesi tidak ditemukan atau tidak aktif!' }, { status: 404 });
    }

    // 2. Validasi Nama: Cek apakah nama siswa sudah ada di sesi ini
    const studentNameCheck = await query(
      'SELECT id FROM students WHERE sessionCode = ? AND name = ? AND role = ?',
      [upperSessionCode, name.trim(), 'student']
    );

    if (Array.isArray(studentNameCheck) && studentNameCheck.length > 0) {
      return NextResponse.json({ message: 'Nama sudah digunakan dalam sesi ini!' }, { status: 409 });
    }

    // 3. Tambahkan Siswa
    const id = generateUniqueId();
    await query(
      'INSERT INTO students (id, name, class, sessionCode, role, isReady) VALUES (?, ?, ?, ?, ?, ?)',
      [id, name.trim(), studentClass, upperSessionCode, 'student', false]
    );

    return NextResponse.json({ id, name: name.trim(), class: studentClass, sessionCode: upperSessionCode });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Gagal bergabung dengan sesi' }, { status: 500 });
  }
}
