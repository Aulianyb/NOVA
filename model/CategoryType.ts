import mongoose from "mongoose";
const { Schema } = mongoose;

const categoryType = new Schema({
    typeName : {type : String, required: [true, "Type name required"]},
    tags : [{type : Schema.Types.ObjectId, ref: 'CategoryTag'}],
}, { timestamps: true });

export default mongoose.models.CategoryType || mongoose.model("CategoryType", categoryType);