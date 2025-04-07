import React, { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

export default function Faqs({ faqList }) {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <section className="py-16 w-3/4 mx-auto">
        <div>
          {/* Heading */}
          <h3 className="text-4xl font-bold text-left text-gray-800">Frequently Asked Questions</h3>

          {/* FAQ List */}
          <div className="mt-6 space-y-4">
            {faqList.map((faq, index) => (
              <div
                key={index}
                className="p-5 border border-gray-300 rounded-lg flex flex-col transition-all duration-300"
              >
                {/* Question Section */}
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-lg font-bold text-gray-700">{faq.id}</span>
                    <p className="font-semibold text-lg text-gray-800">{faq.question}</p>
                  </div>

                  {/* Toggle Button with Custom Color */}
                  <button
                    className={`w-10 h-10 flex items-center justify-center rounded-md transition-all duration-300 ${
                      openIndex === index
                        ? "bg-[rgb(199,49,205)] text-white hover:bg-[rgb(179,39,185)]"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {openIndex === index ? <FiMinus size={20} /> : <FiPlus size={20} />}
                  </button>
                </div>

                {/* Answer Section */}
                {openIndex === index && (
                  <p className="mt-3 text-gray-700 transition-opacity duration-300">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
