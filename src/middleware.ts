import { NextRequest, NextResponse } from "next/server";
import {cookies} from "next/headers";
import { getSession } from "./app/api/auth/session/route";

const protectedRoutes = ['/home']
const publicRoutes = ['/login', '/signup', '/']

export default async function middleware(req: NextRequest){
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path)
    const isPublicRoute = publicRoutes.includes(path)

    const session = await getSession(); 
    
    if(isProtectedRoute && !session){
        return NextResponse.redirect('/login')
    }

    if (isPublicRoute && session?.username){
        // note self : KALAU FIX URL INI UBAH
        return NextResponse.redirect(new URL('/home', req.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}