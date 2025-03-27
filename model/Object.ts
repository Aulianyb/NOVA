import mongoose from "mongoose";
const { Schema } = mongoose;
import { Position } from "@xyflow/react";

const object = new Schema({
    objectName : {type : String, required: [true, "Object name required"]},
    objectPicture : {type: String, required: [true, "Profile image required"]},
    objectDescription : {type : String},
    images : [{type : Schema.Types.ObjectId, ref: 'Image'}],
    relationships : [{type : Schema.Types.ObjectId, ref: 'Relationship'}],
    tags : [{type: Schema.Types.ObjectId, red: 'Tag'}],
    position : {type : Position, required:[true, "Object position required"]}
}, { timestamps: true });

export default mongoose.models.Object || mongoose.model("Object", object);