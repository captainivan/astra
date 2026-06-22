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

    if (body.historyData.movie) {
        const api = await fetch(`https://api.themoviedb.org/3/movie/${body.historyData.movie}?language=en-US`,options);
        const MovieRes  = await api.json();
        return NextResponse.json({ message: MovieRes });
    } else {
        const api = await fetch(`https://api.themoviedb.org/3/tv/${body.historyData.series}/season/${body.historyData.season}/episode/${body.historyData.episode}?language=en-US`,options);
        const SeriesRes  = await api.json();
        return NextResponse.json({ message: SeriesRes });
    }
}