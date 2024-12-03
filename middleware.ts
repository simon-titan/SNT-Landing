import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('outseta_auth_token')
  
  if (request.nextUrl.pathname.startsWith('/app')) {
    if (!token) {
      const callbackUrl = encodeURIComponent(request.nextUrl.pathname)
      return NextResponse.redirect(new URL(`/?callbackUrl=${callbackUrl}`, request.url))
    }
    
    try {
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/app/:path*'
  ]
} 