import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: {type:String, required:true},
    image: String,
    bio: String,
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    postLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    quoteLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    }],
    reviewLiked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    imageLiked: [{
        type: String
    }],
    savedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    postSaved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    quoteSaved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quote'
    }],
    reviewSaved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    imageSaved: [{
        type: String
    }],
    onboarded: {
        type: Boolean,
        default: false,
    },
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community'
        }
    ],
    genres: [
        {
            type: String
        }
    ],
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    follow: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User;