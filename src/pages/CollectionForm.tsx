import React, { useState, useEffect } from "react";
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
  onCancel: () => void;
  onNext: () => void;
  collectionId?: string;
  isEditing?: boolean;
  initialData?: {
    title: string;
    description: string;
    cityOrLocation: string;
    price: string;
    selectedArtworks: number[];
    coverImageFile?: File | null;
  };
}

const CollectionForm = ({
  mode,
  onCancel,
  onNext,
  isEditing = false,
  collectionId,
  initialData,
}: StepTwoFormProps) => {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [cityOrLocation, setCityOrLocation] = useState(
    initialData?.cityOrLocation || ""
  );
  const [price, setPrice] = useState(initialData?.price || "");
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>(
    initialData?.selectedArtworks || []
  );
  const [coverImageFile, setCoverImageFile] = useState<File | null>(
    initialData?.coverImageFile || null
  );
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const genre = "Low-Poly";
  const [artworks, setArtworks] = useState<
    { _id: number; title: string; image: string }[]
  >([]);

  // Fetch artworks once on mount
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const res = await api.get("/objects");
        const objects = res.data.data.objects;

        setArtworks(
          objects.map((obj: any) => ({
            _id: obj._id,
            title: obj.title,
            image: obj.thumbnail?.filePath || obj.file?.url || artworkImg,
          }))
        );
      } catch (err) {
        console.error("Failed to load artworks", err);
        setArtworks([]);
      }
    };

    fetchArtworks();
  }, []);

  // Fetch collection data when editing
  useEffect(() => {
    if (isEditing && collectionId) {
      const fetchCollection = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await fetch(
            `http://localhost:3000/api/v1/artist/collections/${collectionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) throw new Error("Failed to fetch collection");
          const data = await res.json();

          const collection = data.data.collection;

          setTitle(collection.title || "");
          setDescription(collection.description || "");
          setCityOrLocation(collection.city || "");
          setPrice(collection.price ? collection.price.toString() : "");
          setSelectedArtworks(collection.objects || []);

          if (collection.coverImageUrl) {
            setCoverImageUrl(collection.coverImageUrl);
            setCoverImageFile(null);
          }
        } catch (error) {
          console.error("Error fetching collection data:", error);
        }
      };
      fetchCollection();
    }
  }, [isEditing, collectionId]);

  // Handle price input validation (max 2 decimals)
  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setPrice(value);
    }
  };

  // Toggle artworks selected/unselected
  const toggleArtwork = (id: number) => {
    setSelectedArtworks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Publish or save draft handler
  const handlePublish = async (isDraft: boolean) => {
    const formData = new FormData();
    if (coverImageFile) formData.append("coverImage", coverImageFile);

    formData.append(
      "collection",
      JSON.stringify({
        collection: {
          type: mode,
          title,
          description,
          city: cityOrLocation,
          price: parseFloat(price),
          genres: [genre],
          objects: selectedArtworks,
          status: isDraft ? "draft" : "published",
        },
      })
    );

    try {
      const token = localStorage.getItem("token");
      const url =
        isEditing && collectionId
          ? `http://localhost:3000/api/v1/artist/collections/${collectionId}`
          : "http://localhost:3000/api/v1/artist/collections";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        window.location.href = "/collections";
      } else {
        const error = await res.json();
        alert("Fout: " + JSON.stringify(error, null, 2));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Something went wrong.");
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setCoverImageFile(file);
      setCoverImageUrl(null);
    }
  };

  const CityAutocomplete = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (v: string) => void;
  }) => {
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (value.length < 3) {
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

    React.useEffect(() => {
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
      <div className="relative w-full">
        <InputField
          label={mode === "tour" ? "City" : "Location"}
          placeholder={mode === "tour" ? "City" : "Location"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
          autoComplete="off" // zorg dat dit ook in InputField kan
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
                alt="Artwork"
                className="object-cover w-3/4 h-full"
              />
            </div>

            <div className="flex justify-center gap-4 w-full mt-4">
              <label className="bg-primary-500 text-neutral-50 text-sm font-semibold rounded px-3 py-2 hover:opacity-90 cursor-pointer">
                Choose cover
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>

              <button
                className="text-sm font-semibold text-red-400 border border-red-600 rounded px-3 py-2 bg-[#FCA5A5] hover:opacity-90"
                onClick={() => {
                  setCoverImageFile(null);
                  setCoverImageUrl(null);
                }}
              >
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

              {/* Hier de autocomplete voor stad/location */}
              <CityAutocomplete
                value={cityOrLocation}
                onChange={setCityOrLocation}
              />

              <InputField
                label="Price (€)"
                placeholder="Enter price"
                value={price}
                onChange={handlePriceChange}
                className="w-full h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
              />
            </div>

            <div className="w-full mt-6">
              <p className="text-sm text-left mb-2">Genre</p>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#00B69B] bg-[#00B69B33] px-3 py-1 rounded-lg">
                  Low-Poly
                </span>
                <img src={plusGenreIcon} alt="Add genre" className="w-4 h-4" />
              </div>
            </div>

            <button
              className="mt-6 bg-primary-500 py-3 px-6 rounded-lg text-white font-semibold hover:bg-primary-600"
              onClick={() => setStep(2)}
              disabled={!title || !description || !cityOrLocation || !price}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="w-full flex flex-col gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artworks.map((artwork) => (
              <div
                key={artwork._id}
                className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                  selectedArtworks.includes(artwork._id)
                    ? "border-primary-500 bg-primary-600"
                    : "border-transparent"
                }`}
                onClick={() => toggleArtwork(artwork._id)}
              >
                <img
                  src={artwork.image}
                  alt={artwork.title}
                  className="w-full h-24 object-cover rounded-md mb-2"
                />
                <p className="text-sm text-center">{artwork.title}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="bg-secondary-700 px-6 py-3 rounded-lg text-neutral-400 hover:text-white"
            >
              Back
            </button>

            <button
              onClick={() => setStep(3)}
              className="bg-primary-500 px-6 py-3 rounded-lg text-white hover:bg-primary-600"
              disabled={selectedArtworks.length === 0}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="w-full p-6 bg-secondary-800 rounded-lg flex flex-col gap-4 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>

          <p>
            <strong>Title:</strong> {title}
          </p>
          <p>
            <strong>Description:</strong> {description}
          </p>
          <p>
            <strong>City/Location:</strong> {cityOrLocation}
          </p>
          <p>
            <strong>Price (€):</strong> {price}
          </p>
          <p>
            <strong>Genre:</strong> {genre}
          </p>
          <p>
            <strong>Selected artworks:</strong> {selectedArtworks.length}
          </p>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setStep(2)}
              className="bg-secondary-700 px-6 py-3 rounded-lg text-neutral-400 hover:text-white"
            >
              Back
            </button>

            <button
              onClick={() => handlePublish(true)}
              className="bg-gray-500 px-6 py-3 rounded-lg text-white hover:bg-gray-600"
            >
              Save Draft
            </button>

            <button
              onClick={() => handlePublish(false)}
              className="bg-primary-500 px-6 py-3 rounded-lg text-white hover:bg-primary-600"
            >
              Publish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionForm;
