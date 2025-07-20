import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// Function to generate a unique session code
function generateSessionCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(req: Request) {
  try {
    const { name, school, subject } = await req.json();

    if (!name || !school) {
      return NextResponse.json({ message: 'Nama dan sekolah harus diisi' }, { status: 400 });
    }

    let sessionCode = '';
    let isCodeUnique = false;
    let attempts = 0;

    // Ensure the generated code is unique
    while (!isCodeUnique && attempts < 10) {
      sessionCode = generateSessionCode();
      const existingSession = await query(
        'SELECT id FROM game_sessions WHERE session_code = ?',
        [sessionCode]
      );
      if (Array.isArray(existingSession) && existingSession.length === 0) {
        isCodeUnique = true;
      }
      attempts++;
    }

    if (!isCodeUnique) {
      return NextResponse.json({ message: 'Gagal membuat kode sesi unik. Coba lagi.' }, { status: 500 });
    }

    // Insert the new session into the database
    const result: any = await query(
      'INSERT INTO game_sessions (session_code, teacher_name, teacher_school, subject, status) VALUES (?, ?, ?, ?, ?)',
      [sessionCode, name, school, subject, 'waiting']
    );

    const insertId = result.insertId;

    if (!insertId) {
      throw new Error('Gagal menyimpan sesi ke database.');
    }

    return NextResponse.json({ 
      message: 'Sesi berhasil dibuat',
      sessionCode: sessionCode,
      id: insertId 
    }, { status: 201 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: error.message || 'Terjadi kesalahan pada server' }, { status: 500 });
  }
}
