"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { regions, type AfricaRegion } from "@/lib/countries";
import { locales, localeNames, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/app/[lang]/dictionaries";

const regionCountries: Record<AfricaRegion, { name: string; slug: string }[]> = {
  "Southern Africa": [
    { name: "South Africa", slug: "south-africa" },
    { name: "Mozambique", slug: "mozambique" },
    { name: "Angola", slug: "angola" },
    { name: "Zimbabwe", slug: "zimbabwe" },
    { name: "Madagascar", slug: "madagascar" },
    { name: "Zambia", slug: "zambia" },
  ],
  "East Africa": [
    { name: "Ethiopia", slug: "ethiopia" },
    { name: "Tanzania", slug: "tanzania" },
    { name: "Kenya", slug: "kenya" },
    { name: "Uganda", slug: "uganda" },
    { name: "Somalia", slug: "somalia" },
    { name: "Rwanda", slug: "rwanda" },
  ],
  "West Africa": [
    { name: "Nigeria", slug: "nigeria" },
    { name: "Ghana", slug: "ghana" },
    { name: "Ivory Coast", slug: "ivory-coast" },
    { name: "Senegal", slug: "senegal" },
    { name: "Mali", slug: "mali" },
    { name: "Niger", slug: "niger" },
  ],
  "Central Africa": [
    { name: "DR Congo", slug: "dr-congo" },
    { name: "Cameroon", slug: "cameroon" },
    { name: "Chad", slug: "chad" },
    { name: "Congo", slug: "congo" },
    { name: "Gabon", slug: "gabon" },
  ],
  "North Africa": [
    { name: "Egypt", slug: "egypt" },
    { name: "Algeria", slug: "algeria" },
    { name: "Sudan", slug: "sudan" },
    { name: "Morocco", slug: "morocco" },
    { name: "Tunisia", slug: "tunisia" },
    { name: "Libya", slug: "libya" },
  ],
};

interface NavbarProps {
  lang: Locale;
  dict: Dictionary;
}

export function Navbar({ lang, dict }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
    setLangOpen(false);
  }, [pathname]);

  // Build locale-switched URL: replace the current locale prefix with the new one
  function switchLocaleUrl(newLocale: string) {
    // pathname looks like /en/... or /fr/...
    const segments = pathname.split("/");
    segments[1] = newLocale;
    return segments.join("/");
  }

  const getCountryName = (slug: string) =>
    dict.countries[slug as keyof typeof dict.countries] || slug;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="flex items-center gap-2.5 shrink-0"
          aria-label="AfriWeather — Home"
        >
          <img
            src="/afriweather-logo.png"
            alt=""
            width={36}
            height={36}
            className="w-9 h-9 rounded-lg"
          />
          <span className="text-[17px] font-bold tracking-tight text-[var(--text-primary)]">
            AfriWeather
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* Countries dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                dropdownOpen
                  ? "bg-gray-100 text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-50"
              }`}
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {dict.nav.countries}
              <svg
                className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute top-full right-0 mt-2 w-[600px] bg-white border border-[var(--border)] rounded-2xl shadow-xl shadow-black/8 p-5 grid grid-cols-3 gap-5"
                role="menu"
              >
                {regions.map((region) => (
                  <div key={region} role="group" aria-label={dict.regions[region] || region}>
                    <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                      {dict.regions[region] || region}
                    </p>
                    <ul className="space-y-0.5">
                      {regionCountries[region].map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/${lang}/${c.slug}`}
                            className={`block px-2 py-1.5 text-[13px] rounded-md transition-colors ${
                              pathname === `/${lang}/${c.slug}`
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "text-[var(--text-secondary)] hover:bg-gray-50 hover:text-[var(--text-primary)]"
                            }`}
                            role="menuitem"
                          >
                            {getCountryName(c.slug)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top country quick links */}
          <Link
            href={`/${lang}/south-africa`}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith(`/${lang}/south-africa`)
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-50"
            }`}
          >
            {getCountryName("south-africa")}
          </Link>
          <Link
            href={`/${lang}/nigeria`}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith(`/${lang}/nigeria`)
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-gray-50"
            }`}
          >
            {getCountryName("nigeria")}
          </Link>
          <Link
            href={`/${lang}/kenya`}
            className={`hidden lg:block px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith(`/${lang}/kenya`)
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-gray-50"
            }`}
          >
            {getCountryName("kenya")}
          </Link>
          <Link
            href={`/${lang}/egypt`}
            className={`hidden lg:block px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith(`/${lang}/egypt`)
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-gray-50"
            }`}
          >
            {getCountryName("egypt")}
          </Link>

          {/* Language switcher */}
          <div ref={langRef} className="relative ml-2">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-sm font-medium rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-gray-50 transition-all"
              aria-label="Change language"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="uppercase text-xs">{lang}</span>
            </button>

            {langOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-[var(--border)] rounded-xl shadow-xl shadow-black/8 overflow-hidden">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={switchLocaleUrl(l)}
                    className={`block px-4 py-2.5 text-[13px] transition-colors ${
                      l === lang
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-[var(--text-secondary)] hover:bg-gray-50"
                    }`}
                  >
                    {localeNames[l]}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2.5 -mr-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:text-[var(--text-primary)] transition-colors touch-manipulation"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? dict.nav.closeMenu : dict.nav.openMenu}
        >
          {mobileOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-white max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-4">
            {/* Language switcher - mobile */}
            <div className="flex flex-wrap gap-1.5 pb-3 border-b border-[var(--border-subtle)]">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={switchLocaleUrl(l)}
                  className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${
                    l === lang
                      ? "bg-blue-50 text-blue-700 font-semibold"
                      : "text-[var(--text-secondary)] bg-gray-50"
                  }`}
                >
                  {localeNames[l]}
                </Link>
              ))}
            </div>

            {regions.map((region) => (
              <div key={region}>
                <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5 px-2">
                  {dict.regions[region] || region}
                </p>
                <div className="grid grid-cols-2 gap-0.5">
                  {regionCountries[region].map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${lang}/${c.slug}`}
                      className={`px-3 py-2.5 text-[14px] rounded-lg transition-colors touch-manipulation ${
                        pathname === `/${lang}/${c.slug}`
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-[var(--text-secondary)] active:bg-gray-50"
                      }`}
                    >
                      {getCountryName(c.slug)}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
