"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { allCities } from "@/lib/cities";
import { City } from "@/lib/types";
import { useDictionary } from "@/i18n/dictionary-provider";

interface GeoResult {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  displayName: string;
}

type SearchResult =
  | { type: "city"; city: City }
  | { type: "geo"; geo: GeoResult };

interface SearchBarProps {
  autoFocus?: boolean;
  variant?: "hero" | "default";
}

export function SearchBar({
  autoFocus = false,
  variant = "default",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { dict, lang } = useDictionary();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  // Position dropdown relative to input
  const updateDropdownPosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownStyle({
      position: "fixed",
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
      zIndex: 9999,
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateDropdownPosition();
    window.addEventListener("scroll", updateDropdownPosition, true);
    window.addEventListener("resize", updateDropdownPosition);
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const geocode = useCallback(
    async (q: string, localResults: SearchResult[]) => {
      if (localResults.length >= 4 || q.length < 3) return;

      setIsLoading(true);
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const geoResults: GeoResult[] = await res.json();

        const localSlugs = new Set(
          localResults
            .filter((r): r is { type: "city"; city: City } => r.type === "city")
            .map((r) => `${r.city.latitude.toFixed(1)}-${r.city.longitude.toFixed(1)}`)
        );

        const newGeo: SearchResult[] = geoResults
          .filter((g) => {
            const key = `${g.lat.toFixed(1)}-${g.lon.toFixed(1)}`;
            return !localSlugs.has(key);
          })
          .slice(0, 5 - localResults.length)
          .map((g) => ({ type: "geo" as const, geo: g }));

        if (newGeo.length > 0) {
          setResults((prev) => [...prev, ...newGeo]);
          setIsOpen(true);
        }
      } catch {
        // Geocoding failed silently
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  function handleSearch(value: string) {
    setQuery(value);
    setSelectedIndex(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const q = value.toLowerCase();

    const cityMatches: SearchResult[] = allCities
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.countryName.toLowerCase().includes(q)
      )
      .sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return b.population - a.population;
      })
      .slice(0, 6)
      .map((c) => ({ type: "city" as const, city: c }));

    setResults(cityMatches);
    if (cityMatches.length > 0) {
      setIsOpen(true);
      updateDropdownPosition();
    }

    debounceRef.current = setTimeout(() => {
      geocode(value, cityMatches);
    }, 400);
  }

  function navigate(result: SearchResult) {
    setIsOpen(false);
    setQuery("");
    if (result.type === "city") {
      router.push(`/${lang}/weather/${result.city.country}/${result.city.slug}`);
    } else {
      const { lat, lon, name } = result.geo;
      router.push(
        `/${lang}/weather?lat=${lat}&lon=${lon}&name=${encodeURIComponent(name)}`
      );
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      navigate(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  const isHero = variant === "hero";

  const dropdown =
    isOpen && results.length > 0 && mounted
      ? createPortal(
          <ul
            ref={dropdownRef}
            style={dropdownStyle}
            className="bg-white border border-[var(--border)] rounded-2xl shadow-xl shadow-black/8 overflow-hidden"
          >
            {results.map((result, i) => {
              const isCity = result.type === "city";
              const key = isCity
                ? `${result.city.country}-${result.city.slug}`
                : `geo-${result.geo.lat}-${result.geo.lon}`;

              return (
                <li key={key}>
                  <button
                    onClick={() => navigate(result)}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between transition-colors ${
                      i === selectedIndex
                        ? "bg-blue-50 text-blue-700"
                        : "text-[var(--text-primary)] hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <svg
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isCity
                            ? "text-[var(--text-tertiary)]"
                            : "text-emerald-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium truncate">
                        {isCity ? result.city.name : result.geo.name}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)] shrink-0 ml-2">
                      {isCity ? result.city.countryName : result.geo.country}
                    </span>
                  </button>
                </li>
              );
            })}
            {isLoading && (
              <li className="px-4 py-2.5 text-[12px] text-[var(--text-tertiary)] text-center">
                {dict.search.searching}
              </li>
            )}
          </ul>,
          document.body
        )
      : null;

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <svg
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] ${
            isHero ? "text-white/50" : "text-[var(--text-tertiary)]"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true);
              updateDropdownPosition();
            }
          }}
          placeholder={dict.search.placeholder}
          autoFocus={autoFocus}
          className={`w-full pl-11 pr-4 py-3.5 rounded-2xl text-[15px] font-medium focus:outline-none transition-all touch-manipulation ${
            isHero
              ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-white/30 shadow-lg shadow-black/5"
              : "bg-white border border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 shadow-sm"
          }`}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}
      </div>
      {dropdown}
    </div>
  );
}
