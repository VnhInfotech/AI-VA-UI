import React from "react";
import { ArrowRight } from "lucide-react";

const HeroSection = () => (
  <section className="text-center py-16">
    <h2 className="text-4xl font-bold">
      Create Stunning AI-Generated Images & Videos Instantly!
    </h2>
    <p className="mt-4 text-xl  max-w-3xl mx-auto">
      We've been told it is possible to revolutionize the payment industry. We
      have not reinvented the wheel, we decided to build upon it - successfully.
    </p>
    <button className="mt-6 px-8 py-4 bg-[#c731cd] hover:bg-[#a855f7] text-white rounded-md text-lg flex items-center gap-2 mx-auto transition duration-300">
      CONNECTED <ArrowRight className="w-5 h-5" />
    </button>
  </section>
);

export default HeroSection;
