import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Send,
  User2,
} from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
// import { setPosts, setSelectedPost } from "@/redux/postSlice";
import postSlice, { setPosts, setSelectedPost } from "@/reduxStore/postSlice";
import { Badge } from "./ui/badge";
import PostSkeleton from "./postSekeleton";

const Post = ({ post, loading }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const likeDislikeHandler = async (postId) => {
    try {
      const res = await axios.post(
        // `https://vgc1848d-8000.inc1.devtunnels.ms/api/${action}/${post._id}`,
        `http://localhost:8000/api/dislike/${post._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        setLiked(!liked);
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async (postId) => {
    try {
      const res = await axios.post(
        // `https://vgc1848d-8000.inc1.devtunnels.ms/api/comment/${postId}` ,
        `http://localhost:8000/api/comment/${postId}`,
        { text },
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log(res.data.comment);
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === postId ? { ...p, comments: updatedCommentData } : p
        );
        setPosts(updatedPostData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCommentsHandler = async (postId) => {
    try {
      const res = await axios.get(
        // `https://vgc1848d-8000.inc1.devtunnels.ms/api/getcomment/${postId}`,
        `http://localhost:8000/api/getcomment/${postId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        console.log(res.data);
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        dispatch(updateComments(updatedCommentData));
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        // `https://vgc1848d-8000.inc1.devtunnels.ms/api/deletepost/${post._id}`,
        `http://localhost:8000/api/deletepost/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.messsage);
    }
  };
  const bookmarkHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/bookmark/${post._id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return (
      <>
        <PostSkeleton />
      </>
    ); // Show the skeleton while loading
  }
  return (
    <div className="my-8 max-w-sm w-full mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="cursor-pointer ">
            <AvatarImage src={post.author?.profilePictureURL} alt="" />
            <AvatarFallback>
              <User2 className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <h1 className="cursor-pointer font-bold">{post.author.username}</h1>
          <div className="flex items-center gap-3">
            {user?._id === post.author._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer " />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant="ghost" className="w-fit font-bold text-blue-600">
              {" "}
              Unfollow
            </Button>
            <Button variant="ghost" className="w-fit">
              {" "}
              Message
            </Button>
            {user && user._id === post.author._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="w-fit "
              >
                {" "}
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="my-2 rounded-sm aspect-square object-cover"
        src={post.image}
        alt="post_img"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-2">
          {liked ? (
            <FaHeart
              size={"22px"}
              className="text-red-500 cursor-pointer"
              onClick={() => likeDislikeHandler(post._id)}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
              onClick={() => likeDislikeHandler(post._id)}
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          {comment.length}
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark
          onClick={bookmarkHandler}
          className="cursor-pointer hover:text-gray-600"
        />
      </div>
      <span className="block font-medium mb-2">{postLike} Likes</span>
      <p>
        <span className="font-bold mr-2">{post.author.username}</span>
        {post.caption}
      </p>
      <p>
        <span className="cursor-pointer text-sm">{post.tags}</span>
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post)), setOpen(true);
        }}
        className="cursor-pointer text-sm"
      >
        view all {comment.length} comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none w-full text-sm"
        />
        {text && (
          <span
            onClick={() => commentHandler(post._id)}
            className="text-[#3BADF8] cursor-pointer"
          >
            post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
