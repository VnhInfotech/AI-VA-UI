import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import Logo from "../assets/images/logo.png";
import Email from "../assets/images/email.png";
import OpenEye from "../assets/images/open eye.png";
import ClosedEye from "../assets/images/closed eye.png";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (user != null || user != undefined) {
      navigate("/dashboard");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="pt-10 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 rounded-lg">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6 cursor-pointer transition"
          onClick={() => navigate("/search")}
        >
          <div className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-10" />
            <span
              style={{
                fontFamily: "Roboto",
                fontWeight: 800,
                fontSize: "24px",
                lineHeight: "100%",
              }}
            >
              AI Virtual Assistant
            </span>
          </div>
          <h2
            className="mt-20"
            style={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "110%",
              textAlign: "center",
            }}
          >
            Create your account
          </h2>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(199,48,207,0.8)]"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email with icon */}
          <div className="mb-4 relative">
            <span className="absolute left-5 top-1/2 transform -translate-y-1/2">
              <img src={Email} alt="email icon" className="w-[20px] h-[16px]" />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              className="w-full pl-12 pr-2 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(199,48,207,0.8)]"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password with eye toggle */}
          <div className="relative mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder=" "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
      peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-lg bg-white 
      text-gray-900 placeholder-transparent
      focus:outline-none focus:ring-2 focus:ring-[rgba(199,48,207,0.8)]
    "
            />

            <label
              htmlFor="password"
              className={`
      absolute left-4 px-1 text-gray-500 bg-white text-sm transition-all duration-200 
      peer-placeholder-shown:top-1/2 peer-placeholder-shown:translate-y-[-50%] peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent 
      peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:text-[rgba(199,48,207,0.8)] 
      peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:text-[rgba(199,48,207,0.8)]
    `}
              style={{ zIndex: 10 }}
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <img
                src={showPassword ? ClosedEye : OpenEye}
                alt="Toggle Password Visibility"
                className={showPassword ? "h-[10px]" : "h-[16px]"}
              />
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            Register with email
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Social Sign Up */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border py-3 rounded-lg hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="25"
            viewBox="0 0 48 48"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          &nbsp; Sign in with Google
        </button>
        <button className="w-full flex items-center justify-center border py-3 rounded-lg mt-2 hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="25"
            viewBox="0 0 26 26"
          >
            <path d="M 23.933594 18.945313 C 23.335938 20.269531 23.050781 20.863281 22.28125 22.03125 C 21.210938 23.667969 19.695313 25.707031 17.820313 25.71875 C 16.15625 25.734375 15.726563 24.632813 13.464844 24.652344 C 11.203125 24.660156 10.730469 25.738281 9.0625 25.722656 C 7.191406 25.707031 5.757813 23.867188 4.683594 22.238281 C 1.679688 17.664063 1.363281 12.300781 3.21875 9.449219 C 4.53125 7.425781 6.609375 6.238281 8.5625 6.238281 C 10.546875 6.238281 11.796875 7.328125 13.441406 7.328125 C 15.035156 7.328125 16.003906 6.234375 18.304688 6.234375 C 20.039063 6.234375 21.878906 7.179688 23.191406 8.816406 C 18.894531 11.167969 19.59375 17.304688 23.933594 18.945313 Z M 16.558594 4.40625 C 17.394531 3.335938 18.027344 1.820313 17.800781 0.277344 C 16.433594 0.371094 14.839844 1.242188 13.90625 2.367188 C 13.0625 3.394531 12.363281 4.921875 12.636719 6.398438 C 14.125 6.445313 15.664063 5.558594 16.558594 4.40625 Z"></path>
          </svg>
          &nbsp; Sign up with Apple
        </button>

        <p className="text-right mt-2.5 text-sm font-medium">
          Already have an account?{" "}
          <a href="/login" className="text-[#C730CF]">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
