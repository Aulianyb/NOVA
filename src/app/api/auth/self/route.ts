import { NextResponse } from "next/server";
import { getSession } from "../session/route";

export async function GET(
  res : NextResponse
){
    const session = await getSession(); 
    if (!session){
        res = NextResponse.json({message : "No session found"}, {status: 401});
    } else {
        res = NextResponse.json({message : "User Authenticated", session : session}, {status: 200}) 
    }
    return res;
}