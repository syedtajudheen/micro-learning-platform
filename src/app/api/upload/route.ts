import { writeFile, mkdir, access } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }

    // Simulate 3 second processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    
    // Check if file exists
    try {
      await access(filePath);
      // File exists, return existing path
      return NextResponse.json({
        url: `/uploads/${fileName}`,
        message: 'File already exists',
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      });
    } catch {
      // File doesn't exist, write it
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
    }

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      message: 'Video uploaded successfully',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

  } catch (error) {
    console.error('upload Error:::', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
