import mongoose from "mongoose"
const postSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: String,
    tags: [String],
    location: String,
    image: String,
    // author:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const Post = mongoose.model('Post', postSchema);