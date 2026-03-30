import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr", "ar", "pt", "sw"];
const defaultLocale = "en";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Detect locale from Accept-Language header, fallback to default
  const acceptLang = request.headers.get("accept-language") || "";
  const locale = detectLocale(acceptLang) || defaultLocale;

  // Redirect to add locale prefix
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

function detectLocale(acceptLanguage: string): string | null {
  // Parse Accept-Language header and match against supported locales
  const langs = acceptLanguage
    .split(",")
    .map((part) => {
      const [lang, q] = part.trim().split(";q=");
      return { lang: lang.trim().split("-")[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of langs) {
    if (locales.includes(lang)) return lang;
  }
  return null;
}

export const config = {
  matcher: [
    // Skip internal paths and static files
    "/((?!api|_next/static|_next/image|favicon\\.ico|icon\\.jpeg|apple-icon\\.png|afriweather-logo\\.png|og-image\\.jpeg|hero-bg\\.webp|countries|sitemap\\.xml|robots\\.txt|.*\\.webp$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.ico$).*)",
  ],
};
