import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Finalize = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [schedule, setSchedule] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const scheduleRef = useRef(null);

  useEffect(() => {
    const storedImage = localStorage.getItem("selectedImage");
    const storedCaption = localStorage.getItem("selectedCaption");
    setImage(storedImage);
    setCaption(storedCaption);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (scheduleRef.current && !scheduleRef.current.contains(event.target)) {
        setSchedule(false);
      }
    };

    if (schedule) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [schedule]);

  const platformButtons = ["Instagram", "Twitter", "Facebook", "LinkedIn"];

  const handleScheduleConfirm = () => {
    console.log("Scheduled post for:", scheduleDate);
    // You can add logic here to store it in MongoDB or send to backend
  };

  return (
    <Layout>
      <section className="py-10 w-full flex flex-col items-center">
        <div className="w-11/12 max-w-5xl bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Finalize Your Post
          </h2>

          <div className="flex flex-col md:flex-row gap-6 mb-10">
            {image && (
              <div className="md:w-1/2">
                <img
                  src={image}
                  alt="Selected"
                  className="w-full rounded-lg border-2 border-[#C731CD] object-contain"
                />
              </div>
            )}

            <div className="flex flex-col md:w-1/2 gap-6">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={10}
                className="w-full p-4 border-2 border-[#C731CD] rounded-lg text-gray-800 text-sm focus:outline-none resize-none"
              />

              <div className="flex justify-start flex-wrap gap-3 mb-4">
                {platformButtons.map((platform) => (
                  <button
                    key={platform}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition ${
                      selectedPlatform === platform
                        ? "bg-[#C731CD] text-white border-[#C731CD]"
                        : "border-gray-300 text-gray-600"
                    }`}
                    onClick={() => setSelectedPlatform(platform)}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              <div className="flex justify-start flex-wrap gap-3 relative mb-2">
                <button
                  className="px-6 py-2 border-2 border-[#C731CD] text-[#C731CD] rounded-lg font-medium transition hover:bg-[#C731CD] hover:text-white"
                  onClick={() => console.log("Instant Post")}
                >
                  Instant Post
                </button>
                <button
                  className="px-6 py-2 border-2 border-[#C731CD] text-[#C731CD] rounded-lg font-medium transition hover:bg-[#C731CD] hover:text-white"
                  onClick={() => setSchedule(!schedule)}
                >
                  Schedule Post
                </button>
                <button
                  className="px-6 py-2 border-2 border-[#C731CD] text-[#C731CD] rounded-lg font-medium transition hover:bg-[#C731CD] hover:text-white"
                  onClick={() => console.log("Save Draft")}
                >
                  Save Draft
                </button>
              </div>

              {schedule && (
                <div
                  ref={scheduleRef}
                  className="border rounded-md p-4 shadow-sm w-full max-w-md bg-gray-50 flex flex-col gap-2"
                >
                  <label className="font-medium mb-1">Pick Schedule Time:</label>
                  <div className="flex items-center gap-3">
                    <DatePicker
                      selected={scheduleDate}
                      onChange={(date) => setScheduleDate(date)}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="border p-2 rounded-md w-full text-center"
                    />
                    <button
                      onClick={handleScheduleConfirm}
                      className="px-4 py-2 bg-[#C731CD] text-white rounded-md hover:bg-[#a127ab] transition"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Finalize;
