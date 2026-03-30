import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AfriWeather — Africa Weather Forecast",
    template: "%s | AfriWeather",
  },
  description:
    "Accurate weather forecasts for Africa. Current conditions, hourly and 7-day forecasts for 54 African countries and 5,900+ cities. Free, ad-free, updated every 30 minutes.",
  metadataBase: new URL("https://afriweather.io"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: "AfriWeather",
    images: [
      {
        url: "/og-image.jpeg",
        width: 2048,
        height: 1152,
        alt: "AfriWeather — Africa Weather Forecast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AfriWeather — Africa Weather Forecast",
    description:
      "Accurate weather forecasts for 54 African countries and 5,900+ cities. Free, ad-free, updated every 30 minutes.",
    images: ["/og-image.jpeg"],
  },
  icons: {
    icon: "/icon.jpeg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
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

        <Navbar />

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
                  Weather data provided by{" "}
                  <a
                    href="https://www.met.no/"
                    className="underline underline-offset-2 hover:text-[var(--text-secondary)] transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    MET Norway
                  </a>{" "}
                  (Norwegian Meteorological Institute).
                  <br />
                  Licensed under CC BY 4.0.
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                  Popular Cities
                </p>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
                  {[
                    { name: "Cape Town", href: "/weather/south-africa/cape-town" },
                    { name: "Lagos", href: "/weather/nigeria/lagos" },
                    { name: "Nairobi", href: "/weather/kenya/nairobi" },
                    { name: "Cairo", href: "/weather/egypt/cairo" },
                    { name: "Johannesburg", href: "/weather/south-africa/johannesburg" },
                    { name: "Accra", href: "/weather/ghana/accra" },
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
                  About
                </p>
                <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                  Free, accurate weather forecasts for Africa. Starting with
                  South Africa, expanding continent-wide. Updated every 30
                  minutes with data from the Norwegian Meteorological Institute.
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
                  Sitemap
                </Link>
                <span className="text-[var(--border)]">&middot;</span>
                <span>Forecasts updated every 30 minutes</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
