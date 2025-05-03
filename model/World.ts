import mongoose from "mongoose";
const { Schema } = mongoose;

const changes = new Schema({
    description : {type : String, required: [true, "Description required"]},
    username  : {type : String, required: [true, "Description required"]}
}, { timestamps: true });

const world = new Schema({
    worldName: { type: String, required: [true, "World name required"] },
    worldDescription: { type: String },
    worldCover : {type : String},
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    objects: [{ type: Schema.Types.ObjectId, ref: 'Object' }],
    relationships : [{type: Schema.Types.ObjectId, ref : 'Relationship'}],
    changes: [changes],
    tags : [{type : Schema.Types.ObjectId, ref: 'Tag'}],
}, { timestamps: true });

export default mongoose.models.World || mongoose.model("World", world);