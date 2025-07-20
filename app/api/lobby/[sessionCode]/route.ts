import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { sessionCode: string } }) {
  const sessionCode = params.sessionCode;

  try {
    // Ambil data guru
    const teacherResult = await query(
      'SELECT name, school, status FROM students WHERE sessionCode = ? AND role = ?',
      [sessionCode, 'teacher']
    );

    // Ambil data siswa
    const studentsResult = await query(
      'SELECT id, name, class, isReady FROM students WHERE sessionCode = ? AND role = ?',
      [sessionCode, 'student']
    );

    const teacher = Array.isArray(teacherResult) && teacherResult.length > 0 ? teacherResult[0] : null;
    const students = Array.isArray(studentsResult) ? studentsResult : [];

    return NextResponse.json({ teacher, students });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ message: 'Failed to fetch lobby data' }, { status: 500 });
  }
}
