import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User2 } from "lucide-react";
import { Link } from "react-router-dom";

const Comment = ({ comment }) => {
  return (
    <div my-2>
      <div className="flex gap-2 items-center">
        <Link>
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={comment?.author?.profilePictureURL}
              alt="@shadcn"
            />
            <AvatarFallback>
              <User2 />
            </AvatarFallback>
          </Avatar>
        </Link>
        <h1 className="font-semibold text-sm">
          {comment?.author.username}
          <span className="font-normal pl-2">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
