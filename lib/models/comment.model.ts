import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    like:{type:Number},
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
    ]
});

const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

export default Comment;
