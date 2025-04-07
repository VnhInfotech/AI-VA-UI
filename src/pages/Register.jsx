import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext"; 

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useUserContext(); 
  const navigate = useNavigate();

  useEffect(() => {
    if(user != null || user != undefined)
    {
      navigate("/dashboard");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      name,
      email,
      password,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", requestOptions);
      const data = await response.json();
      console.log("Response from server:", data); // Debug log
      if (response.ok) {
        alert("Registration successful! You can now log in.");
        navigate("/login"); // Redirect to login page after successful registration
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create an account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          </div>
          <div className="mb-4 relative">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4 ">
          Already have an account?{" "}
          <a href="/login" className="text-purple-500">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}