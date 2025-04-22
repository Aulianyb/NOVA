import mongoose from "mongoose";
const { Schema } = mongoose;

const user = new Schema({
    username: {type : String, unique: true, required: [true, "username required"]},
    password : {type : String, required: [true, "username required"]},
    ownedWorlds : [{ type: Schema.Types.ObjectId, ref: 'World' }],
    changes : [{ type: Schema.Types.ObjectId, ref: 'Changes' }]
}, {timestamps: true}); 

export default mongoose.models.User || mongoose.model("User", user);