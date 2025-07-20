import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { sessionCode: string } }) {
  const sessionCode = params.sessionCode;

  if (!sessionCode) {
    return NextResponse.json({ message: 'Kode sesi diperlukan' }, { status: 400 });
  }

  try {
    // Langkah 1: Dapatkan detail sesi dan informasi guru dari tabel game_sessions
    const sessionResult: any = await query(
      'SELECT id, teacher_name, teacher_school, subject, status FROM game_sessions WHERE session_code = ?',
      [sessionCode]
    );

    if (sessionResult.length === 0) {
      return NextResponse.json({ message: 'Sesi tidak ditemukan' }, { status: 404 });
    }

    const session = sessionResult[0];
    const sessionId = session.id;

    // Langkah 2: Dapatkan semua pemain yang terhubung dengan sesi ini dari tabel players
    const playersResult: any = await query(
      'SELECT id, player_name FROM players WHERE session_id = ?',
      [sessionId]
    );

    // Format data untuk dikirim ke frontend
    const responseData = {
      session: {
        id: session.id,
        code: sessionCode,
        teacherName: session.teacher_name,
        school: session.teacher_school,
        subject: session.subject,
        status: session.status,
      },
      players: playersResult.map((player: any) => ({
        id: player.id,
        name: player.player_name,
      }))
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('API Error fetching lobby data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan pada server';
    return NextResponse.json({ message: 'Gagal mengambil data lobby', details: errorMessage }, { status: 500 });
  }
}
