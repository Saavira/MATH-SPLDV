import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { sessionCode: string } }) {
  const { sessionCode } = params;
  try {
    const { playerId } = await request.json();

    if (!playerId) {
      return NextResponse.json({ message: 'ID Pemain diperlukan' }, { status: 400 });
    }

    // 1. Dapatkan semua pemain di sesi untuk menentukan giliran
    const playersResult = await query(
      'SELECT id, position, isCurrentTurn FROM students WHERE sessionCode = ? AND role = ? AND isEliminated = FALSE ORDER BY createdAt ASC',
      [sessionCode.toUpperCase(), 'student']
    );
    
    const players = playersResult as any[];

    if (players.length === 0) {
        return NextResponse.json({ message: 'Tidak ada pemain di sesi ini' }, { status: 404 });
    }

    const currentPlayerIndex = players.findIndex(p => p.id === playerId);
    if (currentPlayerIndex === -1 || !players[currentPlayerIndex].isCurrentTurn) {
      return NextResponse.json({ message: 'Bukan giliran Anda untuk melempar dadu' }, { status: 403 });
    }

    // 2. Lakukan lemparan dadu
    const diceValue = Math.floor(Math.random() * 6) + 1;
    const currentPlayer = players[currentPlayerIndex];
    const newPosition = (currentPlayer.position + diceValue) % 100; // Papan memiliki 100 kotak (0-99)

    // 3. Update posisi pemain saat ini
    await query('UPDATE students SET position = ? WHERE id = ?', [newPosition, playerId]);

    // 4. Tentukan pemain berikutnya
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    const nextPlayerId = players[nextPlayerIndex].id;

    // 5. Update status giliran di database
    await query('UPDATE students SET isCurrentTurn = FALSE WHERE id = ?', [playerId]);
    await query('UPDATE students SET isCurrentTurn = TRUE WHERE id = ?', [nextPlayerId]);

    // 6. Kembalikan hasilnya
    return NextResponse.json({ diceValue, newPosition });

  } catch (error) {
    console.error(`Error in roll API for session ${sessionCode}:`, error);
    return NextResponse.json({ message: 'Gagal melempar dadu' }, { status: 500 });
  }
}
