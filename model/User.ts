import mongoose from "mongoose";
const { Schema } = mongoose;

const notification = new Schema({
    sender : {type : Schema.Types.ObjectId, ref : 'User'},
    worldID : {type : Schema.Types.ObjectId, ref : 'World'},
    status : {type : String, enum : ['pending', 'rejected', 'accepted', 'kicked'], default : 'pending'}
}, {timestamps : true})

const user = new Schema({
    username: {type : String, unique: true, required: [true, "username required"]},
    password : {type : String, required: [true, "username required"]},
    ownedWorlds : [{ type: Schema.Types.ObjectId, ref: 'World' }],
    notifications : [notification]
}, {timestamps: true}); 

export default mongoose.models.User || mongoose.model("User", user);