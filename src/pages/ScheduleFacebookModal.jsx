import React, { useEffect, useState } from "react";
import axios from "axios";

const ScheduleFacebookModal = ({ open, onClose, token, selectedAccountId, scheduleDate, postDTO }) => {
  const [pages, setPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      if (!open || !selectedAccountId) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/facebook/pages/${selectedAccountId}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        setPages(res.data.pages);
      } catch (err) {
        console.error("Error fetching Facebook pages:", err);
        alert("Failed to fetch Facebook pages.");
        onClose();
      }
    };

    fetchPages();
  }, [open, selectedAccountId, token, onClose]);

  const handleSchedule = async () => {
    if (!selectedPageId) {
      alert("Please select a page.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/facebook/schedule",
        postDTO.toFacebookSchedulePayload(scheduleDate, selectedPageId),
        {
          headers: { "x-auth-token": token },
        }
      );
      alert("Post scheduled successfully!");
      onClose();
    } catch (err) {
      console.error("Scheduling failed:", err);
      alert("Failed to schedule the post.");
    }
  };

  if (!open) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h3>Select a Facebook Page</h3>
        {pages.length === 0 ? (
          <p>No pages found.</p>
        ) : (
          <select
            value={selectedPageId || ""}
            onChange={(e) => setSelectedPageId(e.target.value)}
            style={styles.select}
          >
            <option value="" disabled>Select a Page</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
        )}
        <div style={styles.buttons}>
          <button onClick={handleSchedule} style={styles.confirmBtn}>Confirm</button>
          <button onClick={onClose} style={styles.cancelBtn}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  select: {
    width: "100%",
    padding: "8px",
    margin: "10px 0",
    fontSize: "16px",
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
  },
  confirmBtn: {
    padding: "8px 16px",
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 16px",
    backgroundColor: "#eee",
    color: "#333",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ScheduleFacebookModal;
