import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2, User2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "../reduxStore/postSlice";
import { useDispatch, useSelector } from "react-redux";

const Createpost = ({ open, setOpen }) => {
  const [file, setFile] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const posts = useSelector((state) => state.post.posts);

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("tags", tags);
    formData.append("location", location);
    if (imagePreview) {
      formData.append("postphoto", file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        // "https://vgc1848d-8000.inc1.devtunnels.ms/api/addnewpost",
        "http://localhost:8000/api/addnewpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const imgRef = useRef(null);

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="font-semibold text-center m-auto">
          Create Post
        </DialogHeader>
        <hr />
        <div className="flex gap-3 items-center">
          <Avatar className="cursor-pointer ">
            <AvatarImage src={user?.profilePictureURL} alt="img" />
            <AvatarFallback>
              <User2 />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="cursor-pointer ">{user?.username}</h1>
            <span>{user?.bio}</span>
          </div>
        </div>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption ..."
          className="w-full outline-none  border-gray-300 p-2 rounded-sm"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags ..."
          className="w-full outline-none  border-gray-300 p-2 rounded-sm"
        />
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location ..."
          className="w-full outline-none  border-gray-300 p-2 rounded-sm"
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt=""
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        <input
          ref={imgRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button onClick={() => imgRef.current.click()} className="mx-auto">
          Upload
        </Button>
        {imagePreview &&
          (loading ? (
            <Button disabled>
              <Loader2 className="animate-spin " />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit">
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default Createpost;
