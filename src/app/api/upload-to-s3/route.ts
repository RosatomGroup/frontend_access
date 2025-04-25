import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION,
  endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as Blob;
    const fileName = formData.get('fileName') as string;
    const contentType = formData.get('contentType') as string;

    if (!file || !fileName) {
      return NextResponse.json(
        { error: 'File and fileName are required' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    });

    await s3Client.send(command);

    const publicUrl = `${process.env.NEXT_PUBLIC_S3_ENDPOINT}/${process.env.NEXT_PUBLIC_S3_BUCKET}/${fileName}`;

    return NextResponse.json({
      fileName,
      url: publicUrl,
    });

  } catch (error) {
    console.error('S3 upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading to S3' },
      { status: 500 }
    );
  }
}