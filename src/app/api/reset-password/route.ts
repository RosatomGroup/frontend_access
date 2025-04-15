import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
// import bcrypt from 'bcryptjs';

interface User {
  email: string;
  password: string;
  // passwordHash: string;
}

interface RequestBody {
  email: string;
  oldPassword: string;
  newPassword: string;
}

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  try {
    const { email, oldPassword, newPassword }: RequestBody = await request.json();

    if (!fs.existsSync(usersFilePath)) {
      return NextResponse.json({ error: 'База пользователей не найдена' }, { status: 404 });
    }

    const fileData = fs.readFileSync(usersFilePath, 'utf-8');
    const users: User[] = JSON.parse(fileData);

    const userIndex = users.findIndex((user) => user.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    // bcrypt.compare
    if (users[userIndex].password !== oldPassword) {
      return NextResponse.json({ error: 'Неверный старый пароль' }, { status: 401 });
    }

    users[userIndex].password = newPassword;
    // users[userIndex].passwordHash = await bcrypt.hash(newPassword, 10);

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Ошибка при сбросе пароля' }, { status: 500 });
  }
}

