import { useState, useEffect } from "react";
import hamburgerIcon from "assets/img/hamburger.svg";
import closeIcon from "assets/img/close.svg";
import profilePic from "assets/img/profilepic.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStorage } from "../store/authStorage";

const apiUrl = import.meta.env.VITE_API_URL;

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { clearAuth } = useAuthStorage();

  const logout = () => {
    clearAuth();
    navigate("/signin");
  };

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
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center"
      >
        <img src={hamburgerIcon} alt="Menu" className="w-5 h-5" />
      </button>

      <div
        className={`fixed inset-0 z-50 bg-secondary-900 backdrop-blur-3xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="absolute top-6 right-6 mt-10">
          <button
            onClick={() => setIsOpen(false)}
            className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center"
          >
            <img src={closeIcon} alt="Close" className="w-4 h-4" />
          </button>
        </div>

        <div className="h-full w-full flex flex-col items-center justify-center text-white">
          <div className="flex flex-col items-center gap-2 text-lg font-medium w-full">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`w-1/2 font-text flex justify-center py-4 rounded-[10px]  ${
                isActive("/")
                  ? "bg-primary-500/20 text-primary-500"
                  : "text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/collections"
              onClick={() => setIsOpen(false)}
              className={`w-1/2 font-text flex justify-center py-4 rounded-[10px]  ${
                isActive("/collections")
                  ? "bg-primary-500/20 text-primary-500"
                  : "text-white"
              }`}
            >
              Collections
            </Link>
            <Link
              to="/artworks"
              onClick={() => setIsOpen(false)}
              className={`w-1/2 font-text flex justify-center py-4 rounded-[10px]  ${
                isActive("/artworks")
                  ? "bg-primary-500/20 text-primary-500"
                  : "text-white"
              }`}
            >
              Artworks
            </Link>
          </div>

          <div className="mt-[120px] flex flex-col items-center gap-2 text-lg w-full">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={`w-1/2 font-text flex justify-center py-4 rounded-[10px] ${
                isActive("/settings")
                  ? "bg-primary-500/20 text-primary-500"
                  : "text-white"
              }`}
            >
              Settings
            </Link>
            <button
              onClick={logout}
              className="w-full font-text flex justify-center py-4 text-white hover:text-primary-500"
            >
              Logout
            </button>
            <div className="mt-6">
              <img
                src={userData.profilePicture?.filePath || profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
