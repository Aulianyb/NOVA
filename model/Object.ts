import mongoose from "mongoose";
const { Schema } = mongoose;

const object = new Schema({
    objectName : {type : String, required: [true, "Object name required"]},
    objectDescription : {type : String},
    images : [{type : Schema.Types.ObjectId, ref: 'Image'}],
    relationships : [{type : Schema.Types.ObjectId, ref: 'Relationship'}],
    tags : [{type : Schema.Types.ObjectId, ref: 'CategoryTag'}],
}, { timestamps: true });

export default mongoose.models.Object || mongoose.model("Object", object);