import mongoose from "mongoose";
import Tag from "./tag.model";


const postSchema = new mongoose.Schema({
    id: { type: String },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    review: [{
        type: String,
        required: false,
    }],
    quotes:[
        {type:String,required:false},
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    image: String,
    saved:{type:Number},
    genre:{type:String},
    score:{type:Number},
    affiliateUrl:{type:String},
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }],
})
postSchema.index({ review: 'text' });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema)

export default Post;