import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { sessionCode, playerName } = await req.json();

    if (!sessionCode || !playerName) {
      return NextResponse.json({ error: 'Kode sesi dan nama pemain diperlukan' }, { status: 400 });
    }

    // Langkah 1: Cari sesi berdasarkan kode yang diberikan
    const sessionResult: any = await query(
      'SELECT id FROM game_sessions WHERE session_code = ? AND status = ?',
      [sessionCode, 'waiting']
    );

    if (sessionResult.length === 0) {
      return NextResponse.json({ error: 'Sesi tidak ditemukan atau permainan sudah dimulai' }, { status: 404 });
    }

    const sessionId = sessionResult[0].id;

    // Langkah 2: Masukkan data pemain baru ke tabel players
    const playerResult: any = await query(
      'INSERT INTO players (session_id, player_name) VALUES (?, ?)',
      [sessionId, playerName]
    );

    const playerId = playerResult.insertId;

    // Langkah 3: Kirim respons sukses kembali ke browser siswa
    return NextResponse.json({
      message: 'Berhasil bergabung dengan sesi!',
      sessionId: sessionId,
      playerId: playerId,
      playerName: playerName
    }, { status: 200 });

  } catch (error) {
    console.error('Error saat bergabung dengan sesi:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan pada server';
    return NextResponse.json({ error: 'Gagal bergabung dengan sesi', details: errorMessage }, { status: 500 });
  }
}
