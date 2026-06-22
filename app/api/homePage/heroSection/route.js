import { NextResponse } from "next/server";


export async function GET(req) {
    try {
        const api = await fetch('https://api.themoviedb.org/3/trending/all/day?language=en-US', {
            method: "GET",
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_API_KEY}`
            }
        });
        const data = await api.json();
        return NextResponse.json({ message: "success", data })
    } catch (error) {
        return NextResponse.json({ message: "failure", error })
    }
}