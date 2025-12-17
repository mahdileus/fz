import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const data = await request.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = '/var/www/uploads';  // مسیر ذخیره
  const fileName = Date.now() + '-' + file.name;
  const filePath = path.join(uploadsDir, fileName);

  fs.writeFileSync(filePath, buffer);

  const url = `/uploads/${fileName}`;

  return NextResponse.json({ uploaded: 1, fileName, url });
}