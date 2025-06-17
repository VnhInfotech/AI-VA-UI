import { useState, useEffect } from "react"
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

export default function PostDetailDialog({ isOpen, onClose, post }) {
  const [activeTab, setActiveTab] = useState(null)
  const [showFullCaption, setShowFullCaption] = useState(false)

  const platformPosts = {
    linkedin: post.linkedinPosts || [],
    instagram: post.instagramPosts || [],
    facebook: post.facebookPosts || [],
    x: post.xPosts || [],
  }

  useEffect(() => {
    const firstAvailable = Object.entries(platformPosts).find(([_, posts]) => posts.length > 0)
    setActiveTab(firstAvailable?.[0] || null)
  }, [post])

  if (!isOpen) return null

  console.log(post)
  const image =
    post.image ||
    post.linkedinPosts?.[0]?.originalContent ||
    post.instagramPosts?.[0]?.originalContent ||
    post.facebookPosts?.[0]?.originalContent ||
    post.xPosts?.[0]?.originalContent ||
    "/placeholder.svg"

  const caption =
    post.caption ||
    post.linkedinPosts?.[0]?.generatedContent ||
    post.instagramPosts?.[0]?.generatedContent ||
    post.facebookPosts?.[0]?.generatedContent ||
    post.xPosts?.[0]?.generatedContent ||
    ""

  const getPlatformIcon = (platform) => {
    const iconProps = { className: "w-5 h-5" }
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <FaLinkedinIn {...iconProps} style={{ color: "#0077b5" }} />
      case "instagram":
        return <FaInstagram {...iconProps} style={{ color: "#E4405F" }} />
      case "facebook":
        return <FaFacebookF {...iconProps} style={{ color: "#1877f2" }} />
      case "x":
      case "twitter":
        return <FaXTwitter {...iconProps} style={{ color: "#000000" }} />
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

  const formatPostTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  const renderAccountCard = (account, date, platform) => {
    if (!account) return null

    const name = account.name || account.username || "Unknown"
    const email = account.email || `@${account.username || "unknown"}`
    const picture = account.profilePicture

    return (
      <div
        className="flex items-center justify-between border rounded-xl p-4 shadow-sm"
        style={{ backgroundColor: "#F5F7FA" }}
      >
        <div className="flex items-center space-x-3">
          {picture && <img src={picture || "/placeholder.svg"} alt="Profile" className="w-10 h-10 rounded-full" />}
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-600">{email}</p>
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-white bg-green-600 px-2 py-1 rounded-full">
            {formatPostTime(date)}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-gray-200">
          <h2 className="text-xl font-semibold">Post Detail</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          {/* Image and Caption Container */}
          <div className="mx-6 mt-3 rounded-xl" style={{ backgroundColor: "#F5F5F5" }}>
            {/* Image */}
            <div className="w-full">
              <img src={image || "/placeholder.svg"} alt="Post" className="w-full h-72 object-cover rounded-t-xl" />
            </div>

            {/* Caption */}
            <div className="p-4">
              <p className="text-gray-800 whitespace-pre-line">{caption}</p>
            </div>
          </div>

          {/* Platform Buttons */}
          <div className="grid grid-cols-4 gap-3 px-6 py-6">
            {Object.entries(platformPosts)
              .filter(([_, posts]) => posts.length > 0)
              .map(([platform]) => (
                <button
                  key={platform}
                  onClick={() => setActiveTab(platform)}
                  className={`flex flex-col items-center p-3 rounded-xl shadow-sm text-sm font-medium transition-colors ${
                    activeTab === platform ? "bg-white border-2" : ""
                  }`}
                  style={{
                    backgroundColor: activeTab === platform ? "#ffffff" : "#F8F8F8",
                    borderColor: activeTab === platform ? "#C81B9A4D" : "transparent",
                  }}
                >
                  <div className="text-xl mb-1">{getPlatformIcon(platform)}</div>
                  <span className="capitalize">{platform === "x" ? "X" : platform}</span>
                </button>
              ))}
          </div>

          {/* Platform-Specific Details */}
          <div className="space-y-4 px-6 pb-6">
            {activeTab === "linkedin" &&
              (platformPosts.linkedin.length ? (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#F5F7FA" }}>
                  {platformPosts.linkedin.map((lp, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          {lp.linkedinAccount?.profilePicture && (
                            <img
                              src={lp.linkedinAccount.profilePicture || "/placeholder.svg"}
                              alt="Profile"
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-semibold">
                              {lp.linkedinAccount?.name || lp.linkedinAccount?.username || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {lp.linkedinAccount?.email || `@${lp.linkedinAccount?.username || "unknown"}`}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-white bg-green-600 px-2 py-1 rounded-full">
                            {formatPostTime(lp.postedAt || post.scheduledTime)}
                          </span>
                        </div>
                      </div>
                      {idx < platformPosts.linkedin.length - 1 && <div className="h-px bg-white mx-4"></div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No LinkedIn post details.</p>
              ))}

            {activeTab === "facebook" &&
              (platformPosts.facebook.length ? (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#F5F7FA" }}>
                  {platformPosts.facebook.map((fp, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          {fp.facebookAccount?.profilePicture && (
                            <img
                              src={fp.facebookAccount.profilePicture || "/placeholder.svg"}
                              alt="Profile"
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-semibold">
                              {fp.facebookAccount?.pageName || fp.facebookAccount?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {fp.facebookAccount?.email || `@${fp.facebookAccount?.username || "unknown"}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              Posted to: {fp.postedTo === "page" ? fp.pageName : "Feed"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-white bg-green-600 px-2 py-1 rounded-full">
                            {formatPostTime(fp.postedAt || post.scheduledTime)}
                          </span>
                        </div>
                      </div>
                      {idx < platformPosts.facebook.length - 1 && <div className="h-px bg-white mx-4"></div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No Facebook post details.</p>
              ))}

            {activeTab === "instagram" &&
              (platformPosts.instagram.length ? (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#F5F7FA" }}>
                  {platformPosts.instagram.map((ip, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          {ip.instagramAccount?.profilePicture && (
                            <img
                              src={ip.instagramAccount.profilePicture || "/placeholder.svg"}
                              alt="Profile"
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-semibold">{`@${ip.instagramAccount?.username}` || "Unknown"}</p>
                            <p className="text-sm text-gray-600">
                              {ip.instagramAccount?.accountType || ip.instagramAccount?.email || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-white bg-green-600 px-2 py-1 rounded-full">
                            {formatPostTime(ip.postedAt || post.scheduledTime)}
                          </span>
                        </div>
                      </div>
                      {idx < platformPosts.instagram.length - 1 && <div className="h-px bg-white mx-4"></div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No Instagram post details.</p>
              ))}

            {activeTab === "x" &&
              (platformPosts.x.length ? (
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#F5F7FA" }}>
                  {platformPosts.x.map((xp, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          {xp.xAccount?.profilePicture && (
                            <img
                              src={xp.xAccount.profilePicture || "/placeholder.svg"}
                              alt="Profile"
                              className="w-10 h-10 rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-semibold">{xp.xAccount?.name || "Unknown"}</p>
                            <p className="text-sm text-gray-600">{`@${xp.xAccount?.username}` || "Unknown"}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-white bg-green-600 px-2 py-1 rounded-full">
                            {formatPostTime(xp.postedAt || post.scheduledTime)}
                          </span>
                        </div>
                      </div>
                      {idx < platformPosts.x.length - 1 && <div className="h-px bg-white mx-4"></div>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No X post details.</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
