import mongoose from "mongoose";
const { Schema } = mongoose;

const tag = new Schema({
    tagName: {type : String},
    tagColor : {type : String},
    tagObjects :  [{type : Schema.Types.ObjectId, ref : 'Object'}],
    tagRelationships :  [{type : Schema.Types.ObjectId, ref : 'Relationship'}]
}); 

export default mongoose.models.Tag || mongoose.model("Tag", tag);