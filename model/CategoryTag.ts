import mongoose from "mongoose";
const { Schema } = mongoose;

const categoryTag = new Schema({
    tagName : {type : String, required: [true, "Tag name required"]},
}, { timestamps: true });

export default mongoose.models.CategoryTag || mongoose.model("CategoryTag", categoryTag);