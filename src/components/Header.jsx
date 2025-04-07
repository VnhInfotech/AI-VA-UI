import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { useUserContext } from "../context/UserContext";
import Logo from "../assets/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext();

  return (
    <>
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-white z-50 p-6 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="Logo" className="h-10 w-10 object-contain" />
          <h1 className="text-2xl font-bold">AI Virtual Assistant</h1>
        </div>

        <div className="space-x-4">
          {user ? (
            <Button
              variant="contained"
              onClick={logout}
              sx={{
                backgroundColor: "#c731cd",
                "&:hover": { backgroundColor: "#a855f7" },
              }}
            >
              Log Out
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={{
                  backgroundColor: "#c731cd",
                  "&:hover": { backgroundColor: "#a855f7" },
                }}
              >
                Sign Up
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  backgroundColor: "#c731cd",
                  "&:hover": { backgroundColor: "#a855f7" },
                }}
              >
                Log In
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Padding to prevent content overlap */}
      <div className="pt-20"></div>
    </>
  );
};

export default Header;
