import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/reduxStore/authSlice.js";

const Login = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        // "https://vgc1848d-8000.inc1.devtunnels.ms/api/login",
        "http://localhost:8000/api/login",
        input,
        {
          headers: {
            // Corrected key
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        console.log(res.data.user);
        navigate("/");
        toast.success(res.data.message);
        setInput({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response.data.errors) {
        const errorsArray = error.response.data.errors;
        errorsArray.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex items-center w-screen h-screen justify-center border-r-2">
      <form
        onSubmit={signupHandler}
        className="shadow-xl flex flex-col gap-5 p-8"
      >
        <div className="text-center text-xl font-bold">LOGO</div>
        <p>Login to see photos and videos from your friends.</p>

        <div>
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Login"
          )}{" "}
        </Button>
        <span className="text-center">
          Don't have Account?{" "}
          <Link to="/signup" className="text-blue-500">
            Signup
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
