import { NextResponse } from "next/server";
import { getSession } from "../session/route";

export async function GET(
  res : NextResponse
){
    const session = await getSession(); 
    res = NextResponse.json({session : session}, {status: 200}) 
    return res;
}