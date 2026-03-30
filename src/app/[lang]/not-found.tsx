import Link from "next/link";
import { SearchBar } from "@/components/weather/search-bar";

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-8 h-8 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
        City Not Found
      </h1>
      <p className="text-[var(--text-secondary)] mb-8 max-w-sm mx-auto text-[15px]">
        We couldn&apos;t find weather data for that location. Try searching below.
      </p>
      <SearchBar autoFocus />
      <div className="mt-8">
        <Link
          href="/en/south-africa"
          className="text-[13px] text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          Browse all South Africa cities &rarr;
        </Link>
      </div>
    </div>
  );
}
