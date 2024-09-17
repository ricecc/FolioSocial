import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    like: { type: Number },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',  
        default: null
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'  
        }
    ],
   
    refType: {
        type: String,
        enum: ['Quote', 'Review'],  
        required: true
    },
    refId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
