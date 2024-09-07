import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import { User2 } from "lucide-react";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="md:flex hidden flex-col fixed top-0 right-0 z-10 px-4 border-l border-gray-200 md:w-1/4 lg:w-1/5 xl:w-1/6 h-screen bg-white">
      <div className="flex flex-col w-full mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Link to={`/profile/${user?._id}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={user?.profilePicture} alt="profile_image" />
              <AvatarFallback>
                <User2 />
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-semibold text-sm">
              <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
            </h1>
            <span className="text-gray-600 text-xs">
              {user?.bio || "Bio here..."}
            </span>
          </div>
        </div>
        <SuggestedUsers />
      </div>
    </div>
  );
};

export default RightSidebar;
