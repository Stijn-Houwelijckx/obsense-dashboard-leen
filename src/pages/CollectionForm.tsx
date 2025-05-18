import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import hamburgerIcon from "assets/img/hamburger.svg";
import treeImage from "assets/img/tree.png";
import plusGenreIcon from "assets/img/plus_genre.svg";
import InputField from "components/InputField";

const CollectionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mode = location.state?.mode === "expo" ? "expo" : "tour";

  const handleCancel = () => {
    navigate(-1); // of naar een specifieke pagina zoals navigate("/createcollection")
  };

  const handleNext = () => {
    console.log("Next clicked");
    // navigate("/next-step") bijvoorbeeld
  };

  return (
    <div className="min-h-screen bg-secondary-900 text-neutral-50 p-4 mt-14 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Step 1: Create a {mode === "tour" ? "Tour" : "Exposition"}
          </h1>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
              <img src={hamburgerIcon} alt="Menu" className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-md flex flex-col items-center text-center mt-9">
        {/* Artwork Image */}
        <div className="relative">
          <div className="w-[290px] h-[290px] bg-secondary-700 rounded-lg overflow-hidden relative flex items-center justify-center mt-7">
            <img
              src={treeImage}
              alt="Artwork"
              className="object-cover w-full h-full"
            />
          </div>

          {/* Buttons onder afbeelding */}
          <div className="flex justify-between w-[290px] mt-4">
            <button className="bg-white text-black text-sm font-semibold border border-neutral-400 rounded px-3 py-2 hover:opacity-90">
              Choose cover
            </button>
            <button className="text-sm font-semibold text-red-400 border border-red-600 rounded px-3 py-2 bg-[#FCA5A5] hover:opacity-90">
              Delete
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="w-[290px] flex flex-col items-start gap-4 my-7">
          <InputField
            label="Title"
            placeholder="Title"
            className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
          />
          <InputField
            label="Description"
            placeholder="Description"
            textarea
            className="w-full h-[166px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 py-2 text-sm text-white resize-none"
          />
          <InputField
            label={mode === "tour" ? "City" : "Location"}
            placeholder={mode === "tour" ? "City" : "Location"}
            className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
          />
          <InputField
            label="Price (€)"
            placeholder="Enter price"
            className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
          />
        </div>

        {/* Genre Tag */}
        <div className="w-[290px] flex items-center justify-between mb-10">
          <span className="text-sm font-medium text-[#00B69B] bg-[#00B69B33] px-3 py-1 rounded-lg">
            Low-Poly
          </span>
          <img src={plusGenreIcon} alt="Add genre" className="w-5 h-5" />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCancel}
            className="w-[90px] h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            className="w-[145px] h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionForm;
