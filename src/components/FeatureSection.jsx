import React from 'react'

export default function FeatureSection({ rocket }) {
  return (
    <section className="py-16 flex items-start justify-between w-3/4 mx-auto">
      {/* Left Content */}
      <div className="max-w-3xl">
        <h3 className="text-4xl font-bold text-left">
          AI-Powered Social Media Automation for Maximum Engagement!
        </h3>
        <ul className="mt-6 text-xl text-left space-y-3">
          <li>• AI-Generated Posts & Reels :– Automatically creates trending and engaging content</li>
          <li>• Auto-Posting on Social Media – Directly post</li>
          <li>• Customizable Templates – Ready-made formats for carousels, reels, and text posts</li>
          <li>• Post Scheduling & Planner – Plan and schedule future posts easily</li>
          <li>• AI Hashtag & Caption Generator :– Get the best hashtags and captions for viral reach</li>
          <li>• Analytics & Insights – Track performance and improve engagement</li>
        </ul>
      </div>

      {/* Right Image */}
      <div className="w-[400px]">
        <img
          src={rocket}
          alt="AI Automation"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    </section>
  );
}
