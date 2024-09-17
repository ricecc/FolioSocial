import mongoose from "mongoose";



const reviewSchema = new mongoose.Schema({
    id: { type: String },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    title:{type:String},
    review:{type:String},
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
    
})
reviewSchema.index({ review: 'text' });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)

export default Review;