import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { sessionCode: string } }) {
  const { sessionCode } = params;

  if (!sessionCode) {
    return NextResponse.json({ message: 'Kode sesi diperlukan' }, { status: 400 });
  }

  try {
    const players = await query(
      'SELECT id, name, class, position, money, bonusTime, isEliminated, isCurrentTurn, role FROM students WHERE sessionCode = ?',
      [sessionCode.toUpperCase()]
    );

    if (!Array.isArray(players) || players.length === 0) {
      return NextResponse.json({ message: 'Sesi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ players });

  } catch (error) {
    console.error(`Error fetching game state for session ${sessionCode}:`, error);
    return NextResponse.json({ message: 'Gagal mengambil status permainan' }, { status: 500 });
  }
}
