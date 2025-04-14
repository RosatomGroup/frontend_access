import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Формируем содержимое файла
    const fileContent = `interface DataType {
  id: number;
  name: string;
  role: string;
  status: string;
  system: string;
}

export const reqOutdata: DataType[] = ${JSON.stringify(data, null, 2)};`;

    // Путь к файлу (от корня проекта)
    const filePath = path.join(process.cwd(), 'src/app/reqOut.ts');
    
    // Записываем файл
    fs.writeFileSync(filePath, fileContent, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
}