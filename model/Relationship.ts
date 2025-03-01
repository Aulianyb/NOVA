import mongoose from "mongoose";
const { Schema } = mongoose;

const relationship = new Schema({
    relationshipDesc : {type : String, required: [true, "Object name required"]},
    objects : [{type : Schema.Types.ObjectId, ref: 'Object'}],
    tags : [{type : Schema.Types.ObjectId, ref: 'CategoryTag'}],
}, { timestamps: true });

export default mongoose.models.Relationship || mongoose.model("Relationship", relationship);