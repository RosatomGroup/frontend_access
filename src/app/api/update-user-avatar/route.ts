import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const usersFilePath = path.join(process.cwd(), 'data', 'users.json');

interface UserData {
  email: string;
  avatar?: string;
}

export async function POST(request: Request) {
  try {
    const { email, avatar } = await request.json();

    if (!email || !avatar) {
      return NextResponse.json(
        { error: 'Email and avatar are required' },
        { status: 400 }
      );
    }

    const fileContents = await fs.readFile(usersFilePath, 'utf8');
    const users = JSON.parse(fileContents);

    const userIndex = users.findIndex((u: UserData) => u.email === email);
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    users[userIndex].avatar = avatar;

    await fs.writeFile(
      usersFilePath,
      JSON.stringify(users, null, 2),
      'utf8'
    );

    return NextResponse.json(users[userIndex]);

  } catch (error) {
    console.error('Error updating user avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}