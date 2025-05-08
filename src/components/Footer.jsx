import React from "react";
import { useLocation } from "react-router-dom";
import { FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const location = useLocation();
  const isMinimal = ["/login", "/signup", "/forgot-password"].includes(location.pathname);

  return (
    <footer className="w-full bg-[#F5F5F5] text-sm font-[Inter] text-black py-6">
      <div className="w-11/12 md:w-3/4 mx-auto">
        {isMinimal ? (
          <div className="flex flex-col md:flex-row justify-between items-center text-xs">
            <p className="text-left w-full md:w-auto mb-2 md:mb-0">
              © Copyright 2024, All Rights Reserved
            </p>

            <div className="w-full md:w-auto flex justify-center md:justify-end space-x-8">
              <a href="/terms" className="hover:underline">
                Terms of Service
              </a>
              <a href="/privacy" className="hover:underline">
                Privacy Policy
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center flex-wrap">
              <div className="flex-1"></div>

              <h2 className="text-3xl font-bold text-center flex-1">AI Virtual Assistant</h2>

              <div className="flex justify-end space-x-5 flex-1">
                {[
                  {
                    icon: FaXTwitter,
                    link: "https://twitter.com",
                    color: "hover:text-black",
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

            <p className="text-center mt-4 max-w-3xl mx-auto">
              Easily connect your favorite tools to automate your social media
              workflow. Our AI-powered system integrates seamlessly.
            </p>

            <hr className="my-8 border-gray-300 w-full" />

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row justify-between items-center text-xs">
              <p className="text-left w-full md:w-auto mb-2 md:mb-0">
                © Copyright 2025, All Rights Reserved
              </p>

              <div className="w-full md:w-auto flex justify-right md:justify-end space-x-8">
                <a href="/terms" className="hover:underline">
                  Terms of Service
                </a>
                <a href="/privacy" className="hover:underline">
                  Privacy Policy
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
