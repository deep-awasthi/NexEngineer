import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isDemoMode = supabaseUrl.includes('placeholder-project-id') || !supabaseUrl;
  const mockSession = request.cookies.get('sb-mock-session')?.value === 'true';

  let user: any = null;

  if (isDemoMode) {
    if (mockSession) {
      // Return a simulated user structure
      user = {
        id: '11111111-2222-3333-4444-555555555555',
        email: 'demo@nexengineer.com',
        user_metadata: {
          full_name: 'Demo Engineer',
          avatar_url: '',
        },
      };
    }
  } else {
    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    try {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      user = supabaseUser;
    } catch {
      user = null;
    }
  }

  const pathname = request.nextUrl.pathname;

  // Let static assets, auth api endpoints, or public metadata pass through
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') || // e.g., favicon.ico, images, sitemap
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return supabaseResponse;
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isProtectedRoute =
    pathname === '/' ||
    pathname.startsWith('/dsa') ||
    pathname.startsWith('/library') ||
    pathname.startsWith('/studio') ||
    pathname.startsWith('/ide') ||
    pathname.startsWith('/admin');

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
