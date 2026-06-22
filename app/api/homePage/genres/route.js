import { NextResponse } from "next/server";


export async function GET(req) {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    };

    try {
        const movieApi = await fetch("https://api.themoviedb.org/3/genre/movie/list?language=en", options);
        const movieRes = await movieApi.json();
        const tvApi = await fetch("https://api.themoviedb.org/3/genre/tv/list?language=en", options);
        const tvRes = await tvApi.json();

        return NextResponse.json({message:"sucess",movieRes,tvRes})

    } catch (error) {
        return NextResponse.json({ message: "failure", error })
    }
}