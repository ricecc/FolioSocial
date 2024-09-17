import mongoose from "mongoose";



const quoteSchema = new mongoose.Schema({
    id: { type: String },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    page:{type:String},
    quote:{type:String},
    createdAt: {
        type: Date,
        default: Date.now,
    },
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
    
})
quoteSchema.index({ review: 'text' });

const Quote = mongoose.models.Quote || mongoose.model('Quote', quoteSchema)

export default Quote;