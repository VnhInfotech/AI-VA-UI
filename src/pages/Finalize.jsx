import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import ImagePostDTO from "../utils/ImagePostDTO";
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import usePostStore from "../store/postStore";
import { useNavigate } from "react-router-dom";
import ScheduleFacebookModal from "../pages/ScheduleFacebookModal";

const Finalize = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [postDTO, setPostDTO] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [schedule, setSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [linkedinAccounts, setLinkedinAccounts] = useState([]);
  const [selectedLinkedinAccount, setSelectedLinkedinAccount] = useState(null);
  const [facebookAccounts, setFacebookAccounts] = useState([]);
  const [selectedFacebookAccount, setSelectedFacebookAccount] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const scheduleRef = useRef(null);
  const [draftId, setDraftId] = useState(null);
  const token = localStorage.getItem("token");
  const location = useLocation();
  const [isCropping, setIsCropping] = useState(false);
  const [cropper, setCropper] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState(NaN);
  const [finalImage, setFinalImage] = useState(null);
  const [hasFacebookPages, setHasFacebookPages] = useState(false);
  const [facebookPageOptions, setFacebookPageOptions] = useState([]);
  const [showFacebookPostOptions, setShowFacebookPostOptions] = useState(false);
  const [selectedFacebookPageId, setSelectedFacebookPageId] = useState(null);
  const [showFacebookPostConfirmation, setShowFacebookPostConfirmation] = useState(false);
  const [showFbPageModal, setShowFbPageModal] = useState(false);

  const {
    selectedImage,
    templateText,
    prompt,
    setSelectedImage,
    setTemplateText
  } = usePostStore();

  const expiryDate = () => {
    if (!selectedLinkedinAccount || !selectedLinkedinAccount.tokenExpiry) return null;

    const expiry = new Date(selectedLinkedinAccount.tokenExpiry);
    expiry.setHours(23, 59, 59, 999);

    return expiry;
  };

  useEffect(() => {
    const { state } = location;
    const imageFromStore = selectedImage || state?.post?.imageUrl;
    const captionFromStore = templateText || state?.post?.caption;

    if (imageFromStore) {
      setImage(imageFromStore);
      setFinalImage(imageFromStore);
      setOriginalImage(imageFromStore);
      setSelectedImage(imageFromStore);
    }

    if (captionFromStore) {
      setCaption(captionFromStore);
      setTemplateText(captionFromStore);
    }

    if (state?.post) {
      const dto = new ImagePostDTO(state.post);
      setPostDTO(dto);
      setSelectedPlatform(dto.selectedPlatform || null);
      setSelectedLinkedinAccount(dto.selectedAccountId || null);
    }

    if (state?.draftId) {
      setDraftId(state.draftId);
    }
  }, [location]);

  useEffect(() => {
    const { state } = location;
    if (state?.post) {
      const dto = new ImagePostDTO(state.post);
      setPostDTO(dto);
      setImage(dto.imageUrl);
      setOriginalImage(dto.imageUrl);
      setCaption(dto.caption);
      setSelectedPlatform(dto.selectedPlatform || null);
      setSelectedLinkedinAccount(dto.selectedAccountId || null);
    }
    // Grab draftId if it's passed from Drafts.jsx
    if (state.draftId) {
      setDraftId(state.draftId);
    }
  }, [location.search]);

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
      if (event.data?.type === "FACEBOOK_ACCOUNT_CONNECTED") {
        fetchFacebookAccounts();
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
    if (!token || !postDTO) return;
    postDTO.caption = caption;
    postDTO.image = finalImage;

    try {
      await axios.post(
        "http://localhost:5000/api/drafts",
        postDTO.toDraftPayload(),
        {
          headers: { "x-auth-token": token },
        }
      );
      navigate("/drafts");
    } catch (err) {
      console.error("Draft saving failed:", err);
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

  const fetchFacebookAccounts = async () => {
    setLoading(true);
    if (!token) return;

    try {
      const res = await axios.get("http://localhost:5000/api/auth/facebook/accounts", {
        headers: { "x-auth-token": token },
      });

      const accounts = res?.data?.accounts || [];

      setFacebookAccounts(accounts);

      if (accounts.length > 0) {
        const pageRes = await axios.get(`https://graph.facebook.com/v16.0/me/accounts`, {
          params: {
            access_token: accounts[0].accessToken,
          },
        });

        const pages = pageRes.data.data;
        setFacebookPageOptions(pages);
        setHasFacebookPages(pages.length > 0);
      }
    } catch (err) {
      console.error("Error fetching Facebook accounts or pages", err);
      setFacebookAccounts([]);
      setHasFacebookPages(false);
    } finally {
      setLoading(false);
    }
  };


  const handlePlatformSelect = async (platform) => {
    setSelectedPlatform(platform);
    if (platform === "LinkedIn") {
      await fetchLinkedInAccounts();
    } else if (platform === "Facebook") {
      await fetchFacebookAccounts();
    } else {
      setShowDropdown(true);
    }
  };

  const handleInstantPost = async () => {
    if (selectedPlatform === "LinkedIn") {
      if (!selectedLinkedinAccount) {
        toast.error("Please select a LinkedIn account.");
        return;
      }
      try {
        postDTO.caption = caption;
        postDTO.image = finalImage;
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

        toast.success("Posted to LinkedIn successfully!");
      } catch (err) {
        console.error("Post failed:", err);
        toast.error("Failed to post to LinkedIn.");
      }

    } else if (selectedPlatform === "Facebook") {
      if (!selectedFacebookAccount) {
        toast.error("Please select a Facebook account.");
        return;
      }

      // If user has pages, show them options
      if (hasFacebookPages) {
        setShowFacebookPostOptions(true);
        return;
      }

      // If user has no pages, directly open feed dialog
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/facebook/post",
          {
            accountId: selectedFacebookAccount,
            imageUrl: finalImage,
            caption,
            postTo: "feed",
          },
          { headers: { "x-auth-token": token } }
        );

        const feedDialogUrl = res.data.feedDialogUrl;
        // window.open(feedDialogUrl, "_blank", "width=600,height=500");
        const feedWindow = window.open(feedDialogUrl, "_blank", "width=600,height=500");
        const checkClosed = setInterval(() => {
          if (feedWindow.closed) {
            clearInterval(checkClosed);
            setShowFacebookPostConfirmation(true);
          }
        }, 500);
        toast.success("Opened Facebook share dialog!");

        if (draftId) {
          await axios.put(
            `http://localhost:5000/api/drafts/${draftId}/mark-posted`,
            {},
            { headers: { "x-auth-token": token } }
          );
        }
      } catch (err) {
        console.error("Feed dialog error:", err);
        toast.error("Failed to post to Facebook feed.");
      }
    }

    else {
      toast(`${selectedPlatform} integration is coming soon.`);
    }
  };

  const handleScheduleConfirm = async () => {
    if (selectedPlatform === "Facebook") {
      if (!scheduleDate) {
        toast.error("Please select a date and time.");
        return;
      }

      if (!selectedFacebookAccount) {
        toast.error("Please select a Facebook account.");
        return;
      }

      setShowFbPageModal(true);
    } else if (selectedPlatform === "LinkedIn") {
      if (!selectedLinkedinAccount) {
        toast.error("Please select a LinkedIn account.");
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

        toast.success("LinkedIn post scheduled successfully!");
      } catch (err) {
        console.error("Failed to schedule post:", err);
        toast.error("Failed to schedule LinkedIn post.");
      }
    } else {
      toast(`${selectedPlatform} scheduling is coming soon.`);
    }
  };

  const handleCropConfirm = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
        const croppedUrl = canvas.toDataURL("image/png");
        setCroppedImage(croppedUrl);
        setImage(croppedUrl);
        setFinalImage(croppedUrl);
        setIsCropping(false);

        if (postDTO) {
          const updatedDTO = new ImagePostDTO({ ...postDTO, image: croppedUrl });
          setPostDTO(updatedDTO);
        }
      }
    }
  };

  const handleCropCancel = () => {
    setIsCropping(false);
  };

  return (
    <Layout>
      <section className="py-10 w-full flex flex-col items-center">
        <div className="w-11/12 max-w-5xl bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Finalize Your Post</h2>

          <div className="flex flex-col md:flex-row gap-6 mb-10">
            <div className="md:w-1/2 flex flex-col items-center gap-4">
              {!isCropping && image && (
                <>
                  <img
                    src={croppedImage || image}
                    alt="Selected"
                    className="w-full rounded-lg border-2 border-[#C731CD] object-contain"
                  />
                  <button
                    onClick={() => setIsCropping(true)}
                    className="px-4 py-2 bg-[#C731CD] text-white rounded-md hover:bg-[#a127ab] transition"
                  >
                    Crop Image
                  </button>
                </>
              )}

              {isCropping && (
                <>
                  <Cropper
                    src={finalImage}

                    style={{ height: 500, width: "100%" }}
                    aspectRatio={NaN}
                    guides={true}
                    viewMode={1}
                    responsive={true}
                    checkOrientation={false}
                    height='auto'
                    width='100%'
                    onInitialized={(instance) => setCropper(instance)}
                  />

                  <div className="w-full mt-4">
                    <div className="flex gap-2 flex-wrap justify-center">
                      {[
                        { label: "Free", ratio: NaN },
                        { label: "1:1", ratio: 1 },
                        { label: "4:5", ratio: 4 / 5 },
                        { label: "16:9", ratio: 16 / 9 }
                      ].map(({ label, ratio }) => (
                        <button
                          key={label}
                          onClick={() => {
                            cropper?.setAspectRatio(ratio);
                            setAspectRatio(ratio);
                          }}
                          className="px-3 py-1 text-sm border-2 border-[#C731CD] text-[#C731CD] rounded hover:bg-[#C731CD] hover:text-[#FFFFFF] transition font-medium"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleCropConfirm}
                      className="px-4 py-2 bg-[#C731CD] text-white border-2 border-[#C731CD] rounded-md hover:bg-white hover:text-[#C731CD] transition font-medium"
                    >
                      Crop & Confirm
                    </button>
                    <button
                      onClick={handleCropCancel}
                      className="px-4 py-2 border border-gray-400 text-gray-600 rounded-md hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

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
                    ) : selectedPlatform === "Facebook" ? (
                      facebookAccounts.length === 0 ? (
                        <div className="text-sm text-gray-600 flex flex-col gap-3">
                          <p>No Facebook accounts connected.</p>
                          <button
                            onClick={() => {
                              const width = 600;
                              const height = 600;
                              const left = window.innerWidth / 2 - width / 2;
                              const top = window.innerHeight / 2 - height / 2;

                              const popup = window.open(
                                `http://localhost:5000/api/auth/facebook/redirect?token=${token}`,
                                "ConnectFacebook",
                                `width=${width},height=${height},top=${top},left=${left}`
                              );

                              const timer = setInterval(() => {
                                if (popup.closed) {
                                  clearInterval(timer);
                                  fetchFacebookAccounts();
                                }
                              }, 500);
                            }}
                            className="text-[#C731CD] border border-[#C731CD] px-4 py-2 rounded-lg font-medium hover:bg-[#C731CD] hover:text-white transition w-fit"
                          >
                            Connect Facebook Account
                          </button>
                        </div>
                      ) : (
                        facebookAccounts.map((acc) => (
                          <div
                            key={acc._id}
                            onClick={() => setSelectedFacebookAccount(acc._id)}
                            className={`flex items-center justify-between gap-4 border p-4 rounded-xl cursor-pointer transition
          ${selectedFacebookAccount === acc._id
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
                      minDate={new Date()}
                      maxDate={expiryDate()}
                      className="border p-2 rounded-md w-full text-center"
                      calendarClassName="custom-datepicker-calendar"
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
        {showFacebookPostOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">Where do you want to post?</h3>
              <div className="space-y-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                  onClick={async () => {
                    setShowFacebookPostOptions(false);
                    try {
                      const res = await axios.post(
                        "http://localhost:5000/api/auth/facebook/post",
                        {
                          accountId: selectedFacebookAccount,
                          imageUrl: finalImage,
                          caption,
                          postTo: "feed",
                        },
                        { headers: { "x-auth-token": token } }
                      );

                      const feedDialogUrl = res.data.feedDialogUrl;
                      // window.open(feedDialogUrl, "_blank", "width=600,height=500");
                      const feedWindow = window.open(feedDialogUrl, "_blank", "width=600,height=500");

                      const checkClosed = setInterval(() => {
                        if (feedWindow.closed) {
                          clearInterval(checkClosed);
                          setShowFacebookPostConfirmation(true);
                        }
                      }, 500);

                      toast.success("Opened Facebook share dialog!");
                    } catch (err) {
                      toast.error("Failed to post to feed.");
                      console.error(err);
                    }
                  }}
                >
                  Post to My Feed
                </button>

                <div>
                  <label className="block mb-2">Post to a Page:</label>
                  <select
                    className="border rounded px-3 py-2 w-full"
                    value={selectedFacebookPageId || ""}
                    onChange={(e) => setSelectedFacebookPageId(e.target.value)}
                  >
                    <option value="">-- Select a Page --</option>
                    {facebookPageOptions.map((page) => (
                      <option key={page.id} value={page.id}>
                        {page.name}
                      </option>
                    ))}
                  </select>

                  <button
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded w-full"
                    disabled={!selectedFacebookPageId}
                    onClick={async () => {
                      try {
                        await axios.post(
                          "http://localhost:5000/api/auth/facebook/post",
                          {
                            accountId: selectedFacebookAccount,
                            imageUrl: finalImage,
                            caption,
                            postTo: "page",
                            selectedPageId: selectedFacebookPageId,
                          },
                          { headers: { "x-auth-token": token } }
                        );
                        toast.success("Posted to Facebook page!");
                        setShowFacebookPostOptions(false);
                      } catch (err) {
                        toast.error("Failed to post to page.");
                        console.error(err);
                      }
                    }}
                  >
                    Post to Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showFacebookPostConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Did you successfully post this image to your personal Facebook feed?
              </h3>
              <div className="flex justify-around">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  onClick={async () => {
                    try {
                      await axios.post("http://localhost:5000/api/auth/facebook/log-feed-post", {
                        accountId: selectedFacebookAccount,
                        imageUrl: finalImage,
                        caption,
                      }, { headers: { "x-auth-token": token } });

                      toast.success("Post confirmed and logged.");
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to log post.");
                    } finally {
                      setShowFacebookPostConfirmation(false);
                    }
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setShowFacebookPostConfirmation(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
        <ScheduleFacebookModal
          open={showFbPageModal}
          onClose={() => setShowFbPageModal(false)}
          token={token}
          selectedAccountId={selectedFacebookAccount}
          scheduleDate={scheduleDate}
          postDTO={postDTO}
        />

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
