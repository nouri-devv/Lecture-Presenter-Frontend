// app/api/your-endpoint/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();

  // Set the cookie using the `cookies()` helper
  (await cookies()).set({
  name: 'token',
  value: token,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' ? true : false, // ✅
  sameSite: 'lax',  // Or 'strict' if you're on the same origin
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
  });

  return NextResponse.json({ success: true });
}


