import authConfig from './auth.config';
import NextAuth from 'next-auth';

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;

  const session = req.auth;
  const pathname = nextUrl.pathname;

  if (pathname.startsWith('/panel') || pathname.startsWith('lista-zyczen')) {
    if (!session?.user.email) return Response.redirect(new URL('/logowanie', nextUrl));
  }
  if (session?.user.email && pathname.startsWith('/logowanie')) {
    return Response.redirect(new URL('/sklep', nextUrl));
  }

  return null;
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
