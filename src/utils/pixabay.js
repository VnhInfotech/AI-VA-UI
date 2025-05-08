import axios from "axios";

export const searchImages = async (query) => {
    try {
        const res = await axios.get("http://localhost:5000/api/generatedimages/search", {
            params: { q: query },
        });
        return res.data;
    } catch (err) {
        console.error("Backend image fetch error:", err);
        return [];
    }
};
