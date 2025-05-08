import React, { useState, useRef } from "react";
import { Search, Mic } from "lucide-react";
import Sparkle from "../assets/images/sparkle.png";

const SearchSection = () => {
  const [visibleOptions, setVisibleOptions] = useState(6);
  const filters = [
    "All",
    "Custom Post",
    "Custom Reel",
    "Custom Mockup",
    "VN Code",
    "Custom Post",
    "Option 7",
    "Option 8",
    "Option 9",
  ];
  const scrollRef = useRef(null);

  const handleShowMore = () => {
    setVisibleOptions((prev) => Math.min(prev + 3, filters.length));
  };

  return (
    <section className="py-10 w-full bg-white flex flex-col items-center rounded-lg shadow-md">
      <div className="w-3/4">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-left flex items-center gap-1">
          Search with <span className="text-black ml-1">Seamless Power</span>
          <img
            src={Sparkle}
            alt="sparkle"
            className="w-[18px] h-[20px] -mt-2 ml-[-4px] inline-block animate-sparkle"
          />
        </h2>

        {/* Search Bar */}
        <div
          className="mt-6 p-[1px] rounded-[10px]"
          style={{
            background:
              "linear-gradient(90.87deg, rgba(236, 131, 187, 0.8) 8.14%, rgba(182, 100, 219, 0.8) 90.67%)",
            boxShadow: "10px 10px 40px rgba(0, 0, 0, 0.15)",
          }}
        >

          <div className="flex items-center w-full px-4 py-2 rounded-[10px] bg-[#F5F5F5]">
            {/* Left Icon Section */}
            <div className="flex items-center mr-4 gap-2">
              <div
                className="w-8 h-8 rounded-[12px] flex items-center justify-center"
                style={{
                  background:
                    "conic-gradient(from 180deg at 50% 50%, #C729B9 -28.32deg, #B52BBA 4.67deg, #A12CBC 23.65deg, #8C2EBE 44.86deg, #792FBF 72.46deg, #6C30C0 82.5deg, #4B32C3 127.99deg, #5831C2 160.97deg, #6330C1 178.46deg, #742FC0 189.48deg, #8D2DBE 202.95deg, #A62CBC 230.66deg, #B92ABA 251.35deg, #D029B8 276.44deg, #EC27B6 306.45deg, #C729B9 331.68deg, #B52BBA 364.67deg)",
                }}
              >
                <img
                  src={require("../assets/images/search.png")}
                  alt="Search Icon"
                  className="w-5 h-5"
                />
              </div>
              <span className="mx-2 adlam-display font-bold text-[15px] leading-[100%] text-black">
                Ai Generate
              </span>
            </div>

            {/* Divider */}
            <div className="h-8 w-[2.5px] bg-gray-700 mx-3" />

            {/* Input Field */}
            <input
              type="text"
              placeholder="Describe your idea in words and let AI create a stunning image for you!"
              className="flex-grow outline-none border-none text-sm text-gray-800 placeholder-gray-500 bg-transparent"
            />

            {/* Mic Icon */}
            <Mic className="text-gray-800 w-5 h-5 mr-4 cursor-pointer" />

            {/* Search Button */}
            <button className="flex items-center font-bold text-sm text-black px-3 py-2 rounded-[10px] bg-white hover:shadow transition">
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="mt-6 w-3/4 grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="relative">
            <img
              src="https://www.shutterstock.com/image-photo/banff-national-park-lake-minnewanka-600nw-2527379207.jpg"
              alt="Generated"
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 rounded-b-lg">
              <h3 className="font-semibold">What EXPERTS say?</h3>
              <p className="text-xs">
                Incredible! It's best! I am recording my podcasts from 1-2 years,
                it actually is helping a lot, no more hires for sound engineers.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SearchSection;