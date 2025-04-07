import React, { useState, useEffect } from "react";
import { useUserContext } from "../context/UserContext";
import { FaSearch } from "react-icons/fa";
import Search from "../assets/images/search.png";
import {
  FaUser,
  FaBell,
  FaCog,
  FaLock,
  FaLink,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  Menu,
  MenuItem,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import Settings from "../pages/Settings";
import { useSearchContext } from "../context/SearchContext"; 

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useSearchContext(); 
  const { user, logout } = useUserContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bellClicked, setBellClicked] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleBellClick = () => setBellClicked(!bellClicked);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const menuItems = [
    { name: "Search", path: "/search", icon: "🔍" },
    { name: "SMM", path: "/smm", icon: "📣" },
    { name: "SEO", path: "/seo", icon: "📈" },
    { name: "Drafts", path: "/drafts", icon: "📝" },
    { name: "SMS", path: "/sms", icon: "📱" },
    { name: "Email", path: "/email", icon: "✉️" },
    { name: "Analytics", path: "/analytics", icon: "📊" },
  ];

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <header className="w-full bg-white p-4 flex justify-between items-center shadow-md z-30 sticky top-0">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="text-xl mr-3">
            <img src={Logo} alt="Logo" className="h-8 w-auto" />
          </button>
          <h1
            className="text-2xl font-bold cursor-pointer transition"
            onClick={() => navigate("/search")}
          >
            AI Virtual Assistant
          </h1>

        </div>

        {/* {Search button} */}
        <div className="flex-grow flex justify-center px-4">
          <div className="relative w-full max-w-4xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Describe your idea in words and let AI create a stunning image for you!"
              className="w-full pl-14 pr-32 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C731CD] transition-all text-lg"
            />

            {/* Left-side Custom Search Icon */}
            <img
              src={require("../assets/images/search.png")}
              alt="Search Icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6"
              style={{
                filter:
                  "invert(22%) sepia(84%) saturate(7494%) hue-rotate(287deg) brightness(83%) contrast(108%)",
              }}
            />

            {/* Right-side Magnifying Glass and Search Button */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <FaSearch
                className="text-[#C731CD] cursor-pointer text-lg"
                onClick={() => navigate(`/search?q=${searchQuery}`)}
              />
              <button
                onClick={() => navigate(`/search?q=${searchQuery}`)}
                className="text-[#C731CD] text-base font-semibold bg-transparent"
              >
                Search
              </button>
            </div>
          </div>
        </div>


        <div className="flex items-center space-x-6 ml-auto">
          {user ? (
            <>
              <IconButton onClick={handleBellClick} className="hover:bg-transparent">
                <FaBell className={`text-xl ${bellClicked ? "text-[#C731CD]" : "text-black"}`} />
              </IconButton>

              <div className="relative">
                <button
                  onClick={handleMenuClick}
                  className="text-xl flex items-center p-2 rounded-lg transition-all hover:bg-[#C731CD] hover:text-white"
                >
                  <FaUser className="mr-2" /> {user.name}
                </button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  PaperProps={{
                    style: {
                      borderRadius: "8px",
                      marginTop: "8px",
                      minWidth: 200,
                    },
                  }}
                >
                  {[
                    {
                      label: "Settings",
                      icon: <FaUser className="mr-2" />,
                      action: () => navigate("/settings"),
                    },
                    {
                      label: "Connected Apps",
                      icon: <FaLink className="mr-2" />,
                      action: () => navigate("/profile/connected-apps"),
                    },
                  ].map(({ label, icon, action }, idx) => (
                    <MenuItem
                      key={idx}
                      onClick={() => {
                        if (action) action();
                        handleMenuClose();
                      }}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#C731CD",
                          color: "#ffffff",
                        },
                        fontWeight: 500,
                      }}
                    >
                      {icon} {label}
                    </MenuItem>
                  ))}

                  <MenuItem
                    onClick={(e) => e.stopPropagation()}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#C731CD",
                        color: "#ffffff",
                      },
                      fontWeight: 500,
                    }}
                  >
                    <FormControlLabel
                      control={<Switch color="success" />}
                      label="Notifications"
                      sx={{ color: "#000" }}
                    />
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      logout();
                      handleMenuClose();
                    }}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#C731CD",
                        color: "#ffffff",
                      },
                      fontWeight: 500,
                    }}
                  >
                    <FaSignOutAlt className="mr-2" /> Logout
                  </MenuItem>
                </Menu>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 text-lg font-semibold text-white bg-[#C731CD] rounded-lg hover:bg-[#a52fa2] transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-lg font-semibold text-[#C731CD] border-2 border-[#C731CD] rounded-lg hover:bg-[#C731CD] hover:text-white transition"
              >
                Login
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {user && (
          <aside
            className={`bg-white fixed left-0 top-[4rem] h-[calc(100vh-4rem)] w-64 flex flex-col transition-transform duration-300 z-20 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
          >
            {/* Navigation Links */}
            <nav className="p-4 flex flex-col flex-grow">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`block w-full text-left flex items-center p-4 text-lg font-semibold rounded-lg transition-all duration-200 ${location.pathname.startsWith(item.path)
                      ? "bg-[#C731CD] text-white"
                      : "hover:bg-gray-200 hover:text-gray-900"
                    }`}
                >
                  <span className="mr-3">{item.icon}</span> {item.name}
                </button>
              ))}

            </nav>

            {/* Footer Section with Line */}
            <div className="p-4 border-t border-gray-300">
              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center p-3 text-lg font-medium rounded-lg hover:bg-gray-200 transition"
              >
                <FaCog className="mr-2" /> Settings
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center p-3 text-lg font-medium rounded-lg hover:bg-red-100 text-red-600 transition"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ${user && sidebarOpen ? "ml-64" : "ml-0"
            }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
