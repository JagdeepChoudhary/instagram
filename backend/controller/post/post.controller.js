import sharp from 'sharp';
import cloudinary from '../../utils/cloudinary.js';
import mongoose from 'mongoose';
import { Post } from '../../models/post.js';
import { User } from '../../models/user.js';
import { Comment } from '../../models/comments.js';
import { getReciverSocketId, io } from '../../Socket/Socket.js';

export const bookmark = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found',
                success: false,
            });
        }

        // Check if the user exists
        const user = await User.findById(authorId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false,
            });
        }

        // Check if the post is already bookmarked
        if (user.bookmarks.includes(post._id)) {
            // Already bookmarked, remove from bookmarks
            await user.updateOne({ $pull: { bookmarks: post._id } });
            return res.status(200).json({
                type: 'unsaved',
                message: 'Post removed from bookmarks',
                success: true,
            });
        } else {
            // Add to bookmarks
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            return res.status(200).json({
                type: 'saved',
                message: 'Post bookmarked',
                success: true,
            });
        }
    } catch (error) {
        console.error('Error bookmarking post:', error);
        return res.status(500).json({
            message: 'Server error',
            success: false,
        });
    }
};


export const addcomment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commenter = req.user.id;
        const { text } = req.body;

        // Validate text input
        if (!text) {
            // Handle missing text input
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            // Handle post not found
        }

        // Create a new comment
        const comment = await Comments.create({
            text,
            author: commenter,
            post: postId,
        });

        // Populate author information
    } catch (error) {
        // Handle error
    }
};

export const getcomment = async (req, res) => {
    try {
        const postId = req.params.id;

        // Find comments by postId and populate the author field
        const comments = await Comment.find({ post: postId })
            .populate('author', 'username profilePictureURL'); // Populate author field and select the fields

        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: 'No comments found for this post',
                success: false,
            });
        }

        return res.status(200).json({
            comments,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching comments:', error); // Log the error for debugging
        return res.status(500).json({
            message: 'Server error',
            success: false,
            error: error.message, // Include the error message in the response
        });
    }
};

export const getallpost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePictureURL' })
            .populate({
                path: 'comments',
                options: { sort: { createdAt: -1 } }, // Sort comments by creation date
                populate: {
                    path: 'author', // Populate the author of each comment
                    select: 'username profilePictureURL'
                }
            });

        if (!posts || posts.length === 0) {
            return res.status(404).json({
                posts: [],
                success: true,
                message: 'No posts found',
            });
        }

        return res.status(200).json({
            posts,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};


export const getuserpost = async (req, res) => {
    try {
        const autherId = req.Id
        const userposts = await Post.find({ auther: autherId })
            .populate({
                path: 'auther',
                select: ['name', 'profilePic']
            })
            .sort({ createdAt: -1 }).populate({
                path: 'comments',
                sort: { createdAt: -1 }
                    .populate({
                        path: 'comments',
                        sort: { createdAt: -1 },
                        populate: { path: 'author', select: 'username profilePictureURL' }
                    })
            })
        res.status(200).json({
            userposts,
            success: true
        })

    } catch (error) {
        console.log(error),
            res.status(500).json({
                success: false
            })
    }
}

export const addNewPost = async (req, res) => {
    try {
        const { caption, location, tags } = req.body
        const image = req.file
        const authorId = req.user.id
        if (!image) return res.status(400).json({ message: 'Image required' });
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudRes = await cloudinary.uploader.upload(fileUri)
        const post = await Post.create({
            caption,
            location,
            tags,
            image: cloudRes.secure_url,
            author: authorId


        });
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            success: true,
            message: 'New post added',
            post,

        })

    } catch (error) {
        return res.status(500).json({ message: 'server error' });
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        // check if the logged-in user is the owner of the post
        if (post.author.toString() !== authorId.toString()) {
            return res.status(403).json({ message: 'Unauthorized', success: false });
        }

        // delete post
        await Post.findByIdAndDelete(postId);
        const publicId = post.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
        // remove the post id from the user's post
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({
            success: true,
            message: 'Post deleted'
        })

    } catch (error) {
        // console.log(error); // Return the error to the client
        res.status(500).json({
            message: 'Server error',
            success: false,
            error: error.message,
        });
    }

}

export const likeDislike = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Check if the post is already liked by the user
        const isLiked = post.likes.includes(userId);

        // If liked, handle "unlike" action
        if (isLiked) {
            post.likes.pull(userId); // Remove the like
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });
            await post.save();

            // Prepare user details for the notification
            const user = await User.findById(userId).select('username profilePictureURL');
            const postOwnerId = post.author.toString();

            // Only send a notification if the user unliking the post is not the owner
            if (postOwnerId !== userId) {
                const notification = {
                    type: 'unlike',
                    user: userId,
                    userDetails: user,
                    postId,
                    message: 'Post unliked'
                };
                const postOwnerSocketId = getReciverSocketId(postOwnerId);
                if (postOwnerSocketId) {
                    io.to(postOwnerSocketId).emit('notification', notification);
                }
            }

            return res.status(200).json({
                message: "Post unliked",
                success: true
            });
        }
        // If not liked, handle "like" action
        else {
            post.likes.push(userId); // Add the like
            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
            await post.save();

            // Prepare user details for the notification
            const user = await User.findById(userId).select('username profilePictureURL');
            const postOwnerId = post.author.toString();

            // Only send a notification if the user liking the post is not the owner
            if (postOwnerId !== userId) {
                const notification = {
                    type: 'like',
                    userId: userId,
                    userDetails: user,
                    postId,
                    message: 'Your post was liked'
                };
                // console.log(notification)
                const postOwnerSocketId = getReciverSocketId(postOwnerId);
                // console.log(postOwnerSocketId)
                if (postOwnerSocketId) {
                    io.to(postOwnerSocketId).emit('notification', notification);
                }
            }

            return res.status(200).json({
                message: "Post liked",
                success: true
            });
        }
    } catch (error) {
        console.error("Error in likeDislike:", error);
        return res.status(500).json({
            error: "Internal server error",
            success: false
        });
    }
};

