import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes
  const publicRoutes = ['/', '/login', '/register', '/api']
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith('/api/')
  )

  // Auth routes (redirect to dashboard if logged in)
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.includes(pathname)

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/app/dashboard'
    return NextResponse.redirect(url)
  }

  // Admin route protection
  if (user && pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/app/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Student route protection (check subscription)
  if (user && pathname.startsWith('/app/exam')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, role')
      .eq('id', user.id)
      .single()

    if (
      profile &&
      profile.role !== 'admin' &&
      !['active', 'trial'].includes(profile.subscription_status)
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/app/dashboard'
      url.searchParams.set('error', 'subscription_required')
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
