import React from "react";
import Post from "./Post";
import { useSelector } from "react-redux";

const Posts = ({ loading }) => {
  const posts = useSelector((state) => state.post.posts); // Adjusted to match the state structure
  return (
    <div>
      {posts.map((post) => (
        <Post key={post._id} post={post} loading={loading} />
      ))}
    </div>
  );
};

export default Posts;
