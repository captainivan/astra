import { NextResponse } from "next/server";


export async function POST(req) {
    const body = await req.json();
    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmEwMGZiMDQ5ZTQwMDBmZmE4MDM2M2FhNDMwM2M5OCIsIm5iZiI6MTc4MTMyNTY2MC41MTcsInN1YiI6IjZhMmNkZjVjNWZmYmE0ODBkZjIzMjZmNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2hvE_YnDD41IQjPSUQY7yEtP8bdkvfnmAbkcwZC_wRc'
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