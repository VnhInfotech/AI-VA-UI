import React from "react";
import { FaTwitter, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";

const Footer = () => (
  <footer className="w-3/4 mx-auto py-10">
    <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
      {/* Left Section - Title & Subtitle */}
      <div className="max-w-full mx-auto text-center">
        <h2 className="text-3xl font-bold">AI Virtual Assistant</h2>
        <p className="mt-5 whitespace-nowrap overflow-hidden text-ellipsis">
          Easily connect your favorite tools to automate your social media
          workflow. Our AI-powered system integrates seamlessly.
        </p>
      </div>

      {/* Right Section - Social Icons */}
      <div className="flex space-x-5 mt-6 md:mt-0">
        {[
          {
            icon: FaTwitter,
            link: "https://twitter.com",
            color: "hover:text-blue-400",
          },
          {
            icon: FaLinkedin,
            link: "https://linkedin.com",
            color: "hover:text-blue-500",
          },
          {
            icon: FaTiktok,
            link: "https://tiktok.com",
            color: "hover:text-gray-400",
          },
          {
            icon: FaYoutube,
            link: "https://youtube.com",
            color: "hover:text-red-500",
          },
        ].map(({ icon: Icon, link, color }, index) => (
          <a key={index} href={link} target="_blank" rel="noopener noreferrer">
            <Icon
              className={`text-2xl text-black transition duration-300 ${color}`}
            />
          </a>
        ))}
      </div>
    </div>

    {/* Bottom Section - Copyright & Links */}
    <div className="mt-8 flex flex-col md:flex-row justify-between items-center  text-sm">
      <p>© Copyright 2025, All Rights Reserved</p>
      <div className="flex space-x-5 mt-2 md:mt-0">
        <a href="/terms" className="hover:underline">
          Terms of Service
        </a>
        <a href="/privacy" className="hover:underline">
          Privacy Policy
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
