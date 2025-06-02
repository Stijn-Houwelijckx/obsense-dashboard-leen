import React, { useState, useRef } from "react";
import profilePic from "assets/img/profilepic.png";
import InputField from "components/InputField";
import searchIcon from "../assets/img/search.svg";
import backIcon from "../assets/img/back.svg";
import arrowIcon from "../assets/img/arrow.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStorage } from "../store/authStorage";

import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";

const tabs = ["General", "Notification", "Wallet", "Security"];

interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  server?: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [securityPage, setSecurityPage] = useState("main");

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");
  const [errors, setErrors] = React.useState<Errors>({});

  const [success, setSuccess] = React.useState(false);

  const handleBack = () => setSecurityPage("main");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    artistName: "",
    email: "",
    phoneNumber: "",
    instagram: "",
    behance: "",
    dribbble: "",
  });

  const navigate = useNavigate();
  const { clearAuth } = useAuthStorage();

  const handleDeleteAccount = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch("VITE_API_URL/users/me", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        useAuthStorage.getState().clearAuth();

        navigate("/signin");
      } else {
        console.error("Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "General") {
      const token = localStorage.getItem("token");
      fetch("VITE_API_URL/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          const user = data.data.user || {};
          setProfileData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            artistName: user.username || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            instagram: "",
            behance: "",
            dribbble: "",
          });
        });
    }
  }, [activeTab]);

  const handleSaveChanges = () => {
    fetch("VITE_API_URL/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to save");
        return res.json();
      })
      .then((data) => {
        alert("Profile saved!");
      })
      .catch((err) => {
        alert("Error saving profile");
        console.error(err);
      });
  };

  const newErrors: Errors = {};

  const handleChangePassword = async () => {
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      server: "",
    });

    let hasError = false;
    const newErrors: { [key: string]: string } = {};

    if (!currentPassword) {
      newErrors.currentPassword = "Please enter your current password.";
      hasError = true;
    }

    if (!newPassword) {
      newErrors.newPassword = "Please enter a new password.";
      hasError = true;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters.";
      hasError = true;
    }

    if (newPassword !== confirmNewPassword) {
      newErrors.confirmNewPassword = "Passwords do not match.";
      hasError = true;
    }

    if (hasError) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("VITE_API_URL/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user: {
            oldPassword: currentPassword,
            newPassword: newPassword,
          },
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        setSuccess(true);
        navigate("/settings");
      } else {
        if (
          data.message &&
          data.message.toLowerCase().includes("current password")
        ) {
          setErrors((prev) => ({
            ...prev,
            currentPassword: data.message,
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            server: data.message || "Error changing password.",
          }));
        }
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        server: "Network error: " + (error.message || error.toString()),
      }));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("VITE_API_URL/users/me/profile-picture", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (data.status !== "success") {
        alert("Failed to upload image: " + data.message);
      }
    } catch (error) {
      alert("Network error uploading image");
    }
  };

  const handleDeleteProfileImage = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("VITE_API_URL/users/me/profile-picture", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setProfilePic(null);
      } else {
        alert("Failed to delete profile image: " + data.message);
      }
    } catch (error) {
      alert("Network error deleting image");
    }
  };

  const renderSecuritySubPage = () => (
    <div className="w-full flex justify-center pt-6 ">
      <div className="w-full bg-secondary-800 lg:h-[calc(80vh-56px)] p-6 rounded-[16px] text-neutral-50 flex flex-col gap-6">
        {securityPage === "privacy" && (
          <>
            <p className="text-sm font-text text-neutral-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque blandit justo lacus, id consequat augue scelerisque
              a. Proin ipsum dui, condimentum sit amet auctor quis, tempus sed
              purus. Proin at massa ullamcorper massa porta convallis a sed
              sapien. Sed quis ornare nibh. Sed molestie feugiat augue, at
              sagittis arcu venenatis nec. Praesent consectetur mi id augue
              sodales, eget rhoncus lorem tristique. Aliquam porta dui libero,
              id tincidunt lorem sodales lacinia. Cras laoreet mauris quis dolor
              eleifend, quis euismod turpis sollicitudin. Maecenas ullamcorper
              condimentum fringilla. Donec vel tortor magna. Vivamus luctus
              viverra augue eget fringilla.
            </p>
            <p className="text-sm font-text text-neutral-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Pellentesque blandit justo lacus, id consequat augue scelerisque
              a. Proin ipsum dui, condimentum sit amet auctor quis, tempus sed
              purus. Proin at massa ullamcorper massa porta convallis a sed
              sapien. Sed quis ornare nibh. Sed molestie feugiat augue, at
              sagittis arcu venenatis nec. Praesent consectetur mi id augue
              sodales, eget rhoncus lorem tristique. Aliquam porta dui libero,
              id tincidunt lorem sodales lacinia. Cras laoreet mauris quis dolor
              eleifend, quis euismod turpis sollicitudin. Maecenas ullamcorper
              condimentum fringilla. Donec vel tortor magna. Vivamus luctus
              viverra augue eget fringilla.
            </p>
          </>
        )}

        {securityPage === "terms" && (
          <>
            <p className="text-sm font-text text-neutral-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut
              libero vitae nulla viverra placerat. Cras at diam sit amet purus
              pharetra tempor.
            </p>
            <p className="text-sm font-text text-neutral-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              erat volutpat. Pellentesque vehicula tortor at velit ullamcorper,
              et porta felis porttitor.
            </p>
          </>
        )}

        {securityPage === "password" && (
          <>
            <InputField
              label="Current password"
              placeholder="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full font-text lg:w-1/3 h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}

            <InputField
              label="New password"
              placeholder="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full font-text lg:w-1/3 h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}

            <InputField
              label="Retype new password"
              placeholder="Retype new password"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full font-text lg:w-1/3 h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
            />
            {errors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmNewPassword}
              </p>
            )}

            {errors.server && (
              <p className="text-red-500 text-sm mt-1">{errors.server}</p>
            )}

            <button className="text-sm font-text text-primary-500 text-left hover:underline">
              Forgot password?
            </button>

            <button
              onClick={handleChangePassword}
              className="bg-primary-500 font-text text-white px-4 py-2 rounded-lg lg:w-1/5 w-full font-medium hover:opacity-90 transition"
            >
              Change password
            </button>
          </>
        )}
      </div>
    </div>
  );
  return (
    <div className="min-h-screen  bg-secondary-900 text-neutral-50 px-4 pt-4 mt-14 ">
      {activeTab === "Security" && securityPage !== "main" ? (
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleBack}
            className="w-10 h-10 md:ml-[166px] rounded-full bg-secondary-800 flex items-center justify-center"
          >
            <img src={backIcon} alt="Back" className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-title font-bold md:pr-[74px]">
            {securityPage === "privacy" && "Privacy & cookies"}
            {securityPage === "terms" && "Terms and conditions"}
            {securityPage === "password" && "Change Password"}
          </h1>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-10 md:pl-[166px] md:pr-[74px]">
          <h1 className="text-2xl font-title font-bold">Settings</h1>
          <div className="flex gap-2">
            <div className="md:hidden">
              <Navigation />
            </div>
          </div>
          <div className="hidden md:block w-[250px]">
            <NavigationDesktop />
          </div>
        </div>
      )}

      <div className="min-h-screen md:pl-[166px] md:pr-[74px] bg-secondary-900 text-neutral-50 mt-5 flex flex-col items-center">
        {!(activeTab === "Security" && securityPage !== "main") && (
          <div className="flex mb-6 border-neutral-700 w-full lg:justify-start justify-center">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSecurityPage("main");
                }}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-primary-500 font-text border-b-2 border-primary-500"
                    : "text-neutral-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}

        {activeTab === "Security" && securityPage !== "main"
          ? renderSecuritySubPage()
          : activeTab === "Security" && (
              <div className="w-full flex justify-center pt-6">
                <div className="bg-secondary-800 lg:h-[calc(70vh-56px)] rounded-xl p-6 w-full pt-5 pb-5 flex flex-col gap-5">
                  <h2 className="text-xl font-title font-semibold text-neutral-50 mb-2">
                    Security
                  </h2>
                  <div className="w-full lg:w-1/3 border border-[#757575] rounded-[16px] p-5 flex flex-col gap-y-5">
                    {[
                      { label: "Change password", key: "password" },
                      { label: "Privacy & cookies", key: "privacy" },
                      { label: "Terms and conditions", key: "terms" },
                    ].map((item, index, array) => (
                      <React.Fragment key={item.key}>
                        <button
                          className="flex justify-between items-center text-neutral-50 w-full"
                          onClick={() => setSecurityPage(item.key)}
                        >
                          <span>{item.label}</span>
                          <img src={arrowIcon} alt="Arrow" />
                        </button>

                        {index < array.length - 1 && (
                          <div className="w-full border-t border-[#757575]" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <button
                      onClick={handleDeleteAccount}
                      className="text-sm font-text text-red-400 border border-red-600 rounded px-4 py-2 hover:opacity-90 bg-[#FCA5A5]"
                    >
                      Delete account
                    </button>
                  </div>
                </div>
              </div>
            )}

        {activeTab === "General" && (
          <div className="w-full bg-secondary-800 rounded-xl p-6 flex flex-col lg:flex-row lg:gap-[80px]">
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-title font-semibold mb-4">
                  Your Profile
                </h2>
                <div className="items-center gap-4 mb-4">
                  <img
                    src={profilePic || "/default-profile.png"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />

                  <div className="flex flex-row gap-2 mt-8 mb-8">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-primary-500 font-text text-neutral-50 text-sm font-semibold rounded px-3 py-2 hover:opacity-90 cursor-pointer"
                    >
                      Choose Profile Image
                    </button>

                    <button
                      onClick={handleDeleteProfileImage}
                      className="text-sm font-text font-semibold text-red-400 border border-red-600 rounded px-3 py-2 bg-[#FCA5A5] hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <InputField
                    label="First name"
                    placeholder="First name"
                    className="w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                    value={profileData.firstName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Last name"
                    placeholder="Last name"
                    className="w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                    value={profileData.lastName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Artist name"
                    placeholder="Artist name"
                    className="lg:col-span-2 w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                    value={profileData.artistName}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        artistName: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Email address"
                    placeholder="Email address"
                    className="w-full h-[48px] font-text bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                  <InputField
                    label="Phone number"
                    placeholder="Phone number"
                    className="w-full h-[48px] font-text bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                    value={profileData.phoneNumber}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex gap-4 w-[250px] hidden lg:flex mt-8">
                  <button className="w-1/3 h-[48px] font-text border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition">
                    Cancel
                  </button>
                  <button
                    className="w-2/3 h-[48px] font-text bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
                    onClick={handleSaveChanges}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-title font-semibold mb-4 mt-8 lg:mt-0">
                    Your Social Media Accounts
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Instagram"
                      placeholder="Insert a link here"
                      className="w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                      value={profileData.instagram}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          instagram: e.target.value,
                        }))
                      }
                    />
                    <InputField
                      label="Behance"
                      placeholder="Insert a link here"
                      className="w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                      value={profileData.behance}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          behance: e.target.value,
                        }))
                      }
                    />
                    <InputField
                      label="Dribbble"
                      placeholder="Insert a link here"
                      className="w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                      value={profileData.dribbble}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          dribbble: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="lg:flex lg:justify-between lg:items-end mt-6">
                  <div className="flex flex-col lg:flex-row justify-between items-center w-full mt-6">
                    <div className="flex gap-4 w-full lg:w-[250px] lg:hidden">
                      <button className="w-1/3 font-text h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition">
                        Cancel
                      </button>
                      <button className="w-2/3 font-text h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition">
                        Save changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Notification" && (
          <div className="w-full lg:h-[calc(75vh-56px)] pt-6 flex flex-col gap-6 bg-secondary-800 rounded-xl p-6">
            <h1 className="text-2xl font-title font-semibold">Notifications</h1>

            <div className="flex flex-col gap-5">
              <h6 className="text-lg font-text font-semibold">Marketing</h6>
              <div className="lg:w-1/2 flex justify-between items-center">
                <div>
                  <p className="text-sm font-text font-medium">
                    Email notifications
                  </p>
                  <p className="text-sm italic font-text text-neutral-400">
                    Get mail updates about our new features and promotions.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:bg-primary-500 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <h6 className="text-lg font-text font-semibold">Interactions</h6>

              <div className="flex justify-between lg:w-1/2 items-center">
                <div>
                  <p className="text-sm font-medium">Purchases</p>
                  <p className="text-sm font-text italic text-neutral-400">
                    Get notifications every time someone buys your tour or
                    exposition.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:bg-primary-500 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
                </label>
              </div>

              <div className="flex justify-between lg:w-1/2 items-center">
                <div>
                  <p className="text-sm font-text font-medium">Likes</p>
                  <p className="text-sm italic text-neutral-400 font-text">
                    Get notifications every time someone likes your tour or
                    exposition.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:bg-primary-500 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
                </label>
              </div>

              <div className="flex justify-between lg:w-1/2 items-center">
                <div>
                  <p className="text-sm font-text font-medium">Rating</p>
                  <p className="text-sm italic font-text text-neutral-400">
                    Get notifications every time someone rates your tour or
                    exposition.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-neutral-600 rounded-full peer peer-checked:bg-primary-500 transition-all duration-300"></div>
                  <div className="absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform peer-checked:translate-x-full transition-transform duration-300"></div>
                </label>
              </div>
            </div>
          </div>
        )}
        {activeTab === "Wallet" && (
          <div className="bg-secondary-800 lg:h-[calc(75vh-56px)] rounded-xl p-6 w-full max-w-xl lg:max-w-none pt-6 text-neutral-50">
            <div className="w-full mb-6">
              <h1 className="text-2xl font-title font-semibold text-left">
                Your Wallet
              </h1>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-10 items-center">
              <div
                className="w-full lg:w-1/2 h-[290px] rounded-[20px] flex flex-col items-center justify-center text-center gap-4 mb-10 lg:mb-0 p-6"
                style={{
                  background:
                    "radial-gradient(circle at top left, #99B2FF 0%, #3B82F6 100%)",
                }}
              >
                <h3 className="text-lg font-title font-semibold text-neutral-950">
                  Your Wallet
                </h3>
                <p className="text-[96px] font-title font-bold leading-none text-neutral-950">
                  €15
                </p>
                <h6 className="text-sm font-title font-medium text-neutral-500">
                  Your balance
                </h6>
                <button
                  className="w-full font-text h-[62px] rounded-lg font-medium border border-primary-600 text-neutral-950 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, #1A50F3 0%, #3B82F6 100%)",
                  }}
                >
                  Transfer to bank account
                </button>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col items-center text-center gap-4 mt-10 lg:mt-0 text-neutral-50">
                <h6 className="text-xl font-title font-semibold">
                  Trying to earn extra money?
                </h6>
                <p className="text-sm font-text">
                  Upload more tours and expositions.
                </p>
                <button
                  onClick={() => {
                    navigate("/choose");
                  }}
                  className="bg-primary-500 font-text text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
                >
                  Create here
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
