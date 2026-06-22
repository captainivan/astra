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
  Languages,
  DollarSign,
  Film,
  Users,
  Tags,
  ImageIcon,
  Heart,
  Share2,
  Loader2,
  Award,
  Building2,
  BadgeCheck,
  Sparkles,
  Play,
  X,
  ExternalLink,
  Tv,
} from "lucide-react";
import NavBar from "@/app/components/NavBar";

const IMG_ORIGINAL = "https://image.tmdb.org/t/p/original";
const IMG_780 = "https://image.tmdb.org/t/p/w780";
const IMG_500 = "https://image.tmdb.org/t/p/w500";
const IMG_300 = "https://image.tmdb.org/t/p/w300";
const IMG_185 = "https://image.tmdb.org/t/p/w185";

const getImg = (path, size = "w780") => {
  if (!path) return null;

  if (size === "original") return `${IMG_ORIGINAL}${path}`;
  if (size === "w500") return `${IMG_500}${path}`;
  if (size === "w300") return `${IMG_300}${path}`;
  if (size === "w185") return `${IMG_185}${path}`;

  return `${IMG_780}${path}`;
};

const formatMoney = (amount) => {
  if (!amount || amount <= 0) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
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

const getYoutubeEmbed = (video) => {
  if (!video?.key) return null;

  if (video.site === "YouTube") {
    return `https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`;
  }

  return null;
};

const SmallInfoCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#7C3AED]/40 hover:bg-white/[0.055]">

      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C3AED]/15">
        <Icon size={15} className="text-[#C4B5FD]" />
      </div>

      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-white/80">{value}</p>
    </div>
  );
};

const PersonCard = ({ person, role }) => {
  const profile = getImg(person?.profile_path, "w300");

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:bg-white/[0.055]">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/[0.04]">
        {profile ? (
          <Image
            src={profile}
            alt={person?.name || "Person"}
            fill
            sizes="(max-width: 640px) 33vw, 140px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Users size={26} className="text-white/25" />
          </div>
        )}
      </div>

      <div className="p-2.5">
        <p className="line-clamp-1 text-xs font-bold text-white">
          {person?.name || "Unknown"}
        </p>

        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/40">
          {role || "Cast"}
        </p>
      </div>
    </div>
  );
};

const CrewCard = ({ person }) => {
  const profile = getImg(person?.profile_path, "w185");

  return (
    <div className="flex min-w-0 gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:-translate-y-0.5 hover:border-[#7C3AED]/40 hover:bg-white/[0.055]">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white/[0.05]">
        {profile ? (
          <Image
            src={profile}
            alt={person?.name || "Crew"}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Users size={20} className="text-white/25" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-bold text-white">
          {person?.name || "Unknown"}
        </p>

        <p className="mt-1 line-clamp-1 text-xs font-semibold text-[#C4B5FD]/85">
          {person?.job || "Crew"}
        </p>

        <p className="line-clamp-1 text-xs text-white/35">
          {person?.department || "Department"}
        </p>
      </div>
    </div>
  );
};

const ProviderCard = ({ provider }) => {
  const logo = getImg(provider?.logo_path, "w185");

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#3B82F6]/40 hover:bg-white/[0.055]">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white">
        {logo ? (
          <Image
            src={logo}
            alt={provider?.provider_name || "Provider"}
            fill
            sizes="44px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Tv size={18} className="text-black/40" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-bold text-white/80">
          {provider?.provider_name || "Provider"}
        </p>

        <p className="text-xs text-white/35">
          #{provider?.display_priority ?? "N/A"}
        </p>
      </div>
    </div>
  );
};

const Page = () => {
  const params = useParams();
  const router = useRouter();

  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [heart, setHeart] = useState(false);

  useEffect(() => {
    const getMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const api = await fetch("/api/details/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: params.id,
          }),
        });

        const res = await api.json();

        if (!api.ok) {
          throw new Error(res?.message || "Failed to fetch movie details");
        }

        setMovieData(res);
      } catch (err) {
        console.log(err);
        setError("Unable to load movie details.");
      } finally {
        setLoading(false);
      }
    };

    if (params?.id) {
      getMovieDetails();
    }
  }, [params?.id]);


  useEffect(() => {
    const heartedData = JSON.parse(localStorage.getItem("Hearted") || "[]");

    const alreadyHearted = heartedData.some((item) => item.id == params.id);

    if (alreadyHearted) {
      setHeart(true);
    }

  }, [])

  const handleHeart = (id) => {
    const heartedData = JSON.parse(localStorage.getItem("Hearted") || "[]");

    const alreadyHearted = heartedData.some((item) => item.id === id);

    let updatedHearted;

    if (alreadyHearted) {
      updatedHearted = heartedData.filter((item) => item.id !== id);
      setHeart(false);
    } else {
      updatedHearted = [...heartedData, { type: "movie", id }];
      setHeart(true);
    }

    localStorage.setItem("Hearted", JSON.stringify(updatedHearted));

    console.log("Updated hearted data:", updatedHearted);
  };

  const details = movieData?.getDetailsApiRes;
  const credits = movieData?.getCreditsApiRes;
  const keywords = movieData?.getKeyWordsApiRes?.keywords || [];
  const altTitles = movieData?.getAlterNativeDetailsApiRes?.titles || [];
  const images = movieData?.getImagesApiRes;

  const videos =
    movieData?.getVideosApiRes?.results ||
    movieData?.videos?.results ||
    movieData?.getVideos?.results ||
    [];

  const watchProviderResults =
    movieData?.getWatchProvidersApiRes?.results ||
    movieData?.getWatchProviderApiRes?.results ||
    movieData?.watchProviders?.results ||
    movieData?.providers?.results ||
    {};

  const selectedProviderCountry =
    watchProviderResults?.IN ||
    watchProviderResults?.US ||
    watchProviderResults?.GB ||
    Object.values(watchProviderResults || {})?.[0] ||
    null;

  const flatrateProviders = selectedProviderCountry?.flatrate || [];
  const rentProviders = selectedProviderCountry?.rent || [];
  const buyProviders = selectedProviderCountry?.buy || [];

  const allProviders = [
    ...flatrateProviders.map((p) => ({ ...p, type: "Stream" })),
    ...rentProviders.map((p) => ({ ...p, type: "Rent" })),
    ...buyProviders.map((p) => ({ ...p, type: "Buy" })),
  ].filter(
    (provider, index, self) =>
      index ===
      self.findIndex((p) => p.provider_id === provider.provider_id)
  );

  const providerLink = selectedProviderCountry?.link || details?.homepage || "";

  const trailer = useMemo(() => {
    return (
      videos.find(
        (video) =>
          video?.site === "YouTube" &&
          video?.type === "Trailer" &&
          video?.key
      ) ||
      videos.find((video) => video?.site === "YouTube" && video?.key) ||
      null
    );
  }, [videos]);

  const trailerEmbedUrl = getYoutubeEmbed(trailer);

  const cast = credits?.cast || [];
  const crew = credits?.crew || [];

  const director = useMemo(() => {
    return crew.find((person) => person.job === "Director");
  }, [crew]);

  const importantCrew = useMemo(() => {
    const jobs = [
      "Director",
      "Screenplay",
      "Original Music Composer",
      "Producer",
      "Editor",
      "Art Direction",
      "Director of Photography",
      "Animation Director",
      "Character Designer",
    ];

    return crew
      .filter((person) => jobs.includes(person.job))
      .filter(
        (person, index, self) =>
          index ===
          self.findIndex((p) => p.id === person.id && p.job === person.job)
      )
      .slice(0, 10);
  }, [crew]);

  const gallery = useMemo(() => {
    const backdrops = images?.backdrops || [];
    const posters = images?.posters || [];

    return [...backdrops, ...posters]
      .filter((img) => img?.file_path)
      .slice(0, 8);
  }, [images]);

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#09090F] text-white">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center">
            <Loader2
              size={34}
              className="mx-auto animate-spin text-[#A78BFA]"
            />
            <p className="mt-4 text-sm font-bold text-white/70">
              Loading movie details...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !details) {
    return (
      <main className="min-h-screen overflow-x-hidden bg-[#09090F] text-white">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-sm rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="font-bold text-red-200">Movie not found</p>
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

  const poster = getImg(details.poster_path, "w500");
  const backdrop = getImg(details.backdrop_path, "w780");

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#09090F] text-white">
      <NavBar />
      {/* Trailer Modal */}
      {trailerOpen && trailerEmbedUrl && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-x-hidden bg-black/80 px-4 backdrop-blur-xl">
          <div
            className="absolute inset-0"
            onClick={() => setTrailerOpen(false)}
          />

          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#09090F] shadow-2xl shadow-black/70">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <p className="line-clamp-1 text-sm font-bold text-white/80">
                {trailer?.name || `${details.title} Trailer`}
              </p>

              <button
                type="button"
                onClick={() => setTrailerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={trailerEmbedUrl}
                title={trailer?.name || "Trailer"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[230px] w-full overflow-hidden sm:h-[300px] lg:h-[360px]">
          {backdrop ? (
            <Image
              src={backdrop}
              alt={details.title}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#111827] to-[#09090F]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-[#09090F]/10 via-[#09090F]/55 to-[#09090F]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090F] via-[#09090F]/65 to-transparent" />

          <button
            type="button"
            onClick={() => router.push("/")}
            className="absolute left-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm font-bold text-white/75 backdrop-blur-xl transition hover:bg-white/10"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        <div className="relative mx-auto -mt-20 grid max-w-6xl gap-5 px-4 pb-8 sm:px-6 lg:grid-cols-[165px_1fr] lg:px-8">
          {/* FIXED POSTER */}
          <div className="relative mx-auto aspect-[2/3] w-[150px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/60 sm:w-[165px] lg:mx-0">
            {poster ? (
              <Image
                src={poster}
                alt={details.title}
                fill
                priority
                sizes="165px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Film size={36} className="text-white/25" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 pt-1 text-center lg:text-left">
            <div className="mb-3 flex max-w-full flex-wrap justify-center gap-2 lg:justify-start">
              {details.genres?.slice(0, 4).map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/15 px-3 py-1 text-[11px] font-bold text-[#C4B5FD]"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <h1 className="line-clamp-2 break-words text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {details.title}
            </h1>

            {details.original_title && details.original_title !== details.title && (
              <p className="mt-1 line-clamp-1 text-sm font-semibold text-white/40">
                {details.original_title}
              </p>
            )}

            {details.tagline && (
              <p className="mt-2 text-sm font-semibold italic text-[#C4B5FD] sm:text-base">
                “{details.tagline}”
              </p>
            )}

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-white/55 lg:mx-0">
              {details.overview || "No overview available."}
            </p>

            <div className="mt-5 flex max-w-full flex-wrap justify-center gap-2 lg:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1.5 text-xs font-bold text-yellow-200">
                <Star size={13} fill="currentColor" />
                {Number(details.vote_average || 0).toFixed(1)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/55">
                <Clock size={13} />
                {formatRuntime(details.runtime)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/55">
                <CalendarDays size={13} />
                {getYear(details.release_date)}
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-white/55">
                <Globe2 size={13} />
                {details.origin_country?.join(", ") || "N/A"}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a
                onClick={() => { router.push(`/stream/movies/${details.id}`) }}
                className={" cursor-pointer inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black shadow-lg transition active:scale-95 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-[#7C3AED]/20 hover:scale-105"}
              >
                <ExternalLink size={16} />
                Watch Now
              </a>

              <button
                type="button"
                onClick={() => {
                  if (trailerEmbedUrl) setTrailerOpen(true);
                }}
                disabled={!trailerEmbedUrl}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-black transition active:scale-95 ${trailerEmbedUrl
                  ? "border border-white/10 bg-white/[0.08] text-white hover:bg-white/[0.12]"
                  : "cursor-not-allowed border border-white/10 bg-white/[0.03] text-white/30"
                  }`}
              >
                <Play size={16} fill="currentColor" />
                {trailerEmbedUrl ? "Trailer" : "No Trailer"}
              </button>

              <button
                type="button"
                onClick={() => handleHeart(details.id)}
                className="flex cursor-pointer h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/65 transition hover:bg-white/10"
              >
                <Heart color={heart ? "red" : "white"} fill={heart ? "red" : "none"} size={17} />
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/65 transition hover:bg-white/10"
              >
                <Share2 size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid min-w-0 gap-5 lg:grid-cols-[1fr_300px]">
          {/* Left */}
          <div className="min-w-0 space-y-5">
            {/* Stats */}
            <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
              <SmallInfoCard
                icon={Users}
                label="Votes"
                value={details.vote_count?.toLocaleString() || "0"}
              />
              <SmallInfoCard
                icon={Languages}
                label="Language"
                value={details.original_language?.toUpperCase() || "N/A"}
              />
              <SmallInfoCard
                icon={DollarSign}
                label="Budget"
                value={formatMoney(details.budget)}
              />
              <SmallInfoCard
                icon={Award}
                label="Revenue"
                value={formatMoney(details.revenue)}
              />
            </div>

            {/* Watch Providers */}
            {allProviders.length > 0 && (
              <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                      Watch Providers
                    </p>
                    <h2 className="text-xl font-black text-white">
                      Available On
                    </h2>
                  </div>

                  <span className="shrink-0 rounded-full bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/35">
                    {allProviders.length}
                  </span>
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {allProviders.slice(0, 9).map((provider) => (
                    <ProviderCard
                      key={`${provider.provider_id}-${provider.type}`}
                      provider={provider}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {cast.length > 0 && (
              <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                      Cast
                    </p>
                    <h2 className="text-xl font-black text-white">Main Cast</h2>
                  </div>

                  <span className="shrink-0 rounded-full bg-white/[0.05] px-3 py-1 text-xs font-bold text-white/35">
                    {cast.length}
                  </span>
                </div>

                <div className="grid min-w-0 grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {cast.slice(0, 12).map((person) => (
                    <PersonCard
                      key={`${person.id}-${person.cast_id}`}
                      person={person}
                      role={person.character || "Cast"}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Crew with images */}
            {importantCrew.length > 0 && (
              <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Crew
                </p>

                <h2 className="mb-4 text-xl font-black text-white">
                  Behind The Film
                </h2>

                <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                  {importantCrew.map((person) => (
                    <CrewCard
                      key={`${person.id}-${person.job}`}
                      person={person}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <ImageIcon size={18} className="text-[#93C5FD]" />
                  <h2 className="text-xl font-black text-white">Gallery</h2>
                </div>

                <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3">
                  {gallery.map((img) => (
                    <div
                      key={img.file_path}
                      className="relative aspect-video min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
                    >
                      <Image
                        src={getImg(img.file_path, "w500")}
                        alt="Movie gallery"
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="min-w-0 space-y-5">
            {/* Director */}
            <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#7C3AED]/15">
                  <BadgeCheck size={17} className="text-[#C4B5FD]" />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                    Director
                  </p>

                  <p className="line-clamp-1 text-base font-black text-white">
                    {director?.name || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Studios */}
            {details.production_companies?.length > 0 && (
              <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Building2 size={17} className="text-white/60" />
                  <h2 className="text-lg font-black text-white">Studios</h2>
                </div>

                <div className="space-y-2">
                  {details.production_companies.slice(0, 6).map((company) => (
                    <div
                      key={company.id}
                      className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3"
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
                        {company.logo_path ? (
                          <Image
                            src={getImg(company.logo_path, "w185")}
                            alt={company.name}
                            fill
                            sizes="40px"
                            className="object-contain p-1.5"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Building2 size={17} className="text-black/40" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="line-clamp-1 text-sm font-bold text-white/75">
                          {company.name}
                        </p>

                        <p className="mt-0.5 text-xs text-white/35">
                          {company.origin_country || "Unknown"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Tags size={17} className="text-[#C4B5FD]" />
                  <h2 className="text-lg font-black text-white">Keywords</h2>
                </div>

                <div className="flex max-w-full flex-wrap gap-2">
                  {keywords.slice(0, 16).map((keyword) => (
                    <span
                      key={keyword.id}
                      className="max-w-full rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-white/50"
                    >
                      {keyword.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Alternative titles */}
            {altTitles.length > 0 && (
              <div className="min-w-0 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles size={17} className="text-[#93C5FD]" />
                  <h2 className="text-lg font-black text-white">
                    Also Known As
                  </h2>
                </div>

                <div className="space-y-2">
                  {altTitles.slice(0, 6).map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] px-3 py-2"
                    >
                      <p className="line-clamp-1 text-sm font-bold text-white/65">
                        {item.title}
                      </p>

                      <p className="text-xs text-white/30">
                        {item.iso_3166_1}
                        {item.type ? ` • ${item.type}` : ""}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="min-w-0 rounded-3xl border border-white/10 bg-gradient-to-br from-[#7C3AED]/12 to-[#3B82F6]/10 p-4">
              <p className="text-sm font-black text-white">Movie Meta</p>

              <div className="mt-3 space-y-2 text-xs text-white/45">
                <div className="flex justify-between gap-3">
                  <span>Status</span>
                  <span className="font-bold text-white/70">
                    {details.status || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>Adult</span>
                  <span className="font-bold text-white/70">
                    {details.adult ? "Yes" : "No"}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span>IMDB</span>
                  <span className="font-bold text-white/70">
                    {details.imdb_id || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default Page;