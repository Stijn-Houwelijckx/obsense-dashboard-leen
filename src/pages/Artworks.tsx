import rocket from "../assets/img/rakket.svg";
import searchIcon from "../assets/img/search.svg";
import plusIcon from "../assets/img/plus.svg";
import { useNavigate } from "react-router-dom";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import Button from "components/Button";
import ArtworkCard from "components/ArtworkCard";
import { useEffect, useState } from "react";
import api from "../services/api";

interface FileData {
  fileName: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
}

interface Artwork {
  _id: string;
  title: string;
  description?: string;
  file?: FileData;
  thumbnail?: FileData;
}

const Artworks = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const filteredArtworks = artworks.filter((artwork) =>
    artwork.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    api
      .get("/objects")
      .then((res) => {
        const objects = res.data.data.objects;
        setArtworks(objects);
      })
      .catch((err) => {
        console.error("Failed to load artworks", err);
      });
  }, []);

  const handleRequestDelete = (id: string) => {
    setIdToDelete(id);
  };

  const handleCancelDelete = () => {
    setIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!idToDelete) return;
    try {
      await api.delete(`/objects/${idToDelete}`);
      setArtworks((prev) => prev.filter((art) => art._id !== idToDelete));
      setIdToDelete(null);
    } catch (err) {
      console.error("Error deleting object:", err);
      setIdToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 pt-14 text-neutral-50 md:pl-[166px] md:pr-[74px] px-4">
      <div className="flex items-center justify-between mb-10 w-full">
        <h1 className="text-2xl font-title font-bold">Your Artworks</h1>

        <div className="flex items-center gap-2">
          <div className="lg:hidden">
            {showSearch ? (
              <div className="flex items-center w-[180px] bg-secondary-800 border border-neutral-500 rounded-[10px] px-[14px] py-[6px] transition">
                <img
                  src={searchIcon}
                  alt="Search"
                  className="w-5 h-5 text-neutral-500"
                />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="ml-2 text-sm text-neutral-50 bg-transparent w-full focus:outline-none"
                  autoFocus
                  onBlur={() => setShowSearch(false)}
                />
              </div>
            ) : (
              <div
                className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center transition"
                onClick={() => setShowSearch(true)}
              >
                <img src={searchIcon} alt="Search" className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center w-[300px] bg-secondary-800 border border-neutral-500 rounded-[10px] px-[18px] py-[8px]">
            <img
              src={searchIcon}
              alt="Search"
              className="w-5 h-5 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="ml-2 font-text text-sm text-neutral-50 bg-transparent w-full focus:outline-none"
            />
          </div>

          <div className="flex gap-2">
            <div className="md:hidden">
              <Navigation />
            </div>
          </div>

          <div className="hidden md:block w-0 h-0 p-0 m-0 overflow-hidden">
            <NavigationDesktop />
          </div>
        </div>
      </div>

      {artworks.length > 0 ? (
        <div className="grid gap-5 justify-items-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-8">
          <div
            onClick={() => navigate("/upload")}
            className="w-full h-[350px] p-[11px] bg-secondary-800 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="relative w-full h-[328px] p-[11px] rounded-lg bg-secondary-700 flex flex-col items-center justify-center text-center">
              <h6 className="text-lg font-title text-primary-500 font-semibold mb-3">
                Upload new artwork
              </h6>
              <img src={plusIcon} alt="Plus" className="w-24 h-24" />
            </div>
          </div>

          {filteredArtworks.map((artwork) => (
            <ArtworkCard
              key={artwork._id}
              _id={artwork._id}
              title={artwork.title}
              thumbnailUrl={
                artwork.thumbnail?.filePath || artwork.file?.filePath
              }
              onRequestDelete={handleRequestDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 pt-10">
          <img src={rocket} alt="Upload" className="w-32 h-32 mb-6" />
          <h6 className="text-lg font-title font-semibold mb-2">
            Upload your artwork
          </h6>
          <p className="text-neutral-300 font-text mb-6">
            To use it in an exposition or tour.
          </p>
          <div className="w-full max-w-xs">
            <Button
              label="Upload"
              type="button"
              onClick={() => navigate("/upload")}
            />
          </div>
        </div>
      )}

      {idToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-secondary-800 rounded-[10px] max-w-md w-full text-neutral-50 flex flex-col items-center text-center gap-6 px-8 py-10">
            <h4 className="text-xl font-title font-semibold">
              Are you sure you want to delete your artwork?
            </h4>
            <p className="font-text">This action cannot be undone.</p>
            <div className="flex gap-4 justify-center w-full mt-4">
              <button
                onClick={handleCancelDelete}
                className="border font-text border-primary-500 text-primary-500 px-6 py-2 rounded-lg hover:border-primary-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-primary-500 font-text text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Yes, I'm sure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artworks;
