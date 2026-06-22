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