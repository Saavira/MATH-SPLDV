import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

// Fungsi untuk menghasilkan ID unik sederhana
function generateUniqueId() {
  return `teacher_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Fungsi untuk menghasilkan kode sesi
function generateSessionCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { name, school, subject } = await request.json();

    if (!name || !school) {
      return NextResponse.json({ message: 'Nama dan sekolah harus diisi' }, { status: 400 });
    }

    const id = generateUniqueId();
    const sessionCode = generateSessionCode();

    await query(
      'INSERT INTO students (id, name, school, subject, sessionCode, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, school, subject, sessionCode, 'teacher', 'waiting']
    );

    return NextResponse.json({ id, sessionCode });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Gagal membuat sesi' }, { status: 500 });
  }
}
