import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPosts } from "@/reduxStore/postSlice";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      setLoading(true); // Set loading to true at the beginning
      try {
        const res = await axios.get("http://localhost:8000/api/getpost", {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Ensure this is called after fetch completes
      }
    };

    fetchAllPosts();
  }, [dispatch]);

  return loading;
};

export default useGetAllPost;
