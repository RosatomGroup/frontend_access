import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface User {
  email: string;
  name: string;
  surname: string;
  phone: string;
  number: string;
  role: string;
  date?: string;
}

export async function POST(request: Request) {
  try {
    const data: User = await request.json();
    const userEmail = data.email;

    // Путь к файлу с пользователями
    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const users: User[] = JSON.parse(fileContents);

    // Находим пользователя по email
    const userIndex = users.findIndex(user => user.email === userEmail);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Обновляем данные пользователя
    users[userIndex] = {
      ...users[userIndex],
      name: data.name || users[userIndex].name,
      surname: data.surname || users[userIndex].surname,
      phone: data.phone || users[userIndex].phone,
      number: data.number || users[userIndex].number,
      role: data.role || users[userIndex].role,
      date: data.date || users[userIndex].date
    };

    // Записываем обновленные данные обратно в файл
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));

    return NextResponse.json(
      { success: true, user: users[userIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при обновлении профиля:', error);
    let errorMessage = "Ошибка сервера";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
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

    const filePath = path.join(process.cwd(), 'data', 'users.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const users: User[] = JSON.parse(fileContents);

    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Ошибка при получении профиля:', error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}