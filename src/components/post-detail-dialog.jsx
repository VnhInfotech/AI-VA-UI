"use client"

import { useState } from "react"
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function PostDetailDialog({ isOpen, onClose, post }) {
  const [activeTab, setActiveTab] = useState("all")

  if (!isOpen) return null

  const getPlatformIcon = (platform) => {
    const iconProps = { className: "w-5 h-5" }

    switch (platform.toLowerCase()) {
      case "linkedin":
        return <FaLinkedinIn {...iconProps} />
      case "instagram":
        return <FaInstagram {...iconProps} />
      case "facebook":
        return <FaFacebookF {...iconProps} />
      case "x":
      case "twitter":
        return <FaXTwitter {...iconProps} />
      default:
        return null
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return "bg-[#0077b5] text-white"
      case "instagram":
        return "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white"
      case "facebook":
        return "bg-[#1877f2] text-white"
      case "x":
      case "twitter":
        return "bg-black text-white"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Post Details</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {/* Image */}
          <div className="relative w-full h-64 md:h-80">
            <img
              src={post.normalizedImage || "/placeholder.svg?height=400&width=600"}
              alt="Post content"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Caption */}
          <div className="p-4">
            <p className="text-gray-800">{post.normalizedCaption || "No caption available"}</p>
          </div>

          {/* Posted on */}
          <div className="px-4 pb-2">
            <p className="text-sm text-gray-500">
              Posted on:{" "}
              {new Date(post.createdAt || post.postedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Tabs */}
          <div className="px-4 pt-2 pb-4">
            <div className="border-b">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                    activeTab === "all"
                      ? "border-b-2 border-[#C731CD] text-[#C731CD]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  All Platforms
                </button>
                {post.platforms && post.platforms.includes("linkedin") && (
                  <button
                    onClick={() => setActiveTab("linkedin")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                      activeTab === "linkedin"
                        ? "border-b-2 border-[#0077b5] text-[#0077b5]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <FaLinkedinIn className="w-4 h-4" />
                      <span>LinkedIn</span>
                    </div>
                  </button>
                )}
                {post.platforms && post.platforms.includes("facebook") && (
                  <button
                    onClick={() => setActiveTab("facebook")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                      activeTab === "facebook"
                        ? "border-b-2 border-[#1877f2] text-[#1877f2]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <FaFacebookF className="w-4 h-4" />
                      <span>Facebook</span>
                    </div>
                  </button>
                )}
                {post.platforms && post.platforms.includes("instagram") && (
                  <button
                    onClick={() => setActiveTab("instagram")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                      activeTab === "instagram"
                        ? "border-b-2 border-pink-500 text-pink-500"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <FaInstagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </div>
                  </button>
                )}
                {post.platforms && (post.platforms.includes("x") || post.platforms.includes("twitter")) && (
                  <button
                    onClick={() => setActiveTab("x")}
                    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
                      activeTab === "x" ? "border-b-2 border-black text-black" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <FaXTwitter className="w-4 h-4" />
                      <span>X</span>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Tab content */}
            <div className="py-4">
              {activeTab === "all" && (
                <div className="space-y-4">
                  <h3 className="font-medium">Posted on platforms:</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.platforms &&
                      post.platforms.map((platform, index) => (
                        <div
                          key={index}
                          className={`px-3 py-1 rounded-full flex items-center space-x-1 ${getPlatformColor(platform)}`}
                        >
                          {getPlatformIcon(platform)}
                          <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {activeTab === "linkedin" && (
                <div className="space-y-4">
                  <h3 className="font-medium">LinkedIn Post</h3>
                  <p>Content specific to LinkedIn post</p>
                  {/* Add LinkedIn specific details here */}
                </div>
              )}

              {activeTab === "facebook" && (
                <div className="space-y-4">
                  <h3 className="font-medium">Facebook Post</h3>
                  <p>Content specific to Facebook post</p>
                  {/* Add Facebook specific details here */}
                </div>
              )}

              {activeTab === "instagram" && (
                <div className="space-y-4">
                  <h3 className="font-medium">Instagram Post</h3>
                  <p>Content specific to Instagram post</p>
                  {/* Add Instagram specific details here */}
                </div>
              )}

              {activeTab === "x" && (
                <div className="space-y-4">
                  <h3 className="font-medium">X Post</h3>
                  <p>Content specific to X post</p>
                  {/* Add X specific details here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
