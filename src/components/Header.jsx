import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { useUserContext } from "../context/UserContext";
import Logo from "../assets/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  // hide header on login page
  if (location.pathname === "/login" || location.pathname === "/signup") return null;

  return (
    <>
      <header
        className="fixed top-0 left-0 w-full bg-white z-50 px-6 py-4 flex justify-between items-center transition-all duration-300"
        style={{
          boxShadow: scrolled ? "0px 4px 10px 0px #0000000D" : "none",
        }}
      >
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-2xl font-bold text-gray-800">AI Virtual Assistant</h1>
        </div>

        <div className="space-x-4 flex items-center">
          {user ? (
            <Button
              variant="contained"
              onClick={logout}
              sx={{
                backgroundColor: "#c731cd",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                textTransform: "none",
                border: "2px solid transparent",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#c731cd",
                  border: "2px solid #c731cd",
                },
              }}
            >
              Log Out
            </Button>
          ) : (
            !isAuthPage && (
              <>
                <Button
                  variant="text"
                  onClick={() => navigate("/signup")}
                  sx={{
                    color: "#c731cd",
                    fontWeight: 600,
                    fontSize: "1rem",
                    fontFamily: "Inter, sans-serif",
                    textTransform: "none",
                    borderRadius: "8px",
                    paddingX: 1,
                    paddingY: 1,
                    minHeight: "36px",
                    border: "2px solid transparent",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#c731cd",
                      color: "#fff",
                    },
                  }}
                >
                  Sign Up
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    backgroundColor: "#c731cd",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "1rem",
                    fontFamily: "Inter, sans-serif",
                    textTransform: "none",
                    borderRadius: "8px",
                    paddingX: 2,
                    paddingY: 1,
                    border: "2px solid #c731cd",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "transparent",
                      color: "#c731cd",
                      border: "2px solid #c731cd",
                    },
                  }}
                >
                  Log In
                </Button>
              </>
            )
          )}
        </div>
      </header>
      
      <div className="pt-20"></div>
    </>
  );
};

export default Header;
