    import mongoose from "mongoose";

    const userSchema = new mongoose.Schema({
        id:{type:String, required: true},
        username: {type: String, required: true, unique: true},
        name:{type: String, required: true},
        image: String,
        bio: String,
        posts:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }],
        savedBooks:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }],
        onboarded:{
            type:Boolean,
            default: false,
        },
        communities:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'Community'
            }
        ],
        genres:[
            {
                type:String
            }
        ],
        follower:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ],
        follow:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:'User'
            }
        ]
    })

    const User = mongoose.models.User || mongoose.model('User', userSchema)

    export default User;