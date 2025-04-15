import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Layout from "../components/Layout";
import { useUserContext } from "../context/UserContext";

const Analytics = () => {
  const { user } = useUserContext();
  const [timePeriod, setTimePeriod] = useState("weekly");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    let greet = "";

    if (currentHour >= 5 && currentHour < 12) greet = "Good morning";
    else if (currentHour >= 12 && currentHour < 17) greet = "Good afternoon";
    else greet = "Good evening";

    const firstName = user?.name?.split(" ")[0] || "there";
    setGreeting(`${greet}, ${firstName}!`);
  }, [user]);

  const handleTimePeriodChange = (event) => setTimePeriod(event.target.value);

  const weeklyData = [
    { name: "Week 1", posts: 4 },
    { name: "Week 2", posts: 7 },
    { name: "Week 3", posts: 5 },
    { name: "Week 4", posts: 8 },
  ];

  const monthlyData = [
    { name: "January", posts: 30 },
    { name: "February", posts: 50 },
    { name: "March", posts: 40 },
    { name: "April", posts: 60 },
    { name: "May", posts: 45 },
    { name: "June", posts: 35 },
    { name: "July", posts: 50 },
    { name: "August", posts: 65 },
    { name: "September", posts: 60 },
    { name: "October", posts: 55 },
    { name: "November", posts: 70 },
    { name: "December", posts: 80 },
  ];

  const data = timePeriod === "weekly" ? weeklyData : monthlyData;

  return (
    <Layout>
      {/* Main Content */}
      <div className="pt-[40px] px-6">
        {/* Dynamic Greeting */}
        <h1 className="text-2xl font-bold mb-6 text-gray-700">{greeting} 👋</h1>

        {/* Search Section */}
        {/* <div className="mt-4 flex items-center border rounded-full overflow-hidden shadow-md w-full">
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
        </div> */}

        {/* Time Period Dropdown */}
        <div className="mt-12 mb-0 flex justify-end">
          <select
            value={timePeriod}
            onChange={handleTimePeriodChange}
            className="border p-2 rounded-md shadow-md"
            style={{ maxWidth: "150px" }}
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Post Analytics Section */}
        <div className="pt-[40px] px-6">
          <div className="p-6 rounded-lg shadow-none mb-6">
            <h2 className="text-2xl font-bold mb-4">Post Analytics</h2>

            {/* Line Chart */}
            <ResponsiveContainer width="100%" height={350}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
                <XAxis dataKey="name" tick={{ fontSize: 14, fill: "#888" }} />
                <YAxis tick={{ fontSize: 14, fill: "#888" }} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ddd" }} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="posts"
                  stroke="#C731CD"
                  strokeWidth={3}
                  dot={{ fill: "#C731CD", stroke: "#fff", strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
