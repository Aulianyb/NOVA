import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
    username: String,
    password : String,
    ownedWorlds : [String]
}, {timestamps: true}); 

export default mongoose.models.User || mongoose.model("User", user);