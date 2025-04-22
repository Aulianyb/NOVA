import mongoose from "mongoose";
const { Schema } = mongoose;

const tag = new Schema({tagName: 'string'}); 

export default mongoose.models.Tag || mongoose.model("Tag", tag);