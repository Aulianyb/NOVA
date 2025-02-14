import { NextResponse } from "next/server";
import { getSession, removeSession } from "../session/route";

export async function POST(
  res : NextResponse
){
    const session = await getSession(); 
    if (!session) {
        res = NextResponse.json({message : "No session found"}, {status: 401});
    }
    await removeSession();
    res = NextResponse.json({message : "Logout successful"}, {status: 200});
    return res;
};