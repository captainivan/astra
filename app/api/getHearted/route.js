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

    if (body.data.type == "movie") {
        try {
            const api = await fetch(`https://api.themoviedb.org/3/movie/${body.data.id}?language=en-US`, options);
            const MovieRes = await api.json();
            return NextResponse.json({ message: "sucess", MovieRes });
        } catch (error) {
            return NextResponse.json({ message: "error", error })
        }
    } else {
        try {
            const api = await fetch(`https://api.themoviedb.org/3/tv/${body.data.id}?language=en-US`, options);
            const MovieRes = await api.json();
            return NextResponse.json({ message: "sucess", MovieRes });
        } catch (error) {
            return NextResponse.json({ message: "error", error })
        }
    }
}