import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import ImagePostDTO from "../utils/ImagePostDTO"; // used dto instead of local storage

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/drafts", {
          headers: { "x-auth-token": token },
        });
        setDrafts(res.data.drafts);
      } catch (err) {
        console.error("Error fetching drafts:", err);
      }
    };

    fetchDrafts();
  }, []);

  const handleDraftClick = (draft) => {
    const dto = new ImagePostDTO({
      imageUrl: draft.imageUrl,
      caption: draft.content    });
  
      navigate("/search/finalize", { state: { post: dto, draftId: draft._id } });
  };

  return (
    <Layout title="Drafts">
      <div className="p-6 overflow-y-auto">
        {drafts.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-lg">No drafts yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {drafts.map((draft) => (
              <div
                key={draft._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-4 cursor-pointer"
                onClick={() => handleDraftClick(draft)}
              >
                <div className="relative w-full h-48 mb-3 rounded-xl overflow-hidden">
                  <img
                    src={draft.imageUrl}
                    alt="Draft"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-800 line-clamp-2 mb-2">{draft.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Drafts;
