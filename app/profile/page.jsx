"use client";

import { Button } from "@/components/ui/button";
import {
    Calendar,
    Clock,
    Film,
    Heart,
    History,
    Loader2,
    Play,
    Star,
    Tv,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w780";

const Page = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("history");

    const [heart, setHeart] = useState([]);
    const [heartLoading, setHeartLoading] = useState(false);

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        const data = async () => {
            setHistoryLoading(true);

            try {
                const getHistory = JSON.parse(localStorage.getItem("History") || "[]");

                console.log("the history is --------", getHistory);

                if (getHistory.length === 0) {
                    setHistory([]);
                    return;
                }

                const arr = [];

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
        const data = async () => {
            setHeartLoading(true);

            try {
                const getHearted = JSON.parse(localStorage.getItem("Hearted") || "[]");
                const arr = [];


                if (getHearted.length === 0) {
                    setHeart([]);
                    return;
                }

                for (let i = 0; i < getHearted.length; i++) {
                    const api = await fetch(`/api/getHearted`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            data: getHearted[i],
                        }),
                    });

                    const res = await api.json();

                    arr.push({
                        type: getHearted[i].type === "movie" ? "movie" : "series",
                        response: res.MovieRes,
                        heartData: getHearted[i],
                    });
                }

                console.log("final heart data --------", arr);
                setHeart(arr.reverse());
            } catch (error) {
                console.log(error);
                setHeart([]);
            } finally {
                setHeartLoading(false);
            }
        };

        data();
    }, []);

    const getTitle = (item) => {
        const data = item?.response;

        return (
            data?.title ||
            data?.name ||
            data?.original_title ||
            data?.original_name ||
            "Untitled"
        );
    };

    const getOverview = (item) => {
        return item?.response?.overview || "No overview available.";
    };

    const getPoster = (item) => {
        const poster = item?.response?.poster_path;
        if (!poster) return null;

        return `${TMDB_IMAGE_BASE_URL}${poster}`;
    };

    const getBackdrop = (item) => {
        const backdrop = item?.response?.backdrop_path;
        if (!backdrop) return null;

        return `${TMDB_BACKDROP_BASE_URL}${backdrop}`;
    };

    const getStillPath = (item) => {
        const stillPath = item?.response?.still_path;

        if (!stillPath) return null;

        return `${TMDB_IMAGE_BASE_URL}${stillPath}`;
    }

    const getDate = (item) => {
        return item?.response?.release_date || item?.response?.first_air_date || "";
    };

    const getYear = (item) => {
        const date = getDate(item);
        if (!date) return "Unknown";

        return date.split("-")[0];
    };

    const getRating = (item) => {
        return Number(item?.response?.vote_average || 0).toFixed(1);
    };

    const handleCardClick = (item) => {
        if (item.type === "movie") {
            const movieId = item?.response?.id || item?.historyData?.movie || item?.heartData?.id;
            router.push(`/stream/movies/${movieId}`);
            return;
        }

        const seriesId =  item?.historyData?.series;
        const epsiode = item?.historyData?.episode;
        const season = item?.historyData?.season;
        router.push(`/stream/series/${seriesId}/${season}/${epsiode}`);
    };

    const handleHistoryRemove = (id, type) => {
        const getHistory = JSON.parse(localStorage.getItem("History") || "[]");

        let filteredHistory;

        if (type === "movie") {
            filteredHistory = getHistory.filter((item) => {
                return String(item.movie) !== String(id);
            });
        } else {
            filteredHistory = getHistory.filter((item) => {
                return !(
                    String(item.series) === String(id.series) &&
                    String(item.season) === String(id.season) &&
                    String(item.episode) === String(id.episode)
                );
            });
        }

        localStorage.setItem("History", JSON.stringify(filteredHistory));
        window.location.reload();
    };

    const activeData = activeTab === "history" ? history : heart;
    const activeLoading = activeTab === "history" ? historyLoading : heartLoading;

    return (
        <main className="min-h-screen overflow-x-hidden bg-[#050509] text-white">
            <NavBar />
            {/* Background Effects */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[#7C3AED]/20 blur-[120px]" />
                <div className="absolute right-[-120px] top-[240px] h-80 w-80 rounded-full bg-[#3B82F6]/10 blur-[130px]" />
                <div className="absolute bottom-[-160px] left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#7C3AED]/10 blur-[150px]" />
            </div>

            <section className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
                {/* Header */}
                <div className="mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-7 md:p-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#C4B5FD]">
                                <Play size={14} />
                                Your Library
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                                Watch Space
                            </h1>

                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45 sm:text-base">
                                Continue from your watch history or jump back into your favorite
                                hearted movies and series.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:flex">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                <p className="text-xs font-semibold text-white/35">History</p>
                                <p className="mt-1 text-2xl font-black text-white">
                                    {history.length}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                                <p className="text-xs font-semibold text-white/35">Hearted</p>
                                <p className="mt-1 text-2xl font-black text-white">
                                    {heart.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="sticky top-16 z-30 mb-7 rounded-3xl border border-white/10 bg-[#09090F]/85 p-2 backdrop-blur-2xl md:top-20">
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            type="button"
                            onClick={() => setActiveTab("history")}
                            className={`h-12 rounded-2xl text-sm font-bold transition-all sm:h-14 sm:text-base ${activeTab === "history"
                                ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30 hover:bg-[#7C3AED]"
                                : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
                                }`}
                        >
                            <History size={18} />
                            History
                        </Button>

                        <Button
                            type="button"
                            onClick={() => setActiveTab("hearted")}
                            className={`h-12 rounded-2xl text-sm font-bold transition-all sm:h-14 sm:text-base ${activeTab === "hearted"
                                ? "bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30 hover:bg-[#7C3AED]"
                                : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
                                }`}
                        >
                            <Heart
                                size={18}
                                className={
                                    activeTab === "hearted"
                                        ? "fill-white text-white"
                                        : "text-white/50"
                                }
                            />
                            Hearted
                        </Button>
                    </div>
                </div>

                {/* Section Title */}
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-white sm:text-2xl">
                            {activeTab === "history" ? "Recently Watched" : "Your Favorites"}
                        </h2>
                        <p className="mt-1 text-sm text-white/40">
                            {activeTab === "history"
                                ? "Movies and episodes you watched recently."
                                : "Movies and series you saved by hearting them."}
                        </p>
                    </div>

                    <div className="hidden rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold text-white/40 sm:block">
                        {activeData.length} items
                    </div>
                </div>

                {/* Loading */}
                {activeLoading && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-3"
                            >
                                <div className="h-52 animate-pulse rounded-[1.3rem] bg-white/10" />
                                <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
                                <div className="mt-3 h-3 w-1/2 animate-pulse rounded-full bg-white/10" />
                                <div className="mt-4 h-9 w-full animate-pulse rounded-full bg-white/10" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty */}
                {!activeLoading && activeData.length === 0 && (
                    <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-12">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05]">
                            {activeTab === "history" ? (
                                <History size={28} className="text-white/45" />
                            ) : (
                                <Heart size={28} className="text-white/45" />
                            )}
                        </div>

                        <h3 className="mt-5 text-xl font-black text-white">
                            {activeTab === "history"
                                ? "No history found"
                                : "No hearted items yet"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/40">
                            {activeTab === "history"
                                ? "Start watching a movie or series and it will appear here."
                                : "Tap the heart button on any movie or series to save it here."}
                        </p>

                        <Button
                            onClick={() => router.push("/")}
                            className="mt-6 rounded-full bg-[#7C3AED] px-6 py-2 font-bold text-white hover:bg-[#6D28D9]"
                        >
                            Browse Now
                        </Button>
                    </div>
                )}

                {/* Cards */}
                {!activeLoading && activeData.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {activeData.map((item, index) => {
                            const title = getTitle(item);
                            const poster = getPoster(item);
                            const backdrop = getBackdrop(item);
                            const stillPath = getStillPath(item);
                            const isMovie = item.type === "movie";
                            const type = item.historyData;


                            return (
                                <div
                                    key={`${item.type}-${item?.response?.id || index}`}
                                    className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.035] p-3 text-left shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/50 hover:bg-white/[0.06] active:scale-[0.98]"
                                >
                                    {/* Poster / Backdrop */}
                                    <div className="relative h-56 overflow-hidden rounded-[1.3rem] border border-white/10 bg-white/[0.05] sm:h-60">
                                        {poster || backdrop || stillPath ? (
                                            <Image
                                                src={poster || backdrop || stillPath}
                                                alt={title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 300px"
                                                className="object-cover transition duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <Film size={38} className="text-white/25" />
                                            </div>
                                        )}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                                        {/* Type Badge */}
                                        <div className="absolute w-full top-3 flex items-center justify-between p-2">
                                            <div
                                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold backdrop-blur-xl ${isMovie
                                                    ? "border-[#7C3AED]/40 bg-[#7C3AED]/25 text-[#DDD6FE]"
                                                    : "border-[#3B82F6]/40 bg-[#3B82F6]/20 text-[#BFDBFE]"
                                                    }`}
                                            >
                                                {isMovie ? <Film size={13} /> : <Tv size={13} />}
                                                {isMovie ? "Movie" : "Series"}
                                            </div>
                                            <div>
                                                {type ? <Button onClick={() => { isMovie ? handleHistoryRemove(item.historyData.movie, "movie") : handleHistoryRemove(item.historyData, "series") }} className={`cursor-pointer rounded-full `}><X /></Button> : <></>}
                                            </div>
                                        </div>

                                        {/* Heart Badge */}
                                        {activeTab === "hearted" && (
                                            <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-red-400/30 bg-red-500/20 backdrop-blur-xl">
                                                <Heart size={16} className="fill-red-500 text-red-500" />
                                            </div>
                                        )}

                                        {/* Play Button */}
                                        <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-xl transition duration-300 group-hover:scale-110">
                                            <Play size={17} className="fill-black" />
                                        </div>

                                        {/* Episode Info */}
                                        {!isMovie && item?.historyData?.episode && (
                                            <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs font-bold text-white backdrop-blur-xl">
                                                S{item.historyData.season} · E{item.historyData.episode}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="px-1 pb-1 pt-4">
                                        <h3 className="line-clamp-1 text-base font-black text-white">
                                            {title}
                                        </h3>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/45">
                                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                                                <Calendar size={12} />
                                                {getYear(item)}
                                            </span>

                                            <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2 py-1 text-yellow-200">
                                                <Star size={12} className="fill-yellow-300 text-yellow-300" />
                                                {getRating(item)}
                                            </span>

                                            {item?.response?.runtime && (
                                                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1">
                                                    <Clock size={12} />
                                                    {item.response.runtime}m
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/40">
                                            {getOverview(item)}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/25">
                                                    {activeTab === "history"
                                                        ? <Button onClick={() => handleCardClick(item)} className={`cursor-pointer bg-[#7C3AED] text-white w-full  rounded-xl`}>Continue Watching</Button>
                                                        : "Saved Item"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Page;