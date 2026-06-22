import { NextResponse } from "next/server";


export async function POST(req) {
    const body = await req.json();
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    };

    if (body.type == "nowPlaying") {
        const api = await fetch("https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
    if (body.type == "popular") {
        const api = await fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
    if (body.type == "topRated") {
        const api = await fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
    if (body.type == "upcoming") {
        const api = await fetch("https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
}