import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  MessageCircle,
  Send,
  Bookmark,
  User2,
} from "lucide-react";
import { FaRegHeart } from "react-icons/fa";

const PostSkeleton = () => {
  return (
    <div className="my-8 max-w-sm w-full mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="cursor-pointer">
            <Skeleton className="w-full h-full rounded-full" />
          </Avatar>
          <Skeleton className="h-4 w-24 rounded" />
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              <Skeleton className="h-3 w-12" />
            </Badge>
          </div>
        </div>
        <MoreHorizontal className="cursor-pointer text-gray-300" />
      </div>
      <Skeleton className="my-2 w-full aspect-square rounded-sm" />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-2">
          <FaRegHeart size="22px" className="text-gray-300" />
          <MessageCircle className="text-gray-300" />
          <Skeleton className="h-4 w-4" />
          <Send className="text-gray-300" />
        </div>
        <Bookmark className="text-gray-300" />
      </div>
      <Skeleton className="h-4 w-20 mb-2" />
      <div className="mb-2">
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <Skeleton className="h-4 w-1/2 mb-2" />
      <Skeleton className="h-4 w-32 mb-2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  );
};

export default PostSkeleton;
