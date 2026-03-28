"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { regions, type AfricaRegion } from "@/lib/countries";

// Top countries per region (highest population, most searched)
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

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
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
              Countries
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
                  <div key={region} role="group" aria-label={region}>
                    <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                      {region}
                    </p>
                    <ul className="space-y-0.5">
                      {regionCountries[region].map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/${c.slug}`}
                            className={`block px-2 py-1.5 text-[13px] rounded-md transition-colors ${
                              pathname === `/${c.slug}`
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : "text-[var(--text-secondary)] hover:bg-gray-50 hover:text-[var(--text-primary)]"
                            }`}
                            role="menuitem"
                          >
                            {c.name}
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
            href="/south-africa"
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith("/south-africa")
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-gray-50"
            }`}
          >
            South Africa
          </Link>
          <Link
            href="/nigeria"
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith("/nigeria")
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-gray-50"
            }`}
          >
            Nigeria
          </Link>
          <Link
            href="/kenya"
            className={`hidden lg:block px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith("/kenya")
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-gray-50"
            }`}
          >
            Kenya
          </Link>
          <Link
            href="/egypt"
            className={`hidden lg:block px-3 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              pathname.startsWith("/egypt")
                ? "bg-blue-50 text-blue-700"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-gray-50"
            }`}
          >
            Egypt
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2.5 -mr-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:text-[var(--text-primary)] transition-colors touch-manipulation"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
            {regions.map((region) => (
              <div key={region}>
                <p className="text-[11px] font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5 px-2">
                  {region}
                </p>
                <div className="grid grid-cols-2 gap-0.5">
                  {regionCountries[region].map((c) => (
                    <Link
                      key={c.slug}
                      href={`/${c.slug}`}
                      className={`px-3 py-2.5 text-[14px] rounded-lg transition-colors touch-manipulation ${
                        pathname === `/${c.slug}`
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "text-[var(--text-secondary)] active:bg-gray-50"
                      }`}
                    >
                      {c.name}
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
