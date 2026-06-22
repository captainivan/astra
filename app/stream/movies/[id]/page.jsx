"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Clock,
  CalendarDays,
  Globe2,
  Film,
  Loader2,
  Play,
  Server,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Building2,
  Radio,
  AlertCircle,
  Info,
  CheckCircle2,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import NavBar from "@/app/components/NavBar";

const IMG_780 = "https://image.tmdb.org/t/p/w780";
const IMG_500 = "https://image.tmdb.org/t/p/w500";
const IMG_342 = "https://image.tmdb.org/t/p/w342";
const IMG_185 = "https://image.tmdb.org/t/p/w185";

const getImg = (path, size = "w780") => {
  if (!path) return null;

  if (size === "w500") return `${IMG_500}${path}`;
  if (size === "w342") return `${IMG_342}${path}`;
  if (size === "w185") return `${IMG_185}${path}`;

  return `${IMG_780}${path}`;
};

const formatRuntime = (minutes) => {
  if (!minutes) return "N/A";

  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (!h) return `${m}m`;
  return `${h}h ${m}m`;
};

const getYear = (date) => {
  if (!date) return "Unknown";
  return date.split("-")[0];
};

const InfoPill = ({ icon: Icon, label, value }) => {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Icon size={14} className="shrink-0 text-[#A78BFA]" />

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
            {label}
          </p>

          <p className="truncate text-xs font-bold text-white/75">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ServerButton = ({ server, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-300 active:scale-[0.98] ${active
        ? "border-[#7C3AED]/60 bg-[#7C3AED]/15 text-white shadow-[0_0_24px_rgba(124,58,237,0.16)]"
        : "border-white/10 bg-white/[0.035] text-white/60 hover:border-[#7C3AED]/45 hover:bg-white/[0.06] hover:text-white"
        }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-[#7C3AED]/25" : "bg-white/[0.06]"
            }`}
        >
          <Server
            size={16}
            className={active ? "text-[#C4B5FD]" : "text-white/55"}
          />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-black">{server.name}</p>
          <p className="truncate text-xs text-white/35">{server.group}</p>
        </div>
      </div>

      {active ? (
        <CheckCircle2 size={16} className="shrink-0 text-[#C4B5FD]" />
      ) : server.recommended ? (
        <span className="shrink-0 rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/15 px-2 py-1 text-[10px] font-black text-[#C4B5FD]">
          Best
        </span>
      ) : null}
    </button>
  );
};

const StudioCard = ({ company }) => {
  const logo = getImg(company?.logo_path, "w185");

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#7C3AED]/40 hover:bg-white/[0.055]">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
        {logo ? (
          <Image
            src={logo}
            alt={company?.name || "Studio"}
            fill
            sizes="40px"
            className="object-contain p-1.5"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 size={16} className="text-black/40" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-bold text-white/75">
          {company?.name || "Unknown Studio"}
        </p>

        <p className="text-xs text-white/35">
          {company?.origin_country || "Unknown"}
        </p>
      </div>
    </div>
  );
};

const MovieCard = ({ movie, onClick }) => {
  const poster = getImg(movie?.poster_path, "w342");

  return (
    <button
      type="button"
      onClick={onClick}
      className=" cursor-pointer group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] text-left transition hover:-translate-y-1 hover:border-[#7C3AED]/45 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/[0.04]">
        {poster ? (
          <Image
            src={poster}
            alt={movie?.title || "Movie"}
            fill
            sizes="(max-width: 640px) 45vw, 170px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Film size={30} className="text-white/25" />
          </div>
        )}

        <div className="absolute right-2 top-2 rounded-full border border-black/20 bg-black/60 px-2 py-1 text-[10px] font-black text-yellow-200 backdrop-blur-md">
          ★ {Number(movie?.vote_average || 0).toFixed(1)}
        </div>
      </div>

      <div className="p-3">
        <p className="line-clamp-1 text-sm font-black text-white">
          {movie?.title || "Untitled"}
        </p>

        <p className="mt-1 text-xs font-semibold text-white/35">
          {getYear(movie?.release_date)}
        </p>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/40">
          {movie?.overview || "No overview available."}
        </p>
      </div>
    </button>
  );
};

const MovieSection = ({ title, subtitle, movies, onMovieClick }) => {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
            {subtitle}
          </p>

          <h2 className="text-lg font-black text-white">{title}</h2>
        </div>

        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/35">
          {movies?.length || 0}
        </span>
      </div>

      {movies?.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.slice(0, 10).map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => onMovieClick(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/40">
          No movies found in this section.
        </div>
      )}
    </div>
  );
};

const ReviewSection = ({ reviews }) => {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageCircle size={17} className="text-[#C4B5FD]" />
          <h2 className="text-lg font-black text-white">Reviews</h2>
        </div>

        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/35">
          {reviews?.length || 0}
        </span>
      </div>

      {reviews?.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {reviews.slice(0, 4).map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-black text-white">
                    {review.author || "Anonymous"}
                  </p>

                  <p className="text-xs text-white/35">
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString()
                      : "Review"}
                  </p>
                </div>

                {review.author_details?.rating ? (
                  <span className="shrink-0 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 text-xs font-black text-yellow-200">
                    ★ {review.author_details.rating}
                  </span>
                ) : null}
              </div>

              <p className="line-clamp-5 text-sm leading-6 text-white/50">
                {review.content || "No review content."}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <ThumbsUp size={16} className="text-white/45" />
            </div>

            <div>
              <p className="text-sm font-bold text-white/70">No reviews yet</p>
              <p className="mt-1 text-xs leading-5 text-white/38">
                Reviews are not available for this movie right now.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const [streamData, setStreamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [serverMenuOpen, setServerMenuOpen] = useState(false);
  const [activeServerId, setActiveServerId] = useState("direct-vidsrc");

  const movieId = params?.id;

  const servers = useMemo(() => {
    if (!movieId) return [];

    const directVidsrc = {
      id: "direct-vidsrc",
      name: "Vidsrc Direct",
      group: "Recommended Server",
      url: `https://vidsrc-embed.ru/embed/movie/${movieId}`,
      recommended: true,
    };

    const ezVidServerApi = [
      { provider: "vidsrc", recommended: true },
      { provider: "vidrock" },
      { provider: "vidzee" },
      { provider: "icefy" },
      { provider: "vidlink" },
      { provider: "vidnest" },
      { provider: "vixsrc" },
      { provider: "popr" },
    ];

    const ezServers = ezVidServerApi.map((item) => ({
      id: `ez-${item.provider}`,
      name: `EZVid ${item.provider}`,
      group: item.recommended ? "Recommended Server" : "EZVid Server",
      url: `https://ezvidapi.com/embed/movie/${movieId}?provider=${item.provider}`,
      recommended: Boolean(item.recommended),
    }));

    const superEmbed = {
      id: "superembed",
      name: "MultiEmbed",
      group: "Other Server",
      url: `https://multiembed.mov/?video_id=${movieId}&tmdb=1`,
      recommended: false,
    };

    return [directVidsrc, ...ezServers, superEmbed];
  }, [movieId]);

  const activeServer = useMemo(() => {
    return servers.find((server) => server.id === activeServerId) || servers[0];
  }, [servers, activeServerId]);

  const recommendedServers = useMemo(() => {
    return servers.filter((server) => server.recommended);
  }, [servers]);

  useEffect(() => {
    const getMovieData = async () => {
      try {
        setLoading(true);
        setError("");

        const api = await fetch("/api/streamDetails/movie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: movieId,
          }),
        });

        const data = await api.json();

        if (!api.ok) {
          throw new Error(data?.message || "Failed to load movie data");
        }

        setStreamData(data);
      } catch (err) {
        console.log(err);
        setError("Unable to load streaming details.");
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      getMovieData();
    }
  }, [movieId]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("History") || "[]");

    const movieData = {
      movie: params.id,
    };

    const alreadyExists = history.some((item) => item.movie === params.id);

    if (!alreadyExists) {
      localStorage.setItem("History", JSON.stringify([...history, movieData]));
    }
  }, [params.id]);

  const details = streamData?.movieStreamRes || {};
  const similarMovies = streamData?.simillarMovieRes?.results || [];
  const recommendedMovies = streamData?.recommendedMovieRes?.results || [];
  const reviews = streamData?.reviewMoviesRes?.results || [];

  const poster = getImg(details?.poster_path, "w500");

  const goToMovie = (id) => {
    if (!id) return;

    router.push(`/details/movies/${id}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#09090F] text-white">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/40">
            <Loader2
              size={34}
              className="mx-auto animate-spin text-[#A78BFA]"
            />

            <p className="mt-4 text-sm font-bold text-white/70">
              Loading stream...
            </p>

            <p className="mt-1 text-xs text-white/35">
              Preparing player and movie details.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#09090F] text-white">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-sm rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6 text-center">
            <AlertCircle size={34} className="mx-auto text-red-200" />

            <p className="mt-4 font-bold text-red-200">Stream not found</p>

            <p className="mt-2 text-sm text-red-100/60">{error}</p>

            <button
              type="button"
              onClick={() => router.back()}
              className="mt-5 rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white transition hover:bg-white/15"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#09090F] text-white">
      <NavBar />
      <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-4 py-2 text-xs font-bold text-[#C4B5FD]">
            Now Streaming
          </div>
        </div>

        <div className="space-y-5">
          {/* 1. VIDEO PLAYER */}
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#0D0D16] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/15">
                  <Play size={16} className="text-[#C4B5FD]" />
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-black text-white">
                    {activeServer?.name || "Server"}
                  </p>
                  <p className="line-clamp-1 text-xs text-white/35">
                    {activeServer?.group || "Streaming server"}
                  </p>
                </div>
              </div>

              {activeServer?.recommended ? (
                <span className="hidden rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/15 px-3 py-1 text-[10px] font-black text-[#C4B5FD] sm:block">
                  Recommended
                </span>
              ) : (
                <span className="hidden rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-black text-white/40 sm:block">
                  Server
                </span>
              )}
            </div>

            <div className="relative aspect-video w-full bg-black">
              {activeServer?.url ? (
                <iframe
                  key={activeServer.url}
                  src={activeServer.url}
                  title={activeServer.name}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen={true}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm font-bold text-white/40">
                    No server selected
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. WARNING */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
                <Info size={16} className="text-white/50" />
              </div>

              <p className="text-xs leading-5 text-white/45">
                If the active server does not load, open Active Server and
                choose another available server. Some servers may take a few
                seconds to start.
              </p>
            </div>
          </div>

          {/* 3. SERVERS */}
          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <div className="relative rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                Active Server
              </p>

              <button
                type="button"
                onClick={() => setServerMenuOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#7C3AED]/40 bg-[#7C3AED]/15 px-4 py-3 text-left transition hover:bg-[#7C3AED]/20"
              >
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-black text-white">
                    {activeServer?.name || "Select server"}
                  </p>

                  <p className="line-clamp-1 text-xs text-[#C4B5FD]/70">
                    {activeServer?.group || "Server"}
                  </p>
                </div>

                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[#C4B5FD] transition ${serverMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {serverMenuOpen && (
                <div className="absolute left-4 right-4 top-[105px] z-30 max-h-[330px] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0B12] p-2 shadow-2xl shadow-black/70">
                  {servers.map((server) => (
                    <button
                      key={server.id}
                      type="button"
                      onClick={() => {
                        setActiveServerId(server.id);
                        setServerMenuOpen(false);
                      }}
                      className={`mb-2 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition last:mb-0 ${activeServer?.id === server.id
                        ? "bg-[#7C3AED]/20 text-white"
                        : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                        }`}
                    >
                      <div className="min-w-0">
                        <span className="block truncate font-bold">
                          {server.name}
                        </span>

                        <span className="block truncate text-[11px] text-white/35">
                          {server.group}
                        </span>
                      </div>

                      {server.recommended ? (
                        <Sparkles
                          size={13}
                          className="shrink-0 text-[#C4B5FD]"
                        />
                      ) : activeServer?.id === server.id ? (
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-[#C4B5FD]"
                        />
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck size={17} className="text-[#C4B5FD]" />
                <h2 className="text-lg font-black text-white">Recommended</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {recommendedServers.map((server) => (
                  <ServerButton
                    key={server.id}
                    server={server}
                    active={activeServer?.id === server.id}
                    onClick={() => setActiveServerId(server.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 4. MOVIE DETAILS */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4 shadow-2xl shadow-black/25">
            <div className="grid min-w-0 gap-4 sm:grid-cols-[110px_1fr]">
              <div className="relative mx-auto aspect-[2/3] w-[105px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/40 sm:mx-0">
                {poster ? (
                  <Image
                    src={poster}
                    alt={details?.title || "Movie poster"}
                    fill
                    priority
                    sizes="110px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Film size={28} className="text-white/25" />
                  </div>
                )}
              </div>

              <div className="min-w-0 text-center sm:text-left">
                <div className="mb-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {details?.genres?.slice(0, 4).map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/15 px-3 py-1 text-[11px] font-bold text-[#C4B5FD]"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <h1 className="line-clamp-2 break-words text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {details?.title || "Movie"}
                </h1>

                {details?.original_title &&
                  details.original_title !== details.title && (
                    <p className="mt-1 line-clamp-1 text-sm font-semibold text-white/40">
                      {details.original_title}
                    </p>
                  )}

                {details?.tagline && (
                  <p className="mt-2 text-sm font-semibold italic text-[#C4B5FD]">
                    “{details.tagline}”
                  </p>
                )}

                <p className="mx-auto mt-3 max-w-3xl text-sm leading-6 text-white/55 sm:mx-0">
                  {details?.overview || "No overview available."}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <InfoPill
                    icon={Star}
                    label="Rating"
                    value={Number(details?.vote_average || 0).toFixed(1)}
                  />
                  <InfoPill
                    icon={Clock}
                    label="Runtime"
                    value={formatRuntime(details?.runtime)}
                  />
                  <InfoPill
                    icon={CalendarDays}
                    label="Year"
                    value={getYear(details?.release_date)}
                  />
                  <InfoPill
                    icon={Globe2}
                    label="Country"
                    value={details?.origin_country?.join(", ") || "N/A"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. REVIEWS */}
          <ReviewSection reviews={reviews} />


          {/* 7. RECOMMENDED MOVIES */}
          <MovieSection
            title="Recommended Movies"
            subtitle="You may also like"
            movies={recommendedMovies}
            onMovieClick={goToMovie}
          />

          {/* 6. SIMILAR MOVIES */}
          <MovieSection
            title="Similar Movies"
            subtitle="More like this"
            movies={similarMovies}
            onMovieClick={goToMovie}
          />

          {/* 8. STUDIOS */}
          <div className="min-w-0 rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
            <div className="mb-4 flex items-center gap-2">
              <Building2 size={17} className="text-[#C4B5FD]" />
              <h2 className="text-lg font-black text-white">Studios</h2>
            </div>

            {details?.production_companies?.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {details.production_companies.slice(0, 6).map((company) => (
                  <StudioCard key={company.id} company={company} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/40">No studio data found.</p>
            )}
          </div>

          {/* 9. STREAM INFO */}
          <div className="min-w-0 rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
            <div className="mb-4 flex items-center gap-2">
              <Radio size={17} className="text-[#93C5FD]" />
              <h2 className="text-lg font-black text-white">Stream Info</h2>
            </div>

            <div className="grid gap-3 text-xs text-white/45 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <span>Status</span>
                <p className="mt-1 font-bold text-white/70">
                  {details?.status || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <span>Language</span>
                <p className="mt-1 font-bold text-white/70">
                  {details?.original_language?.toUpperCase() || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <span>IMDB</span>
                <p className="mt-1 font-bold text-white/70">
                  {details?.imdb_id || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <span>Servers</span>
                <p className="mt-1 font-bold text-white/70">
                  {servers.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Page;