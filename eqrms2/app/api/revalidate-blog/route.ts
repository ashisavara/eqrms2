import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { paths, secret } = await request.json();

    // Verify the secret to prevent unauthorized revalidation
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: 'Paths array is required' }, { status: 400 });
    }

    // Revalidate all specified paths
    const revalidatedPaths = [];
    for (const path of paths) {
      revalidatePath(path);
      revalidatedPaths.push(path);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Revalidated ${revalidatedPaths.length} path(s)`,
      revalidatedPaths,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' }, 
      { status: 500 }
    );
  }
}
