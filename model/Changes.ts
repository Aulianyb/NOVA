import mongoose from "mongoose";
const { Schema } = mongoose;

const changes = new Schema({
    description : {type : String, required: [true, "Description required"]},
}, { timestamps: true });

export default mongoose.models.Changes || mongoose.model("Changes", changes);