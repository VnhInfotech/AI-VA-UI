import { useState, useEffect } from "react"
import Layout from "../components/Layout"
import axios from "axios"
import { FaLinkedinIn, FaInstagram, FaFacebookF } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import PostDetailDialog from "../components/post-detail-dialog"
import ImagePostDTO from "../utils/ImagePostDTO";
import { useNavigate } from "react-router-dom";
import History from "../assets/images/History.png"

const AllPosts = () => {
  const [posts, setPosts] = useState([])
  const [scheduledPosts, setScheduledPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [postDetailsMap, setPostDetailsMap] = useState({});
  const token = localStorage.getItem("token")
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [detailPost, setDetailPost] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPosts()
  }, [])

  const normalizePostData = (post, platform) => {
    let caption = ""
    let image = ""

    switch (platform) {
      case "linkedin":
        caption = post.generatedContent
        image = post.originalContent
        break
      case "instagram":
      case "facebook":
        caption = post.caption
        image = post.imageUrl
        break
      case "x":
        caption = post.content
        image = post.mediaUrls?.[0]
        break
      default:
        caption = post.caption || post.content || post.generatedContent
        image = post.image || post.imageUrl
    }

    return {
      ...post,
      normalizedCaption: caption,
      normalizedImage: image,
    }
  }

  const fetchAllPosts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/posts/all", {
        headers: { "x-auth-token": token },
      });

      const groupByMasterPost = {};
      const fullPostMap = {};

      const addPostGroup = (post, isScheduled = false) => {
        const groupId = post._id || post.masterPostId || post.postDraftScheduleId || Math.random().toString();

        if (!groupByMasterPost[groupId]) {
          groupByMasterPost[groupId] = {
            _id: groupId,
            platforms: [],
            posts: [],
            isScheduled: isScheduled,
            scheduledTime: post.scheduledAt || post.scheduledTime,
          };
        }

        groupByMasterPost[groupId].platforms.push(...(post.platforms || []));

        let normalizedCaption = post.caption || post.content || post.generatedContent || "";
        let normalizedImage = post.image || post.imageUrl || post.mediaUrls?.[0] || "";

        let createdAt = post.createdAt || post.postedAt || post.scheduledTime || post.scheduledAt;

        if (post.facebookPosts?.[0]?.postedAt) {
          createdAt = post.facebookPosts[0].postedAt;
        } else if (post.instagramPosts?.[0]?.postedAt) {
          createdAt = post.instagramPosts[0].postedAt;
        } else if (post.linkedinPosts?.[0]?.postedAt) {
          createdAt = post.linkedinPosts[0].postedAt;
        } else if (post.twitterPosts?.[0]?.postedAt) {
          createdAt = post.twitterPosts[0].postedAt;
        }

        if (post.linkedinPosts?.length > 0) {
          const linkedinPost = post.linkedinPosts[0];
          normalizedCaption = linkedinPost.generatedContent || normalizedCaption;
          normalizedImage = linkedinPost.originalContent || normalizedImage;
        }

        if (!fullPostMap[groupId]) {
          fullPostMap[groupId] = post;
        }

        groupByMasterPost[groupId].posts.push({
          ...post,
          normalizedCaption,
          normalizedImage,
          createdAt,
        });
      };

      // Process instant posts
      (data.instantPosts || []).forEach(post => addPostGroup(post, false));

      // Process scheduled posts
      (data.scheduledPosts || []).forEach(post => addPostGroup(post, true));

      const unifiedPosts = Object.values(groupByMasterPost).map(group => {
        const firstPost = group.posts[0] || {};
        return {
          _id: group._id,
          platforms: [...new Set(group.platforms)],
          normalizedCaption: firstPost.normalizedCaption,
          normalizedImage: firstPost.normalizedImage,
          createdAt: firstPost.createdAt || firstPost.postedAt || firstPost.scheduledTime,
          scheduledTime: group.scheduledTime,
          isScheduled: group.isScheduled,
        };
      });

      setPosts(unifiedPosts.filter(p => !p.isScheduled));
      setScheduledPosts(unifiedPosts.filter(p => p.isScheduled));
      setPostDetailsMap(fullPostMap);
    } catch (err) {
      console.error("Error fetching posts", err);
      setPosts([]);
      setScheduledPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu") && !event.target.closest(".three-dots-btn")) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPlatformIcon = (platform) => {
    if (typeof platform !== "string") {
      console.warn("Unexpected platform type in getPlatformIcon:", platform)
      return null
    }

    const iconProps = { className: "w-5 h-5 text-white" }

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
    if (typeof platform !== "string") {
      console.warn("Unexpected platform type in getPlatformColor:", platform)
      return "bg-gray-500"
    }

    switch (platform.toLowerCase()) {
      case "linkedin":
        return "bg-[#0077b5]"
      case "instagram":
        return "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"
      case "facebook":
        return "bg-[#1877f2]"
      case "x":
      case "twitter":
        return "bg-black"
      default:
        return "bg-gray-500"
    }
  }

  // Timer component for scheduled posts
  const CountdownTimer = ({ scheduledDate, masterPostId, refreshPosts }) => {
    const [timeLeft, setTimeLeft] = useState("")
    const [posted, setPosted] = useState(false)

    useEffect(() => {
      const updateCountdown = async () => {
        const now = new Date().getTime()
        const scheduled = new Date(scheduledDate).getTime()
        const difference = scheduled - now

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24))
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

          if (days > 0) setTimeLeft(`${days}D ${hours}H`)
          else if (hours > 0) setTimeLeft(`${hours}H ${minutes}M`)
          else setTimeLeft(`${minutes}M`)
        } else {
          // Scheduled time has passed — check post status
          try {
            const token = localStorage.getItem("token")
            const { data } = await axios.get(
              `http://localhost:5000/api/posts/check-status/${masterPostId}`,
              {
                headers: { "x-auth-token": token },
              }
            )

            if (data.status === "posted") {
              setPosted(true) // Mark as posted to hide the timer
              refreshPosts()
            } else {
              setTimeLeft("0M")
            }
          } catch (err) {
            console.error("Status check failed:", err)
          }
        }
      }

      const intervalId = setInterval(updateCountdown, 10000)
      updateCountdown()

      return () => clearInterval(intervalId)
    }, [scheduledDate, masterPostId])

    // Hide timer completely if posted
    if (posted) return null

    return (
      <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
        <img src={History} alt="clock" className="w-4 h-4" />
        <span>{timeLeft}</span>
      </div>
    )
  }

  const PostCard = ({ post, isScheduled = false, refreshPosts }) => {
    const handleEdit = () => {
      setActiveDropdown(null)

      const dto = new ImagePostDTO({
        imageUrl: post.normalizedImage,
        caption: post.normalizedCaption,
        draftId: post._id,
      })

      navigate("/search/finalize", { state: { post: dto, draftId: post._id } })
    }

    const handleViewDetail = () => {
      console.log("View detail for post:", post._id)
      setActiveDropdown(null)
      const fullPost = postDetailsMap[post._id] || post;
      setDetailPost(fullPost)
      console.log("detailPost value in AllPosts:", detailPost);
    }

    const toggleDropdown = (e, id) => {
      e.stopPropagation()
      setActiveDropdown(activeDropdown === id ? null : id)
    }

    return (
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        style={{
          width: "330px",
          height: "339px",
        }}
      >
        <div className="p-3">
          {/* Image and caption container */}
          <div
            className="overflow-hidden"
            style={{
              width: "306.7px",
              height: "240px",
              borderRadius: "5px",
            }}
          >
            {/* Image */}
            <div className="relative h-[150px] px-3 pt-3">
              <img
                src={post.normalizedImage || "/placeholder.svg?height=200&width=300"}
                alt="Post content"
                className="w-full h-full object-cover"
              />
              {isScheduled && <CountdownTimer scheduledDate={post.scheduledTime} masterPostId={post._id} />}

            </div>

            {/* Caption */}
            <div className="h-[90px] overflow-hidden px-3 py-2">
              <h3 className="text-gray-800 text-base font-medium line-clamp-3">
                {post.normalizedCaption?.split(".")[0] || "No caption available"}
              </h3>
            </div>
          </div>

          {/* Footer section */}
          <div
            className="bg-[#F5F5F5] mt-[5px] flex items-center justify-between"
            style={{
              width: "306px",
              height: "60px",
              borderRadius: "8px",
              padding: "0 20px",
            }}
          >
            <div className="flex flex-col justify-center">
              <span className="text-sm text-gray-600 mb-1">Posted on</span>
              <div className="flex space-x-1">
                {post.platforms ? (
                  post.platforms.map((platform, index) => {
                    const label = typeof platform === "string" ? platform : platform?.name || "unknown"
                    return (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded flex items-center justify-center ${getPlatformColor(label)}`}
                      >
                        {getPlatformIcon(label)}
                      </div>
                    )
                  })
                ) : (
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center ${getPlatformColor(post.platform)}`}
                  >
                    {getPlatformIcon(post.platform)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-xs text-gray-500">
                {isScheduled ? `${formatDate(post.scheduledTime)}` : formatDate(post.createdAt || post.postedAt)}
              </span>

              <div className="relative ml-2">
                <button
                  onClick={(e) => toggleDropdown(e, post._id)}
                  className="p-1 rounded-full hover:bg-gray-200 three-dots-btn"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-500"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="12" cy="5" r="1"></circle>
                    <circle cx="12" cy="19" r="1"></circle>
                  </svg>
                </button>

                {activeDropdown === post._id && (
                  <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-md shadow-lg z-50 overflow-hidden dropdown-menu">
                    <button
                      onClick={handleEdit}
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-[#C731CD] hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={handleViewDetail}
                      className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-[#C731CD] hover:text-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Detail
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C731CD]"></div>
        </div>
      </Layout>
    )
  }

  // Combine and sort all posts
  const allPosts = [
    ...posts.map((post) => ({ ...post, isScheduled: false })),
    ...scheduledPosts.map((post) => ({ ...post, isScheduled: true })),
  ].sort((a, b) => {
    const dateA = new Date(a.scheduledDate || a.createdAt || a.postedAt)
    const dateB = new Date(b.scheduledDate || b.createdAt || b.postedAt)
    return dateB - dateA // Most recent first
  })

  return (
    <Layout>
      <div className="pl-8 pr-4">
        <div className="mb-8 mt-2">
          <p className="text-gray-600">View all your published and scheduled posts across social media platforms</p>
        </div>

        {allPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No posts yet</h3>
            <p className="text-gray-500 mb-6">Start creating and scheduling posts to see them here</p>
            <button
              onClick={() => (window.location.href = "/search")}
              className="px-6 py-3 bg-[#C731CD] text-white rounded-lg hover:bg-[#a127ab] transition"
            >
              Create Your First Post
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Total: {allPosts.length} posts</span>
                <span className="text-sm text-gray-600">Scheduled: {scheduledPosts.length}</span>
                <span className="text-sm text-gray-600">Published: {posts.length}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-start justify-start" style={{ gap: "25px" }}>
              {allPosts.map((post, index) => (
                <PostCard
                  key={`${post._id || post.id}-${index}`}
                  post={post}
                  isScheduled={post.isScheduled}
                  refreshPosts={fetchAllPosts}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {detailPost && <PostDetailDialog isOpen={!!detailPost} onClose={() => setDetailPost(null)} post={detailPost} />}
    </Layout>
  )
}

export default AllPosts
