import { NextResponse } from "next/server";



export async function POST(req) {
    const body = await req.json();
    const id = body.id;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`
        }
    };

    try {

        const getDetailsApi = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, options);
        const getDetailsApiRes = await getDetailsApi.json();

        const getAlterNativeDetailsApi = await fetch(`https://api.themoviedb.org/3/movie/${id}/alternative_titles?language=en-US`, options);
        const getAlterNativeDetailsApiRes = await getAlterNativeDetailsApi.json();

        const getCreditsApi = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`, options);
        const getCreditsApiRes = await getCreditsApi.json();

        const getKeyWordsApi = await fetch(`https://api.themoviedb.org/3/movie/${id}/keywords?language=en-US`, options);
        const getKeyWordsApiRes = await getKeyWordsApi.json();

        const getImagesApi = await fetch(`https://api.themoviedb.org/3/movie/${id}/images?language=en-US`, options);
        const getImagesApiRes = await getImagesApi.json();

        const getVideosApi = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options);
        const getVideosApiRes = await getVideosApi.json();

        const getWatchProviders = await fetch(`https://api.themoviedb.org/3/movie/${id}/watch/providers?language=en-US`, options);
        const getWatchProvidersRes = await getWatchProviders.json();

        return NextResponse.json({ message: "success", getDetailsApiRes, getAlterNativeDetailsApiRes, getCreditsApiRes, getKeyWordsApiRes, getImagesApiRes, getVideosApiRes, getWatchProvidersRes })

    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}