import React, { useState } from "react";
import hamburgerIcon from "assets/img/hamburger.svg";
import treeImage from "assets/img/tree.png";
import plusGenreIcon from "assets/img/plus_genre.svg";
import artworkImg from "assets/img/tree.png"; // voorbeeld
import InputField from "components/InputField";

interface StepTwoFormProps {
  mode: "tour" | "expo";
  onCancel: () => void;
  onNext: () => void;
}

const dummyArtworks = [
  { id: 1, title: "Tree of Life", image: artworkImg },
  { id: 2, title: "Abstract Dream", image: artworkImg },
  { id: 3, title: "Urban Mood", image: artworkImg },
];

const CollectionForm = ({ mode, onCancel, onNext }: StepTwoFormProps) => {
  const [step, setStep] = useState(1);
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>([]);

  const toggleArtwork = (id: number) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-secondary-900 text-neutral-50 p-4 mt-14 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {step === 1
              ? `Step 1: Create a ${mode === "tour" ? "Tour" : "Exposition"}`
              : "Step 2: Choose Artwork"}
          </h1>
          <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
            <img src={hamburgerIcon} alt="Menu" className="w-5 h-5" />
          </div>
        </div>
        {step === 2 && (
          <p className="text-sm text-neutral-300 font-medium mt-2">
            Selected ({selectedArtworks.length})
          </p>
        )}
      </div>

      {/* Step 1: Form Inputs */}
      {step === 1 && (
        <>
          {/* Artwork Image */}
          <div className="w-[290px] h-[290px] bg-secondary-700 rounded-lg overflow-hidden flex items-center justify-center mt-7">
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

          {/* Genre */}
          <div className="w-[290px] mb-10">
            <p className="text-sm text-left mb-2">Genre</p>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-[#00B69B] bg-[#00B69B33] px-3 py-1 rounded-lg">
                Low-Poly
              </span>
              <img src={plusGenreIcon} alt="Add genre" className="w-5 h-5" />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="w-[90px] h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep(2)}
              className="w-[145px] h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Step 2: Artwork Selection */}
      {step === 2 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            {dummyArtworks.map(({ id, title, image }) => {
              const isSelected = selectedArtworks.includes(id);
              return (
                <div
                  key={id}
                  onClick={() => toggleArtwork(id)}
                  className={`w-[303px] h-[350px] rounded-lg p-[11px] cursor-pointer transition ${
                    isSelected
                      ? "border-4 border-primary-500"
                      : "border-2 border-transparent"
                  }`}
                >
                  <div className="w-[280px] h-[330px] bg-secondary-700 rounded-lg flex flex-col relative">
                    {/* Checkbox */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleArtwork(id);
                      }}
                      className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 ${
                        isSelected
                          ? "bg-primary-500 border-primary-500"
                          : "border-neutral-300 bg-transparent"
                      } flex items-center justify-center`}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Image */}
                    <div className="w-[280px] h-[264px] rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Title */}
                    <div className="w-full h-[64px] bg-secondary-600 rounded-b-lg flex items-center justify-center px-4">
                      <h6 className="text-primary-500 font-semibold">
                        {title}
                      </h6>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 2 Buttons */}
          <div className="flex gap-4 mt-10">
            <button
              onClick={() => setStep(1)}
              className="w-[90px] h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
            >
              Back
            </button>
            <button
              onClick={onNext}
              className="w-[145px] h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionForm;
