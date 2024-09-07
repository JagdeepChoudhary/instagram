import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { useSelector } from "react-redux";

const Signup = () => {
  const { user } = useSelector((store) => store.auth);
  const [input, setInput] = useState({
    name: "",
    username: "",
    // gender:"",
    phoneNo: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        // "https://vgc1848d-8000.inc1.devtunnels.ms/api/signup",
        "http://localhost:8000/api/signup",
        input,
        {
          header: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        navigate("/");
        toast.success(res.data.message);
        setInput({
          name: "",
          username: "",
          phoneNo: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        // Check if there are errors in the response
        if (error.response.data.errors) {
          const errorsArray = error.response.data.errors;
          errorsArray.forEach((err) => toast.error(err.msg));
        } else {
          toast.error(
            error.response.data.message || "An unexpected error occurred."
          );
        }
      } else {
        // Handle errors that don't have a response, like network errors
        toast.error("A network error occurred. Please try again.");
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
        <p>Sign up to see photos and videos from your friends.</p>
        <div>
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={input.name}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Username"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
          />
        </div>
        <div>
          <Input
            type="text"
            placeholder="Phone No."
            name="phoneNo"
            value={input.phoneNo}
            onChange={changeEventHandler}
          />
        </div>
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
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Signup"
          )}{" "}
        </Button>
        <span className="text-center">
          Already have Account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
