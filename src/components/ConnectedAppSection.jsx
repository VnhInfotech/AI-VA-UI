import React from "react";
import { FaTwitter, FaLinkedin } from "react-icons/fa";
import { BsFacebook } from "react-icons/bs";

export default function ConnectedAppSection() {
  return (
    <section className="py-16 w-3/4 mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10">
        {/* Left Side: Title & Description */}
        <div className="max-w-lg text-left">
          <h3 className="text-4xl font-bold">Connected Apps & Integrations</h3>
          <p className="mt-4 text-xl ">
            Easily connect your favorite tools to automate your social media workflow. 
            Our AI-powered system integrates with multiple apps to enhance content creation and posting.
          </p>
        </div>

        {/* Right Side: App Cards */}
<div className="grid grid-cols-3 gap-8">
  {[
    { icon: FaLinkedin, name: "LinkedIn" },
    { icon: FaTwitter, name: "Twitter" },
    { icon: BsFacebook, name: "Facebook" },
  ].map(({ icon: Icon, name }, idx) => (
    <div
      key={idx}
      className="w-50 p-8 border rounded-xl shadow-md flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      {/* Larger Gradient Circle with Icon */}
      <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
        <Icon className="text-white text-4xl" />
      </div>
      {/* Larger App Name */}
      <p className="mt-5 text-xl font-semibold">{name}</p>
    </div>
  ))}
</div>

      </div>
    </section>
  );
}
