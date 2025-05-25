import rocket from "../assets/img/rakket.svg";
import searchIcon from "../assets/img/search.svg";
import plusIcon from "../assets/img/plus.svg";
import { useNavigate } from "react-router-dom";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import Button from "components/Button";
import ArtworkCard from "components/ArtworkCard";
import { useEffect, useState } from "react";
import api from "../services/api"; // jouw axios instance
// import axios from "axios";

interface Artwork {
  _id: string; // ✅ dit is wat MongoDB gebruikt
  title: string;
  description?: string;
}
const Artworks = () => {
  // const hasArtworks = true;
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  // const yourToken = localStorage.getItem("jwt") || ""; // Haal je token op uit localStorag
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get("/objects")
      .then((res) => {
        console.log("RESPONSE:", res.data); // <---- Voeg dit toe

        const objects = res.data.data.objects; // pas aan indien structuur anders is
        setArtworks(objects);
      })
      .catch((err) => {
        console.error("Failed to load artworks", err);
      });
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/objects/${id}`);
      console.log(`Object with ID ${id} deleted successfully.`);
      setArtworks((prev) => prev.filter((art) => art._id !== id));
    } catch (err) {
      console.error("Error deleting object:", err);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 pt-14 text-neutral-50 md:pl-[166px] md:pr-[74px] px-4">
      <div className="flex items-center justify-between mb-10 w-full">
        <h1 className="text-2xl font-bold">Your Artworks</h1>

        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center lg:hidden">
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </div>

          <div className="hidden lg:flex items-center w-[300px] bg-secondary-800 border border-neutral-500 rounded-[10px] px-[18px] py-[8px] cursor-pointer hover:bg-secondary-700 transition">
            <img
              src={searchIcon}
              alt="Search"
              className="w-5 h-5 text-neutral-500"
            />
            <span className="ml-2 text-sm text-neutral-500">Search</span>
          </div>

          <div className="md:hidden">
            <Navigation />
          </div>

          <div className="hidden md:block w-[250px]">
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
              <h6 className="text-lg text-primary-500 font-semibold mb-3">
                Upload new artwork
              </h6>
              <img src={plusIcon} alt="Plus" className="w-24 h-24" />
            </div>
          </div>

          {artworks.map((artwork) => (
            <ArtworkCard
              key={artwork._id}
              _id={artwork._id}
              title={artwork.title}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 pt-10">
          <img src={rocket} alt="Upload" className="w-32 h-32 mb-6" />
          <h6 className="text-lg font-semibold mb-2">Upload your artwork</h6>
          <p className="text-neutral-300 mb-6">
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
    </div>
  );
};

export default Artworks;
