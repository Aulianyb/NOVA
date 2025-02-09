import mongoose, {Connection} from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    throw new Error("DATABASE_URL undefined")
}

let cached: Connection | null = null;

export async function connectToMongoDB(){
    if (cached) {
        console.log("Using cached DB connection")
        return cached;
    }
    try{
        const cnt = await mongoose.connect(DATABASE_URL!)
        cached = cnt.connection;
        console.log("New connection has been established");
        return cached;
    } catch (error){
        console.log(error);
        throw error;
    }
}