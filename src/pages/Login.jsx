import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; // Import the context
import { useEffect } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, user } = useUserContext(); // Get login function and user from context

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if(user != null || user != undefined)
    {
      navigate("/search");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in user:", { email, password }); // Debug log
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("Response from server:", data); // Debug log
      if (response.ok) {
        // Store user data and token in context and local storage
        login(data.user, data.token);
        navigate("/dashboard"); // Redirect to dashboard after successful login
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleLogout = () => {
    login(null, null);
    navigate("/login");
  };

  return (
    <div className="pt-10 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Login to your account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="email"
              name="email"
              placeholder="Email ID"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="absolute right-3 top-3.5 text-purple-500">📧</span>
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword && (
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁️
              </button>
            )}
            {!showPassword && (
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁‍🗨
              </button>
            )}
          </div>
          <div className="text-right mb-4">
            <a href="#" className="text-purple-500">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            Continue with email
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center border py-3 rounded-lg hover:bg-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
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
            height="30"
            viewBox="0 0 26 26"
          >
            <path d="M 23.933594 18.945313 C 23.335938 20.269531 23.050781 20.863281 22.28125 22.03125 C 21.210938 23.667969 19.695313 25.707031 17.820313 25.71875 C 16.15625 25.734375 15.726563 24.632813 13.464844 24.652344 C 11.203125 24.660156 10.730469 25.738281 9.0625 25.722656 C 7.191406 25.707031 5.757813 23.867188 4.683594 22.238281 C 1.679688 17.664063 1.363281 12.300781 3.21875 9.449219 C 4.53125 7.425781 6.609375 6.238281 8.5625 6.238281 C 10.546875 6.238281 11.796875 7.328125 13.441406 7.328125 C 15.035156 7.328125 16.003906 6.234375 18.304688 6.234375 C 20.039063 6.234375 21.878906 7.179688 23.191406 8.816406 C 18.894531 11.167969 19.59375 17.304688 23.933594 18.945313 Z M 16.558594 4.40625 C 17.394531 3.335938 18.027344 1.820313 17.800781 0.277344 C 16.433594 0.371094 14.839844 1.242188 13.90625 2.367188 C 13.0625 3.394531 12.363281 4.921875 12.636719 6.398438 C 14.125 6.445313 15.664063 5.558594 16.558594 4.40625 Z"></path>
          </svg>
          &nbsp; Sign in with Apple
        </button>

        {user && (
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-800"
          >
            Logout
          </button>
        )}

        <p className="text-center mt-4 ">
          Don't have an account?{" "}
          <a href="/signup" className="text-purple-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
