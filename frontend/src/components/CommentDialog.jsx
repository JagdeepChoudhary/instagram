import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal, User2 } from "lucide-react";
import Comment from "./Comments";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/reduxStore/postSlice";
import { useDispatch, useSelector } from "react-redux";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/comment/${selectedPost?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-5xl p-0 flex flex-col"
        onInteractOutside={() => {
          setOpen(false);
        }}
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="my-2 rounded-sm aspect-square object-cover"
              src={selectedPost?.image}
              alt="post_img"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={selectedPost?.author?.profilePictureURL}
                      alt="@shadcn"
                    />
                    <AvatarFallback>
                      <User2 />
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-bold text-sm">
                    {selectedPost?.author?.username}
                  </Link>
                  {/* <span>Bio here ...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col text-center items-center">
                  <div className="cursor-pointer font-bold w-full ">follow</div>
                  <div className="cursor-pointer text-bold w-full">
                    Add to favraite
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add comment..."
                  className="w-full outline-none  border-gray-300 p-2 rounded-sm"
                />
                {text && (
                  <span
                    onClick={sendMessageHandler}
                    className="text-[#3BADF8] cursor-pointer"
                  >
                    post
                  </span>
                )}
                {/* <Button variant="outline">Post</Button> */}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
