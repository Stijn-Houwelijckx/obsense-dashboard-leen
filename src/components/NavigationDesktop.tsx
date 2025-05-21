import React from "react";
import { Link, useLocation } from "react-router-dom";
import favicon from "assets/img/favicon.svg";
import homeIcon from "assets/img/home.svg";
import collectionsIcon from "assets/img/collections.svg";
import artworksIcon from "assets/img/artworks.svg";
import insightsIcon from "assets/img/insights.svg";
import settingsIcon from "assets/img/settings.svg";
import logoutIcon from "assets/img/logout.svg";
import arrowIcon from "assets/img/arrow.svg";
import profilePic from "assets/img/profilepic.png";

const NavigationDesktop = () => {
  const location = useLocation();

  const navItems = [
    { icon: homeIcon, path: "/", alt: "Home", label: "Home" },
    {
      icon: collectionsIcon,
      path: "/collections",
      alt: "Collections",
      label: "Collections",
    },
    {
      icon: artworksIcon,
      path: "/artworks",
      alt: "Artworks",
      label: "Artworks",
    },
    {
      icon: insightsIcon,
      path: "/insights",
      alt: "Insights",
      label: "Insights",
    },
  ];

  const bottomItems = [
    {
      icon: settingsIcon,
      path: "/settings",
      alt: "Settings",
      label: "Settings",
    },
    { icon: logoutIcon, path: "#", alt: "Logout", label: "Logout" },
  ];

  return (
    <div className="hidden md:flex fixed top-4 left-4 z-50 group">
      <div className="flex flex-col justify-between h-[calc(100vh-2rem)] bg-secondary-800 rounded-[16px] py-6 transition-all duration-300 ease-in-out w-[76px] group-hover:w-[280px] overflow-hidden">
        <div className="flex flex-col items-start px-4 gap-6">
          <div className="flex items-center gap-3 mb-2 pl-2 pr-16">
            <img
              src={favicon}
              alt="Favicon"
              className="w-8 h-8 transition-none"
            />
            <h6 className="text-neutral-50 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              OBSENSE
            </h6>
          </div>

          {navItems.map(({ icon, path, alt, label }) => (
            <Link to={path} key={path} className="flex items-center gap-3 pl-2">
              <img
                src={icon}
                alt={alt}
                className="w-6 h-6 opacity-100 transition-opacity"
              />
              <span className="text-neutral-50 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {label}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col px-4 items-start gap-6">
          {bottomItems.map(({ icon, path, alt, label }) => (
            <Link to={path} key={alt} className="flex items-center gap-3 pl-2">
              <img
                src={icon}
                alt={alt}
                className="w-6 h-6 opacity-100 transition-opacity"
              />
              <span className="text-neutral-50 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {label}
              </span>
            </Link>
          ))}

          <div className="h-[1px] bg-secondary-700 w-full my-6 transition-none" />

          <Link
            to="/settings"
            className="flex items-center justify-between w-full px-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-neutral-50">Welcome back</span>
                <span className="text-sm text-neutral-50 font-medium">
                  Stijn
                </span>
              </div>
            </div>
            <img
              src={arrowIcon}
              alt="Arrow"
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationDesktop;
