import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  FaLinkedinIn,
  FaInstagram,
  FaFacebookF,
  FaEnvelope,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import axios from "axios";

const SMM = () => {
  const [selectedPlatform, setSelectedPlatform] = useState("linkedin");
  const [linkedinAccounts, setLinkedinAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState(null);

  const fetchLinkedInAccounts = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.get("http://localhost:5000/api/auth/linkedin/accounts", {
        headers: { "x-auth-token": token },
      });
      setLinkedinAccounts(res?.data?.accounts || []);
    } catch (err) {
      console.error("Failed to fetch LinkedIn accounts", err);
      setMessage("Error fetching LinkedIn accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlatform === "linkedin") {
      fetchLinkedInAccounts();
    }
  }, [selectedPlatform]);

  const handleConnectNew = () => {
    if (!token) {
      alert("User token is missing. Please log in again.");
      return;
    }

    const popup = window.open(
      `http://localhost:5000/api/auth/linkedin/redirect?token=${token}`,
      "LinkedInAuth",
      "width=600,height=700"
    );

    if (!popup) {
      setMessage("❌ Failed to open popup. Please allow popups in your browser.");
      return;
    }

    const checkPopupClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkPopupClosed);
        fetchLinkedInAccounts(); // Refresh the accounts once the popup closes
      }
    }, 500);

    const listener = (event) => {
      if (
        event.origin !== "http://localhost:3000" ||
        event.data?.source !== "linkedin-oauth"
      ) return;

      // ✅ Process message
      const status = event.data.status;
      switch (status) {
        case "success":
          setMessage("✅ LinkedIn account connected successfully.");
          break;
        case "already-exists":
          setMessage("⚠️ This LinkedIn account is already connected.");
          break;
        case "error":
          setMessage("❌ Something went wrong during LinkedIn login.");
          break;
        case "invalid-token":
          setMessage("⚠️ Invalid or expired token.");
          break;
        case "unauthorized":
          setMessage("❌ Unauthorized or invalid user.");
          break;
        case "missing-auth":
          setMessage("⚠️ Missing authorization code or state.");
          break;
        default:
          setMessage("⚠️ Unknown status received from LinkedIn.");
      }
    };

    window.addEventListener("message", listener);

    // Optional: Cleanup listener after 1 minute
    setTimeout(() => {
      window.removeEventListener("message", listener);
      clearInterval(checkPopupClosed);
    }, 60000);
  };

  // const handleDisconnect = async (accountId) => {
  //   try {
  //     await axios.patch(
  //       `http://localhost:5000/api/auth/linkedin/delete/${accountId}`,
  //       {},
  //       { headers: { "x-auth-token": token } }
  //     );
  //     setLinkedinAccounts(prev => prev.filter(acc => acc._id !== accountId));
  //   } catch (error) {
  //     console.error("Disconnect error", error);
  //     setMessage("Failed to disconnect LinkedIn account.");
  //   }
  // };

  const confirmDisconnect = (accountId) => {
    setAccountToDisconnect(accountId);
    setShowConfirmPopup(true);
  };

  const proceedDisconnect = async () => {
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/linkedin/delete/${accountToDisconnect}`,
        {},
        { headers: { "x-auth-token": token } }
      );
      setLinkedinAccounts(prev => prev.filter(acc => acc._id !== accountToDisconnect));
      setMessage("Disconnected successfully.");
    } catch (error) {
      console.error("Disconnect error", error);
      setMessage("Failed to disconnect LinkedIn account.");
    } finally {
      setShowConfirmPopup(false);
      setAccountToDisconnect(null);
    }
  };

  const socialButtons = [
    { id: "linkedin", label: "LinkedIn", icon: <FaLinkedinIn />, color: "#0A66C2" },
    { id: "instagram", label: "Instagram", icon: <FaInstagram />, gradient: true },
    { id: "facebook", label: "Facebook", icon: <FaFacebookF />, color: "#1877F2" },
    { id: "x", label: "X", icon: <FaXTwitter />, color: "black" },
  ];

  return (
    <Layout>
      <div className="w-full max-w-4xl pl-8 pr-4 py-10">
        {/* Social Media Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          {socialButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedPlatform(btn.id)}
              className={`social-btn ${btn.gradient
                  ? "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"
                  : `bg-[${btn.color}]`
                } text-white ${selectedPlatform === btn.id ? "border-2 border-black" : ""
                }`}
            >
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && <p className="text-sm text-blue-700 mb-4">{message}</p>}
        {loading && <p className="text-gray-500">Loading LinkedIn accounts...</p>}

        {/* Dropdown Section */}
        <div className="w-full bg-white border rounded-xl shadow p-4 flex flex-col gap-4 mb-6 animate-fade">
          {selectedPlatform === "linkedin" && (
            <>
              {linkedinAccounts
                .filter(acc => acc.isEnabled) // 👈 only show enabled accounts
                .map(acc => (
                  <div
                    key={acc._id}
                    className="bg-white rounded-2xl p-6 shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={acc.profilePicture || "https://via.placeholder.com/48"}
                        alt="Profile"
                        className="rounded-full w-12 h-12 object-cover"
                      />
                      <div>
                        <h2 className="font-semibold text-lg">{acc.name}</h2>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaEnvelope className="mr-2" />
                          {acc.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 flex-wrap items-center text-sm text-gray-500">
                      <span>Total Posts: {acc.totalPosts ?? 0}</span>
                      <button
                        onClick={() => confirmDisconnect(acc._id)}
                        className="px-4 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        Disconnect
                      </button>
                    </div>
                  </div>
                ))}


              {(linkedinAccounts.length === 0 ||
                linkedinAccounts.every(acc => !acc.isEnabled)) ? (
                <div className="text-gray-600 text-sm">
                  <p>No active LinkedIn accounts connected.</p>
                  <button
                    onClick={handleConnectNew}
                    className="mt-4 px-4 py-2 bg-[#0A66C2] text-white rounded-md font-medium hover:bg-[#004182] transition"
                  >
                    + Connect New Account
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnectNew}
                  className="self-start mt-2 px-4 py-2 bg-[#0A66C2] text-white rounded-md font-medium hover:bg-[#004182] transition"
                >
                  + Connect Another Account
                </button>
              )}
            </>
          )}

          {selectedPlatform === "instagram" && (
            <p className="text-gray-600 text-sm">coming soon...</p>
          )}
          {selectedPlatform === "facebook" && (
            <p className="text-gray-600 text-sm">coming soon...</p>
          )}
          {selectedPlatform === "x" && (
            <p className="text-gray-600 text-sm">coming soon...</p>
          )}
        </div>
      </div>

      <style>{`
        .animate-fade {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .social-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.75rem 1.5rem;
          width: 180px;
          justify-content: center;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.2s;
          opacity: 1;
        }
        .social-btn:hover {
          filter: brightness(0.9);
          transform: scale(1.05);
        }
      `}</style>
      {showConfirmPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-80 text-center space-y-4">
            <h2 className="text-lg font-semibold">Are you sure?</h2>
            <p>Do you really want to disconnect this LinkedIn account?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={proceedDisconnect}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirmPopup(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SMM;
