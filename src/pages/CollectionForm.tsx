import React, { useState, useEffect } from "react";
import hamburgerIcon from "assets/img/hamburger.svg";
import treeImage from "assets/img/tree.png";
import plusGenreIcon from "assets/img/plus_genre.svg";
import artworkImg from "assets/img/tree.png";
import InputField from "components/InputField";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import api from "../services/api"; // importeer je axios instance

interface StepTwoFormProps {
  mode: "tour" | "expo";
  onCancel: () => void;
  onNext: () => void;
}

const CollectionForm = ({ mode, onCancel, onNext }: StepTwoFormProps) => {
  const [step, setStep] = useState(1);

  // Form fields state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cityOrLocation, setCityOrLocation] = useState("");
  const [price, setPrice] = useState("");

  // Genre blijft voorlopig hardcoded
  const genre = "Low-Poly";

  // Artworks state (gehaald via API)
  const [artworks, setArtworks] = useState<
    { _id: number; title: string; image: string }[]
  >([]);

  // Geselecteerde artwork IDs
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>([]);

  // Artwork ophalen bij laden component (vul je eigen endpoint in)
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await api.get("/objects");
        const objects = res.data.data.objects;

        if (objects.length === 0) {
          setArtworks([]); // lege lijst
        } else {
          setArtworks(objects);
        }
      } catch (err) {
        console.error("Failed to load artworks", err);
        setArtworks([]); // ook leeg bij fetch fout
      }
    };

    fetchArtworks();
  }, []);

  const toggleArtwork = (id: number) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePublish = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", cityOrLocation);
    formData.append("price", price);
    formData.append("genre", genre);
    formData.append("mode", mode);
    formData.append("artworks", JSON.stringify(selectedArtworks)); // array in string

    if (coverImageFile) {
      // stel je hebt een bestand geselecteerd
      formData.append("coverImage", coverImageFile);
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const res = await fetch(
        "http://localhost:3000/api/v1/artist/collections",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Geen Content-Type header hier!
          },
          body: formData,
        }
      );

      if (res.ok) {
        window.location.href = "/collections";
      } else {
        const error = await res.json();
        alert("Failed to save: " + error.message);
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen md:pl-[166px] md:pr-[74px] bg-secondary-900 text-neutral-50 p-4 mt-14 flex flex-col items-center">
      <div className="w-full mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {step === 1
              ? `Step 1: Create a ${mode === "tour" ? "Tour" : "Exposition"}`
              : step === 2
              ? "Step 2: Choose Artwork"
              : "Step 3: Overview"}
          </h1>

          <div className="md:hidden">
            <Navigation />
          </div>
        </div>
        <div className="hidden md:block w-[250px]">
          <NavigationDesktop />
        </div>
        {step === 2 && (
          <p className="text-sm text-neutral-300 font-medium mt-2">
            Selected ({selectedArtworks.length})
          </p>
        )}
      </div>

      {step === 1 && (
        <div className="w-full bg-secondary-800 p-6 rounded-[16px] flex flex-col lg:flex-row gap-0 lg:gap-[80px]">
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="w-full h-3/4 bg-secondary-700 rounded-lg overflow-hidden flex items-center justify-center mt-7">
              <img
                src={treeImage}
                alt="Artwork"
                className="object-cover w-3/4 h-full"
              />
            </div>

            <div className="flex justify-center gap-4 w-full mt-4">
              <button className="bg-primary-500 text-neutral-50 text-sm font-semibold rounded px-3 py-2 hover:opacity-90">
                Choose cover
              </button>
              <button className="text-sm font-semibold text-red-400 border border-red-600 rounded px-3 py-2 bg-[#FCA5A5] hover:opacity-90">
                Delete
              </button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="w-full flex flex-col items-start gap-4 mt-7 lg:mt-0">
              <InputField
                label="Title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
              />
              <InputField
                label="Description"
                placeholder="Description"
                textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-[166px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 py-2 text-sm text-white resize-none"
              />
              <InputField
                label={mode === "tour" ? "City" : "Location"}
                placeholder={mode === "tour" ? "City" : "Location"}
                value={cityOrLocation}
                onChange={(e) => setCityOrLocation(e.target.value)}
                className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
              />
              <InputField
                label="Price (€)"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
              />
            </div>

            <div className="w-full mt-6">
              <p className="text-sm text-left mb-2">Genre</p>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#00B69B] bg-[#00B69B33] px-3 py-1 rounded-lg">
                  Low-Poly
                </span>
                <img src={plusGenreIcon} alt="Add genre" className="w-5 h-5" />
              </div>
            </div>

            <div className="w-full flex justify-end gap-4 mt-6">
              <button
                onClick={() => (window.location.href = "/create")}
                className="w-[75px] h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="w-[75px] h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Artwork Selection */}
      {step === 2 && (
        <>
          {artworks.length === 0 ? (
            <div className="w-full h-[350px] flex items-center justify-center text-neutral-400 text-lg font-semibold">
              No artworks yet
            </div>
          ) : (
            <div className="w-full flex flex-wrap gap-5 mt-4">
              {artworks.map(({ _id, title, image }) => {
                const isSelected = selectedArtworks.includes(_id);
                return (
                  <div
                    key={_id}
                    onClick={() => toggleArtwork(_id)}
                    className="w-full sm:w-[calc(50%-10px)] lg:basis-[calc(25%-15px)] lg:max-w-[calc(25%-15px)] lg:w-1/4 cursor-pointer h-[350px]"
                  >
                    <div
                      className={`w-full h-full bg-secondary-700 rounded-lg flex flex-col relative p-2 transition ${
                        isSelected
                          ? "border-2 border-primary-500"
                          : "border border-transparent"
                      }`}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleArtwork(_id);
                        }}
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 ${
                          isSelected
                            ? "bg-primary-500 border-primary-500"
                            : "border-neutral-300"
                        } flex items-center justify-center`}
                      ></div>

                      <div className="w-full h-[300px] rounded-lg overflow-hidden">
                        <img
                          src={image || artworkImg} // fallback image hier
                          alt={title}
                          className="lg:w-3/4 w:1/2 h-full object-cover mx-auto"
                        />
                      </div>

                      <div className="w-full h-[64px] bg-secondary-600 rounded-lg flex items-center justify-center p-4">
                        <h6 className="text-primary-500 font-semibold">
                          {title}
                        </h6>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-10 w-full">
            <div className="flex gap-4 w-full lg:hidden">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Next
              </button>
            </div>

            <div className="hidden lg:flex justify-end gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-[75px] h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-[75px] h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Step 3: Overview */}
      {step === 3 && (
        <>
          <div className="w-full bg-secondary-800 p-6 rounded-[16px]">
            <div className="w-full flex flex-col lg:flex-row lg:gap-[68px]">
              {/* Image */}
              <div className="w-full lg:w-1/2 h-[350px] rounded-lg overflow-hidden mb-6 lg:mb-0">
                <img
                  src={treeImage}
                  alt="Overview Artwork"
                  className="w-1/2 h-full object-cover rounded-lg mx-auto"
                />
              </div>

              {/* Text content */}
              <div className="w-full lg:w-3/4 flex flex-col">
                <h4 className="text-3xl font-bold text-primary-500 mb-4">
                  {title}
                </h4>

                <p className="text-neutral-50 mb-8 leading-relaxed">
                  {description}
                </p>

                <div className="flex justify-between w-full mb-10">
                  <div className="flex flex-col items-center">
                    <span className="font-medium mb-1 text-[#B3B3B3]">
                      {mode === "tour" ? "City" : "Location"}
                    </span>
                    <span className="text-neutral-50">{cityOrLocation}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium mb-1 text-[#B3B3B3]">
                      Price
                    </span>
                    <span className="text-neutral-50">{price}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium mb-1 text-[#B3B3B3]">
                      Genre
                    </span>
                    <span className="text-sm font-medium text-[#00B69B] bg-[#00B69B33] px-3 py-1 rounded-lg">
                      {genre}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Artworks */}
            <div className="w-full mb-10 mt-6">
              <h6 className="mb-4 font-semibold">Artworks</h6>
              <div className="flex flex-col gap-4">
                {artworks
                  .filter((art) => selectedArtworks.includes(art._id))
                  .map(({ _id, title, image }) => (
                    <div
                      key={_id}
                      className="flex items-center gap-4 border-2 border-dashed border-primary-500 rounded-xl p-2"
                    >
                      <img
                        src={image}
                        alt={title}
                        className="w-1/7 h-[46px] object-cover rounded-lg"
                      />
                      <span>{title}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-4 w-full lg:justify-end">
              <button
                onClick={() => (window.location.href = "/collections")}
                className="w-1/3 h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition
               lg:w-[120px]"
              >
                Save as Draft
              </button>
              <button
                onClick={handlePublish}
                className="w-2/3 h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition
               lg:w-[120px]"
              >
                Publish
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionForm;
