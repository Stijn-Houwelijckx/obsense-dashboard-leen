import React, { useState } from "react";
import profilePic from "assets/img/profilepic.png";
import InputField from "components/InputField";
import searchIcon from "../assets/img/search.svg";
import Navigation from "components/Navigation";

const tabs = ["General", "Notification", "Wallet", "Security"];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="min-h-screen bg-secondary-900 p-4 text-neutral-50 mt-14 ml-4 mr-4">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </div>
          <Navigation />
        </div>
      </div>

      <div className="min-h-screen bg-secondary-900 text-neutral-50 p-6 mt-5 flex flex-col items-center">
        {/* Tabs */}
        <div className="flex gap-[1px] mb-6 border-neutral-700">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === tab
                  ? "text-primary-500 border-b-2 border-primary-500"
                  : "text-neutral-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* General Tab Content */}
        {activeTab === "General" && (
          <div className="w-full max-w-xl bg-secondary-800 rounded-xl p-6 flex flex-col gap-6">
            {/* Your Profile */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Profile</h2>
              <div className="flex justify-center mb-6">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-[96px] h-[96px] rounded-full object-cover"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="First name"
                  placeholder="First name"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
                <InputField
                  label="Last name"
                  placeholder="Last name"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
                <InputField
                  label="Artist name"
                  placeholder="Artist name"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
                <InputField
                  label="Email address"
                  placeholder="Email address"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
                <InputField
                  label="Phone number"
                  placeholder="Phone number"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
              </div>
            </div>

            {/* Your Social Media Accounts */}
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Your Social Media Accounts
              </h2>

              <div className="grid grid-cols-1 gap-4">
                <InputField
                  label="Instagram"
                  placeholder="Insert a link here"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
                <InputField
                  label="Behance"
                  placeholder="Insert a link here"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
                <InputField
                  label="Dribbble"
                  placeholder="Insert a link here"
                  className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
                />{" "}
              </div>
            </div>

            {/* Buttons - Centered */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="w-[90px] h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition">
                Cancel
              </button>
              <button className="w-[145px] h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition">
                Save changes
              </button>
            </div>
          </div>
        )}

        {/* Delete Account */}
        <div className="mt-10">
          <button className="text-sm text-red-400 border border-red-600 rounded px-4 py-2 hover:opacity-90 bg-[#FCA5A5]">
            Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
