import { NextRequest, NextResponse } from 'next/server';
import User from '../../../../../model/User'
import jwt from 'jsonwebtoken'
import { Session, setSession } from '../session/route';

 
export async function POST(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const data = await req.json();
    const bcrypt = require('bcrypt');

    console.log(data.username)
    const user = await User.where({ username : data.username }).findOne()
    console.log(user)
    if (!user) throw new Error('User not found')


    const validPassword = await bcrypt.compare(data.password, user.password)
    if (!validPassword) throw new Error('Invalid Password')
    
    const tokenData = {
      id : user._id,
      username : user.username
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw new Error('JWT_SECRET not defined')
    const token = await jwt.sign(tokenData, JWT_SECRET!)
    const res = NextResponse.json({message : "Login successful", token}, {status: 200}) 
    const session : Session = {
      username : user.username,
      token : token
    }
    await setSession(session)
    // res.cookies.set("token", token, {httpOnly:true})
    return res;

  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}