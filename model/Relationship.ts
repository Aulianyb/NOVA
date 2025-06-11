import mongoose from "mongoose";
const { Schema } = mongoose; 

const relationship = new Schema({
    relationshipDescription : {type : String, required: [true, "Object name required"]},
    source : {type : Schema.Types.ObjectId, ref: 'Object'},
    target : {type : Schema.Types.ObjectId, ref: 'Object'},
    tags : [{type : Schema.Types.ObjectId, ref: 'Tag'}],
    mainTag : {type : Schema.Types.ObjectId, ref: 'Tag'},
    story: { type: String },
    info: {
        sourceToTarget: { type: String }, 
        targetToSource: { type: String } 
    },
}, { timestamps: true });

export default mongoose.models.Relationship || mongoose.model("Relationship", relationship);