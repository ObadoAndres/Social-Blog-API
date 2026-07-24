import mongoose from "mongoose";

const postSchema = new mongoose.Schema({

author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required:true,
},

title : {
    type:String,
    trim: true,
    required: true,
},

content: {
    type: String,
    trim: true,
    required: true,
},

likesCount : {
    type: Number,
    default: 0,
},

commentsCount : {
    type: Number,
    default: 0,
},

shareCount: {
    type: Number,
    default:0
}


}, { timestamps : true});

export default mongoose.model("Post", postSchema);