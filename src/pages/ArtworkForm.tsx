import { useEffect, useState, useRef, ChangeEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import treeImage from "../assets/img/fallback.jpeg";
import InputField from "components/InputField";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import api from "../services/api";
const apiUrl = import.meta.env.VITE_API_URL;

const ArtworkForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objectId, setObjectId] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state || !location.state.objectId) {
      alert("Geen artwork ID meegegeven via locatie!");
      return;
    }

    const id = location.state.objectId;
    setObjectId(id);

    // setLoading(true);
    api
      .get(`${apiUrl}/objects/${id}`)
      .then((res) => {
        const object = res.data.data.object;

        setTitle(res.data.data.object.title || "");
        setDescription(res.data.data.object.description || "");
        if (object.thumbnail && object.thumbnail.filePath) {
          setThumbnailUrl(object.thumbnail.filePath);
        }
      })
      .catch((err) => {
        console.error("Failed to load artwork metadata", err);
        alert("Kon artwork data niet laden.");
      });
    // .finally(() => setLoading(false));
  }, [location.state]);

  if (!location.state) {
    return <p>Loading...</p>;
  }

  const handleSave = async () => {
    try {
      await api.put(`${apiUrl}/objects/${objectId}`, {
        object: {
          title,
          description,
          file: {
            url: thumbnailUrl,
          },
        },
      });
      navigate("/artworks");
    } catch (err) {
      console.error("Fout bij opslaan artwork:", err);
      alert("Fout bij opslaan artwork.");
    }
  };

  const handleCancel = () => {
    navigate("/artworks");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      // Bestand is groter dan 1MB
      setThumbnailUrl(null);
      setThumbnailError("Thumbnail must be less than 1MB.");
    } else {
      setThumbnailUrl(URL.createObjectURL(file));
      setThumbnailError(null);
    }

    if (!objectId) {
      alert("Geen objectId beschikbaar!");
      return;
    }

    const formData = new FormData();

    formData.append("objectThumbnail", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/objects/${objectId}/thumbnail`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Upload mislukt:", response.status, text);
        alert("Upload mislukt: " + response.status);
        return;
      }

      const tempUrl = URL.createObjectURL(file);
      setThumbnailUrl(tempUrl);

      const result = await response.json();
      if (result.thumbnail && result.thumbnail.filePath) {
        setThumbnailUrl(result.thumbnail.filePath);
      } else {
        const tempUrl = URL.createObjectURL(file);
        setThumbnailUrl(tempUrl);
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDelete = async () => {
    if (!objectId) {
      alert("Geen objectId beschikbaar!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}/objects/${objectId}/thumbnail`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Delete mislukt:", response.status, text);
        alert("Verwijderen mislukt: " + response.status);
        return;
      }

      setThumbnailUrl(null);
      alert("Cover image verwijderd");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Er ging iets mis bij het verwijderen");
    }
  };

  return (
    <div className="min-h-screen md:pl-[166px] md:pr-[74px] bg-secondary-900 text-neutral-50 px-4 mt-14 flex flex-col items-center">
      <div className="w-full mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-title font-bold">Your Artworks</h1>
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

      <div className="w-full bg-secondary-800 p-6 pt-12 rounded-[16px] mb-6 flex flex-col lg:flex-row lg:gap-[68px] lg:justify-between relative">
        <div className="lg:w-1/2 w-full flex flex-col items-center text-center">
          <div className="relative w-full h-[400px] bg-secondary-700 rounded-lg overflow-hidden flex items-center justify-center mt-7">
            <img
              src={thumbnailUrl || treeImage}
              alt="Artwork"
              className="object-cover w-full md:w-1/2 h-full"
            />
          </div>

          <div className="flex justify-center gap-4 w-full mt-4">
            <input
              type="file"
              name="objectThumbnail"
              accept="image/png, image/jpeg"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary-500 font-text text-neutral-50 text-sm font-semibold rounded px-3 py-2 hover:opacity-90"
            >
              Choose cover
            </button>
          </div>

          {thumbnailError && (
            <p className="text-sm text-red-500 mt-2 text-left w-full">
              {thumbnailError}
            </p>
          )}
        </div>

        <div className="lg:w-1/2 lg:mt-16 w-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 mb-7">
            <InputField
              label="Title"
              placeholder="Title"
              value={title}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setTitle(e.target.value)}
              className="w-full font-text h-[48px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 text-sm text-white"
            />
            <InputField
              label="Description"
              placeholder="Description"
              textarea
              value={description}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
              ) => setDescription(e.target.value)}
              className="w-full font-text h-[166px] bg-secondary-700 border border-neutral-100 rounded-lg px-3 py-2 text-sm text-white resize-none"
            />
          </div>

          <div className="w-full flex justify-center lg:justify-end mt-6">
            <div className="w-full max-w-[250px] flex gap-4">
              <button
                onClick={handleCancel}
                className="w-1/3 h-[48px] font-text border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-2/3 h-[48px] font-text bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkForm;
