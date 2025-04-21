import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface User {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface UserInputData {
  email: string;
  password: string;
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(
  request: Request,
): Promise<NextResponse<{ success: true } | { error: string }>> {
  try {
    const userData: UserInputData = await request.json();

    let users = [];
    if (fs.existsSync(usersFilePath)) {
      const fileData = fs.readFileSync(usersFilePath, 'utf-8');
      users = JSON.parse(fileData);
    }

    if (users.some((user: User) => user.email === userData.email)) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 },
      );
    }

    users.push(userData);

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка при регистрации' }, { status: 500 });
  }
}

