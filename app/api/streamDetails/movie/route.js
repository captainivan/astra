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
        const api = await fetch(`https://api.themoviedb.org/3/movie/${body.id}?language=en-US`, options);
        const movieStreamRes = await api.json();

        const simillarMovieApi = await fetch(`https://api.themoviedb.org/3/movie/${body.id}/similar?language=en-US&page=1`,options);
        const simillarMovieRes = await simillarMovieApi.json();

        const recommendedMovieApi = await fetch(`https://api.themoviedb.org/3/movie/${body.id}/recommendations?language=en-US&page=1`,options);
        const recommendedMovieRes = await recommendedMovieApi.json();

        const reviewMoviesApi = await fetch(`https://api.themoviedb.org/3/movie/${body.id}/reviews?language=en-US&page=1`,options);
        const reviewMoviesRes = await reviewMoviesApi.json();

        return NextResponse.json({ message: "sucess", movieStreamRes, simillarMovieRes, recommendedMovieRes, reviewMoviesRes })
    } catch (error) {
        console.log(error);
        
        return NextResponse.json({ message: "error", error })
    }
}