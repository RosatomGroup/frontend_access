import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface User {
  email: string;
  name: string;
  surname: string;
  middle_name?: string;
  phone?: string;
  number?: string;
  role?: string;
  date?: string;
  avatar?: string;
}

const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const userEmail = data.email;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    const usersData = await fs.readFile(USERS_PATH, 'utf8');
    const users: User[] = JSON.parse(usersData);
    const userIndex = users.findIndex(user => user.email === userEmail);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Обновляем только переданные поля
    const updatedUser = {
      ...users[userIndex],
      ...data,
      // Защищаем email от изменения
      email: users[userIndex].email
    };

    users[userIndex] = updatedUser;
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));

    return NextResponse.json({
      success: true,
      user: updatedUser // Возвращаем полные обновленные данные
    });

  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    const errorMessage = error instanceof Error ? error.message : "Ошибка сервера";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    const usersData = await fs.readFile(USERS_PATH, 'utf8');
    const users: User[] = JSON.parse(usersData);
    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
    
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    const errorMessage = error instanceof Error ? error.message : "Ошибка сервера";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}