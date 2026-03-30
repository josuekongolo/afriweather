import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, isRtl, type Locale } from "@/i18n/config";
import { getDictionary, hasLocale } from "./dictionaries";
import { DictionaryProvider } from "@/i18n/dictionary-provider";
import { Navbar } from "@/components/navbar";
import "../globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    title: {
      default: dict.meta.siteTitle,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.siteDescription,
    metadataBase: new URL("https://afriweather.io"),
    alternates: {
      canonical: `/${lang}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}`])
      ),
    },
    openGraph: {
      type: "website",
      locale: lang === "fr" ? "fr_FR" : lang === "ar" ? "ar_SA" : lang === "pt" ? "pt_PT" : lang === "sw" ? "sw_TZ" : "en_ZA",
      siteName: "AfriWeather",
      images: [
        {
          url: "/og-image.jpeg",
          width: 2048,
          height: 1152,
          alt: dict.meta.siteTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.siteTitle,
      description: dict.meta.siteDescription,
      images: ["/og-image.jpeg"],
    },
    icons: {
      icon: "/icon.jpeg",
      apple: "/apple-icon.png",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  const rtl = isRtl(lang as Locale);

  return (
    <html lang={lang} dir={rtl ? "rtl" : "ltr"} className={`${dmSans.variable} h-full antialiased`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-K0KTS7G8GM"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K0KTS7G8GM');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-[var(--font-dm-sans)] bg-[var(--background)] text-[var(--foreground)]">
        {/* Schema.org Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AfriWeather",
              url: "https://afriweather.io",
              logo: "https://afriweather.io/afriweather-logo.png",
              description:
                "Accurate weather forecasts for Africa. 54 countries, starting with South Africa. Free, ad-free, powered by open data.",
            }),
          }}
        />

        <DictionaryProvider dict={dict} lang={lang as Locale}>
          <Navbar lang={lang as Locale} dict={dict} />

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--border)] bg-white mt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src="/afriweather-logo.png"
                      alt="AfriWeather"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-lg"
                    />
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      AfriWeather
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                    {dict.footer.weatherDataBy}{" "}
                    <a
                      href="https://www.met.no/"
                      className="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {dict.footer.metNorway}
                    </a>{" "}
                    {dict.footer.institute}
                    <br />
                    {dict.footer.license}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    {dict.footer.popularCities}
                  </p>
                  <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
                    {[
                      { name: "Cape Town", href: `/${lang}/weather/south-africa/cape-town` },
                      { name: "Lagos", href: `/${lang}/weather/nigeria/lagos` },
                      { name: "Nairobi", href: `/${lang}/weather/kenya/nairobi` },
                      { name: "Cairo", href: `/${lang}/weather/egypt/cairo` },
                      { name: "Johannesburg", href: `/${lang}/weather/south-africa/johannesburg` },
                      { name: "Accra", href: `/${lang}/weather/ghana/accra` },
                    ].map((city) => (
                      <Link
                        key={city.name}
                        href={city.href}
                        className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                    {dict.footer.about}
                  </p>
                  <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                    {dict.footer.aboutDescription}
                  </p>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-[11px] text-[var(--text-tertiary)]">
                  &copy; {new Date().getFullYear()} AfriWeather
                </p>
                <div className="flex items-center gap-3 text-[11px] text-[var(--text-tertiary)]">
                  <Link
                    href="/sitemap.xml"
                    className="hover:text-[var(--text-secondary)] transition-colors"
                  >
                    {dict.footer.sitemap}
                  </Link>
                  <span className="text-[var(--border)]">&middot;</span>
                  <span>{dict.footer.updatedEvery30}</span>
                </div>
              </div>
            </div>
          </footer>
        </DictionaryProvider>
      </body>
    </html>
  );
}
