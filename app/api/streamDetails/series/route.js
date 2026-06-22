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
        const seriesDetails = await fetch(`https://api.themoviedb.org/3/tv/${body.id}?language=en-US`, options);
        const seriesDetailsJson = await seriesDetails.json();

        const seasonDetailsOfSeries = await fetch(`https://api.themoviedb.org/3/tv/${body.id}/season/${body.seasonNumber}?language=en-US`, options);
        const seasonDetailsOfSeriesJson = await seasonDetailsOfSeries.json();

        const seriesReviews = await fetch(`https://api.themoviedb.org/3/tv/${body.id}/reviews?language=en-US&page=1`, options);
        const seriesReviewsJson = await seriesReviews.json();

        const simillarSeries = await fetch(`https://api.themoviedb.org/3/tv/${body.id}/similar?language=en-US&page=1`, options);
        const simillarSeriesJson = await simillarSeries.json();

        const recomendedSeries = await fetch(`https://api.themoviedb.org/3/tv/${body.id}/recommendations?language=en-US&page=1`, options);
        const recomendedSeriesJson = await recomendedSeries.json();

        return NextResponse.json({ message: "sucess", seriesDetailsJson, seasonDetailsOfSeriesJson, seriesReviewsJson, simillarSeriesJson, recomendedSeriesJson })

    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}