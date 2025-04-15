import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import ImagePostDTO from "../utils/ImagePostDTO";

const Finalize = () => {
  const [image, setImage] = useState(null);
  const [postDTO, setPostDTO] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [schedule, setSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [linkedinAccounts, setLinkedinAccounts] = useState([]);
  const [selectedLinkedinAccount, setSelectedLinkedinAccount] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const scheduleRef = useRef(null);
  const [draftId, setDraftId] = useState(null);
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const { state } = location;
    if (state?.post) {
      const dto = new ImagePostDTO(state.post);
      setPostDTO(dto);
      setImage(dto.imageUrl);
      setCaption(dto.caption);
      setSelectedPlatform(dto.selectedPlatform || null);
      setSelectedLinkedinAccount(dto.selectedAccountId || null);
    }
    // Grab draftId if it's passed from Drafts.jsx
    if (state.draftId) {
      setDraftId(state.draftId);
    }
  },[location.search]);

  useEffect(() => {
    if (postDTO) {
      postDTO.selectedAccountId = selectedLinkedinAccount;
    }
  }, [selectedLinkedinAccount]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "LINKEDIN_ACCOUNT_CONNECTED") {
        fetchLinkedInAccounts();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (scheduleRef.current && !scheduleRef.current.contains(event.target)) {
        setSchedule(false);
      }
    };
    if (schedule) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [schedule]);

  const handleSaveDraft = async () => {
    if (!token) {
      alert("No token found.");
      return;
    }

    if (!caption || !image) {
      alert("Please complete all fields before saving.");
      return;
    }

    try {
      postDTO.caption = caption;
      await axios.post(
        "http://localhost:5000/api/drafts",
        postDTO.toDraftPayload(),
        {
          headers: { "x-auth-token": token },
        }
      );

      alert("Draft saved successfully!");
    } catch (err) {
      console.error("Failed to save draft:", err);
      alert("Failed to save draft.");
    }
  };

  const fetchLinkedInAccounts = async () => {
    setLoading(true);
    if (!token) {
      console.warn("No token found.");
      setLinkedinAccounts([]);
      setShowDropdown(true);
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/api/auth/linkedin/accounts", {
        headers: { "x-auth-token": token },
      });

      const accounts = (res?.data?.accounts || []).map((acc) => ({
        _id: acc._id,
        name: acc.name,
        email: acc.email,
        profilePicture: acc.profilePicture,
        totalPosts: acc.totalPosts || 0,
      }));

      setLinkedinAccounts(accounts);
      setShowDropdown(true);
    } catch (err) {
      console.warn("Error fetching LinkedIn accounts:", err?.response?.status);
      setLinkedinAccounts([]);
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformSelect = async (platform) => {
    setSelectedPlatform(platform);
    if (platform === "LinkedIn") {
      await fetchLinkedInAccounts();
    } else {
      setShowDropdown(true);
    }
  };

  const handleInstantPost = async () => {
    if (selectedPlatform === "LinkedIn") {
      if (!selectedLinkedinAccount) {
        alert("Please select a LinkedIn account to post with.");
        return;
      }
      try {
        postDTO.caption = caption;
        postDTO.image = image;
        postDTO.selectedAccountId = selectedLinkedinAccount;

        await axios.post(
          "http://localhost:5000/api/auth/linkedin/post",
           postDTO.toLinkedInPayload(),
          {
            headers: { "x-auth-token": token },
          }
        );

        if (draftId) {
          await axios.put(
            `http://localhost:5000/api/drafts/${draftId}/mark-posted`,
            {},
            {
              headers: { "x-auth-token": token },
            }
          );
        }
  
        alert("Posted to LinkedIn successfully!");
      } catch (err) {
        console.error("Post failed:", err);
        alert("Failed to post to LinkedIn.");
      }
    } else {
      alert(`${selectedPlatform} integration is coming soon.`);
    }
  };

  const handleScheduleConfirm = async () => {
    if (selectedPlatform === "LinkedIn") {
      if (!selectedLinkedinAccount) {
        alert("Please select a LinkedIn account.");
        return;
      }

      try {
        await axios.post(
          "http://localhost:5000/api/auth/linkedin/schedule",
          postDTO.toLinkedInSchedulePayload(scheduleDate),
          {
            headers: { "x-auth-token": token },
          }
        );

        alert("LinkedIn post scheduled successfully!");
      } catch (err) {
        console.error("Failed to schedule post:", err);
        alert("Failed to schedule LinkedIn post.");
      }
    } else {
      alert(`${selectedPlatform} scheduling is coming soon.`);
    }
  };

  return (
    <Layout>
      <section className="py-10 w-full flex flex-col items-center">
        <div className="w-11/12 max-w-5xl bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Finalize Your Post</h2>

          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {image && (
              <div className="md:w-1/2">
                <img
                  src={image}
                  alt="Selected"
                  className="w-full rounded-lg border-2 border-[#C731CD] object-contain"
                />
              </div>
            )}

            <div className="flex flex-col md:w-1/2 gap-6">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={10}
                className="w-full p-4 border-2 border-[#C731CD] rounded-lg text-gray-800 text-sm focus:outline-none resize-none"
              />

              <div className="flex flex-wrap md:flex-nowrap justify-center gap-2 w-full max-w-[500px] mx-auto">
                <button
                  onClick={() => handlePlatformSelect("LinkedIn")}
                  className="flex items-center justify-center gap-1 bg-[#0077b5] text-white font-semibold rounded-lg px-4 py-2 w-[120px] text-sm hover:opacity-80 transition-opacity duration-200"
                >
                  <FaLinkedinIn /> LinkedIn
                </button>

                <button
                  onClick={() => handlePlatformSelect("Instagram")}
                  className="flex items-center justify-center gap-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white font-semibold rounded-lg px-4 py-2 w-[120px] text-sm hover:opacity-80 transition-opacity duration-200"
                >
                  <FaInstagram /> Instagram
                </button>

                <button
                  onClick={() => handlePlatformSelect("Facebook")}
                  className="flex items-center justify-center gap-1 bg-[#1877f2] text-white font-semibold rounded-lg px-4 py-2 w-[120px] text-sm hover:opacity-80 transition-opacity duration-200"
                >
                  <FaFacebookF /> Facebook
                </button>

                <button
                  onClick={() => handlePlatformSelect("X")}
                  className="flex items-center justify-center gap-1 bg-black text-white font-semibold rounded-lg px-4 py-2 w-[120px] text-sm hover:opacity-80 transition-opacity duration-200"
                >
                  <FaXTwitter /> X
                </button>
              </div>

              {showDropdown && (
                <div className="mt-1 w-full max-w-xl slide-down">
                  <div className="bg-white rounded-2xl shadow-md border px-6 py-5 flex flex-col gap-4">
                    {selectedPlatform === "LinkedIn" ? (
                      linkedinAccounts.length === 0 ? (
                        <div className="text-sm text-gray-600 flex flex-col gap-3">
                          <p>No LinkedIn accounts connected.</p>
                          <button
                            onClick={() => {
                              const width = 600;
                              const height = 600;
                              const left = window.innerWidth / 2 - width / 2;
                              const top = window.innerHeight / 2 - height / 2;

                              const popup = window.open(
                                `http://localhost:5000/api/auth/linkedin/redirect?token=${token}`,
                                "ConnectLinkedIn",
                                `width=${width},height=${height},top=${top},left=${left}`
                              );

                              const timer = setInterval(() => {
                                if (popup.closed) {
                                  clearInterval(timer);
                                  fetchLinkedInAccounts();
                                }
                              }, 500);
                            }}
                            className="text-[#C731CD] border border-[#C731CD] px-4 py-2 rounded-lg font-medium hover:bg-[#C731CD] hover:text-white transition w-fit"
                          >
                            Connect New LinkedIn Account
                          </button>
                        </div>
                      ) : (
                        linkedinAccounts.map((acc) => (
                          <div
                            key={acc._id}
                            onClick={() => setSelectedLinkedinAccount(acc._id)}
                            className={`flex items-center justify-between gap-4 border p-4 rounded-xl cursor-pointer transition
                              ${selectedLinkedinAccount === acc._id
                                ? "border-[#C731CD] bg-[#FBE8FD] shadow-md"
                                : "border-gray-200 hover:border-[#C731CD] hover:bg-[#f9e2fb]"
                              }`}
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={acc.profilePicture || "https://via.placeholder.com/50"}
                                alt={acc.name}
                                className="w-12 h-12 rounded-full object-cover border"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-800">{acc.name}</h4>
                                <p className="text-sm text-gray-500">{acc.email}</p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">Total Posts: {acc.totalPosts || 0}</div>
                          </div>
                        ))
                      )
                    ) : (
                      <div className="text-center text-sm text-gray-500 py-2">
                        {selectedPlatform} integration is coming soon.
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-start flex-wrap gap-3 relative mb-2">
                <button
                  className="px-6 py-2 border-2 border-[#C731CD] text-[#C731CD] rounded-lg font-medium transition hover:bg-[#C731CD] hover:text-white"
                  onClick={handleInstantPost}
                >
                  Instant Post
                </button>
                <button
                  className="px-6 py-2 border-2 border-[#C731CD] text-[#C731CD] rounded-lg font-medium transition hover:bg-[#C731CD] hover:text-white"
                  onClick={() => setSchedule(!schedule)}
                >
                  Schedule Post
                </button>
                <button
                  className="px-6 py-2 border-2 border-[#C731CD] text-[#C731CD] rounded-lg font-medium transition hover:bg-[#C731CD] hover:text-white"
                  onClick={handleSaveDraft}
                >
                  Save Draft
                </button>
              </div>

              {schedule && (
                <div
                  ref={scheduleRef}
                  className="border rounded-md p-4 shadow-sm w-full max-w-md bg-gray-50 flex flex-col gap-2"
                >
                  <label className="font-medium mb-1">Pick Schedule Time:</label>
                  <div className="flex items-center gap-3">
                    <DatePicker
                      selected={scheduleDate}
                      onChange={(date) => setScheduleDate(date)}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="border p-2 rounded-md w-full text-center"
                    />
                    <button
                      onClick={handleScheduleConfirm}
                      className="px-4 py-2 bg-[#C731CD] text-white rounded-md hover:bg-[#a127ab] transition"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            max-height: 1000px;
            transform: translateY(0);
          }
        }

        .slide-down {
          animation: slideDown 0.3s ease-out forwards;
          overflow: hidden;
        }
      `}</style>
    </Layout>
  );
};

export default Finalize;
