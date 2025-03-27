import mongoose from "mongoose";
const { Schema } = mongoose;

const world = new Schema({
    worldName: { type: String, required: [true, "World name required"] },
    worldDescription: { type: String },
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    objects: [{ type: Schema.Types.ObjectId, ref: 'Object' }],
    changes: [{ type: Schema.Types.ObjectId, ref: 'Changes' }],
    tags : [{type : Schema.Types.ObjectId, ref: 'Tag'}]
}, { timestamps: true });

export default mongoose.models.World || mongoose.model("World", world);