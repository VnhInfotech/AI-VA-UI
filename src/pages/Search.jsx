import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";


const Search = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "your search";

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [imageSize, setImageSize] = useState("1:1");
    const [templateText, setTemplateText] = useState(
        `Honoring Two Legends\n\n🔷 Truth & Non-Violence – Mahatma Gandhi\n🔷 Strength & Simplicity – Lal Bahadur Shastri\n\nLet’s follow their ideals for a stronger, united India!\n\n🇮🇳 Happy Gandhi & Shastri Jayanti! 🇮🇳`
    );

    const filters = [
        "All",
        "Custom Post",
        "Custom Reel",
        "Custom Mockup",
        "VN Code",
        "Option 6",
        "Option 7",
        "Option 8",
        "Option 9",
    ];

    const sampleImage =
        "https://www.shutterstock.com/image-photo/banff-national-park-lake-minnewanka-600nw-2527379207.jpg";

    return (
        <Layout>
            <section className="py-10 w-full flex flex-col items-center">
                <div className="w-11/12 max-w-7xl">
                    <h2 className="text-3xl font-bold text-left mb-4">
                        Showing results for{" "}
                        <span className="text-black">post design for {query}</span>
                    </h2>

                    <div className="flex flex-wrap gap-3 mb-6">
                        {filters.map((filter, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${index === 0
                                        ? "bg-gradient-to-r from-[#c731cd] to-[#a855f7] text-white"
                                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Image Templates Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedImage(sampleImage)}
                                className={`relative rounded-lg border-2 transition duration-300 cursor-pointer ${selectedImage === sampleImage ? "border-[#C731CD]" : "border-transparent"
                                    }`}
                            >
                                <img
                                    src={sampleImage}
                                    alt="Generated"
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 rounded-b-lg">
                                    <h3 className="font-semibold">What EXPERTS say?</h3>
                                    <p className="text-xs">
                                        Incredible! It's best! I am recording my podcasts from 1-2
                                        years, it actually is helping a lot, no more hires for sound
                                        engineers.
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Horizontal Divider */}
                    <hr className="my-12 border-t-2 border-gray-300" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedTemplate(index)}
                                className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer border-2 ${selectedTemplate === index ? "border-[#C731CD]" : "border-transparent"
                                    }`}
                            >
                                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                    A Tribute to Great Leaders 🇮🇳
                                </h3>
                                <p className="text-sm text-gray-700 mb-1">
                                    ✨ "Be the change you wish to see in the world." - Mahatma Gandhi
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                    ✨ "Jai Jawan, Jai Kisan." - Lal Bahadur Shastri
                                </p>
                                <p className="text-sm text-gray-800 mt-2">
                                    Let’s honor their legacy of truth, peace, and selfless service.
                                </p>
                                <p className="text-sm text-[#c731cd] font-medium mt-2">
                                    🇮🇳 Happy Gandhi & Shastri Jayanti! 🇮🇳
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Selected Items Section */}
                    {selectedImage && selectedTemplate !== null && (
                        <>
                            <hr className="my-12 border-t-2 border-gray-300" />
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Would You Like This
                            </h2>

                            <div className="flex flex-col md:flex-row items-start gap-6">
                                {/* Selected Template */}
                                <div className="w-full md:w-1/2">
                                    <div className="bg-white p-6 rounded-lg shadow-md border-2 border-[#C731CD]">
                                        <textarea
                                            value={templateText}
                                            onChange={(e) => setTemplateText(e.target.value)}
                                            rows={10}
                                            className="w-full border-none resize-none text-sm text-gray-800 focus:outline-none"
                                        />
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        className="w-full mt-4 px-6 py-3 text-white text-lg font-medium bg-[#C731CD] rounded-lg hover:bg-[#a855f7] transition duration-300"
                                        onClick={() => {
                                            localStorage.setItem("selectedImage", selectedImage);
                                            localStorage.setItem("selectedCaption", templateText);
                                            navigate("/search/finalize");
                                        }}
                                    >
                                        Next
                                    </button>

                                </div>

                                {/* Selected Image */}
                                <div className="w-full md:w-1/2">
                                    <img
                                        src={selectedImage}
                                        alt="Selected"
                                        className={`w-full h-auto rounded-lg border-2 border-[#C731CD] ${imageSize === "1:1" ? "aspect-square" : "aspect-[16/9]"
                                            }`}
                                    />

                                    {/* Image Size Selection */}
                                    <div className="flex gap-3 mt-4">
                                        {["1:1", "16:9"].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setImageSize(size)}
                                                className={`px-4 py-2 text-sm rounded-lg transition duration-300 ${imageSize === size
                                                        ? "bg-[#C731CD] text-white"
                                                        : "bg-gray-200 hover:bg-gray-300"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </Layout>
    );
};

export default Search;
