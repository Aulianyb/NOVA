import mongoose from "mongoose";
const { Schema } = mongoose;

const image = new Schema({
    imageLink : {type : String, required: [true, "Image link required"]},
    imageTitle : {type : String},
    objects : [{ type: Schema.Types.ObjectId, ref: 'Object' }],
}, { timestamps: true });

export default mongoose.models.Image || mongoose.model("Image", image);