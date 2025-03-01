import mongoose from "mongoose";
const { Schema } = mongoose;

const world = new Schema({
    worldName: { type: String, required: [true, "World name required"] },
    worldDescription: { type: String },
    owners: [String],
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    object: [{ type: Schema.Types.ObjectId, ref: 'Object' }],
    changes: [{ type: Schema.Types.ObjectId, ref: 'Changes' }],
}, { timestamps: true });

export default mongoose.models.World || mongoose.model("World", world);