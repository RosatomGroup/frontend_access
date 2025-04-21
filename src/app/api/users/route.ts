import { NextResponse } from 'next/server';
import mockUsers from '@/../data/users.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (email) {
    const user = mockUsers.find(u => u.email === email);
    return user
      ? NextResponse.json(user)
      : NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(mockUsers); // Возвращает всех, если нет email
}