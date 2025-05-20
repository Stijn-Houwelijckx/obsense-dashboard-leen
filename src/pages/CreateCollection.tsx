import React from "react";
import hamburgerIcon from "assets/img/hamburger.svg";
import tourImg from "assets/img/tour.png"; // Zorg dat dit pad klopt
import expoImg from "assets/img/expo.png"; // Zorg dat dit pad klopt
import { useNavigate } from "react-router-dom";
import Navigation from "components/Navigation"; // pad afhankelijk van je structuur

const CreateCollection = () => {
  const navigate = useNavigate();

  const handleCreate = (mode: "tour" | "expo") => {
    navigate("/form", { state: { mode } });
  };

  return (
    <div className="min-h-screen bg-secondary-900 p-4 text-neutral-50 mt-14 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Create</h1>
        <div className="flex gap-2">
          <Navigation />
        </div>
      </div>

      {/* Content box */}
      <div className="bg-secondary-800 rounded-2xl p-6 flex flex-col items-center gap-4">
        {/* Tour Section */}
        <div className="w-full h-[300px] bg-secondary-700 border border-dashed border-primary-500 rounded-2xl flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-lg font-semibold mb-3">Tour</h2>
          <img
            src={tourImg}
            alt="Tour"
            className="w-full h-[100px] object-contain mb-3"
          />
          <p className="text-sm text-neutral-300 mb-4">
            A tour takes you on a journey, with 3D artworks scattered across
            various locations in a city for an immersive exploration
          </p>
          <button
            onClick={() => handleCreate("tour")}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Create tour
          </button>
        </div>

        {/* OR Divider */}
        <p className="text-sm text-primary-500">OR</p>

        {/* Duplicate Section */}
        <div className="w-full h-[300px] bg-secondary-700 border border-dashed border-primary-500 rounded-2xl flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-lg font-semibold mb-3">Exposition</h2>

          <img
            src={expoImg}
            alt="Expo"
            className="w-full h-[100px] object-contain mb-3"
          />
          <p className="text-sm text-neutral-300 mb-4">
            An exposition gathers stunning pieces in a single iconic location
            like the city square.
          </p>
          <button
            onClick={() => handleCreate("expo")}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Create exposition
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
