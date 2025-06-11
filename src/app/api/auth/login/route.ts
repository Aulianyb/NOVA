import { NextRequest, NextResponse } from 'next/server';
import User from '@model/User'
import jwt from 'jsonwebtoken'
import { Session, setSession } from '../session';
import * as bcrypt from 'bcrypt';  
import { connectToMongoDB } from '@/app/lib/connect';
import { verifyUser } from '../../function';
import { errorHandling } from '../../function';

export async function POST(
  req: NextRequest
) {
  try {
    await connectToMongoDB();
    const data = await req.json();
    const user = await User.where({ username : data.username }).findOne()
    const userID = await verifyUser();
    if (userID) {
        throw new Error("User already logged in"); 
    }

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
      id : user._id,
      username : user.username,
      token : token
    }
    await setSession(session)
    return res;

  } catch (error) {
    return errorHandling(error); 
  }
}