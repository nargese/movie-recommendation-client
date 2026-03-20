import { HelpCircle, LogOut, Search, Settings, Users } from "lucide-react";
import React, { useState } from "react";
import Logo from '../assets/logo.png'
import { Link } from 'react-router';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";



export default function Navbar() {
const navigate = useNavigate();
let user = null;
const userData = localStorage.getItem("user");
if (userData) {
  user = JSON.parse(userData);
}

const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        user.nom
      )}`
  : "";

  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
  // Remove user data and token from localStorage
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  alert("Logged out successfully");
  navigate("/signIn");
  setShowMenu(false);
};

  const handleSettingsClick = () => {
    setShowMenu(false); // Close the menu when Settings is clicked
  };
  const handleAccountsManagementClick = () => {
    setShowMenu(false);
  };
  return (
    
    <nav className="flex items-center justify-between
  bg-gradient-to-r from-gray-900 to-black
  shadow-lg sticky top-0 z-50
  p-4 h-20
  text-sm md:text-[15px] font-medium whitespace-nowrap">

      
  {/* Left: Logo */}
  <Link to={"/"}>
  <div className="flex-shrink-0">
    <img src={Logo} alt="Logo" className="w-60 cursor-pointer brightness-125"/>
  </div>
  </Link>

  {/* Center: Search Bar */}
  {/* <div className="flex-1 flex justify-center">
    <div className="relative w-full max-w-md hidden md:block">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search movies..."
        className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
      />
    </div>
  </div> */}

  {/* Right: Buttons */}
  <div className="flex items-center space-x-4">
    <Link to={user ? "ai-recommendations" : "signIn"}>
      <button className="flex justify-center items-center bg-[#e50914] hover:bg-gray-400 text-white py-3 px-4 rounded-full cursor-pointer text-sm md:text-base">
        Movies Recommendations
      </button>
    </Link>
    {!user ? (
  <Link to={"/signIn"}>
    <button className="border border-[#333333] text-white py-2 px-4 cursor-pointer">
      Sign In
    </button>
  </Link>
) : (
  <div className="text-white"><img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-[#e50914] cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />{showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.nom}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>

                {/* <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button> */}
                {user.roleName === "admin" && (
                  <Link to="/accounts-management">
                    <button
                      className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer w-full"
                      onClick={handleAccountsManagementClick}
                    >
                      <Users className="w-5 h-5" />
                      Accounts Management
                    </button>
                  </Link>
                )}
                <Link to="/update-profile">
                  <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer w-full" 
                  onClick={handleSettingsClick}>
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}

  </div>
</nav>

  );
}
