import { User } from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../../utils/datauri.js";
import cloudinary from "../../utils/cloudinary.js";
import { body, validationResult } from 'express-validator';
import { Post } from "../../models/post.js"
// Register controller
export const register = [
    // Validation rules
    body('name', 'Name must contain at least 3 characters').optional().isLength({ min: 3 }),
    body('username', 'Username must contain at least 3 characters').isLength({ min: 3 }).custom(async (value) => {
        const existingUser = await User.findOne({ username: value });
        if (existingUser) {
            throw new Error('A user already exists with this username');
        }
    }),
    body('email', 'Please use a valid email').isEmail().custom(async (value) => {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
            throw new Error('A user already exists with this email address');
        }
    }),
    body('phoneNo', 'Please enter a valid phone number').optional().isLength({ min: 10, max: 11 }).custom(async (value) => {
        const existingUser = await User.findOne({ phoneNo: value });
        if (existingUser) {
            throw new Error('A user already exists with this phone number');
        }
    }),
    body('password', 'Password must contain at least 5 characters').isLength({ min: 5 }),

    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                success: false,
            });
        }

        try {
            const { name, username, email, phoneNo, password, gender } = req.body;

            const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

            const user = new User({
                name,
                username,
                email,
                phoneNo,
                gender,
                password: hashedPassword,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            await user.save();

            const data = {
                user: {
                    id: user.id,
                },
            };

            const token = jwt.sign(data, process.env.JWT_SECRET
                // , { expiresIn: '1h' }
            );

            return res.status(201)
                .cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
                .json({
                    message: "Account created successfully.",
                    success: true,
                });
        } catch (error) {
            return res.status(500).json({
                message: "Server error",
                success: false,
            });
        }
    }
];

// Login controller
export const login = [
    body('email', 'Please enter a valid email').isEmail(),
    body('password', 'Password cannot be null').exists(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid Password" });
            }

            const data = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(data, process.env.JWT_SECRET)
            const populatedPosts = await Promise.all(
                user.posts.map(async (postId) => {
                    const post = await Post.findById(postId);
                    if (post && post.author.equals(user._id)) {
                        return post;
                    }
                    return null;
                })
            ).then(posts => posts.filter(post => post !== null));

            user = {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePictureURL,
                bio: user.bio,
                gender: user.gender,
                followers: user.followers,
                following: user.followings,
                posts: populatedPosts,
            };

            res.status(200)
                .cookie('token', token)
                .json({
                    message: `Welcome back ${user.username}.`,
                    success: true,
                    user,
                });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
];


// Logout controller
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "").json({
            success: true,
            message: 'Logged out successfully'
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Something went wrong, please try again later'
        })
    }

}

// Get profile controller
export const getprofile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
            .populate({ path: 'posts', options: { sort: { createAt: -1 } } }) // Corrected the sorting option
            .populate({ path: 'bookmarks' });
        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false,
        });
    }
}

// Edit profile controller
export const editprofile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gender, bio } = req.body;
        const profilePic = req.file;

        if (!bio && !gender && !profilePic) {
            return res.status(400).json({
                message: 'No fields provided to update',
                success: false,
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(401).json({
                message: 'User not found',
                success: false,
            });
        }

        if (profilePic) {
            if (user.profilePictureURL) {
                const publicId = user.profilePictureURL.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            const fileUri = getDataUri(profilePic);
            const cloudRes = await cloudinary.uploader.upload(fileUri);
            user.profilePictureURL = cloudRes.secure_url;
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user,
        });
    } catch (error) {
        console.error('Error in edit profile operation:', error);
        return res.status(500).json({
            message: 'Server error',
            success: false,
        });
    }
};

// Delete profile controller
export const deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        await user.remove();

        return res.status(200).json({
            message: 'Profile deleted successfully',
            success: true
        });
    } catch (error) {
        console.error('Error in deleting profile:', error);
        return res.status(500).json({
            message: 'Server error',
            success: false
        });
    }
};
export const followandunfollow = async (req, res) => {
    try {
        const followerId = req.user.id;
        const whoToFollowId = req.params.id;

        // Check if the user is trying to follow themselves
        if (followerId === whoToFollowId) {
            return res.status(400).json({
                message: 'You cannot follow yourself',
                success: false,
            });
        }

        // Find the follower and the target user
        const user = await User.findById(followerId);
        const targetUser = await User.findById(whoToFollowId);

        // Check if both users exist
        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false,
            });
        }

        const isFollowing = user.followings.includes(whoToFollowId);

        if (isFollowing) {
            // Unfollow the target user
            await Promise.all([
                User.updateOne({ _id: user._id }, { $pull: { followings: whoToFollowId } }),
                User.updateOne({ _id: whoToFollowId }, { $pull: { followers: followerId } }),
            ]);
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // Follow the target user
            await Promise.all([
                User.updateOne({ _id: user._id }, { $push: { followings: whoToFollowId } }),
                User.updateOne({ _id: whoToFollowId }, { $push: { followers: followerId } }),
            ]);
            return res.status(200).json({ message: 'Followed successfully', success: true });
        }
    } catch (error) {
        console.error('Error in follow/unfollow operation:', error);
        return res.status(500).json({
            message: 'Server error',
            success: false,
        });
    }
};
export const suggestuser = async (req, res) => {
    try {
        const userId = req.user.id;
        const suggesteduser = await User.find({ _id: { $ne: userId } }).select('-password')
        if (!suggesteduser) {
            res.status(400).json({
                message: 'we have no user to suggest',
            })
        }
        res.status(200).json({
            success: true,
            user: suggesteduser
        })

    } catch (error) {
        res.status(500).json({
            message: 'server error',
            success: false
        })
    }
}