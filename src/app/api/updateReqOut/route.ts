import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RequestData {
  id: number;
  name: string;
  requestSubject: string;
  role: string;
  status: string;
  system: string;
  submissionTime: string;
  email: string;
}

export async function POST(request: Request) {
  try {
    const data: RequestData[] = await request.json();
    
    const fileContent = `interface DataType {
  id: number;
  name: string;
  requestSubject: string;
  role: string;
  status: string;
  system: string;
  submissionTime: string;
  email: string;
}

export const reqOutdata: DataType[] = ${JSON.stringify(data, null, 2)};`;

    const filePath = path.join(process.cwd(), 'src/app/reqOut.ts');
    
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