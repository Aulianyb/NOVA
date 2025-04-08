import mongoose from "mongoose";
const { Schema } = mongoose;

const node = new Schema({
    nodeName : {type : String, required: [true, "Object name required"]},
    nodePicture : {type: String, required: [true, "Profile image required"]},
    nodeDescription : {type : String},
    images : [{type : Schema.Types.ObjectId, ref: 'Image'}],
    relationships : [{type : Schema.Types.ObjectId, ref: 'Relationship'}],
    tags : [{type: Schema.Types.ObjectId, ref: 'Tag'}],
    positionX : {type : Number, required:[true, "X position required"]},
    positionY : {type : Number, required:[true, "Y position required"]},
    worldID : {type : Schema.Types.ObjectId, ref : 'World'}
}, { timestamps: true });

export default mongoose.models.Node || mongoose.model("Node", node);