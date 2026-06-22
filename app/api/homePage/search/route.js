import { NextResponse } from "next/server";



export async function POST(req) {
    const body = await req.json();
    try {
        const api = await fetch(`https://api.themoviedb.org/3/search/multi?query=${body.text}&include_adult=true&language=en-US&page=1`, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmEwMGZiMDQ5ZTQwMDBmZmE4MDM2M2FhNDMwM2M5OCIsIm5iZiI6MTc4MTMyNTY2MC41MTcsInN1YiI6IjZhMmNkZjVjNWZmYmE0ODBkZjIzMjZmNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2hvE_YnDD41IQjPSUQY7yEtP8bdkvfnmAbkcwZC_wRc'
            }
        });
        const response = await api.json();
        return NextResponse.json({ message: "sucess", response })
    } catch (error) {
        return NextResponse.json({ message: "error", error })
    }
}