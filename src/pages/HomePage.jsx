import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { FaTwitter, FaLinkedin, FaTiktok } from "react-icons/fa";
import rocket from "../assets/images/rocket.png";

import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import SearchSection from "../components/SearchSection";
import FeatureSection from "../components/FeatureSection";
import PricingSection from "../components/PricingSection";
import ConnectedAppSection from "../components/ConnectedAppSection";
import Faqs from "../components/Faqs";
import Page from "../components/Page";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();
  const planList = [
    {
      title: "Free Plan",
      price: "Let's talk!",
      features: [
        "AI-generated posts per month",
        "Basic post templates",
        "Manual posting (No auto-posting)",
        "No scheduling feature",
        "No analytics or insights",
        "No team collaboration",
      ],
      buttonText: "Contact us",
      highlight: false,
    },
    {
      title: "Basic plan",
      price: "$250",
      features: [
        "1 design project per month",
        "Basic design consultation",
        "Limited revisions",
        "Email support",
      ],
      buttonText: "Get Started",
      highlight: false,
    },
    {
      title: "Most Popular",
      price: "$500",
      features: [
        "3 design projects per month",
        "Detailed design consultation",
        "Unlimited revisions",
        "Priority email and chat support",
        "Access to design resources library",
      ],
      buttonText: "Get Started",
      highlight: true,
    },
    {
      title: "Popular",
      price: "$800",
      features: [
        "3 design projects per month",
        "Detailed design consultation",
        "Unlimited revisions",
        "Priority email and chat support",
        "Access to design resources library",
      ],
      buttonText: "Get Started",
      highlight: false,
    },
  ];

  const faqList = [
    {
      id: "01",
      question:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has.",
      answer:
        "Easily connect your favorite tools to automate your social media workflow. Our AI-powered system integrates with multiple apps to enhance content creation and posting.",
    },
    {
      id: "02",
      question:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has.",
      answer:
        "Easily connect your favorite tools to automate your social media workflow. Our AI-powered system integrates with multiple apps to enhance content creation and posting.",
    },
    {
      id: "03",
      question:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has.",
      answer:
        "Easily connect your favorite tools to automate your social media workflow. Our AI-powered system integrates with multiple apps to enhance content creation and posting.",
    },
    {
      id: "04",
      question:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has.",
      answer:
        "Easily connect your favorite tools to automate your social media workflow. Our AI-powered system integrates with multiple apps to enhance content creation and posting.",
    },
  ];

  useEffect(() => {
    if (user) {
      navigate("/homepage");
    }
  }, [user, navigate]);

  return (
    <div className="font-sans min-h-screen text-gray-800">
      {/* Hero Section */}
      <HeroSection />
      {/* Search Bar */}
      <SearchSection />
      {/* Features Section */}
      <FeatureSection rocket={rocket} />
      {/* Pricing Section */}
      <PricingSection planList={planList} />
      {/* Connected Apps */}
      <ConnectedAppSection />
      {/* FAQ */}
      <Faqs faqList={faqList} />
    </div>
  );
};

export default HomePage;
