import React, { useEffect, useState } from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "../hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useSuggestedUsers";

const Home = () => {
  const postsLoading = useGetAllPost();
  const [loading, setLoading] = useState(postsLoading);

  useEffect(() => {
    setLoading(postsLoading);
  }, [postsLoading]);
  // useEffect(() => {
  //   console.log("Loading state in Home component:", loading);
  // }, [loading]);
  useGetSuggestedUsers();
  // console.log("loading", loading);

  return (
    <div className="flex flex-col md:flex-row max-w-screen-xl mx-auto">
      {/* Main Content Area */}
      <div className="flex-grow w-full md:w-2/3 lg:w-3/5 mx-auto">
        <Feed loading={loading} />
        <Outlet />
      </div>

      {/* Right Sidebar - Hidden on mobile */}
      <div className="hidden md:flex fixed top-0 right-0 z-10 px-4 border-r border-gray-200 w-[16%] h-screen bg-white">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
