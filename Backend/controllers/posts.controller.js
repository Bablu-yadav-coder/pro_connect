
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comment.model.js"
import Profile from "../models/profile.model.js";


export const createPost = async (req, res) => {


    const { token } = req.body;



    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }


        const newPost =  new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.filename : "",
            fileType: req.file != undefined ? req.file.mimetype.split("/")[1] : "",
        })


        await newPost.save();


        return res.json({ message: "Post created" })


    } catch (err) {
        return res.json({ message: err.message });
    }

}



export const getAllPosts = async (req, res) => {

    try {

        const posts = await Post.find().populate("userId", 'name email username profilePic');

        return res.json(posts);
    } catch (err) {
        return res.json({ message: err.messge });
    }
}



export const deletePost = async (req, res) => {


    const { token, postId } = req.body;

    try {

        const user = await User.findOne({ token: token }).select("_id");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const post = await Post.findOne({ _id: postId });


        if (!post) {
            return res.json({ message: "Post not Found" });
        }

        if (user._id.toString() !== post.userId.toString()) {
            return res.json({ message: "you are not the auther of this post" });
        }

        await Post.findByIdAndDelete({ _id: postId });

        return res.status(200).json({ "message": "Post deleted" });


    } catch (err) {
        return res.status(500).json({ message: err.messge });
    }
}


/// comment on a post

export const addNewComment = async (req, res) => {

    const { token, postId, comment } = req.body;


    try {
        const user = await User.findOne({ token: token }).select("_id");

        if (!user) {
            res.status(400).json({ message: "User not found" });
        }


        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ message: "Post not Found" });

        }

        const newComment = new Comment({
            userId: user._id,
            postId: postId,
            body: comment
        })


        await newComment.save();


        return res.status(200).json({ message: newComment });


    } catch (err) {
        return res.json({ message: err.messge });
    }
}



// get all comment of a post

export const getAllComments = async (req, res) => {
    const { postId } = req.query;

    try {


        const post = await Post.findOne({ _id: postId });


        if (!post) {
            return res.status(404).json({ message: "Post not Found" });
        }

        const getAllComments = await Comment.find({ postId: post._id }).populate("userId", "username profilePic ");


        return res.json(getAllComments.reverse());

    } catch (err) {
        return res.json({ message: err.messge });
    }
}


export const deleteComment = async (req, res) => {


    const { token, commentId } = req.body;


    try {

        const user = await User.findOne({ token }).select('_id');

        if (!user) {
            res.status(400).json({ message: "User not found" });
        }




        const comment = await Comment.findOne({ "_id": commentId });

        if (!comment) {
            res.status(400).json({ message: "Comment not found" });

        }


        if (user._id.toString() !== comment.userId.toString()) {
            return res.status(400).json({ message: "Un_authorized" });
        }

        await Comment.deleteOne({ _id: comment._id });

        return res.json({ message: 'Comment deleted' });


    } catch (err) {
        return res.json({ message: err.messge });
    }
}


export const incrementLikes = async (req, res) => {

    const { postId, token } = req.body;

    try {

        const user = await User.findOne({ token }).select('_id username profilePic');


        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        const post = await Post.findOne({ _id: postId });


        if (!post) {
            return res.status(404).json({ message: "Post not Found" });
        }




        let disliked = await Post.findOneAndUpdate({ $and: [{ _id: post._id, likes: user._id }] }, { $pull: { likes: user._id } }, { new: true });


        const postOwnerId = post.userId;
        const likeKrneWalaUserKiId = user._id;




        if (disliked) {

            return res.json({ message: "dislike post", likesCount: disliked.likes.length })
        }



        let added = await Post.findOneAndUpdate({ _id: post._id }, { $addToSet: { likes: user._id } }, { new: true })



        if (!added) {
            return res.json({ message: "post not found" });

        }



        return res.json({ message: "Post liked", likesCount: added.likes.length })

    } catch (err) {
        return res.json({ message: err.messge });
    }
}




export const deleteProfileData = async (req, res) => {
    const { token, id } = req.body;

    try {

        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        const profile = await Profile.findOne({ userId: user });


        if (!profile) {
            return res.status(404).json({ message: "profile not Found" });
        }

        profile.education = profile.education.filter(d => {
            return d._id.toString() !== id
        });


        await profile.save();

        return res.json({ message: "profile updated successfully" })

    } catch (err) {
        return res.json(err.message);
    }
}




export const deleteProfileWork = async (req, res) => {
    const { token, id } = req.body;

    try {

        const user = await User.findOne({ token }).select("_id");

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }


        const profile = await Profile.findOne({ userId: user });


        if (!profile) {
            return res.status(404).json({ message: "profile not Found" });
        }

        profile.pastWork = profile.pastWork.filter(d => {
            return d._id.toString() !== id
        });


        await profile.save();

        return res.json({ message: "profile updated successfully" })
    } catch (err) {
        return res.json(err.message);
    }
}