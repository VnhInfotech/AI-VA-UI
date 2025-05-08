import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { FaCamera, FaUserCircle } from "react-icons/fa";
import { useUserContext } from "../context/UserContext";
import axios from "axios";

const Settings = () => {
  const { user } = useUserContext();
  const [activeTab, setActiveTab] = useState("profile");
  const token = localStorage.getItem("token");

  // Edit Profile States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);  

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfileImage(user.profileImage || null);
      setLoadingProfile(false);
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/users/update-profile", { name, email, profileImage: profileImage }, {
        headers: { "x-auth-token": token } 
      });
    } catch (err) {
      console.error("Profile update error", err);
      alert("Error updating profile");
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("New passwords do not match!");
    }
    try {
      await axios.put("http://localhost:5000/api/users/change-password", {
        currentPassword,
        newPassword,
      }, {
        headers: { "x-auth-token": token } 
    });
      alert("Password changed successfully!");
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;
  
        try {
          const res = await axios.post(
            "http://localhost:5000/api/users/upload-profile-picture",
            { image: base64String },
            { headers: { "x-auth-token": token } }
          );
          setProfileImage(res.data.profilePicture);
        } catch (err) {
          console.error("Image upload failed", err);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (loadingProfile) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-lg">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex w-full min-h-screen bg-gray-100">
        {/* Settings Container */}
        <div className="flex-1 pt-6 pl-2"> 
          {/* Tabs Row */}
          <div className="flex items-center space-x-4 mb-8 pb-2 border-b border-gray-300">
            <button
              onClick={() => setActiveTab("profile")}
              className={`transition text-lg font-semibold px-1 ${
                activeTab === "profile"
                  ? "text-[#C731CD] font-bold"
                  : "text-gray-700 hover:text-[#C731CD]"
              }`}
            >
              Edit Profile
            </button>
            <div className="h-5 w-px bg-gray-400" />
            <button
              onClick={() => setActiveTab("password")}
              className={`transition text-lg font-semibold px-2 ${
                activeTab === "password"
                  ? "text-[#C731CD] font-bold"
                  : "text-gray-700 hover:text-[#C731CD]"
              }`}
            >
              Change Password
            </button>
          </div>

          {/* Edit Profile Content */}
          {activeTab === "profile" && (
            <div className="p-4 w-full max-w-md">
              <div className="flex flex-col items-start">
                {/* Profile Picture */}
                <div className="relative w-24 h-24 mb-4">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <FaUserCircle className="w-24 h-24 text-gray-400" />
                  )}
                  <label className="absolute bottom-2 right-2 bg-[#C731CD] p-2 rounded-full cursor-pointer shadow-lg hover:bg-[#a52fa2] transition">
                    <FaCamera className="text-white" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>

                {/* User Info Form */}
                <form className="w-full" onSubmit={handleProfileSubmit}>
                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C731CD]"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-lg font-medium mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C731CD]"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#C731CD] text-white text-lg font-semibold rounded-lg hover:bg-[#a52fa2] transition"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Change Password Content */}
          {activeTab === "password" && (
            <form className="p-4 w-full max-w-md" onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C731CD]"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C731CD]"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C731CD]"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}
              {success && <p className="text-green-500 mb-4">Password changed successfully!</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#C731CD] text-white text-lg font-semibold rounded-lg hover:bg-[#a52fa2] transition"
                disabled={loadingPassword}
              >
                {loadingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
