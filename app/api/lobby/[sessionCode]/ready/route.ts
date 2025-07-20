import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { studentId, isReady } = await request.json();

    if (!studentId) {
      return NextResponse.json({ message: 'Student ID is required' }, { status: 400 });
    }

    const result = await query(
      'UPDATE students SET isReady = ? WHERE id = ?',
      [isReady, studentId]
    );

    return NextResponse.json({ message: 'Ready status updated successfully' });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to update ready status' }, { status: 500 });
  }
}
