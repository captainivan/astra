"use client";

import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Image from "next/image";

import {
  Star,
  Calendar,
  Clapperboard,
  Play,
  Plus,
  Flame,
  Globe,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

import { Button } from "@/components/ui/button";
import Footer from "./Footer";
import { useRouter } from "next/navigation";

const keenAutoPlay = (delay = 5000) => {
  return (slider) => {
    let timeout;
    let mouseOver = false;

    const clearNextTimeout = () => {
      clearTimeout(timeout);
    };

    const nextTimeout = () => {
      clearTimeout(timeout);

      if (mouseOver) return;

      timeout = setTimeout(() => {
        slider.next();
      }, delay);
    };

    slider.on("created", () => {
      slider.container.addEventListener("mouseenter", () => {
        mouseOver = true;
        clearNextTimeout();
      });

      slider.container.addEventListener("mouseleave", () => {
        mouseOver = false;
        nextTimeout();
      });

      nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };
};

const HomePage = () => {
  const [heroSectionData, setHeroSectionData] = useState([]);
  const [trendingNowSeries, setTrendingNowSeries] = useState("TV");
  const [theTrendingData, setTheTrendingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [movieData, setMovieData] = useState("popular");
  const [actualMovieData, setActualMovieData] = useState([]);
  const [movieLoading, setMovieLoading] = useState(false);
  const [tvData, setTvData] = useState("popular");
  const [actualTvData, setActualTvData] = useState([]);
  const [tvLoading, setTvLoading] = useState(false);
  const [movieGenre, setMovieGenre] = useState([]);
  const [tvGenre, setTvGenre] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showCautionPopup, setShowCautionPopup] = useState(false);
  const [dontShowCautionAgain, setDontShowCautionAgain] = useState(false);

  const router = useRouter();


  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [heroSliderLoaded, setHeroSliderLoaded] = useState(false);

  const [heroSliderRef, heroSlider] = useKeenSlider(
    {
      loop: true,
      drag: true,
      slides: {
        perView: 1,
        spacing: 0,
      },
      slideChanged(slider) {
        setCurrentHeroSlide(slider.track.details.rel);
      },
      created() {
        setHeroSliderLoaded(true);
      },
    },
    [keenAutoPlay(5000)]
  );

  const [trendingSliderLoaded, setTrendingSliderLoaded] = useState(false);

  const [trendingSliderRef, trendingSlider] = useKeenSlider({
    loop: false,
    mode: "free-snap",
    drag: true,
    slides: {
      perView: 1.25,
      spacing: 12,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2.35,
          spacing: 12,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 3.1,
          spacing: 14,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 4.2,
          spacing: 14,
        },
      },
      "(min-width: 1280px)": {
        slides: {
          perView: 5.2,
          spacing: 16,
        },
      },
    },
    created() {
      setTrendingSliderLoaded(true);
    },
  });

  useEffect(() => {
    const popupSaved = localStorage.getItem("cautionPopupDontShowAgain");

    if (popupSaved !== "true") {
      setShowCautionPopup(true);
    }
  }, []);

  const closeCautionPopup = () => {
    if (dontShowCautionAgain) {
      localStorage.setItem("cautionPopupDontShowAgain", "true");
    }

    setShowCautionPopup(false);
  };

  useEffect(() => {
    const getHeroSectionData = async () => {
      try {
        const api = await fetch("/api/homePage/heroSection");
        const res = await api.json();

        setHeroSectionData(res?.data?.results || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    getHeroSectionData();
  }, []);

  useEffect(() => {
    const getTrending = async () => {
      try {
        setTrendingLoading(true);

        const api = await fetch("/api/homePage/trendingNow", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: trendingNowSeries,
          }),
        });

        const res = await api.json();

        setTheTrendingData(res?.res?.results || []);
      } catch (error) {
        console.log(error);
        setTheTrendingData([]);
      } finally {
        setTrendingLoading(false);
      }
    };

    getTrending();
  }, [trendingNowSeries]);

  useEffect(() => {
    const getMovieData = async () => {
      try {
        setMovieLoading(true);

        const api = await fetch("/api/homePage/trendingMovie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: movieData,
          }),
        });

        const res = await api.json();

        setActualMovieData(res?.res?.results || []);
      } catch (error) {
        console.log(error);
        setActualMovieData([]);
      } finally {
        setMovieLoading(false);
      }
    };

    getMovieData();
  }, [movieData]);


  useEffect(() => {
    const getTvData = async () => {
      try {
        setTvLoading(true);

        const api = await fetch("/api/homePage/trendingTV", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: tvData,
          }),
        });

        const res = await api.json();

        setActualTvData(res?.res?.results || []);
      } catch (error) {
        console.log(error);
        setActualTvData([]);
      } finally {
        setTvLoading(false);
      }
    };
    getTvData();

  }, [tvData]);

  useEffect(() => {
    const genreData = async () => {
      const api = await fetch("/api/homePage/genres");
      const res = await api.json();
      setMovieGenre(res.movieRes.genres)
      setTvGenre(res.tvRes.genres)
    };
    genreData()
  }, []);

  useEffect(() => {
    const data = async () => {
      setHistoryLoading(true);

      try {
        const getHistory = JSON.parse(localStorage.getItem("History") || "[]");
        const arr = [];

        console.log("the history is --------", getHistory);

        if (getHistory.length === 0) {
          setHistory([]);
          return;
        }

        for (let i = 0; i < getHistory.length; i++) {
          const api = await fetch(`/api/getHistoryDetails`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              historyData: getHistory[i],
            }),
          });

          const res = await api.json();

          arr.push({
            type: getHistory[i].movie ? "movie" : "series",
            response: res.message,
            historyData: getHistory[i],
          });
        }

        console.log("final history data --------", arr);
        setHistory(arr.reverse());
      } catch (error) {
        console.log(error);
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    data();
  }, []);

  useEffect(() => {
    heroSlider.current?.update();
  }, [heroSectionData, heroSlider]);

  useEffect(() => {
    trendingSlider.current?.update();
  }, [theTrendingData, trendingLoading, trendingNowSeries, trendingSlider]);


  return (
    <div className="min-h-screen overflow-hidden bg-[#09090F] text-white">
      <NavBar />

      {/* ------ Caution ------- */}

      {showCautionPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 px-3 backdrop-blur-md sm:px-4">
          <div
            className="

        relative
        max-h-[88vh]
        w-full
        max-w-lg
        rounded-[22px]
        border
        border-white/10
        bg-[#111827]
        p-4
        shadow-2xl
        shadow-black/60
        sm:rounded-[28px]
        sm:p-7
      "
          >
            <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#7C3AED]/25 blur-3xl sm:h-40 sm:w-40" />
            <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#3B82F6]/20 blur-3xl sm:h-40 sm:w-40" />

            <div className="relative z-10">
              {/* Header */}
              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#FACC15]/30 bg-[#FACC15]/10 text-xl sm:h-12 sm:w-12 sm:text-2xl">
                  ⚠️
                </div>

                <div>
                  <h2 className="font-heading text-2xl tracking-wide text-[#F9FAFB] sm:text-4xl">
                    CAUTION
                  </h2>

                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#9CA3AF] sm:text-xs">
                    Please read before using this website
                  </p>
                </div>
              </div>

              {/* Warning Cards */}
              <div className="space-y-3 sm:space-y-4">
                <div className="rounded-2xl border border-[#FACC15]/20 bg-[#FACC15]/10 p-3 sm:p-4">
                  <h3 className="mb-1.5 text-xs font-bold text-[#F9FAFB] sm:mb-2 sm:text-sm">
                    Ads Warning
                  </h3>

                  <p className="text-xs leading-relaxed text-[#D1D5DB] sm:text-sm">
                    This website may contain ads, popups, redirects, or third-party
                    content from external video sources. For a better and safer
                    experience, using a strong ad blocker or Brave Browser is
                    recommended.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#7C3AED]/25 bg-[#7C3AED]/10 p-3 sm:p-4">
                  <h3 className="mb-1.5 text-xs font-bold text-[#F9FAFB] sm:mb-2 sm:text-sm">
                    Development Disclaimer
                  </h3>

                  <p className="text-xs leading-relaxed text-[#D1D5DB] sm:text-sm">
                    Only the UI and UX design of this website were assisted by AI.
                    The rest of the development, logic, features, setup, and project
                    work are done by the developer.
                  </p>
                </div>
              </div>

              {/* Checkbox */}
              <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-[#09090F]/70 p-3 text-xs text-[#D1D5DB] sm:mt-5 sm:p-4 sm:text-sm">
                <input
                  type="checkbox"
                  checked={dontShowCautionAgain}
                  onChange={(e) => setDontShowCautionAgain(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#7C3AED]"
                />

                <span>Don&apos;t show me again</span>
              </label>

              {/* Button */}
              <button
                type="button"
                onClick={closeCautionPopup}
                className="
            mt-4
            flex
            w-full
            cursor-pointer
            items-center
            justify-center
            rounded-full
            bg-gradient-to-r
            from-[#7C3AED]
            to-[#3B82F6]
            px-6
            py-3
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-[#7C3AED]/25
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[#3B82F6]/30
            active:scale-95
            sm:mt-5
            sm:py-3.5
          "
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------Hero Section-------- */}
      <section id="Home" className="px-3 pt-4 md:px-8">
        {loading ? (
          <div className="flex h-[600px] items-center justify-center rounded-[28px] bg-[#111827]">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-[#7C3AED]" />
          </div>
        ) : (
          <div className="group relative">
            <div ref={heroSliderRef} className="keen-slider overflow-hidden rounded-[30px]">
              {heroSectionData.map((movie, index) => {
                const title =
                  movie.title ||
                  movie.name ||
                  movie.original_title ||
                  movie.original_name ||
                  "Untitled";

                const year =
                  movie.release_date?.split("-")[0] ||
                  movie.first_air_date?.split("-")[0] ||
                  "Unknown";

                const backdropUrl = movie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
                  : "/fallback-poster.jpg";

                return (
                  <div key={movie.id || index} className="keen-slider__slide">
                    <div className="relative h-[78vh] min-h-[540px] overflow-hidden rounded-[30px] border border-white/10 bg-black md:h-[680px]">
                      <Image
                        src={backdropUrl}
                        alt={title}
                        fill
                        priority={index === 0}
                        sizes="100vw"
                        className="
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-105
                  "
                      />

                      <div className="absolute inset-0 bg-linear-to-r from-[#09090F]/95 via-[#09090F]/55 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-64 bg-linear-to-t from-[#09090F] via-[#09090F]/55 to-transparent" />

                      <div className="relative z-20 flex h-full items-end px-5 pb-10 sm:px-10 md:items-center md:px-14 md:pb-0 lg:px-20">
                        <div className="max-w-4xl">
                          <div className="mb-4 flex flex-wrap gap-2.5">
                            <div className="flex items-center gap-2 rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                              <Flame size={15} className="text-orange-400" />
                              Trending Now
                            </div>

                            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/85 backdrop-blur-md">
                              {movie.adult ? "18+" : "PG"}
                            </div>

                            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs capitalize text-white/85 backdrop-blur-md">
                              {movie.media_type || "movie"}
                            </div>
                          </div>

                          <h1 className="font-heading mb-4 max-w-4xl text-5xl leading-none tracking-wide drop-shadow-xl sm:text-6xl md:text-7xl lg:text-8xl">
                            {title}
                          </h1>

                          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/80 md:text-base">
                            <div className="flex items-center gap-2">
                              <Star
                                size={18}
                                className="fill-yellow-400 text-yellow-400"
                              />
                              <span className="font-semibold text-white">
                                {movie.vote_average
                                  ? movie.vote_average.toFixed(1)
                                  : "N/A"}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Users size={18} />
                              <span>
                                {movie.vote_count
                                  ? movie.vote_count.toLocaleString()
                                  : "0"}{" "}
                                Votes
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Calendar size={18} />
                              <span>{year}</span>
                            </div>

                            <div className="flex items-center gap-2 capitalize">
                              <Clapperboard size={18} />
                              <span>{movie.media_type || "movie"}</span>
                            </div>

                            <div className="flex items-center gap-2 uppercase">
                              <Globe size={18} />
                              <span>{movie.original_language || "EN"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <TrendingUp size={18} />
                              <span>{Math.floor(movie.popularity || 0)}</span>
                            </div>
                          </div>

                          <p className="mb-7 max-w-xl text-sm leading-relaxed text-white/70 line-clamp-2 sm:max-w-2xl md:text-base md:line-clamp-3">
                            {movie.overview || "No overview available."}
                          </p>

                          <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                              onClick={() => {
                                movie.media_type == "movie"
                                  ? router.push(`/details/movies/${movie.id}`)
                                  : router.push(`/details/series/${movie.id}`);
                              }}
                              className="cursor-pointer flex items-center justify-center gap-3 rounded-full bg-linear-to-r from-[#7C3AED] to-[#3B82F6] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#7C3AED]/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-[#3B82F6]/30 active:scale-95"
                            >
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                                <Play size={16} fill="white" />
                              </span>
                              Watch Now
                            </button>

                            <button className="cursor-pointer flex items-center justify-center gap-2 rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/10 px-8 py-3.5 font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#3B82F6]/70 hover:bg-[#3B82F6]/15 active:scale-95">
                              <Plus size={20} />
                              Watchlist
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {heroSliderLoaded && heroSlider.current && (
              <>
                <button
                  type="button"
                  onClick={() => heroSlider.current?.prev()}
                  className="absolute left-5 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#09090F]/70 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#3B82F6]/70 hover:bg-[#7C3AED] md:flex"
                >
                  <ChevronLeft size={24} />
                </button>

                <button
                  type="button"
                  onClick={() => heroSlider.current?.next()}
                  className="absolute right-5 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#09090F]/70 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#3B82F6]/70 hover:bg-[#7C3AED] md:flex"
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute right-5 top-5 z-30 flex gap-3 md:hidden">
                  <button
                    type="button"
                    onClick={() => heroSlider.current?.prev()}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#09090F]/75 text-white backdrop-blur-xl hover:bg-[#7C3AED]"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <button
                    type="button"
                    onClick={() => heroSlider.current?.next()}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#09090F]/75 text-white backdrop-blur-xl hover:bg-[#7C3AED]"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 gap-2">
                  {heroSectionData.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => heroSlider.current?.moveToIdx(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${currentHeroSlide === index
                        ? "w-8 bg-[#7C3AED]"
                        : "w-2 bg-white/35 hover:bg-white/70"
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>


      {/* ----------- History --------- */}

      <section id="History" className="w-full px-3 pt-10 md:px-8">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h2 className="font-heading text-4xl tracking-wide text-[#F9FAFB] sm:text-5xl">
                HISTORY
              </h2>

              <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6]" />
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
              Continue watching your recently opened movies and episodes.
            </p>
          </div>

          <div className="w-fit rounded-full border border-[#7C3AED]/25 bg-[#111827] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
            {history.length} Items
          </div>
        </div>

        {/* Loading */}
        {historyLoading ? (
          <div
            className="
        search-modal-scroll
        search-scroll
        max-h-[360px]
        space-y-3
        overflow-y-auto
        pr-2
        sm:flex
        sm:max-h-none
        sm:space-y-0
        sm:gap-3
        sm:overflow-x-auto
        sm:overflow-y-hidden
        sm:pb-4
      "
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="
            relative
            h-[145px]
            w-full
            overflow-hidden
            rounded-[24px]
            border
            border-white/10
            bg-[#111827]
            sm:h-[245px]
            sm:min-w-[380px]
          "
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#182033] to-[#09090F]" />

                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="absolute left-4 top-4 h-7 w-24 rounded-full bg-[#09090F]/80" />
                <div className="absolute right-4 top-4 h-7 w-16 rounded-full bg-[#09090F]/80" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="mb-3 h-6 w-3/4 rounded-lg bg-white/10" />
                  <div className="mb-2 h-4 w-1/2 rounded bg-white/10" />
                  <div className="hidden h-10 w-full rounded-full bg-gradient-to-r from-[#7C3AED]/35 to-[#3B82F6]/35 sm:block" />
                </div>
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111827]/70 p-8 text-center shadow-xl shadow-black/30">
            <div className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-[#7C3AED]/20 blur-3xl" />

            <div className="relative z-10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/15">
              <Play size={26} className="text-[#A855F7]" fill="currentColor" />
            </div>

            <h3 className="font-heading text-3xl tracking-wide text-[#F9FAFB]">
              No History Yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#9CA3AF]">
              Start watching a movie or episode and it will appear here.
            </p>
          </div>
        ) : (
          <div
            className="
        search-modal-scroll
        search-scroll
        max-h-[390px]
        space-y-3
        overflow-y-auto
        pr-2
        sm:flex
        sm:max-h-none
        sm:space-y-0
        sm:gap-3
        sm:overflow-x-auto
        sm:overflow-y-hidden
        sm:pb-4
      "
          >
            {history.map((item, i) => {
              const data = item.response;
              const isMovie = item.type === "movie";

              const title = isMovie
                ? data?.title || data?.original_title || "Untitled Movie"
                : data?.name || `Episode ${data?.episode_number || ""}`;

              const year = isMovie
                ? data?.release_date?.split("-")[0] || "Unknown"
                : data?.air_date?.split("-")[0] || "Unknown";

              const imagePath = isMovie
                ? data?.backdrop_path || data?.poster_path
                : data?.still_path;

              const imageUrl = imagePath
                ? `https://image.tmdb.org/t/p/w780${imagePath}`
                : "/fallback-poster.jpg";

              const rating = data?.vote_average
                ? data.vote_average.toFixed(1)
                : "N/A";

              const runtime = data?.runtime ? `${data.runtime} min` : "N/A";

              const goToHistory = () => {
                if (isMovie) {
                  router.push(`/stream/movies/${item.historyData.movie}`);
                } else {
                  router.push(
                    `/stream/series/${item.historyData.series}/${item.historyData.season}/${item.historyData.episode}`
                  );
                }
              };

              return (
                <div
                  key={`${item.type}-${data?.id || i}`}
                  onClick={goToHistory}
                  className="
              group/history
              relative
              flex
              h-[150px]
              w-full
              cursor-pointer
              overflow-hidden
              rounded-[24px]
              border
              border-white/10
              bg-[#111827]
              shadow-lg
              shadow-black/30
              transition-all
              duration-500
              hover:border-[#7C3AED]/60
              active:scale-[0.98]
              sm:block
              sm:h-[265px]
              sm:min-w-[390px]
              sm:hover:-translate-y-2
            "
                >
                  {/* Mobile Image */}
                  <div className="relative h-full w-[42%] shrink-0 sm:hidden">
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      sizes="42vw"
                      className="object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111827]/70" />
                  </div>

                  {/* Desktop Image */}
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, 390px"
                    className="
                z-0
                hidden
                object-cover
                object-center
                transition-transform
                duration-700
                group-hover/history:scale-110
                sm:block
              "
                  />

                  {/* Desktop Overlay */}
                  <div className="absolute inset-0 z-10 hidden bg-gradient-to-t from-[#09090F] via-[#09090F]/60 to-transparent sm:block" />
                  <div className="absolute inset-0 z-10 hidden bg-gradient-to-r from-[#09090F]/85 via-[#09090F]/35 to-transparent sm:block" />

                  {/* Mobile Content */}
                  <div className="relative z-30 flex flex-1 flex-col justify-between p-3 sm:hidden">
                    <div>
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="rounded-full border border-[#7C3AED]/35 bg-[#7C3AED]/15 px-2.5 py-1 text-[10px] font-bold uppercase text-[#F9FAFB]">
                          {isMovie
                            ? "Movie"
                            : `S${item.historyData?.season || "?"} E${item.historyData?.episode || "?"
                            }`}
                        </span>

                        <span className="flex items-center gap-1 rounded-full border border-[#FACC15]/30 bg-[#09090F]/80 px-2 py-1 text-[10px] font-bold text-[#F9FAFB]">
                          <Star
                            size={11}
                            className="fill-[#FACC15] text-[#FACC15]"
                          />
                          {rating}
                        </span>
                      </div>

                      <h3 className="font-heading line-clamp-2 text-2xl leading-none tracking-wide text-[#F9FAFB]">
                        {title.length <= 15 ? title : `${title.slice(0, 15)}...`}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-[#9CA3AF]">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {year}
                        </span>

                        <span className="flex items-center gap-1">
                          <Clapperboard size={11} />
                          {runtime}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToHistory();
                      }}
                      className="
                  flex
                  w-full
                  cursor-pointer
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-gradient-to-r
                  from-[#7C3AED]
                  to-[#3B82F6]
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-[#F9FAFB]
                  shadow-lg
                  shadow-[#7C3AED]/20
                  transition-all
                  duration-300
                  active:scale-95
                "
                    >
                      <Play size={13} fill="white" />
                      Continue
                    </button>
                  </div>

                  {/* Desktop Top Badges */}
                  <div className="absolute left-4 right-4 top-4 z-20 hidden items-center justify-between gap-2 sm:flex">
                    <div className="rounded-full border border-[#7C3AED]/35 bg-[#09090F]/75 px-3 py-1.5 text-[11px] font-bold uppercase text-[#F9FAFB] backdrop-blur-md">
                      {isMovie
                        ? "Movie"
                        : `S${item.historyData?.season || "?"} E${item.historyData?.episode || "?"
                        }`}
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-[#FACC15]/30 bg-[#09090F]/75 px-3 py-1.5 text-[11px] font-bold text-[#F9FAFB] backdrop-blur-md">
                      <Star size={13} className="fill-[#FACC15] text-[#FACC15]" />
                      {rating}
                    </div>
                  </div>

                  {/* Desktop Center Play Hover */}
                  <div className="absolute inset-0 z-20 hidden items-center justify-center opacity-0 transition-all duration-300 group-hover/history:opacity-100 sm:flex">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToHistory();
                      }}
                      className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-[#F9FAFB] shadow-xl shadow-[#7C3AED]/30 transition-all duration-300 hover:scale-110"
                    >
                      <Play size={22} fill="white" />
                    </button>
                  </div>

                  {/* Desktop Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 hidden p-4 sm:block">
                    <h3 className="font-heading mb-2 line-clamp-2 text-3xl leading-none tracking-wide text-[#F9FAFB] drop-shadow-xl">
                      {title}
                    </h3>

                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#9CA3AF]">
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        {year}
                      </div>

                      <div className="flex items-center gap-1">
                        <Clapperboard size={13} />
                        {runtime}
                      </div>

                      <div className="flex items-center gap-1 capitalize">
                        {isMovie ? "Movie" : "Episode"}
                      </div>
                    </div>

                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#9CA3AF]">
                      {data?.overview || "No overview available."}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToHistory();
                      }}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] px-5 py-3 text-sm font-bold text-[#F9FAFB] shadow-lg shadow-[#7C3AED]/25 transition-all duration-300 hover:scale-[1.03] active:scale-95"
                    >
                      <Play size={15} fill="white" />
                      Continue Watching
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------- Trending Now Section ----------- */}
      <section id="Trending" className="w-full px-3 pt-8 md:px-8">
        {/* Section Header */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-4xl tracking-wide text-white sm:text-5xl">
              TRENDING
            </h2>

            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6]" />
          </div>

          <div className="w-fit rounded-full border border-white/10 bg-[#111827] p-1 shadow-lg shadow-black/20">
            <Button
              className={`
          h-10 w-[95px] rounded-full text-sm font-bold transition-all duration-300 cursor-pointer
          ${trendingNowSeries === "TV"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-md shadow-[#7C3AED]/25"
                  : "bg-transparent text-white/60 hover:text-white"
                }
        `}
              onClick={() => setTrendingNowSeries("TV")}
            >
              TV
            </Button>

            <Button
              className={`
          h-10 w-[95px] rounded-full text-sm font-bold transition-all duration-300 cursor-pointer
          ${trendingNowSeries === "Movies"
                  ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white shadow-md shadow-[#7C3AED]/25"
                  : "bg-transparent text-white/60 hover:text-white"
                }
        `}
              onClick={() => setTrendingNowSeries("Movies")}
            >
              MOVIE
            </Button>
          </div>
        </div>

        {/* Trending Keen Slider */}
        <div className="group relative w-full">
          <div ref={trendingSliderRef} className="keen-slider">
            {trendingLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="keen-slider__slide">
                  <div
                    className="
                relative
                h-[390px]
                overflow-hidden
                rounded-[26px]
                border
                border-white/10
                bg-[#111827]
                shadow-xl
                shadow-black/30
              "
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#182033] to-[#09090F]" />

                    <div
                      className="
                  absolute
                  inset-0
                  -translate-x-full
                  animate-[shimmer_1.6s_infinite]
                  bg-gradient-to-r
                  from-transparent
                  via-white/10
                  to-transparent
                "
                    />

                    <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between">
                      <div className="h-7 w-20 rounded-full bg-[#09090F]/80" />
                      <div className="h-7 w-16 rounded-full bg-[#09090F]/80" />
                    </div>

                    <div className="absolute left-3 top-[58px] z-20 h-7 w-20 rounded-full bg-[#7C3AED]/20" />

                    <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                      <div className="mb-3 h-7 w-3/4 rounded-lg bg-white/10" />
                      <div className="mb-3 flex gap-2">
                        <div className="h-4 w-14 rounded bg-white/10" />
                        <div className="h-4 w-16 rounded bg-white/10" />
                        <div className="h-4 w-10 rounded bg-white/10" />
                      </div>
                      <div className="mb-2 h-3 w-full rounded bg-white/10" />
                      <div className="mb-4 h-3 w-2/3 rounded bg-white/10" />

                      <div className="h-11 w-full rounded-full bg-gradient-to-r from-[#7C3AED]/40 to-[#3B82F6]/40" />
                    </div>
                  </div>
                </div>
              ))
              : theTrendingData.map((movie, i) => {
                const title =
                  movie.title ||
                  movie.name ||
                  movie.original_title ||
                  movie.original_name ||
                  "Untitled";

                const year =
                  movie.release_date?.split("-")[0] ||
                  movie.first_air_date?.split("-")[0] ||
                  "Unknown";

                const posterUrl = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/fallback-poster.jpg";

                return (
                  <div key={movie.id || i} className="keen-slider__slide">
                    <div
                      className="
                  group/card
                  relative
                  h-[390px]
                  overflow-hidden
                  rounded-[26px]
                  border
                  border-white/10
                  bg-[#111827]
                  shadow-xl
                  shadow-black/30
                  transition-all
                  duration-500
                  hover:-translate-y-2
                  hover:border-[#7C3AED]/50
                "
                    >
                      <Image
                        src={posterUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 640px) 75vw, (max-width: 768px) 45vw, (max-width: 1024px) 32vw, 20vw"
                        className="
                    z-0
                    object-cover
                    object-center
                    transition-transform
                    duration-700
                    group-hover/card:scale-110
                  "
                      />

                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#09090F] via-[#09090F]/40 to-transparent" />
                      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#09090F]/45 via-transparent to-transparent" />

                      <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-2">
                        <div
                          className="
                      rounded-full
                      border
                      border-white/15
                      bg-[#09090F]/70
                      px-3
                      py-1.5
                      text-[11px]
                      font-bold
                      uppercase
                      text-[#F9FAFB]
                      backdrop-blur-md
                    "
                        >
                          {movie.media_type || trendingNowSeries}
                        </div>

                        <div
                          className="
                      flex
                      items-center
                      gap-1
                      rounded-full
                      border
                      border-[#FACC15]/30
                      bg-[#09090F]/70
                      px-3
                      py-1.5
                      text-[11px]
                      font-bold
                      text-[#F9FAFB]
                      backdrop-blur-md
                    "
                        >
                          <Star size={13} className="fill-[#FACC15] text-[#FACC15]" />
                          {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                        </div>
                      </div>

                      <div className="absolute left-3 top-[58px] z-20 flex items-center gap-1 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/25 px-3 py-1.5 text-[11px] font-bold text-[#F9FAFB] backdrop-blur-md">
                        <TrendingUp size={13} />
                        {Math.floor(movie.popularity || 0)}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                        <h3
                          className="
                      font-heading
                      mb-2
                      line-clamp-2
                      text-2xl
                      leading-none
                      tracking-wide
                      text-[#F9FAFB]
                      drop-shadow-xl
                    "
                        >
                          {title}
                        </h3>

                        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-[#9CA3AF]">
                          <div className="flex items-center gap-1">
                            <Calendar size={13} />
                            {year}
                          </div>

                          <div className="flex items-center gap-1 capitalize">
                            <Clapperboard size={13} />
                            {movie.media_type || "movie"}
                          </div>

                          <div className="flex items-center gap-1 uppercase">
                            <Globe size={13} />
                            {movie.original_language || "EN"}
                          </div>
                        </div>

                        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#9CA3AF]">
                          {movie.overview || "No overview available."}
                        </p>

                        <button
                          onClick={() => {
                            movie.media_type == "movie"
                              ? router.push(`/details/movies/${movie.id}`)
                              : router.push(`/details/series/${movie.id}`);
                          }}
                          className="
                      cursor-pointer
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      bg-gradient-to-r
                      from-[#7C3AED]
                      to-[#3B82F6]
                      px-5
                      py-3
                      text-sm
                      font-bold
                      text-[#F9FAFB]
                      shadow-lg
                      shadow-[#7C3AED]/25
                      transition-all
                      duration-300
                      hover:scale-[1.03]
                      active:scale-95
                    "
                        >
                          <Play size={15} fill="white" />
                          Watch Now
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {trendingSliderLoaded && trendingSlider.current && (
            <>
              <button
                type="button"
                onClick={() => trendingSlider.current?.prev()}
                className="
          absolute
          left-2
          top-1/2
          z-30
          hidden
          h-12
          w-12
          -translate-y-1/2
          cursor-pointer
          items-center
          justify-center
          rounded-full
          border
          border-[#7C3AED]/30
          bg-[#09090F]/80
          text-[#F9FAFB]
          backdrop-blur-xl
          transition-all
          duration-300
          hover:scale-110
          hover:bg-[#7C3AED]
          md:flex
        "
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={() => trendingSlider.current?.next()}
                className="
          absolute
          right-2
          top-1/2
          z-30
          hidden
          h-12
          w-12
          -translate-y-1/2
          cursor-pointer
          items-center
          justify-center
          rounded-full
          border
          border-[#7C3AED]/30
          bg-[#09090F]/80
          text-[#F9FAFB]
          backdrop-blur-xl
          transition-all
          duration-300
          hover:scale-110
          hover:bg-[#7C3AED]
          md:flex
        "
              >
                <ChevronRight size={22} />
              </button>

              <div className="mt-5 flex justify-end gap-3 md:hidden">
                <button
                  type="button"
                  onClick={() => trendingSlider.current?.prev()}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#111827] text-[#F9FAFB] hover:bg-[#7C3AED]"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={() => trendingSlider.current?.next()}
                  className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#7C3AED]/30 bg-[#111827] text-[#F9FAFB] hover:bg-[#7C3AED]"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ------- Movies Section --------- */}
      <section id="Movies" className="w-full px-3 pt-10 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h2 className="font-heading text-4xl tracking-wide text-[#F9FAFB] sm:text-5xl">
                MOVIES
              </h2>

              <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6]" />
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
              Explore popular, top rated, upcoming and now playing movies.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#111827] p-1.5 shadow-lg shadow-black/20 sm:grid-cols-4 lg:flex lg:w-fit">
            {[
              { label: "NOW PLAYING", value: "nowPlaying" },
              { label: "POPULAR", value: "popular" },
              { label: "TOP RATED", value: "topRated" },
              { label: "UPCOMING", value: "upcoming" },
            ].map((item) => (
              <Button
                key={item.value}
                onClick={() => setMovieData(item.value)}
                className={`
        h-10
        w-full
        rounded-xl
        px-3
        text-[11px]
        font-bold
        transition-all
        duration-300
        sm:text-xs
        lg:w-auto
        lg:px-4
        ${movieData === item.value
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-[#F9FAFB] shadow-md shadow-[#7C3AED]/25"
                    : "bg-transparent text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]"
                  }
      `}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loader Grid */}
        {movieLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="relative h-[310px] overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] sm:h-[340px] md:h-[370px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#182033] to-[#09090F]" />

                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="absolute left-3 top-3 h-7 w-16 rounded-full bg-[#09090F]/80" />
                <div className="absolute right-3 top-3 h-7 w-14 rounded-full bg-[#09090F]/80" />

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="mb-3 h-6 w-4/5 rounded-lg bg-white/10" />
                  <div className="mb-2 h-4 w-3/5 rounded bg-white/10" />
                  <div className="h-10 w-full rounded-full bg-gradient-to-r from-[#7C3AED]/35 to-[#3B82F6]/35" />
                </div>
              </div>
            ))}
          </div>
        ) : actualMovieData.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {actualMovieData.map((movie, i) => {
              const title =
                movie.title ||
                movie.name ||
                movie.original_title ||
                movie.original_name ||
                "Untitled";

              const year =
                movie.release_date?.split("-")[0] ||
                movie.first_air_date?.split("-")[0] ||
                "Unknown";

              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w1920${movie.poster_path}`
                : "/fallback-poster.jpg";

              return (
                <div
                  key={movie.id || i}
                  className="group/card relative h-[310px] overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] shadow-lg shadow-black/30 transition-all duration-500 hover:-translate-y-2 hover:border-[#7C3AED]/60 sm:h-[340px] md:h-[370px]"
                >
                  {/* Poster */}
                  <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="z-0 object-cover object-center transition-transform duration-700 group-hover/card:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#09090F] via-[#09090F]/45 to-transparent" />
                  <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#09090F]/45 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-2">
                    <div className="rounded-full border border-[#7C3AED]/30 bg-[#09090F]/70 px-2.5 py-1.5 text-[10px] font-bold uppercase text-[#F9FAFB] backdrop-blur-md">
                      {movieData === "nowPlaying"
                        ? "Now"
                        : movieData === "topRated"
                          ? "Top"
                          : movieData}
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-[#FACC15]/30 bg-[#09090F]/70 px-2.5 py-1.5 text-[10px] font-bold text-[#F9FAFB] backdrop-blur-md">
                      <Star size={12} className="fill-[#FACC15] text-[#FACC15]" />
                      {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    </div>
                  </div>

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-all duration-300 group-hover/card:opacity-100">
                    <button className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-[#F9FAFB] shadow-xl shadow-[#7C3AED]/30 transition-all duration-300 hover:scale-110">
                      <Play size={22} fill="white" />
                    </button>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 p-3">
                    <h3 className="font-heading mb-2 line-clamp-2 text-xl leading-none tracking-wide text-[#F9FAFB] drop-shadow-xl sm:text-2xl">
                      {title}
                    </h3>

                    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-[#9CA3AF]">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {year}
                      </div>

                      <div className="flex items-center gap-1 uppercase">
                        <Globe size={12} />
                        {movie.original_language || "EN"}
                      </div>
                    </div>

                    <button
                      onClick={() => { router.push(`/details/movies/${movie.id}`) }}
                      className=" cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] px-4 py-2.5 text-xs font-bold text-[#F9FAFB] shadow-lg shadow-[#7C3AED]/20 transition-all duration-300 hover:scale-[1.03] active:scale-95 sm:text-sm">
                      <Play size={14} fill="white" />
                      Watch Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center rounded-[24px] border border-white/10 bg-[#111827]">
            <p className="text-sm text-[#9CA3AF]">No movies found.</p>
          </div>
        )}
      </section>

      {/* -------- TV Section -------- */}

      <section id="Series" className="w-full px-3 pt-10 md:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h2 className="font-heading text-4xl tracking-wide text-[#F9FAFB] sm:text-5xl">
                TV Series
              </h2>

              <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6]" />
            </div>

            <p className="max-w-xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
              Explore popular, top rated, upcoming and now playing TV series.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-[#111827] p-1.5 shadow-lg shadow-black/20 sm:grid-cols-4 lg:flex lg:w-fit">
            {[
              { label: "AIRING TODAY", value: "airingToday" },
              { label: "ON THE AIR", value: "onTheAir" },
              { label: "POPULAR", value: "popular" },
              { label: "TOP RATED", value: "topRated" },
            ].map((item) => (
              <Button
                key={item.value}
                onClick={() => setTvData(item.value)}
                className={`
        h-10
        w-full
        rounded-xl
        px-3
        text-[11px]
        font-bold
        transition-all
        duration-300
        sm:text-xs
        lg:w-auto
        lg:px-4
        ${tvData === item.value
                    ? "bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-[#F9FAFB] shadow-md shadow-[#7C3AED]/25"
                    : "bg-transparent text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]"
                  }
      `}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loader Grid */}
        {tvLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="relative h-[310px] overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] sm:h-[340px] md:h-[370px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#111827] via-[#182033] to-[#09090F]" />

                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div className="absolute left-3 top-3 h-7 w-16 rounded-full bg-[#09090F]/80" />
                <div className="absolute right-3 top-3 h-7 w-14 rounded-full bg-[#09090F]/80" />

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="mb-3 h-6 w-4/5 rounded-lg bg-white/10" />
                  <div className="mb-2 h-4 w-3/5 rounded bg-white/10" />
                  <div className="h-10 w-full rounded-full bg-gradient-to-r from-[#7C3AED]/35 to-[#3B82F6]/35" />
                </div>
              </div>
            ))}
          </div>
        ) : actualTvData.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {actualTvData.map((movie, i) => {
              const title =
                movie.title ||
                movie.name ||
                movie.original_title ||
                movie.original_name ||
                "Untitled";

              const year =
                movie.release_date?.split("-")[0] ||
                movie.first_air_date?.split("-")[0] ||
                "Unknown";

              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w1920${movie.poster_path}`
                : "/fallback-poster.jpg";

              return (
                <div
                  key={movie.id || i}
                  className="group/card relative h-[310px] overflow-hidden rounded-[22px] border border-white/10 bg-[#111827] shadow-lg shadow-black/30 transition-all duration-500 hover:-translate-y-2 hover:border-[#7C3AED]/60 sm:h-[340px] md:h-[370px]"
                >
                  {/* Poster */}
                  <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="z-0 object-cover object-center transition-transform duration-700 group-hover/card:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#09090F] via-[#09090F]/45 to-transparent" />
                  <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#09090F]/45 via-transparent to-transparent opacity-80" />

                  {/* Top Badges */}
                  <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between gap-2">
                    <div className="rounded-full border border-[#7C3AED]/30 bg-[#09090F]/70 px-2.5 py-1.5 text-[10px] font-bold uppercase text-[#F9FAFB] backdrop-blur-md">
                      {movieData === "nowPlaying"
                        ? "Now"
                        : movieData === "topRated"
                          ? "Top"
                          : movieData}
                    </div>

                    <div className="flex items-center gap-1 rounded-full border border-[#FACC15]/30 bg-[#09090F]/70 px-2.5 py-1.5 text-[10px] font-bold text-[#F9FAFB] backdrop-blur-md">
                      <Star size={12} className="fill-[#FACC15] text-[#FACC15]" />
                      {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                    </div>
                  </div>

                  {/* Hover Play Button */}
                  <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-all duration-300 group-hover/card:opacity-100">
                    <button className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-[#F9FAFB] shadow-xl shadow-[#7C3AED]/30 transition-all duration-300 hover:scale-110">
                      <Play size={22} fill="white" />
                    </button>
                  </div>

                  {/* Bottom Content */}
                  <div className="absolute bottom-0 left-0 right-0 z-30 p-3">
                    <h3 className="font-heading mb-2 line-clamp-2 text-xl leading-none tracking-wide text-[#F9FAFB] drop-shadow-xl sm:text-2xl">
                      {title}
                    </h3>

                    <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-[#9CA3AF]">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {year}
                      </div>

                      <div className="flex items-center gap-1 uppercase">
                        <Globe size={12} />
                        {movie.original_language || "EN"}
                      </div>
                    </div>

                    <button
                      onClick={() => { router.push(`/details/series/${movie.id}`) }}
                      className="cursor-pointer flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] px-4 py-2.5 text-xs font-bold text-[#F9FAFB] shadow-lg shadow-[#7C3AED]/20 transition-all duration-300 hover:scale-[1.03] active:scale-95 sm:text-sm">
                      <Play size={14} fill="white" />
                      Watch Now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[300px] items-center justify-center rounded-[24px] border border-white/10 bg-[#111827]">
            <p className="text-sm text-[#9CA3AF]">No movies found.</p>
          </div>
        )}
      </section>


      {/* -------- GENRES ----------- */}

      <section id="Genres" className="w-full px-3 pt-12 pb-16 md:px-8">
        <div className="rounded-[30px] border border-white/10 bg-[#111827]/70 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-3">
                <h2 className="font-heading text-4xl tracking-wide text-[#F9FAFB] sm:text-5xl">
                  GENRES
                </h2>

                <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6]" />
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-[#9CA3AF] sm:text-base">
                Browse movies and TV series by mood, category and style.
              </p>
            </div>

            <div className="w-fit rounded-full border border-[#7C3AED]/25 bg-[#09090F]/80 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#9CA3AF]">
              Explore Genres
            </div>
          </div>

          {/* Movie Genres */}
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-3xl tracking-wide text-[#F9FAFB] sm:text-4xl">
                  Movie Genres
                </h3>

                <p className="text-xs text-[#9CA3AF] sm:text-sm">
                  Find films by category
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-[#09090F] px-3 py-1.5 text-xs font-bold text-[#9CA3AF]">
                {movieGenre.length} Genres
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movieGenre.map((genre, i) => (
                <button
                  key={genre.id || i}
                  className="
              group
              relative
              min-h-[92px]
              cursor-pointer
              overflow-hidden
              rounded-[22px]
              border
              border-white/10
              bg-[#09090F]/80
              p-4
              text-left
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#7C3AED]/60
              hover:bg-[#7C3AED]/10
              active:scale-95
            "
                >
                  <div className="absolute right-[-20px] top-[-20px] h-20 w-20 rounded-full bg-[#7C3AED]/20 blur-2xl transition group-hover:bg-[#3B82F6]/25" />

                  <div className="relative z-10">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#7C3AED]/20 text-sm font-black text-[#A855F7] transition-all duration-300 group-hover:bg-[#7C3AED] group-hover:text-[#F9FAFB]">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <h4 className="line-clamp-1 text-sm font-bold text-[#F9FAFB] sm:text-base">
                      {genre.name}
                    </h4>

                    <p className="mt-1 text-[11px] font-medium text-[#9CA3AF]">
                      Explore movies
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TV Genres */}
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-heading text-3xl tracking-wide text-[#F9FAFB] sm:text-4xl">
                  TV Genres
                </h3>

                <p className="text-xs text-[#9CA3AF] sm:text-sm">
                  Find series by category
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-[#09090F] px-3 py-1.5 text-xs font-bold text-[#9CA3AF]">
                {tvGenre.length} Genres
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {tvGenre.map((genre, i) => (
                <button
                  key={genre.id || i}
                  className="
              group
              relative
              min-h-[92px]
              cursor-pointer
              overflow-hidden
              rounded-[22px]
              border
              border-white/10
              bg-[#09090F]/80
              p-4
              text-left
              transition-all
              duration-300
              hover:-translate-y-1
              hover:border-[#3B82F6]/60
              hover:bg-[#3B82F6]/10
              active:scale-95
            "
                >
                  <div className="absolute right-[-20px] top-[-20px] h-20 w-20 rounded-full bg-[#3B82F6]/20 blur-2xl transition group-hover:bg-[#A855F7]/25" />

                  <div className="relative z-10">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#3B82F6]/20 text-sm font-black text-[#3B82F6] transition-all duration-300 group-hover:bg-[#3B82F6] group-hover:text-[#F9FAFB]">
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <h4 className="line-clamp-1 text-sm font-bold text-[#F9FAFB] sm:text-base">
                      {genre.name}
                    </h4>

                    <p className="mt-1 text-[11px] font-medium text-[#9CA3AF]">
                      Explore series
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* -------------FOOTER----------- */}

      <Footer />

    </div>
  );
};

export default HomePage;