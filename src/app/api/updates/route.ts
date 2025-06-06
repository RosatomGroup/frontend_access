import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const filePath = path.join(process.cwd(), 'data', 'updates.json');

type NewsItem = {
  id: string;
  title: string;
  text: string;
  createdAt: string;
};

function readNews(): NewsItem[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content || '[]');
}

function writeNews(data: NewsItem[]) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const news = readNews();
  return NextResponse.json(news);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, text } = body;
  if (!title || !text) {
    return new NextResponse(JSON.stringify({ message: 'No title or text provided' }), {
      status: 400,
    });
  }

  const news = readNews();
  news.unshift({
    id: randomUUID(),
    title,
    text,
    createdAt: new Date().toISOString(),
  });
  writeNews(news);

  return new NextResponse(JSON.stringify({ message: 'Saved' }), { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idToDelete = searchParams.get('id');
  if (!idToDelete) {
    return new NextResponse(JSON.stringify({ message: 'ID не указан' }), { status: 400 });
  }

  const news = readNews();
  const filteredNews = news.filter((item) => item.id !== idToDelete);

  if (news.length === filteredNews.length) {
    return new NextResponse(JSON.stringify({ message: 'Новость не найдена' }), { status: 404 });
  }

  writeNews(filteredNews);
  return new NextResponse(JSON.stringify({ message: 'Удалено' }), { status: 200 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, text } = body;

  if (!id || !title || !text) {
    return new NextResponse(JSON.stringify({ message: 'Недостаточно данных' }), { status: 400 });
  }

  const news = readNews();
  const index = news.findIndex((item) => item.id === id);

  if (index === -1) {
    return new NextResponse(JSON.stringify({ message: 'Новость не найдена' }), { status: 404 });
  }

  news[index] = { ...news[index], title, text };
  writeNews(news);

  return new NextResponse(JSON.stringify({ message: 'Обновлено' }), { status: 200 });
}

