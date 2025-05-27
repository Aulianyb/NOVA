import mongoose from "mongoose";
const { Schema } = mongoose;

const tag = new Schema({
    tagName: 'string',
    tagColor : 'string',
    tagObjects :  [{type : Schema.Types.ObjectId, ref : 'Object'}],
    tagRelationships :  [{type : Schema.Types.ObjectId, ref : 'Relationships'}]
}); 

export default mongoose.models.Tag || mongoose.model("Tag", tag);