import React, { useState } from "react";
import profilePic from "assets/img/profilepic.png";
import InputField from "components/InputField";
import searchIcon from "../assets/img/search.svg";
import backIcon from "../assets/img/back.svg";
import arrowIcon from "../assets/img/arrow.svg";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";

const tabs = ["General", "Notification", "Wallet", "Security"];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");
  const [securityPage, setSecurityPage] = useState("main");

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

  useEffect(() => {
    if (activeTab === "General") {
      fetch("/api/v1/users") // jouw echte endpoint
        .then((res) => res.json())
        .then((data) => {
          setProfileData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            artistName: data.artistName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            instagram: data.instagram || "",
            behance: data.behance || "",
            dribbble: data.dribbble || "",
          });
        });
    }
  }, [activeTab]);

  const handleSaveChanges = () => {
    fetch("/api/v1/users", {
      method: "PUT", // of POST, afhankelijk van je API
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

  const renderSecuritySubPage = () => (
    <div className="w-full flex justify-center pt-6 ">
      <div className="w-full bg-secondary-800 lg:h-[calc(80vh-56px)] p-6 rounded-[16px] text-neutral-50 flex flex-col gap-6">
        {securityPage === "privacy" && (
          <>
            <p className="text-sm text-neutral-300">
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
            <p className="text-sm text-neutral-300">
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
            <p className="text-sm text-neutral-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut
              libero vitae nulla viverra placerat. Cras at diam sit amet purus
              pharetra tempor.
            </p>
            <p className="text-sm text-neutral-300">
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
              className="w-full lg:w-1/3 h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
            />
            <InputField
              label="New password"
              placeholder="New password"
              type="password"
              className="w-full lg:w-1/3 h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
            />
            <InputField
              label="Retype new password"
              placeholder="Retype new password"
              type="password"
              className="w-full lg:w-1/3 h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
            />
            <button className="text-sm text-primary-500 text-left hover:underline">
              Forgot password?
            </button>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-lg lg:w-1/5 w-full font-medium hover:opacity-90 transition">
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
          <h1 className="text-2xl font-bold md:pr-[74px]">
            {securityPage === "privacy" && "Privacy & cookies"}
            {securityPage === "terms" && "Terms and conditions"}
            {securityPage === "password" && "Change Password"}
          </h1>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-10 md:pl-[166px] md:pr-[74px]">
          <h1 className="text-2xl font-bold">Settings</h1>
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
                    ? "text-primary-500 border-b-2 border-primary-500"
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
                  <h2 className="text-xl font-semibold text-neutral-50 mb-2">
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
                    <button className="text-sm text-red-400 border border-red-600 rounded px-4 py-2 hover:opacity-90 bg-[#FCA5A5]">
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
                <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
                <div className="flex justify-start mb-6">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-[96px] h-[96px] rounded-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <InputField
                    label="First name"
                    placeholder="First name"
                    className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                    className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                    className="lg:col-span-2 w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                    className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                    className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                  <button className="w-1/3 h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition">
                    Cancel
                  </button>
                  <button
                    className="w-2/3 h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
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
                  <h2 className="text-lg font-semibold mb-4 mt-8 lg:mt-0">
                    Your Social Media Accounts
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <InputField
                      label="Instagram"
                      placeholder="Insert a link here"
                      className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                      className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                      className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
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
                      <button className="w-1/3 h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition">
                        Cancel
                      </button>
                      <button className="w-2/3 h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition">
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
            <h1 className="text-2xl font-semibold">Notifications</h1>

            <div className="flex flex-col gap-5">
              <h6 className="text-lg font-semibold">Marketing</h6>
              <div className="lg:w-1/2 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Email notifications</p>
                  <p className="text-sm italic text-neutral-400">
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
              <h6 className="text-lg font-semibold">Interactions</h6>

              <div className="flex justify-between lg:w-1/2 items-center">
                <div>
                  <p className="text-sm font-medium">Purchases</p>
                  <p className="text-sm italic text-neutral-400">
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
                  <p className="text-sm font-medium">Likes</p>
                  <p className="text-sm italic text-neutral-400">
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
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-sm italic text-neutral-400">
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
              <h1 className="text-2xl font-semibold text-left">Your Wallet</h1>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-10 items-center">
              <div
                className="w-full lg:w-1/2 h-[290px] rounded-[20px] flex flex-col items-center justify-center text-center gap-4 mb-10 lg:mb-0 p-6"
                style={{
                  background:
                    "radial-gradient(circle at top left, #99B2FF 0%, #3B82F6 100%)",
                }}
              >
                <h3 className="text-lg font-semibold text-neutral-950">
                  Your Wallet
                </h3>
                <p className="text-[96px] font-bold leading-none text-neutral-950">
                  €15
                </p>
                <h6 className="text-sm font-medium text-neutral-500">
                  Your balance
                </h6>
                <button
                  className="w-full h-[62px] rounded-lg font-medium border border-primary-600 text-neutral-950 flex items-center justify-center"
                  style={{
                    background:
                      "radial-gradient(circle, #1A50F3 0%, #3B82F6 100%)",
                  }}
                >
                  Transfer to bank account
                </button>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col items-center text-center gap-4 mt-10 lg:mt-0 text-neutral-50">
                <h6 className="text-xl font-semibold">
                  Trying to earn extra money?
                </h6>
                <p className="text-sm">Upload more tours and expositions.</p>
                <button
                  onClick={() => {
                    navigate("/create");
                  }}
                  className="bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
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
