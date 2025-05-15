// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isLoginPage = request.nextUrl.pathname === '/user/login';
  const signUpPage = request.nextUrl.pathname === '/user/signup';

  // If not logged in and not on login page, redirect to signup page
  if (!token && !isLoginPage && !signUpPage) {
    return NextResponse.redirect(new URL('/user/signup', request.url));
  }

  // If logged in and trying to access login page, redirect to dashboard (or home)
  if (token && isLoginPage)
    return NextResponse.redirect(new URL('/upload', request.url));

  // If logged in and trying to access sign up page, redirect to dashboard (or home)
  if (token && signUpPage)
    return NextResponse.redirect(new URL('/upload', request.url));
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/((?!_next|api|static|favicon.ico).*)'], // Protect all except static/API assets
};
