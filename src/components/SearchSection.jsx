import React, { useState, useRef } from "react";
import { Search, Mic } from "lucide-react";

const SearchSection = () => {
  const [visibleOptions, setVisibleOptions] = useState(6); // Number of visible options
  const filters = ['All', 'Custom Post', 'Custom Reel', 'Custom Mockup', 'VN Code', 'Custom Post', 'Option 7', 'Option 8', 'Option 9'];
  const scrollRef = useRef(null); // Reference for the filter container

  const handleShowMore = () => {
    setVisibleOptions((prev) => Math.min(prev + 3, filters.length)); // Show 3 more options, max to total length
  };

  return (
    <section className="py-10 w-full bg-white flex flex-col items-center rounded-lg shadow-md">
      {/* Wrapper to align content */}
      <div className="w-3/4">
        {/* Left-Aligned Heading */}
        <h2 className="text-3xl font-bold text-left">
          Search with <span className="text-black">Seamless Power</span>
          <span className="text-[#c731cd]">✦</span>
        </h2>

        {/* Search Bar + Button */}
        <div className="mt-4 flex items-center border rounded-full overflow-hidden shadow-md w-full">
          <span className="bg-[#c731cd] text-white px-5 py-3 font-medium flex items-center rounded-l-full">
            <span className="mr-2">🎨</span> AI Generate
          </span>
          <input
            type="text"
            placeholder="Describe your idea in words and let AI create a stunning image for you!"
            className="p-3 flex-grow text-lg outline-none border-none"
          />
          <Mic className="text-gray-500 mx-4 cursor-pointer" />
          <button className="px-6 py-3 bg-[#c731cd] hover:bg-[#a855f7] text-white rounded-full text-lg transition duration-300 flex items-center">
            <Search className="mr-2" /> Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 w-3/4 flex items-center">
        {/* <button onClick={scrollLeft} className="flex-shrink-0 px-2">
          <span className="cursor-pointer text-gray-700 hover:text-gray-900">⬅️</span>
        </button> */}
        <div ref={scrollRef} className="flex items-center overflow-x-auto w-full">
          {filters.slice(0, visibleOptions).map((filter, index) => (
            <button
              key={index}
              className={`flex-grow px-4 py-2 rounded-full text-sm font-medium transition duration-300 ${index === 0 ? 'bg-gradient-to-r from-[#c731cd] to-[#a855f7] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              {filter}
            </button>
          ))}
          {/* Show More Arrow */}
          {visibleOptions < filters.length && (
            <div className="flex-shrink-0 px-4 py-2">
              <span onClick={handleShowMore} className="cursor-pointer text-gray-700 hover:text-gray-900">
                ➔ {/* You can replace this with an icon if needed */}
              </span>
            </div>
          )}
        </div>
        {/* <button onClick={scrollRight} className="flex-shrink-0 px-2">
          <span className="cursor-pointer text-gray-700 hover:text-gray-900">➡️</span>
        </button> */}
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
              <p className="text-xs">Incredible! It's best! I am recording my podcasts from 1-2 years, it actually is helping a lot, no more hires for sound engineers.</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SearchSection;