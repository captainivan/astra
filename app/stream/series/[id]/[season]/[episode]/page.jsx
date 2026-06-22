"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  Star,
  Clock,
  CalendarDays,
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
  Layers,
  Tv,
  Clapperboard,
  UserRound,
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

const getYear = (date) => {
  if (!date) return "Unknown";
  return date.split("-")[0];
};

const formatRuntime = (runtimeArray) => {
  if (!runtimeArray || runtimeArray.length === 0) return "N/A";

  const runtime = runtimeArray[0];

  if (!runtime) return "N/A";
  return `${runtime}m`;
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
      className={`group flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-300 active:scale-[0.98] ${
        active
          ? "border-[#7C3AED]/60 bg-[#7C3AED]/15 text-white shadow-[0_0_24px_rgba(124,58,237,0.16)]"
          : "border-white/10 bg-white/[0.035] text-white/60 hover:border-[#7C3AED]/45 hover:bg-white/[0.06] hover:text-white"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            active ? "bg-[#7C3AED]/25" : "bg-white/[0.06]"
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

const LogoCard = ({ item, fallbackIcon: Icon = Building2 }) => {
  const logo = getImg(item?.logo_path, "w185");

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-[#7C3AED]/40 hover:bg-white/[0.055]">
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-white">
        {logo ? (
          <Image
            src={logo}
            alt={item?.name || "Logo"}
            fill
            sizes="40px"
            className="object-contain p-1.5"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Icon size={16} className="text-black/40" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-bold text-white/75">
          {item?.name || "Unknown"}
        </p>

        <p className="text-xs text-white/35">
          {item?.origin_country || "Unknown"}
        </p>
      </div>
    </div>
  );
};

const CreatorCard = ({ creator }) => {
  const profile = getImg(creator?.profile_path, "w185");

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/[0.05]">
        {profile ? (
          <Image
            src={profile}
            alt={creator?.name || "Creator"}
            fill
            sizes="44px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound size={18} className="text-white/30" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="line-clamp-1 text-sm font-bold text-white/75">
          {creator?.name || "Unknown Creator"}
        </p>

        <p className="text-xs text-white/35">Creator</p>
      </div>
    </div>
  );
};

const SeriesCard = ({ series, onClick }) => {
  const poster = getImg(series?.poster_path, "w342");

  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] text-left transition hover:-translate-y-1 hover:border-[#7C3AED]/45 hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/[0.04]">
        {poster ? (
          <Image
            src={poster}
            alt={series?.name || "Series"}
            fill
            sizes="(max-width: 640px) 45vw, 170px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Tv size={30} className="text-white/25" />
          </div>
        )}

        <div className="absolute right-2 top-2 rounded-full border border-black/20 bg-black/60 px-2 py-1 text-[10px] font-black text-yellow-200 backdrop-blur-md">
          ★ {Number(series?.vote_average || 0).toFixed(1)}
        </div>
      </div>

      <div className="p-3">
        <p className="line-clamp-1 text-sm font-black text-white">
          {series?.name || "Untitled"}
        </p>

        <p className="mt-1 text-xs font-semibold text-white/35">
          {getYear(series?.first_air_date)}
        </p>

        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/40">
          {series?.overview || "No overview available."}
        </p>
      </div>
    </button>
  );
};

const SeriesSection = ({ title, subtitle, seriesList, onSeriesClick }) => {
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
          {seriesList?.length || 0}
        </span>
      </div>

      {seriesList?.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {seriesList.slice(0, 10).map((series) => (
            <SeriesCard
              key={series.id}
              series={series}
              onClick={() => onSeriesClick(series.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/40">
          No series found in this section.
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
                Reviews are not available for this series right now.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SeasonCard = ({ season, active, onClick }) => {
  const poster = getImg(season?.poster_path, "w342");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group min-w-0 cursor-pointer overflow-hidden rounded-2xl border text-left transition hover:-translate-y-1 ${
        active
          ? "border-[#7C3AED]/60 bg-[#7C3AED]/15"
          : "border-white/10 bg-white/[0.035] hover:border-[#7C3AED]/45 hover:bg-white/[0.06]"
      }`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-white/[0.04]">
        {poster ? (
          <Image
            src={poster}
            alt={season?.name || "Season"}
            fill
            sizes="(max-width: 640px) 45vw, 170px"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Layers size={30} className="text-white/25" />
          </div>
        )}

        <div className="absolute right-2 top-2 rounded-full border border-black/20 bg-black/60 px-2 py-1 text-[10px] font-black text-white backdrop-blur-md">
          S{season?.season_number}
        </div>
      </div>

      <div className="p-3">
        <p className="line-clamp-1 text-sm font-black text-white">
          {season?.name || "Season"}
        </p>

        <p className="mt-1 text-xs text-white/40">
          {season?.episode_count || 0} episodes
        </p>

        <p className="mt-1 text-xs text-white/30">
          {getYear(season?.air_date)}
        </p>
      </div>
    </button>
  );
};

const EpisodeListItem = ({
  episode,
  selected,
  watched,
  opened,
  onToggle,
  onPlay,
}) => {
  const still = getImg(episode?.still_path, "w342");

  return (
    <div
      className={`overflow-hidden rounded-2xl border transition ${
        selected
          ? "border-[#7C3AED]/60 bg-[#7C3AED]/12 shadow-[0_0_24px_rgba(124,58,237,0.14)]"
          : watched
          ? "border-emerald-400/35 bg-emerald-400/[0.08] hover:border-emerald-400/50"
          : "border-white/10 bg-white/[0.035] hover:border-[#7C3AED]/40 hover:bg-white/[0.055]"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3 p-3">
        <button
          type="button"
          onClick={onPlay}
          className="relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:h-20 sm:w-32"
        >
          {still ? (
            <Image
              src={still}
              alt={episode?.name || "Episode still"}
              fill
              sizes="(max-width: 640px) 96px, 128px"
              className="object-cover transition duration-500 hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Film size={22} className="text-white/25" />
            </div>
          )}

          <span
            className={`absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-black backdrop-blur-md ${
              selected
                ? "border-[#7C3AED]/50 bg-[#7C3AED]/40 text-white"
                : watched
                ? "border-emerald-400/40 bg-emerald-500/70 text-white"
                : "border-black/20 bg-black/60 text-white/80"
            }`}
          >
            EP {episode?.episode_number}
          </span>

          {watched && !selected && (
            <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/85 text-white shadow-lg shadow-emerald-500/20 backdrop-blur-md">
              <CheckCircle2 size={15} />
            </span>
          )}

          {selected && (
            <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/85 text-white shadow-lg shadow-[#7C3AED]/20 backdrop-blur-md">
              <Play size={13} fill="white" />
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={onPlay}
          className="min-w-0 flex-1 cursor-pointer text-left"
        >
          <div className="flex min-w-0 items-center gap-2">
            <p className="line-clamp-1 text-sm font-black text-white">
              {episode?.name || `Episode ${episode?.episode_number}`}
            </p>

            {selected && (
              <span className="hidden shrink-0 rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/15 px-2 py-0.5 text-[10px] font-black text-[#C4B5FD] sm:inline-flex">
                Playing
              </span>
            )}

            {watched && !selected && (
              <span className="hidden shrink-0 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-black text-emerald-200 sm:inline-flex">
                Watched
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-white/35">
            <span>
              S{episode?.season_number || ""} E{episode?.episode_number}
            </span>

            {episode?.runtime ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={11} />
                {episode.runtime}m
              </span>
            ) : null}

            {episode?.air_date ? (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={11} />
                {getYear(episode.air_date)}
              </span>
            ) : null}

            {episode?.vote_average ? (
              <span className="inline-flex items-center gap-1 text-yellow-200/70">
                <Star size={11} />
                {Number(episode.vote_average || 0).toFixed(1)}
              </span>
            ) : null}

            {watched && !selected && (
              <span className="inline-flex items-center gap-1 text-emerald-200/80 sm:hidden">
                <CheckCircle2 size={11} />
                Watched
              </span>
            )}
          </div>

          <p className="mt-2 hidden text-xs leading-5 text-white/35 sm:line-clamp-2">
            {episode?.overview || "Episode details not available."}
          </p>
        </button>

        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/[0.08] hover:text-white"
        >
          <ChevronDown
            size={18}
            className={`transition ${
              opened ? "rotate-180 text-[#C4B5FD]" : ""
            }`}
          />
        </button>
      </div>

      {opened && (
        <div className="border-t border-white/10 p-3">
          <div className="grid gap-3 md:grid-cols-[220px_1fr]">
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-white/[0.04]">
              {still ? (
                <Image
                  src={still}
                  alt={episode?.name || "Episode still"}
                  fill
                  sizes="(max-width: 768px) 100vw, 220px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Film size={24} className="text-white/25" />
                </div>
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                Episode Details
              </p>

              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {episode?.name || `Episode ${episode?.episode_number}`}
                </h3>

                {watched && !selected && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-black text-emerald-200">
                    <CheckCircle2 size={11} />
                    Watched
                  </span>
                )}

                {selected && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/15 px-2 py-1 text-[10px] font-black text-[#C4B5FD]">
                    <Play size={11} />
                    Playing
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm leading-6 text-white/50">
                {episode?.overview ||
                  "Detailed overview is not available for this episode."}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <InfoPill
                  icon={Clapperboard}
                  label="Episode"
                  value={episode?.episode_number || "N/A"}
                />

                <InfoPill
                  icon={Layers}
                  label="Season"
                  value={episode?.season_number || "N/A"}
                />

                <InfoPill
                  icon={Clock}
                  label="Runtime"
                  value={episode?.runtime ? `${episode.runtime}m` : "N/A"}
                />

                <InfoPill
                  icon={Star}
                  label="Rating"
                  value={Number(episode?.vote_average || 0).toFixed(1)}
                />
              </div>

              <button
                type="button"
                onClick={onPlay}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/15 px-4 py-2 text-xs font-black text-[#C4B5FD] transition hover:bg-[#7C3AED]/25"
              >
                <Play size={14} />
                Play Episode
              </button>
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
  const [activeServerId, setActiveServerId] = useState("vidsrc");
  const [openEpisodeId, setOpenEpisodeId] = useState(null);
  const [watchedEpisodes, setWatchedEpisodes] = useState(new Set());

  const seriesId = params?.id;
  const activeSeason = Number(params?.season || 1);
  const activeEpisode = Number(params?.episode || 1);

  const servers = useMemo(() => {
    if (!seriesId || !activeSeason || !activeEpisode) return [];

    return [
      {
        id: "vidsrc",
        name: "Vidsrc Direct",
        group: "Recommended Server",
        url: `https://vidsrc-embed.ru/embed/tv?tmdb=${seriesId}&season=${activeSeason}&episode=${activeEpisode}`,
        recommended: true,
      },
      {
        id: "ez-vidsrc",
        name: "EZVid Vidsrc",
        group: "Recommended Server",
        url: `https://ezvidapi.com/embed/tv/${seriesId}/${activeSeason}/${activeEpisode}?provider=vidsrc`,
        recommended: true,
      },
    ];
  }, [seriesId, activeSeason, activeEpisode]);

  const activeServer = useMemo(() => {
    return servers.find((server) => server.id === activeServerId) || servers[0];
  }, [servers, activeServerId]);

  useEffect(() => {
    const getStreamData = async () => {
      try {
        setLoading(true);
        setError("");

        const api = await fetch("/api/streamDetails/series", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: seriesId,
            seasonNumber: activeSeason,
            episode: activeEpisode,
          }),
        });

        const res = await api.json();

        if (!api.ok) {
          throw new Error(res?.message || "Failed to load series stream");
        }

        setStreamData(res);
      } catch (err) {
        console.log(err);
        setError("Unable to load series streaming details.");
      } finally {
        setLoading(false);
      }
    };

    if (seriesId && activeSeason && activeEpisode) {
      getStreamData();
    }
  }, [seriesId, activeSeason, activeEpisode]);

  const details = streamData?.seriesDetailsJson || {};
  const seasonDetails = streamData?.seasonDetailsOfSeriesJson || {};
  const reviews = streamData?.seriesReviewsJson?.results || [];
  const similarSeries = streamData?.simillarSeriesJson?.results || [];
  const recommendedSeries = streamData?.recomendedSeriesJson?.results || [];

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("History") || "[]");

    const seriesData = {
      series: String(params.id),
      season: Number(params.season),
      episode: Number(params.episode),
    };

    const alreadyExists = history.some(
      (item) =>
        item.series === String(params.id) &&
        Number(item.season) === Number(params.season) &&
        Number(item.episode) === Number(params.episode)
    );

    if (!alreadyExists) {
      localStorage.setItem("History", JSON.stringify([...history, seriesData]));
    }
  }, [params.id, params.season, params.episode]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("History") || "[]");

    const watched = history
      .filter(
        (item) =>
          item.series === String(params.id) &&
          Number(item.season) === Number(params.season)
      )
      .map((item) => Number(item.episode));

    setWatchedEpisodes(new Set(watched));
  }, [params.id, params.season, params.episode]);

  const currentSeason = useMemo(() => {
    return details?.seasons?.find(
      (season) => Number(season.season_number) === activeSeason
    );
  }, [details?.seasons, activeSeason]);

  const episodes = useMemo(() => {
    if (Array.isArray(seasonDetails?.episodes)) {
      return seasonDetails.episodes;
    }

    const count = currentSeason?.episode_count || 0;

    return Array.from({ length: count }, (_, index) => ({
      id: `${activeSeason}-${index + 1}`,
      episode_number: index + 1,
      season_number: activeSeason,
      name: `Episode ${index + 1}`,
      overview: "",
      still_path: null,
      runtime: details?.episode_run_time?.[0] || null,
      air_date: currentSeason?.air_date || "",
      vote_average: 0,
    }));
  }, [
    seasonDetails?.episodes,
    currentSeason,
    activeSeason,
    details?.episode_run_time,
  ]);

  const poster = getImg(details?.poster_path, "w500");

  const goToEpisode = (seasonNumber, episodeNumber) => {
    router.push(`/stream/series/${seriesId}/${seasonNumber}/${episodeNumber}`);
  };

  const goToSeries = (id) => {
    router.push(`/details/series/${id}`);
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
              Loading series stream...
            </p>

            <p className="mt-1 text-xs text-white/35">
              Preparing player, episodes, and series details.
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

            <p className="mt-4 font-bold text-red-200">
              Series stream not found
            </p>

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
        <div className="mb-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="rounded-full border border-[#7C3AED]/25 bg-[#7C3AED]/10 px-4 py-2 text-xs font-bold text-[#C4B5FD]">
            S{activeSeason} • E{activeEpisode}
          </div>
        </div>

        <div className="space-y-5">
          {/* 1. PLAYER */}
          <div className="min-w-0 overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl shadow-black/60">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#0D0D16] px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/15">
                  <Play size={16} className="text-[#C4B5FD]" />
                </div>

                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-black text-white">
                    {details?.name || "Series"} — S{activeSeason} E
                    {activeEpisode}
                  </p>
                  <p className="line-clamp-1 text-xs text-white/35">
                    {activeServer?.name || "Streaming server"}
                  </p>
                </div>
              </div>

              <span className="hidden rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/15 px-3 py-1 text-[10px] font-black text-[#C4B5FD] sm:block">
                Now Playing
              </span>
            </div>

            <div className="relative aspect-video w-full bg-black">
              {activeServer?.url ? (
                <iframe
                  key={activeServer.url}
                  src={activeServer.url}
                  title={activeServer.name}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
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
                If the active server does not load, choose another recommended
                server. Some players may take a few seconds to start.
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
                  className={`shrink-0 text-[#C4B5FD] transition ${
                    serverMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {serverMenuOpen && (
                <div className="absolute left-4 right-4 top-[105px] z-30 overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B12] p-2 shadow-2xl shadow-black/70">
                  {servers.map((server) => (
                    <button
                      key={server.id}
                      type="button"
                      onClick={() => {
                        setActiveServerId(server.id);
                        setServerMenuOpen(false);
                      }}
                      className={`mb-2 flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition last:mb-0 ${
                        activeServer?.id === server.id
                          ? "bg-[#7C3AED]/20 text-white"
                          : "text-white/60 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span className="truncate font-bold">{server.name}</span>

                      {activeServer?.id === server.id ? (
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-[#C4B5FD]"
                        />
                      ) : (
                        <Sparkles
                          size={13}
                          className="shrink-0 text-[#C4B5FD]"
                        />
                      )}
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
                {servers.map((server) => (
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

          {/* 4. EPISODES */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Season {activeSeason}
                </p>
                <h2 className="text-lg font-black text-white">Episodes</h2>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/35">
                {episodes.length}
              </span>
            </div>

            {episodes.length > 0 ? (
              <div className="episode-list-scroll search-modal-scroll max-h-[430px] space-y-3 overflow-y-auto pr-2 sm:max-h-[520px]">
                {episodes.map((episode) => {
                  const selected =
                    Number(episode.episode_number) === activeEpisode;

                  const episodeKey =
                    episode.id || `${activeSeason}-${episode.episode_number}`;

                  const opened = openEpisodeId === episodeKey;

                  const watched = watchedEpisodes.has(
                    Number(episode.episode_number)
                  );

                  return (
                    <EpisodeListItem
                      key={episodeKey}
                      episode={episode}
                      selected={selected}
                      watched={watched}
                      opened={opened}
                      onToggle={() =>
                        setOpenEpisodeId((prev) =>
                          prev === episodeKey ? null : episodeKey
                        )
                      }
                      onPlay={() =>
                        goToEpisode(activeSeason, episode.episode_number)
                      }
                    />
                  );
                })}
              </div>
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/40">
                Episode list not available for this season.
              </p>
            )}
          </div>

          {/* 5. SERIES DETAILS */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4 shadow-2xl shadow-black/25">
            <div className="grid min-w-0 gap-4 sm:grid-cols-[110px_1fr]">
              <div className="relative mx-auto aspect-[2/3] w-[105px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl shadow-black/40 sm:mx-0">
                {poster ? (
                  <Image
                    src={poster}
                    alt={details?.name || "Series poster"}
                    fill
                    priority
                    sizes="110px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Tv size={28} className="text-white/25" />
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
                  {details?.name || "Series"}
                </h1>

                {details?.original_name &&
                  details.original_name !== details.name && (
                    <p className="mt-1 line-clamp-1 text-sm font-semibold text-white/40">
                      {details.original_name}
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
                    value={formatRuntime(details?.episode_run_time)}
                  />
                  <InfoPill
                    icon={Layers}
                    label="Seasons"
                    value={details?.number_of_seasons || "N/A"}
                  />
                  <InfoPill
                    icon={Clapperboard}
                    label="Episodes"
                    value={details?.number_of_episodes || "N/A"}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 6. OTHER SEASONS */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                  Season guide
                </p>
                <h2 className="text-lg font-black text-white">Other Seasons</h2>
              </div>

              <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold text-white/35">
                {details?.seasons?.length || 0}
              </span>
            </div>

            {details?.seasons?.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {details.seasons.map((season) => (
                  <SeasonCard
                    key={season.id}
                    season={season}
                    active={Number(season.season_number) === activeSeason}
                    onClick={() => goToEpisode(season.season_number, 1)}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm text-white/40">
                Season list not available.
              </p>
            )}
          </div>

          {/* 7. CREATORS / NETWORKS / STUDIOS */}
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
              <h2 className="mb-4 text-lg font-black text-white">Creators</h2>

              <div className="space-y-3">
                {details?.created_by?.length > 0 ? (
                  details.created_by.slice(0, 4).map((creator) => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))
                ) : (
                  <p className="text-sm text-white/40">No creator data.</p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
              <h2 className="mb-4 text-lg font-black text-white">Networks</h2>

              <div className="space-y-3">
                {details?.networks?.length > 0 ? (
                  details.networks.map((network) => (
                    <LogoCard
                      key={network.id}
                      item={network}
                      fallbackIcon={Radio}
                    />
                  ))
                ) : (
                  <p className="text-sm text-white/40">No network data.</p>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0D0D16] p-4">
              <h2 className="mb-4 text-lg font-black text-white">Studios</h2>

              <div className="space-y-3">
                {details?.production_companies?.length > 0 ? (
                  details.production_companies.map((company) => (
                    <LogoCard
                      key={company.id}
                      item={company}
                      fallbackIcon={Building2}
                    />
                  ))
                ) : (
                  <p className="text-sm text-white/40">No studio data.</p>
                )}
              </div>
            </div>
          </div>

          {/* 8. REVIEWS */}
          <ReviewSection reviews={reviews} />

          {/* 9. SIMILAR SERIES */}
          <SeriesSection
            title="Similar Series"
            subtitle="More like this"
            seriesList={similarSeries}
            onSeriesClick={goToSeries}
          />

          {/* 10. RECOMMENDED SERIES */}
          <SeriesSection
            title="Recommended Series"
            subtitle="You may also like"
            seriesList={recommendedSeries}
            onSeriesClick={goToSeries}
          />

          {/* 11. STREAM INFO */}
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
                <span>Type</span>
                <p className="mt-1 font-bold text-white/70">
                  {details?.type || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                <span>Language</span>
                <p className="mt-1 font-bold text-white/70">
                  {details?.original_language?.toUpperCase() || "N/A"}
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