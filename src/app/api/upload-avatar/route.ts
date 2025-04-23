import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

interface UserData {
  email: string;
  name: string;
  surname: string;
  middle_name?: string;
  phone?: string;
  number?: string;
  role?: string;
  avatar?: string;
}

// Константы путей
const AVATARS_DIR = path.join(process.cwd(), 'public', 'images-profiles');
const USERS_PATH = path.join(process.cwd(), 'data', 'users.json');
const MAX_FILE_SIZE_MB = 2; // Максимальный размер файла 2MB

// Функция для генерации уникального имени файла
const generateUniqueFileName = (originalName: string) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  const ext = path.extname(originalName);
  return `avatar-${timestamp}-${random}${ext}`;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const avatarFile = formData.get('avatar') as File | null;
    const email = formData.get('email') as string | null;

    // Валидация входных данных
    if (!avatarFile) {
      return NextResponse.json(
        { error: "Файл аватара не предоставлен" },
        { status: 400 }
      );
    }

    if (!avatarFile.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Разрешены только изображения (JPEG, PNG, WEBP)" },
        { status: 400 }
      );
    }

    if (avatarFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Размер файла не должен превышать ${MAX_FILE_SIZE_MB}MB` },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    // Создаем директорию, если ее нет
    await fs.mkdir(AVATARS_DIR, { recursive: true });

    // Генерируем уникальное имя файла
    const fileName = generateUniqueFileName(avatarFile.name);
    const avatarPath = `/images-profiles/${fileName}`;
    const fullPath = path.join(AVATARS_DIR, fileName);

    // Читаем и сохраняем файл
    const fileBuffer = Buffer.from(await avatarFile.arrayBuffer());
    await fs.writeFile(fullPath, fileBuffer);

    // Читаем и обновляем данные пользователей
    const usersData = await fs.readFile(USERS_PATH, 'utf8');
    const users = JSON.parse(usersData);
    const userIndex = users.findIndex((user: UserData) => user.email === email);

    if (userIndex === -1) {
      // Удаляем загруженный файл, если пользователь не найден
      await fs.unlink(fullPath).catch(console.error);
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 404 }
      );
    }

    // Сохраняем старый аватар для последующего удаления
    const oldAvatarPath = users[userIndex].avatar 
      ? path.join(process.cwd(), 'public', users[userIndex].avatar)
      : null;

    // Обновляем путь к аватару
    users[userIndex].avatar = avatarPath;
    await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2));

    // Удаляем старый аватар, если он существовал
    if (oldAvatarPath) {
      await fs.unlink(oldAvatarPath).catch(console.error);
    }

    return NextResponse.json({ 
      success: true, 
      avatarUrl: avatarPath,
      user: users[userIndex] // Возвращаем обновленные данные пользователя
    });

  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    const errorMessage = error instanceof Error ? error.message : "Произошла ошибка при загрузке аватара";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}