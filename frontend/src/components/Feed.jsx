import React from "react";
import Posts from "./posts";

const Feed = ({ loading }) => {
  return (
    <div className="flex-1 my-8 flex flex-col items-center">
      <Posts loading={loading} />
    </div>
  );
};

export default Feed;
