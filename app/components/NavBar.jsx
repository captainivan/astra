"use client";

import { useEffect, useState } from "react";
import { Button, Input } from "@base-ui/react";
import {
  Search,
  User,
  Bell,
  Menu,
  X,
  Film,
  CalendarDays,
  Star,
  TrendingUp,
  Tv,
  Clapperboard,
  Flame,
  Tag,
  Loader2,
  Languages,
  Globe2,
  BadgeCheck,
  Eye,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const quickBrowse = [
  {
    name: "Movies",
    icon: Clapperboard,
    href: "#Movies",
    desc: "Blockbusters & cinema",
  },
  {
    name: "Series",
    icon: Tv,
    href: "#Series",
    desc: "Binge-worthy shows",
  },
  {
    name: "Trending",
    icon: TrendingUp,
    href: "#Trending",
    desc: "Hot right now",
  },
  {
    name: "Top Rated",
    icon: Star,
    href: "#Movies",
    desc: "Best audience picks",
  },
  {
    name: "Upcoming",
    icon: CalendarDays,
    href: "#Series",
    desc: "Coming soon",
  },
  {
    name: "Genres",
    icon: Film,
    href: "#Genres",
    desc: "Browse by mood",
  },
];

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

const NavBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [popularSearch, setPopularSearch] = useState([]);
  const [genre, setGenre] = useState([]);

  const [popularLoading, setPopularLoading] = useState(true);
  const [genreLoading, setGenreLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [searchError, setSearchError] = useState("");

  const router = useRouter();

  const [qualitySearch, setQualitySearch] = useState(true);

  const otherContent = searchText.trim().length === 0;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    const getPopularSearches = async () => {
      try {
        setPopularLoading(true);

        const api = await fetch("/api/homePage/trendingMovie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "popular" }),
        });

        const res = await api.json();

        setPopularSearch(res?.res?.results || []);
      } catch (error) {
        console.log("Popular search fetch error:", error);
        setPopularSearch([]);
      } finally {
        setPopularLoading(false);
      }
    };

    getPopularSearches();
  }, []);

  useEffect(() => {
    const getGenre = async () => {
      try {
        setGenreLoading(true);

        const api = await fetch("/api/homePage/genres");
        const res = await api.json();

        setGenre(res?.movieRes?.genres || []);
      } catch (error) {
        console.log("Genre fetch error:", error);
        setGenre([]);
      } finally {
        setGenreLoading(false);
      }
    };

    getGenre();
  }, []);

  useEffect(() => {
    const text = searchText.trim();

    if (!text) {
      setSearching(false);
      setSearchResult([]);
      setSearchError("");
      return;
    }

    const controller = new AbortController();

    const searchTimer = setTimeout(async () => {
      try {
        setSearching(true);
        setSearchError("");

        const api = await fetch("/api/homePage/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        const res = await api.json();

        const rawResults = res?.response?.results || [];

        const finalResults = qualitySearch
          ? rawResults.filter((item) => {
            const hasPoster = Boolean(item?.poster_path);
            const popularityGood = Number(item?.popularity || 0) > 1;
            const voteGood = Number(item?.vote_average || 0) > 3;
            const voteCountGood = Number(item?.vote_count || 0) > 2;

            return hasPoster && popularityGood && voteGood && voteCountGood;
          })
          : rawResults;

        setSearchResult(finalResults);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Search error:", error);
          setSearchError("Something went wrong while searching.");
          setSearchResult([]);
        }
      } finally {
        setSearching(false);
      }
    }, 450);

    return () => {
      clearTimeout(searchTimer);
      controller.abort();
    };
  }, [searchText, qualitySearch]);

  const closeSearch = () => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setSearchText("");
    setSearchResult([]);
    setSearchError("");
  };

  const clearSearch = () => {
    setSearchText("");
    setSearchResult([]);
    setSearchError("");
  };

  const getTitle = (item) => {
    return (
      item?.title ||
      item?.name ||
      item?.original_title ||
      item?.original_name ||
      "Untitled"
    );
  };

  const getDate = (item) => {
    return item?.release_date || item?.first_air_date || "Unknown date";
  };

  const getYear = (date) => {
    if (!date || date === "Unknown date") return "Unknown";
    return date.split("-")[0];
  };

  const getMediaLabel = (item) => {
    if (item?.media_type === "tv") return "TV Series";
    if (item?.media_type === "movie") return "Movie";
    return item?.media_type || "Media";
  };

  const getPosterUrl = (item) => {
    if (!item?.poster_path) return null;
    return `${TMDB_IMAGE_BASE_URL}${item.poster_path}`;
  };

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#09090F]/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-2.5 sm:h-16 sm:px-4 md:h-20 md:gap-3 md:px-8">
          {/* Logo */}
          <div
            onClick={() => {
              router.push("/");
              setMobileMenuOpen(false);
            }}
            className="group flex shrink-0 cursor-pointer items-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-[#7C3AED]/25 blur-xl opacity-0 transition duration-300 group-hover:opacity-100" />

              <Image
                src="/logo.png"
                alt="Astra"
                width={90}
                height={90}
                draggable={false}
                priority
                className="relative h-auto w-[48px] select-none transition-transform duration-300 group-hover:scale-105 min-[380px]:w-[54px] sm:w-[66px] md:w-[90px]"
              />
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden items-center gap-1 md:flex">
            {["Home", "Movies", "Series", "Trending", "Genres"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="rounded-full px-4 py-2 text-sm font-semibold text-white/65 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Search Button */}
          <div className="group/search relative ml-auto flex min-w-0 flex-1 items-center sm:max-w-xl">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#7C3AED]/30 to-[#3B82F6]/30 opacity-0 blur transition duration-300 group-hover/search:opacity-100" />

            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setMobileMenuOpen(false);
              }}
              className="relative flex w-full min-w-0 items-center gap-1.5 rounded-full border border-white/10 bg-[#111827]/90 px-2.5 py-2 text-left transition-all duration-300 hover:border-[#7C3AED]/70 hover:bg-[#151B2B] active:scale-[0.99] sm:gap-2 sm:px-4 md:py-2.5"
            >
              <Search
                size={16}
                className="shrink-0 text-white/45 transition group-hover/search:text-[#7C3AED] sm:size-[17px]"
              />

              <span className="w-full truncate text-xs text-white/35 sm:text-sm md:text-base">
                <span className="sm:hidden">Search...</span>
                <span className="hidden sm:inline">
                  Search movies, series...
                </span>
              </span>

              <div className="hidden rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold text-white/35 lg:block">
                ⌘K
              </div>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button className="hidden h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#111827]/90 text-white/80 transition-all duration-300 hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/15 hover:text-white active:scale-95 lg:flex">
              <Bell size={19} />
            </Button>

            <Button
              onClick={() => {
                router.push("/profile");
                setMobileMenuOpen(false);
              }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#7C3AED]/35 bg-gradient-to-br from-[#7C3AED]/25 to-[#3B82F6]/20 text-white transition-all duration-300 hover:scale-105 hover:border-[#3B82F6]/70 active:scale-95 sm:h-10 sm:w-10 md:h-11 md:w-11"
            >
              <User size={17} strokeWidth={2.5} className="sm:size-[19px]" />
            </Button>

            <Button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#111827]/90 text-white transition hover:bg-white/10 active:scale-95 md:hidden"
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/5 bg-[#09090F]/95 px-3 py-3 backdrop-blur-2xl md:hidden">
            <div className="grid gap-2">
              {["Home", "Movies", "Series", "Trending", "Genres"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-semibold text-white/70 transition hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/15 hover:text-white"
                  >
                    {item}
                  </a>
                )
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[999] flex items-start justify-center px-3 pt-16 sm:items-center sm:px-4 sm:pt-0">
          {/* Background Blur */}
          <div
            onClick={closeSearch}
            className="absolute inset-0 bg-black/75 backdrop-blur-xl"
          />

          {/* Background Glow */}
          <div className="pointer-events-none absolute h-64 w-64 rounded-full bg-[#7C3AED]/25 blur-[100px] sm:h-80 sm:w-80 sm:bg-[#7C3AED]/30 sm:blur-[120px]" />
          <div className="pointer-events-none absolute h-64 w-64 translate-x-20 translate-y-20 rounded-full bg-[#3B82F6]/15 blur-[100px] sm:h-80 sm:w-80 sm:translate-x-32 sm:translate-y-24 sm:bg-[#3B82F6]/20 sm:blur-[120px]" />

          {/* Modal Box */}
          <div className="relative w-full max-w-4xl overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#09090F]/95 shadow-2xl shadow-black/70 backdrop-blur-2xl sm:rounded-[2rem]">
            {/* Accent Line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent opacity-70" />

            {/* Search Input */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.02] px-3 py-2.5 sm:gap-3 sm:px-5 sm:py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/15 sm:h-10 sm:w-10 sm:rounded-2xl">
                {searching ? (
                  <Loader2 size={18} className="animate-spin text-[#A78BFA]" />
                ) : (
                  <Search size={18} className="text-[#A78BFA]" />
                )}
              </div>

              <Input
                autoFocus
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search movies, series, anime..."
                className="w-full min-w-0 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/30 sm:text-lg"
              />

              {searchText && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/45 transition hover:bg-white/10 hover:text-white sm:block"
                >
                  Clear
                </button>
              )}

              {/* Desktop Quality Search Toggle */}
              <button
                type="button"
                onClick={() => setQualitySearch((prev) => !prev)}
                className={`hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition sm:flex ${qualitySearch
                    ? "border-[#7C3AED]/50 bg-[#7C3AED]/15 text-[#C4B5FD] shadow-[0_0_24px_rgba(124,58,237,0.16)]"
                    : "border-white/10 bg-white/[0.04] text-white/45 hover:bg-white/10 hover:text-white"
                  }`}
              >
                {qualitySearch ? (
                  <Sparkles size={13} />
                ) : (
                  <SlidersHorizontal size={13} />
                )}
                {qualitySearch ? "Quality" : "Normal"}
              </button>

              <button
                type="button"
                onClick={closeSearch}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white active:scale-95 sm:h-9 sm:w-9"
              >
                <X size={17} />
              </button>
            </div>

            {/* Mobile Quality Search Toggle */}
            <div className="flex border-b border-white/10 bg-white/[0.015] px-3 py-2 sm:hidden">
              <button
                type="button"
                onClick={() => setQualitySearch((prev) => !prev)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${qualitySearch
                    ? "border-[#7C3AED]/50 bg-[#7C3AED]/15 text-[#C4B5FD]"
                    : "border-white/10 bg-white/[0.04] text-white/50"
                  }`}
              >
                {qualitySearch ? (
                  <Sparkles size={14} />
                ) : (
                  <SlidersHorizontal size={14} />
                )}
                {qualitySearch ? "Quality Search On" : "Normal Search On"}
              </button>
            </div>

            {/* Modal Content */}
            <div className="search-modal-scroll max-h-[55vh] overflow-y-auto p-3 pr-2 sm:max-h-[74vh] sm:p-5 sm:pr-4">
              {otherContent ? (
                <>
                  {/* Quick Browse */}
                  <div className="mb-4 flex items-center justify-between gap-4 sm:mb-5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 sm:text-xs sm:tracking-[0.22em]">
                        Quick Browse
                      </p>
                      <p className="mt-1 text-xs text-white/40 sm:text-sm">
                        Jump directly into your favorite sections.
                      </p>
                    </div>

                    <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/35 sm:block">
                      ESC to close
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {quickBrowse.map((item) => {
                      const Icon = item.icon;

                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          onClick={closeSearch}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/60 hover:bg-[#7C3AED]/15 active:scale-[0.98] sm:rounded-3xl sm:p-4"
                        >
                          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#7C3AED]/10 blur-2xl transition group-hover:bg-[#3B82F6]/20" />

                          <div className="relative mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#7C3AED]/30 to-[#3B82F6]/20 transition duration-300 group-hover:scale-110 group-hover:border-[#7C3AED]/50 sm:mb-4 sm:h-11 sm:w-11 sm:rounded-2xl">
                            <Icon size={18} className="text-white sm:size-5" />
                          </div>

                          <p className="relative text-xs font-bold text-white sm:text-sm">
                            {item.name}
                          </p>

                          <p className="relative mt-1 line-clamp-2 text-[11px] leading-relaxed text-white/40 sm:text-xs">
                            {item.desc}
                          </p>
                        </a>
                      );
                    })}
                  </div>

                  {/* Popular Searches */}
                  <div className="mt-5 sm:mt-7">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10">
                        <Flame size={16} className="text-orange-300" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 sm:text-xs sm:tracking-[0.22em]">
                          Popular Searches
                        </p>
                        <p className="text-xs text-white/35">
                          Trending movies people are watching.
                        </p>
                      </div>
                    </div>

                    {popularLoading ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
                        <Loader2 size={16} className="animate-spin" />
                        Loading popular searches...
                      </div>
                    ) : popularSearch.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {popularSearch.slice(0, 12).map((item) => (
                          <button
                            key={item.id || item.title}
                            type="button"
                            onClick={() =>
                              setSearchText(item.title || item.name || "")
                            }
                            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:-translate-y-0.5 hover:border-[#3B82F6]/60 hover:bg-[#3B82F6]/10 hover:text-white active:scale-95 sm:px-4 sm:py-2 sm:text-sm"
                          >
                            {item.title || item.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                        No popular searches found.
                      </div>
                    )}
                  </div>

                  {/* Genres */}
                  <div className="mt-5 sm:mt-7">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C3AED]/15">
                        <Tag size={16} className="text-[#A78BFA]" />
                      </div>

                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 sm:text-xs sm:tracking-[0.22em]">
                          Genres
                        </p>
                        <p className="text-xs text-white/35">
                          Pick a mood and start exploring.
                        </p>
                      </div>
                    </div>

                    {genreLoading ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
                        <Loader2 size={16} className="animate-spin" />
                        Loading genres...
                      </div>
                    ) : genre.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {genre.slice(0, 16).map((item) => (
                          <button
                            key={item.id || item.name}
                            type="button"
                            onClick={() => setSearchText(item.name || "")}
                            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs font-semibold text-white/55 transition hover:-translate-y-0.5 hover:border-[#7C3AED]/50 hover:bg-white/[0.06] hover:text-white active:scale-95 sm:rounded-2xl sm:py-3 sm:text-sm"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/40">
                        No genres found.
                      </div>
                    )}
                  </div>

                  {/* Search Tip */}
                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#7C3AED]/15 to-[#3B82F6]/10 p-3 sm:mt-7 sm:rounded-3xl sm:p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 sm:h-9 sm:w-9 sm:rounded-2xl">
                        <Search size={15} className="text-white/70 sm:size-4" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Search Tip
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-white/45 sm:text-sm">
                          Use Quality Search for cleaner results. Switch to
                          Normal Search if you want to see every result.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Search Result Header */}
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 sm:text-xs sm:tracking-[0.22em]">
                        Search Results
                      </p>

                      <p className="mt-1 text-xs text-white/40 sm:text-sm">
                        {qualitySearch ? "High-quality matches" : "All matches"}{" "}
                        for{" "}
                        <span className="font-semibold text-white/70">
                          “{searchText}”
                        </span>
                      </p>
                    </div>

                    <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/35 sm:block">
                      {searching
                        ? "Searching..."
                        : `${searchResult.length} found`}
                    </div>
                  </div>

                  {/* Quality Info */}
                  <div
                    className={`mb-4 flex items-center gap-2 rounded-xl border px-3 py-2 text-[11px] font-semibold sm:rounded-2xl sm:px-4 sm:py-3 sm:text-xs ${qualitySearch
                        ? "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#C4B5FD]"
                        : "border-white/10 bg-white/[0.03] text-white/45"
                      }`}
                  >
                    {qualitySearch ? (
                      <Sparkles size={15} />
                    ) : (
                      <SlidersHorizontal size={15} />
                    )}

                    {qualitySearch
                      ? "Quality Search filters out weak results."
                      : "Normal Search shows all results."}
                  </div>

                  {/* Loading State */}
                  {searching && (
                    <div className="grid gap-3">
                      {[1, 2, 3, 4].map((item) => (
                        <div
                          key={item}
                          className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:gap-4 sm:rounded-3xl"
                        >
                          <div className="h-28 w-20 shrink-0 animate-pulse rounded-2xl bg-white/10 sm:h-32 sm:w-24" />

                          <div className="flex flex-1 flex-col gap-3 py-1">
                            <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/10" />
                            <div className="h-3 w-1/3 animate-pulse rounded-full bg-white/10" />
                            <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
                            <div className="h-3 w-4/5 animate-pulse rounded-full bg-white/10" />
                            <div className="mt-auto h-7 w-32 animate-pulse rounded-full bg-white/10 sm:w-40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error State */}
                  {!searching && searchError && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 sm:rounded-3xl sm:p-5">
                      {searchError}
                    </div>
                  )}

                  {/* Empty State */}
                  {!searching && !searchError && searchResult.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center sm:rounded-3xl sm:p-8">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 sm:h-14 sm:w-14">
                        <Search size={22} className="text-white/40 sm:size-6" />
                      </div>

                      <p className="mt-4 text-sm font-bold text-white sm:text-base">
                        {qualitySearch
                          ? "No strong results found"
                          : "No results found"}
                      </p>

                      <p className="mt-1 text-xs text-white/40 sm:text-sm">
                        {qualitySearch
                          ? "Try Normal Search to include weaker results too."
                          : "Try a different movie, series, anime, or genre name."}
                      </p>

                      {qualitySearch && (
                        <button
                          type="button"
                          onClick={() => setQualitySearch(false)}
                          className="mt-5 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/15 px-5 py-2 text-sm font-bold text-[#C4B5FD] transition hover:bg-[#7C3AED]/25"
                        >
                          Switch to Normal Search
                        </button>
                      )}
                    </div>
                  )}

                  {/* Results */}
                  {!searching && !searchError && searchResult.length > 0 && (
                    <div className="grid gap-3">
                      {searchResult.slice(0, 20).map((item) => {
                        const title = getTitle(item);
                        const posterUrl = getPosterUrl(item);

                        return (
                          <button
                            key={`${item.media_type || "media"}-${item.id}`}
                            type="button"
                            onClick={() => {
                              if (item.media_type === "movie") {
                                router.push(`/details/movies/${item.id}`);
                              } else {
                                router.push(`/details/series/${item.id}`);
                              }

                              closeSearch();
                            }}
                            className="group flex cursor-pointer gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#7C3AED]/50 hover:bg-white/[0.06] active:scale-[0.99] sm:gap-4 sm:rounded-3xl"
                          >
                            {/* Poster */}
                            <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] sm:h-32 sm:w-24">
                              {posterUrl ? (
                                <Image
                                  src={posterUrl}
                                  alt={title}
                                  fill
                                  sizes="96px"
                                  className="object-cover transition duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Film size={26} className="text-white/30" />
                                </div>
                              )}

                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-[10px] font-bold uppercase tracking-wide text-white/75">
                                  {getMediaLabel(item)}
                                </p>
                              </div>
                            </div>

                            {/* Details */}
                            <div className="min-w-0 flex-1 py-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="line-clamp-1 text-sm font-bold text-white sm:text-base">
                                  {title}
                                </p>

                                {item?.adult && (
                                  <span className="rounded-full border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-200">
                                    Adult
                                  </span>
                                )}

                                {item?.softcore && (
                                  <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-200">
                                    Softcore
                                  </span>
                                )}

                                {!item?.poster_path && (
                                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-bold text-white/35">
                                    No Poster
                                  </span>
                                )}
                              </div>

                              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/45">
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                                  {getYear(getDate(item))}
                                </span>

                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                                  {getMediaLabel(item)}
                                </span>

                                <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 text-yellow-200">
                                  <Star size={12} />
                                  {Number(item?.vote_average || 0).toFixed(1)}
                                </span>

                                <span className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 min-[420px]:inline-flex">
                                  <Eye size={12} />
                                  {item?.vote_count || 0}
                                </span>
                              </div>

                              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/45 sm:text-sm">
                                {item?.overview || "No overview available."}
                              </p>

                              <div className="mt-3 hidden flex-wrap gap-2 text-[11px] text-white/40 sm:flex">
                                {item?.original_language && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1">
                                    <Languages size={12} />
                                    {item.original_language.toUpperCase()}
                                  </span>
                                )}

                                {item?.origin_country?.length > 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1">
                                    <Globe2 size={12} />
                                    {item.origin_country.join(", ")}
                                  </span>
                                )}

                                {item?.popularity !== undefined && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1">
                                    <TrendingUp size={12} />
                                    {Number(item.popularity).toFixed(1)}{" "}
                                    popularity
                                  </span>
                                )}

                                {item?.genre_ids?.length > 0 && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2 py-1">
                                    <BadgeCheck size={12} />
                                    {item.genre_ids.length} genres
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;