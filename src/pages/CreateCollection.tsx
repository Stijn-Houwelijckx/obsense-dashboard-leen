import React from "react";
import hamburgerIcon from "assets/img/hamburger.svg";
import tourImg from "assets/img/tour.png";
import expoImg from "assets/img/expo.png";
import { useNavigate } from "react-router-dom";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";

const CreateCollection = () => {
  const navigate = useNavigate();

  const handleCreate = (type: "tour" | "exposition") => {
    navigate("/form", { state: { mode: type } });
  };

  return (
    <div className="min-h-screen bg-secondary-900 p-4 text-neutral-50 mt-14 md:pl-[166px] md:pr-[74px] *:px-4">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Create</h1>
        <div className="flex gap-2">
          <div className="md:hidden">
            <Navigation />
          </div>
        </div>
        <div className="hidden md:block w-[250px]">
          <NavigationDesktop />
        </div>
      </div>

      <div className="bg-secondary-800 rounded-2xl p-6 flex flex-col lg:flex-row items-stretch gap-4 lg:h-[calc(80vh-56px)]">
        <div className="w-full lg:w-1/2 h-[300px] lg:h-full bg-secondary-700 border border-dashed border-primary-500 rounded-2xl flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-lg font-title font-semibold mb-3">Tour</h2>
          <img
            src={tourImg}
            alt="Tour"
            className="w-full h-[100px] object-contain mb-3"
          />
          <p className="text-sm font-text text-neutral-300 mb-4 max-w-[400px]">
            A tour takes you on a journey, with 3D artworks scattered across
            various locations in a city for an immersive exploration
          </p>
          <button
            onClick={() => handleCreate("tour")}
            className="bg-primary-500 font-text text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Create tour
          </button>
        </div>

        <p className="text-sm text-primary-500 font-text text-center my-4 lg:my-0 lg:flex lg:items-center lg:justify-center lg:h-full lg:w-12">
          OR
        </p>

        <div className="w-full lg:w-1/2 h-[300px] lg:h-full bg-secondary-700 border border-dashed border-primary-500 rounded-2xl flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-lg font-title font-semibold mb-3">Exposition</h2>
          <img
            src={expoImg}
            alt="Expo"
            className="w-full h-[100px] object-contain mb-3"
          />
          <p className="text-sm font-text text-neutral-300 mb-4 max-w-[400px]">
            An exposition gathers stunning pieces in a single iconic location
            like the city square.
          </p>
          <button
            onClick={() => handleCreate("exposition")}
            className="bg-primary-500 font-text text-white px-4 py-2 rounded-lg text-sm hover:opacity-90"
          >
            Create exposition
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCollection;
