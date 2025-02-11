import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, statSync } from 'fs';
import path from 'path';

export async function GET(req: NextRequest, { params }: { params: { fileName: string } }) {
  const filePath = path.join('/tmp/uploads', params.fileName);

  try {
    // Get file stats to determine size
    const fileStats = statSync(filePath);
    const fileSize = fileStats.size;

    // Create a readable stream
    const fileStream = createReadStream(filePath);

    // Return the video with proper headers
    return new NextResponse(fileStream, {
      status: 200,
      headers: {
        'Content-Length': fileSize.toString(), // Ensure the player knows the file size
        'Accept-Ranges': 'bytes', // Supports seeking in the video
      },
    });

  } catch (error) {
    console.error('File error:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}