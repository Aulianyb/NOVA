import { NextResponse } from "next/server";

export function errorhandling(error : unknown){
    console.log(error);
    if (error instanceof Error) {
        if (error.message === "No session found" || error.message === "You are not the owner of this world") {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
        { message : error },
        { status: 500 }
    );
}