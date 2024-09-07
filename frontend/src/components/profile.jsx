import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  AtSign,
  Heart,
  MessageCircle,
  User2,
  Menu,
  Grid,
  Bookmark,
  Film,
  Tag,
} from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = false;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="ml-[0%] md:ml-[16%]">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-10 p-4 flex justify-between items-center border-b">
        <Button variant="ghost" onClick={toggleMenu}>
          <Menu />
        </Button>
        <span className="font-bold">{userProfile?.username}</span>
        <div className="w-6"></div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="flex flex-col fixed top-14 left-0 right-0 z-20 p-4 border-b">
          <Link to="/editprofile">
            <Button variant="ghost" className="w-full text-left mb-2">
              Edit profile
            </Button>
          </Link>
          <Button variant="ghost" className="w-full text-left mb-2">
            View archive
          </Button>
          <Button variant="ghost" className="w-full text-left">
            Ad tools
          </Button>
        </div>
      )}

      {/* Profile Info Section */}
      <div className="flex flex-col p-4 mt-16">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 flex-shrink-0">
            <AvatarImage
              src={userProfile?.profilePictureURL}
              alt="profilephoto"
            />
            <AvatarFallback>
              <User2 />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xl font-bold">{userProfile?.username}</span>
            <div className="flex gap-4 mt-2">
              <p>
                <span className="font-semibold">
                  {userProfile?.posts.length}
                </span>{" "}
                posts
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.followers.length}
                </span>{" "}
                followers
              </p>
              <p>
                <span className="font-semibold">
                  {userProfile?.followings.length}
                </span>{" "}
                following
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <p className="font-semibold">{userProfile?.bio || "Bio here..."}</p>
          <Badge className="mt-1" variant="secondary">
            <AtSign className="h-3 w-3 mr-1" />
            {userProfile?.username}
          </Badge>
          <p className="mt-1">🤯 Learn code with Patel MERNstack style</p>
          <p>🤯 Turning code into fun</p>
          <p>🤯 DM for collaboration</p>
        </div>
        <div className="flex flex-row gap-2 justify-center mt-4">
          {isLoggedInUserProfile ? (
            <>
              <Link to="/editprofile" className="block w-full">
                <Button variant="secondary" className="w-full">
                  Edit profile
                </Button>
              </Link>
              <Button variant="secondary" className="w-full">
                View archive
              </Button>
              <Button variant="secondary" className="w-full">
                Ad tools
              </Button>
            </>
          ) : (
            // <div className="flex flex-row gap-2 justify-center mt-4 space-y-2">
            //   {isLoggedInUserProfile ? (
            //     <>
            //       <Link to="/editprofile" className="block">
            //         <Button variant="secondary" className="w-fit">
            //           Edit profile
            //         </Button>
            //       </Link>
            //       <Button variant="secondary" className="w-fit">
            //         View archive
            //       </Button>
            //       <Button variant="secondary" className="w-fit">
            //         Ad tools
            //       </Button>
            //     </>
            <Button className="w-full bg-[#0095F6] hover:bg-[#3192d2] text-white">
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      {/* Tabs and Post Display Section */}
      <div className="mt-4">
        <div className="flex justify-around border-t border-b">
          <Button
            variant="ghost"
            className={`flex-1 py-2 ${
              activeTab === "posts" ? "border-t-2 border-black" : ""
            }`}
            onClick={() => handleTabChange("posts")}
          >
            <Grid className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 py-2 ${
              activeTab === "saved" ? "border-t-2 border-black" : ""
            }`}
            onClick={() => handleTabChange("saved")}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="flex-1 py-2">
            <Film className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="flex-1 py-2">
            <Tag className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-1 mt-1">
          {displayedPost?.map((post) => (
            <div key={post?._id} className="relative aspect-square">
              <img
                src={post.image}
                alt="postimage"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 active:opacity-100 transition-opacity duration-200">
                <div className="flex items-center text-white space-x-3">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {post?.likes.length}
                  </span>
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-bold">
                    {post?.comments.length}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
