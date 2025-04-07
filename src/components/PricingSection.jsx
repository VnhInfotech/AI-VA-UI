import React from "react";

export default function PricingSection({ planList }) {
  return (
    <div>
      <section className="py-16 w-3/4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {planList.map((plan, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md border flex flex-col h-full ${
                plan.highlight ? "bg-green-100 border-green-300" : "bg-white"
              }`}
            >
              {/* Left-aligned Title */}
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full text-left block w-max ${
                  plan.highlight
                    ? "bg-gray-200 text-gray-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {plan.title}
              </span>

              {/* Price */}
              <h4 className="text-3xl font-bold mt-4">{plan.price}</h4>

              {/* Features List */}
              <ul className="mt-4 space-y-2 text-gray-700 text-lg text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    ✔ {feature}
                  </li>
                ))}
              </ul>

              {/* Button Always at the Bottom */}
              <button
                className={`mt-auto w-full py-3 text-lg font-semibold rounded-md ${
                  plan.highlight
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
