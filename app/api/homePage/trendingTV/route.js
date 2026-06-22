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

    if (body.type == "airingToday") {
        const api = await fetch("https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
    if (body.type == "onTheAir") {
        const api = await fetch("https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
    if (body.type == "popular") {
        const api = await fetch("https://api.themoviedb.org/3/tv/popular?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
    if (body.type == "topRated") {
        const api = await fetch("https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
}