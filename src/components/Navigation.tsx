import React, { useState } from "react";
import hamburgerIcon from "assets/img/hamburger.svg";
import closeIcon from "assets/img/close.svg";
import profilePic from "assets/img/profilepic.png";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center"
      >
        <img src={hamburgerIcon} alt="Menu" className="w-5 h-5" />
      </button>

      {/* Fullscreen Overlay Navigation */}
      <div
        className={`fixed inset-0 z-50 bg-secondary-900 backdrop-blur-3xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <div className="absolute top-6 right-6 mt-10">
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center"
          >
            <img src={closeIcon} alt="Close" className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="h-full w-full flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center gap-4 text-lg font-medium">
            <p>Home</p>
            <Link to="/collections" onClick={() => setIsOpen(false)}>
              Collections
            </Link>
            <Link to="/artworks" onClick={() => setIsOpen(false)}>
              Artworks
            </Link>
            <p>Insights</p>
          </div>

          <div className="mt-[120px] flex flex-col items-center gap-4 text-sm">
            <p>Settings</p>
            <p>Logout</p>
            <img
              src={profilePic}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
