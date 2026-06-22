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
    
    if (body.type == "TV") {
        const api = await fetch("https://api.themoviedb.org/3/trending/tv/week?language=en-US", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
    if (body.type == "Movies") {
        const api = await fetch("https://api.themoviedb.org/3/trending/movie/week?language=en-US", options);
        const res = await api.json();
        return NextResponse.json({ message: "sucess", res })
    }
}