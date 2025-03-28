import mongoose from "mongoose";
const { Schema } = mongoose;

const object = new Schema({
    objectName : {type : String, required: [true, "Object name required"]},
    objectPicture : {type: String, required: [true, "Profile image required"]},
    objectDescription : {type : String},
    images : [{type : Schema.Types.ObjectId, ref: 'Image'}],
    relationships : [{type : Schema.Types.ObjectId, ref: 'Relationship'}],
    tags : [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    positionX : {type : Number, required:[true, "X position required"]},
    positionY : {type : Number, required:[true, "Y position required"]},
}, { timestamps: true });

export default mongoose.models.Object || mongoose.model("Object", object);