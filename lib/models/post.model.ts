import mongoose from "mongoose";



const postSchema = new mongoose.Schema({
    id: { type: String },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    quotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quote' }],
    postImages:[{type:String}],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
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


const Post = mongoose.models.Post || mongoose.model('Post', postSchema)

export default Post;