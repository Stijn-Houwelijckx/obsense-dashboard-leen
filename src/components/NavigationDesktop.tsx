import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import favicon from "assets/img/favicon.svg";
import homeIcon from "assets/img/home.svg";
import collectionsIcon from "assets/img/collections.svg";
import artworksIcon from "assets/img/artworks.svg";
import insightsIcon from "assets/img/insights.svg";
import settingsIcon from "assets/img/settings.svg";
import logoutIcon from "assets/img/logout.svg";
import arrowIcon from "assets/img/arrow.svg";
import profilePic from "assets/img/profilepic.png";
import { useAuthStorage } from "store/authStorage";
const apiUrl = import.meta.env.VITE_API_URL;

const NavigationDesktop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { clearAuth } = useAuthStorage();

  const logout = () => {
    clearAuth();
    navigate("/signin");
  };

  const isActive = (path: string) => location.pathname === path;

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

  const [userData, setUserData] = useState<{
    firstName: string;
    profilePicture?: { filePath: string };
  }>({ firstName: "Guest" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${apiUrl}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const user = data.data?.user;
          if (user) {
            setUserData({
              firstName: user.firstName || "Guest",
              profilePicture: user.profilePicture,
            });
          }
        });
    }
  }, []);

  return (
    <div className="hidden md:flex fixed top-4 left-4 z-50 group">
      <div className="flex flex-col justify-between h-[calc(100vh-2rem)] bg-secondary-800 rounded-[16px] py-6 transition-all duration-300 ease-in-out w-[76px] group-hover:w-[280px] overflow-hidden">
        <div className="flex flex-col items-start px-4 gap-6">
          <div className="flex items-center gap-3 mb-2 pl-2 pr-16">
            <img src={favicon} alt="Favicon" className="w-8 h-8" />
            <h6 className="text-neutral-50 font-title text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              OBSENSE
            </h6>
          </div>

          {navItems.map(({ icon, path, alt, label }) => {
            const active = isActive(path);
            return (
              <Link
                to={path}
                key={path}
                className={`flex items-center font-text gap-3 pl-2 pr-4 py-2 rounded-[10px] transition-colors duration-300 w-full ${
                  active
                    ? "bg-primary-500/20 text-primary-500"
                    : "text-neutral-50"
                }`}
              >
                <img
                  src={icon}
                  alt={alt}
                  className={`w-6 h-6 transition-colors ${
                    active ? "filter-primary" : ""
                  }`}
                />
                <span
                  className={`text-sm font-text transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    active
                      ? "text-primary-500 max-w-[200px]"
                      : "max-w-0 group-hover:max-w-[200px]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col px-4 items-start gap-6">
          {bottomItems.map(({ icon, path, alt, label }) => {
            const active = isActive(path);
            return (
              <Link
                to={path}
                key={alt}
                className={`flex font-text items-center gap-3 pl-2 pr-4 py-2 rounded-[10px] transition-colors duration-300 w-full ${
                  active
                    ? "bg-primary-500/20 text-primary-500"
                    : "text-neutral-50"
                }`}
                onClick={label === "Logout" ? logout : undefined}
              >
                <img
                  src={icon}
                  alt={alt}
                  className={`w-6 h-6 transition-colors ${
                    active ? "filter-primary" : ""
                  }`}
                />
                <span
                  className={`text-sm font-text transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    active
                      ? "text-primary-500 max-w-[200px]"
                      : "max-w-0 group-hover:max-w-[200px]"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}

          <div className="h-[1px] bg-secondary-700 w-full my-6" />

          <Link
            to="/settings"
            className="flex items-center justify-between w-full px-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={userData.profilePicture?.filePath || profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex flex-col transition-all duration-300 max-w-0 group-hover:max-w-[160px] overflow-hidden">
                <span className="text-xs font-text text-neutral-50 whitespace-nowrap">
                  Welcome back
                </span>
                <span className="text-sm font-text text-neutral-50 font-medium whitespace-nowrap">
                  {userData.firstName}
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
