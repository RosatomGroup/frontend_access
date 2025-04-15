import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// import bcrypt from 'bcryptjs';

interface User {
  email: string;
  password: string;
  // passwordHash: string;
  [key: string]: unknown;
}

interface RequestBody {
  email: string;
  password: string;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  success: boolean;
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(
  request: Request,
): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  try {
    const { email, password } = (await request.json()) as RequestBody;

    if (!fs.existsSync(usersFilePath)) {
      return NextResponse.json({ error: 'База пользователей не найдена' }, { status: 404 });
    }

    const fileData = fs.readFileSync(usersFilePath, 'utf-8');
    const users: User[] = JSON.parse(fileData);

    const user = users.find((user: User) => user.email === email);

    if (!user) {
      return NextResponse.json({ error: 'Пользователь с таким email не найден' }, { status: 404 });
    }

    const isPasswordValid = password === user.password;
    // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка при авторизации' }, { status: 500 });
  }
}

