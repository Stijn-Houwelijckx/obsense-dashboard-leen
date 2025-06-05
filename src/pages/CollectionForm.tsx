import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import treeImage from "assets/img/fallback.jpeg";
import plusGenreIcon from "assets/img/plus_genre.svg";
import artworkImg from "assets/img/fallback.jpeg";
import InputField from "components/InputField";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import api from "../services/api";
const apiUrl = import.meta.env.VITE_API_URL;

interface StepTwoFormProps {
  mode: "tour" | "exposition";
  onCancel?: () => void;
  onNext?: () => void;
  collectionId?: string;
  initialData?: {
    title: string;
    description: string;
    cityOrLocation: string;
    price: string;
    selectedArtworks: string[];
    coverImageFile?: File | null;
    coverImageUrl?: string | null;
    genre?: string;
  };
}

type Genre = {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
};

type CityAutocompleteProps = {
  value: string;
  onChange: (v: string) => void;
  className?: string;
};

const CollectionForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "tour";
  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cityOrLocation, setCityOrLocation] = useState("");
  const [price, setPrice] = useState("");
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState<boolean>(false);

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [cityOrLocationError, setCityOrLocationError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [coverImageError, setCoverImageError] = useState<string | null>(null);

  const [artworks, setArtworks] = useState<
    { _id: string; title: string; image: string }[]
  >([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${apiUrl}/genres`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAllGenres(data.data.genres);
      } catch (err) {
        console.error("Failed to fetch genres", err);
      }
    };

    fetchGenres();
  }, []);

  const handleSelectGenre = (genre: Genre) => {
    if (!selectedGenres.find((g) => g._id === genre._id)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setShowGenreDropdown(false);
  };

  const handleRemoveGenre = (id: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g._id !== id));
  };

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await api.get("/objects");
        const objects = res.data.data.objects;
        setArtworks(
          objects.map((obj: any) => ({
            _id: obj._id.toString(),
            title: obj.title,
            image: obj.thumbnail?.filePath || obj.file?.url || "",
          }))
        );
      } catch (err) {
        console.error("Failed to load artworks", err);
        setArtworks([]);
      }
    };

    fetchArtworks();
  }, []);

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  const handleNextStep = () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleError(true);
      hasError = true;
    } else {
      setTitleError(false);
    }

    if (!description.trim()) {
      setDescriptionError(true);
      hasError = true;
    } else {
      setDescriptionError(false);
    }

    if (!cityOrLocation.trim()) {
      setCityOrLocationError(true);
      hasError = true;
    } else {
      setCityOrLocationError(false);
    }

    if (!price || Number(price) <= 0) {
      setPriceError(true);
      hasError = true;
    } else {
      setPriceError(false);
    }

    if (!coverImageFile && !coverImageUrl) {
      setCoverImageError("Please upload a cover image.");
      hasError = true;
    } else {
      setCoverImageError(null);
    }

    if (!hasError) {
      setStep(2);
    }
  };

  const handlePublish = async (isDraft: boolean) => {
    if (!title.trim() || !description.trim() || !cityOrLocation.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!price || isNaN(parseFloat(price))) {
      alert("Price must be a valid number");
      return;
    }

    if (!coverImageFile) {
      alert("Please select a cover image file.");
      return;
    }

    const formData = new FormData();
    formData.append("coverImage", coverImageFile);

    formData.append(
      "collection",
      JSON.stringify({
        collection: {
          title: title.trim(),
          description: description.trim(),
          city: cityOrLocation.trim(),
          price: parseFloat(price),
          type: mode,
          genres: selectedGenres.map((g) => g._id),
          objects: [],
          status: isDraft ? "draft" : "published",
        },
      })
    );

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${apiUrl}/artist/collections`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => null);
        alert(
          "Fout:\n" + JSON.stringify(errorJson || (await res.text()), null, 2)
        );
        return;
      }

      const data = await res.json();

      const collectionId = data.data.collection._id;
      if (!collectionId) {
        alert("Collection ID not returned from server.");
        return;
      }

      if (selectedArtworks.length > 0) {
        const patchRes = await fetch(
          `${apiUrl}/artist/collections/${collectionId}/add-objects`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              objects: {
                objectIds: selectedArtworks,
              },
            }),
          }
        );

        if (!patchRes.ok) {
          const patchError = await patchRes.json().catch(() => null);
          alert(
            "Fout bij toevoegen van artworks:\n" +
              JSON.stringify(patchError || (await patchRes.text()), null, 2)
          );
          return;
        }
      }

      navigate("/collections");
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  const toggleArtwork = (id: string) => {
    setSelectedArtworks((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((artworkId) => artworkId !== id)
        : [...prevSelected, id]
    );
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCoverImageFile(file);
    }
  };

  const ProgressBar = ({ currentStep }: { currentStep: number }) => {
    const stepWidths: { [key: number]: string } = {
      1: "33.3333%",
      2: "66.6666%",
      3: "100%",
    };
    const width = stepWidths[currentStep] || "0%";

    return (
      <div className="w-full lg:w-1/2 mb-6 lg:mx-0 lg:self-start">
        <div className="h-3 rounded-[10px] bg-primary-500/20 w-full relative">
          <div
            className="h-3 rounded-[10px] bg-primary-500 transition-all duration-300"
            style={{ width }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen md:pl-[166px] md:pr-[74px] bg-secondary-900 text-neutral-50 p-4 mt-14 flex flex-col items-center">
      <div className="w-full mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-title font-bold">
            {step === 1
              ? `Step 1: Create ${mode === "tour" ? "Tour" : "Exposition"}`
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
          <p className="text-sm font-text text-neutral-300 font-medium mt-2">
            Selected ({selectedArtworks.length})
          </p>
        )}
      </div>
      <ProgressBar currentStep={step} />

      {step === 1 && (
        <div className="relative w-full bg-secondary-800 p-6 rounded-[16px] flex flex-col lg:flex-row gap-0 lg:gap-[80px] mt-12">
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className="w-full h-3/4 bg-secondary-700 rounded-lg overflow-hidden flex items-center justify-center mt-7">
              <img
                src={
                  coverImageFile
                    ? URL.createObjectURL(coverImageFile)
                    : treeImage
                }
                className="w-full aspect-square object-cover rounded-lg"
              />
            </div>

            <div className="flex justify-center gap-4 w-full mt-4">
              <label className="bg-primary-500 font-text text-neutral-50 text-sm font-semibold rounded px-3 py-2 hover:opacity-90 cursor-pointer">
                Choose cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (file.size > 1024 * 1024) {
                      setCoverImageFile(null);
                      setCoverImageError("Cover image must be less than 1MB.");
                    } else {
                      setCoverImageFile(file);
                      setCoverImageError(null);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
            {coverImageError && (
              <p className="text-sm text-red-500 mt-2 text-left w-full">
                {coverImageError}
              </p>
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col justify-between">
            <div className="w-full flex flex-col items-start gap-4 mt-7 lg:mt-0">
              <InputField
                label="Title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white ${
                  titleError ? "border-red-500" : "border-neutral-100"
                }`}
              />
              {titleError && (
                <p className="text-sm text-red-500">Title is required.</p>
              )}
              <textarea
                className={`w-full font-text h-24 p-2 rounded-lg border border-neutral-100 bg-secondary-700 text-white ${
                  titleError ? "border-red-500" : "border-neutral-100"
                }`}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {titleError && (
                <p className="text-sm text-red-500">Description is required.</p>
              )}

              <InputField
                label={mode === "tour" ? "City" : "Location"}
                placeholder={mode === "tour" ? "Enter city" : "Enter location"}
                value={cityOrLocation}
                onChange={(e) => setCityOrLocation(e.target.value)}
                className={`w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white ${
                  cityOrLocationError ? "border-red-500" : "border-neutral-100"
                }`}
              />

              <InputField
                label="Price (€)"
                placeholder="Enter price"
                type="number"
                value={price}
                onChange={handlePriceChange}
                className={`w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white ${
                  titleError ? "border-red-500" : "border-neutral-100"
                }`}
              />
              {titleError && (
                <p className="text-sm text-red-500">Price is required.</p>
              )}
            </div>

            <div className="w-full mt-6 relative">
              <p className="text-sm text-left mb-2">Genre</p>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedGenres.map((genre) => (
                  <span
                    key={genre._id}
                    className="flex items-center text-sm font-text font-medium text-[#00B69B] bg-[#00B69B33] px-3 py-1 rounded-lg"
                  >
                    {genre.name}
                    <button
                      onClick={() => handleRemoveGenre(genre._id)}
                      className="ml-2 text-xs text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </span>
                ))}

                <button
                  onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                >
                  <img
                    src={plusGenreIcon}
                    alt="Add genre"
                    className="w-5 h-5"
                  />
                </button>
              </div>

              {showGenreDropdown && (
                <div className="absolute z-10 mt-2 bg-secondary-700 text-white border border-neutral-600 rounded-lg shadow-md p-2 w-48">
                  {allGenres.map((genre) => (
                    <div
                      key={genre._id}
                      onClick={() => handleSelectGenre(genre)}
                      className="cursor-pointer px-2 py-1 hover:bg-secondary-600 rounded"
                    >
                      {genre.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full flex justify-end gap-4 mt-6">
              <button
                onClick={() => (window.location.href = "/create")}
                className="w-[75px] h-[48px] font-text border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleNextStep}
                className="w-[75px] h-[48px] font-text bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <>
          {artworks.length === 0 ? (
            <div className="w-full font-text h-[350px] flex items-center justify-center text-neutral-400 text-lg font-semibold">
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
                          src={image ? image : artworkImg}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="w-full h-[64px] bg-secondary-600 rounded-lg flex items-center justify-center p-4">
                        <h6 className="text-primary-500 font-text font-semibold">
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
                className="w-1/3 h-[48px] font-text border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 h-[48px] font-text bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Next
              </button>
            </div>

            <div className="hidden lg:flex justify-end gap-4">
              <button
                onClick={() => setStep(1)}
                className="w-[75px] h-[48px] font-text border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-[75px] h-[48px] font-text bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="w-full bg-secondary-800 p-6 rounded-[16px]">
            <div className="w-full flex flex-col lg:flex-row lg:gap-[68px]">
              <div className="w-full lg:w-1/2 h-[350px] rounded-lg overflow-hidden mb-6 lg:mb-0">
                <img
                  src={
                    coverImageFile
                      ? URL.createObjectURL(coverImageFile)
                      : treeImage
                  }
                  alt="Overview Artwork"
                  className="w-1/2 h-full object-cover rounded-lg mx-auto"
                />
              </div>

              <div className="w-full lg:w-3/4 flex flex-col">
                <h4 className="text-3xl font-title font-bold text-primary-500 mb-4">
                  {title}
                </h4>

                <p className="text-neutral-50 font-text mb-8 leading-relaxed">
                  {description}
                </p>

                <div className="flex justify-between w-full mb-10">
                  <div className="flex flex-col items-center">
                    <span className="font-medium font-text mb-1 text-[#B3B3B3]">
                      {mode === "tour" ? "City" : "Location"}
                    </span>
                    <span className="text-neutral-50">{cityOrLocation}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium font-text mb-1 text-[#B3B3B3]">
                      Price
                    </span>
                    <span className="text-neutral-50">{price}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-medium font-text mb-1 text-[#B3B3B3]">
                      Genre
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedGenres.map((genre) => (
                        <span
                          key={genre._id}
                          className="text-sm font-medium font-text text-[#00B69B] bg-[#00B69B33] px-3 py-1 rounded-lg"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full mb-10 mt-6">
              <h6 className="mb-4 font-title font-semibold">Artworks</h6>
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
                      <span className="font-text">{title}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex gap-4 w-full lg:justify-end">
              <button
                onClick={() => handlePublish(false)}
                className="w-full h-[48px] font-text bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition lg:w-[120px]"
              >
                Save as Draft
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionForm;
