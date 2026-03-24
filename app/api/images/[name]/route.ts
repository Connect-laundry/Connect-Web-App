import { NextResponse } from 'next/server';
import * as fs from 'fs';

const imageMap: Record<string, string> = {
  'hero-laundry.png': 'hero_laundry_1773419801407.png',
  'delivery-service.png': 'delivery_service_1773419931483.png',
  'dry-cleaning.png': 'dry_cleaning_1773419950105.png',
};

const BRAIN_DIR = 'C:\\Users\\ERNEST\\.gemini\\antigravity\\brain\\d29c87d5-c6fa-423c-8e97-e409b6feb2da';

export async function GET(
  _request: Request,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;

  const filename = imageMap[name];
  if (!filename) {
    return new NextResponse('Not found', { status: 404 });
  }

  const filepath = BRAIN_DIR + '\\' + filename;

  try {
    const buffer = fs.readFileSync(filepath);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('Image read error for', name, 'at', filepath, ':', err);
    return new NextResponse('Image not found', { status: 404 });
  }
}
