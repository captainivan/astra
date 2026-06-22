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
    try {
        const api = await fetch(`https://api.themoviedb.org/3/search/multi?query=${body.text}&include_adult=true&language=en-US&page=1`, options);
        const response = await api.json();
        return NextResponse.json({ message: "sucess", response })
    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}