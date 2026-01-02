import { NextResponse } from "next/server";

export async function GET() {
  const txt = `User-agent: *
Allow: /

# Private / auth areas
Disallow: /p-admin/
Disallow: /admin/
Disallow: /auth/
Disallow: /login-register/
Disallow: /dashboard/
Disallow: /user/
Disallow: /profile/
Disallow: /private/
Disallow: /tmp/

# Next.js internals
Disallow: /_next/
Disallow: /node_modules/

# Protect paid lessons (but allow course pages)
Disallow: /courses/*/lesson/

# Sitemap (ONLY index)
Sitemap: https://firouzehjavaherian.com/sitemap.xml
`;

  return new NextResponse(txt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
