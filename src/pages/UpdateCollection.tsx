import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import hamburgerIcon from "assets/img/hamburger.svg";
import treeImage from "assets/img/tree.png";
import plusGenreIcon from "assets/img/plus_genre.svg";
import artworkImg from "assets/img/tree.png";
import InputField from "components/InputField";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import api from "../services/api";

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

type Artwork = { _id: string };

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

const UpdateCollection = ({
  onCancel,
  onNext,
  collectionId,
}: StepTwoFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "tour";

  const collId =
    collectionId || (location.state && (location.state as any).collectionId);

  const [step, setStep] = useState(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cityOrLocation, setCityOrLocation] = useState("");
  const [price, setPrice] = useState("");
  const [selectedArtworks, setSelectedArtworks] = useState<string[]>([]);

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [genre, setGenre] = useState("Low-Poly");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const [titleError, setTitleError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [cityOrLocationError, setCityOrLocationError] = useState(false);
  const [priceError, setPriceError] = useState(false);
  const [coverImageError, setCoverImageError] = useState(false);

  const [originalArtworks, setOriginalArtworks] = useState<string[]>([]);

  const [artworks, setArtworks] = useState<
    { _id: string; title: string; image: string }[]
  >([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";

    const fetchGenres = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/v1/genres", {
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

  useEffect(() => {
    if (!collId) return;

    const token = localStorage.getItem("token") || "";

    const fetchCollection = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/artist/collections/${collId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        const coll = data.data.collection;

        const artworkIds = (coll.objects || []).map(
          (artwork: any) => artwork._id
        );
        setSelectedArtworks(artworkIds);
        setOriginalArtworks(artworkIds);

        setTitle(coll.title || "");
        setDescription(coll.description || "");
        setCityOrLocation(coll.city || "");
        setPrice(coll.price !== undefined ? coll.price.toString() : "");
        setSelectedGenres(coll.genres || []);

        if (coll.coverImage && coll.coverImage.filePath) {
          setCoverImageUrl(coll.coverImage.filePath);
          setCoverImageFile(null);
        } else {
          setCoverImageUrl(null);
          setCoverImageFile(null);
        }
      } catch (err) {
        console.error("Error loading collection:", err);
        alert("Failed to load collection data.");
      }
      setLoadingCollection(false);
    };

    fetchCollection();
  }, [collId]);

  const handleSelectGenre = (genre: Genre) => {
    if (!selectedGenres.find((g) => g._id === genre._id)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setShowGenreDropdown(false);
  };

  const handleRemoveGenre = (id: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g._id !== id));
  };

  const [loadingArtworks, setLoadingArtworks] = useState(true);
  const [loadingCollection, setLoadingCollection] = useState(true);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await api.get("/objects");
        const objects = res.data.data.objects;

        if (objects.length === 0) {
          setArtworks([]);
        } else {
          setArtworks(
            objects.map((obj: any) => ({
              _id: obj._id.toString(),
              title: obj.title,
              image: obj.thumbnail?.filePath || obj.file?.url || "",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load artworks", err);
        setArtworks([]);
      }
      setLoadingArtworks(false);
    };

    fetchArtworks();
  }, []);

  const [allGenres, setAllGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);

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
      setCoverImageError(true);
      hasError = true;
    } else {
      setCoverImageError(false);
    }

    if (!hasError) {
      setStep(2);
    }
  };

  const toggleArtwork = (id: string) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handlePublish = async (isDraft: boolean) => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!price || isNaN(parseFloat(price))) {
      alert("Price must be a valid number");
      return;
    }

    if (!coverImageFile && !coverImageUrl) {
      alert("Please select a cover image file.");
      return;
    }

    if (!collId) {
      alert("No collection to update");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("city", cityOrLocation.trim());
      formData.append("price", price.toString());
      formData.append("type", mode);
      formData.append("_id", collId);
      formData.append("status", isDraft ? "draft" : "published");

      // De collectie update zonder artworks (of met lege array)
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
            objects: [], // eerst zonder artworks
            isPublished: !isDraft,
          },
        })
      );

      // 1. PUT update collectie
      const url = `http://localhost:3000/api/v1/artist/collections/${collId}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        try {
          const error = JSON.parse(text);
          alert("Fout: " + JSON.stringify(error, null, 2));
        } catch {
          alert("Onverwachte fout: " + text);
        }
        return;
      }

      const selectedArtworkIds = selectedArtworks.filter(Boolean);

      // Vergelijk met originele lijst
      const newArtworkIds = selectedArtworkIds.filter(
        (id) => !originalArtworks.includes(id)
      );

      console.log("Nieuwe artwork IDs om toe te voegen:", newArtworkIds);

      if (newArtworkIds.length > 0) {
        const patchRes = await fetch(
          `http://localhost:3000/api/v1/artist/collections/${collId}/add-objects`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              objects: { objectIds: newArtworkIds },
            }),
          }
        );

        if (!patchRes.ok) {
          const patchText = await patchRes.text();
          try {
            const patchError = JSON.parse(patchText);
            alert(
              "Fout bij toevoegen artworks: " +
                JSON.stringify(patchError, null, 2)
            );
          } catch {
            alert("Onverwachte fout bij toevoegen artworks: " + patchText);
          }
          return;
        }
      }

      // 3. Indien niet draft, toggle publish via aparte endpoint
      if (!isDraft) {
        const publishRes = await fetch(
          `http://localhost:3000/api/v1/artist/collections/${collId}/toggle-publish`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!publishRes.ok) {
          const publishText = await publishRes.text();
          alert("Fout bij publiceren: " + publishText);
          return;
        }
      }

      // 4. Navigeren
      window.location.href = "/collections";
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
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

  const CityAutocomplete = ({
    value,
    onChange,
    className,
  }: CityAutocompleteProps) => {
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (value.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      const fetchCities = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
              value
            )}&format=json&limit=5`
          );
          const data = await res.json();
          const cityNames = data.map((item: any) => item.display_name);
          setSuggestions(cityNames);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
          setSuggestions([]);
          setShowDropdown(false);
        }
      };

      fetchCities();
    }, [value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div className="relative w-full" ref={containerRef}>
        <InputField
          label={mode === "tour" ? "City" : "Location"}
          placeholder={mode === "tour" ? "City" : "Location"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
        />
        {showDropdown && suggestions.length > 0 && (
          <ul className="absolute top-full left-0 right-0 bg-white text-black rounded shadow max-h-48 overflow-auto z-10">
            {suggestions.map((city, i) => (
              <li
                key={i}
                onClick={() => {
                  onChange(city);
                  setShowDropdown(false);
                }}
                className="cursor-pointer hover:bg-gray-200 px-3 py-1"
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen md:pl-[166px] md:pr-[74px] bg-secondary-900 text-neutral-50 p-4 mt-14 flex flex-col items-center">
      <div className="w-full mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-title font-bold">
            {step === 1
              ? `Step 1: ${collId ? "Edit" : "Create"} ${
                  mode === "tour" ? "Tour" : "Exposition"
                }`
              : step === 2
              ? "Step 2: Choose Artwork"
              : "Step 3: Overview"}
          </h1>

          <div className="flex items-center justify-between mb-10">
            <div className="flex gap-2">
              <div className="md:hidden">
                <Navigation />
              </div>
            </div>
            <div className="hidden md:block w-[250px]">
              <NavigationDesktop />
            </div>
          </div>
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
                    : coverImageUrl
                    ? coverImageUrl
                    : treeImage
                }
                alt="Cover"
              />
            </div>

            <div className="flex justify-center gap-4 w-full mt-4">
              <label className="bg-primary-500 font-text text-neutral-50 text-sm font-semibold rounded px-3 py-2 hover:opacity-90 cursor-pointer">
                Choose cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setCoverImageFile(e.target.files[0]);
                      setCoverImageUrl(null);
                    }
                  }}
                  className="hidden"
                />
              </label>

              <button
                className="text-sm font-text font-semibold text-red-400 border border-red-600 rounded px-3 py-2 bg-[#FCA5A5] hover:opacity-90"
                onClick={() => {
                  setCoverImageFile(null);
                  setCoverImageUrl(null);
                }}
              >
                Delete
              </button>
            </div>
            {coverImageError && (
              <p className="text-sm text-red-500 mt-2 text-left w-full">
                Please upload a cover image.
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
                className={`w-full font-text h-[48px] bg-secondary-700 border ${
                  titleError ? "border-red-500" : "border-neutral-100"
                } rounded-lg px-3 text-sm text-white`}
              />
              {titleError && (
                <p className="text-sm text-red-500">Title is required.</p>
              )}

              <label className="block text-sm font-text mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full font-text h-[120px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 py-2 text-sm text-white resize-none"
                placeholder="Description"
              />

              <CityAutocomplete
                value={cityOrLocation}
                onChange={setCityOrLocation}
                className="w-full"
              />
              {cityOrLocationError && (
                <p className="text-sm text-red-500">City is required.</p>
              )}

              <InputField
                label="Price"
                placeholder="Price"
                value={price}
                onChange={handlePriceChange}
                type="text"
                className="w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
              />

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

      {/* Step 2: Artwork Selection */}
      {step === 2 && !loadingArtworks && !loadingCollection && (
        <>
          {artworks.length === 0 ? (
            <div className="w-full font-text h-[350px] flex items-center justify-center text-neutral-400 text-lg font-semibold">
              No artworks yet
            </div>
          ) : (
            <div className="w-full flex flex-wrap gap-5 mt-4">
              {artworks.map(({ _id, title, image }) => {
                const isSelected = selectedArtworks.includes(_id);
                console.log(
                  "Artwork ID:",
                  _id,
                  "isSelected?",
                  isSelected,
                  "selectedArtworks:",
                  selectedArtworks
                );

                console.log("Artworks:", artworks);
                console.log("SelectedArtworks (raw):", selectedArtworks);

                console.log(
                  "SelectedArtworks (stringified):",
                  selectedArtworks.map((a) =>
                    typeof a === "string" ? a : JSON.stringify(a)
                  )
                );

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

      {/* Step 3: Overview */}
      {step === 3 && (
        <>
          <div className="w-full bg-secondary-800 p-6 rounded-[16px]">
            <div className="w-full flex flex-col lg:flex-row lg:gap-[68px]">
              <div className="w-full lg:w-1/2 h-[350px] rounded-lg overflow-hidden mb-6 lg:mb-0">
                <img
                  src={
                    coverImageFile
                      ? URL.createObjectURL(coverImageFile)
                      : coverImageUrl
                      ? coverImageUrl
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
                onClick={() => handlePublish(true)}
                className="w-1/3 h-[48px] font-text border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition lg:w-[120px]"
              >
                Save as Draft
              </button>
              <button
                onClick={() => setShowPublishConfirm(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded"
              >
                Publish
              </button>
            </div>
            {showPublishConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                <div className="bg-secondary-800 rounded-[10px] max-w-md w-full text-neutral-50 flex flex-col items-center text-center gap-6 px-8 py-10">
                  <h4 className="text-xl font-title font-semibold">
                    Are you sure you want to publish your collection?
                  </h4>
                  <p className="font-text">This action cannot be undone</p>
                  <div className="flex gap-4 justify-center w-full mt-4">
                    <button
                      className="border font-text border-primary-500 text-primary-500 px-6 py-2 rounded-lg hover:border-primary-600 transition"
                      onClick={() => setShowPublishConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-primary-500 font-text text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                      onClick={() => {
                        setShowPublishConfirm(false);
                        handlePublish(false);
                      }}
                    >
                      Yes, I'm sure
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateCollection;
