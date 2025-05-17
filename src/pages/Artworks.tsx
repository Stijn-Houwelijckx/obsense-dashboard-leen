import rocket from "../assets/img/rakket.svg";
import searchIcon from "../assets/img/search.svg";
import hamburgerIcon from "../assets/img/hamburger.svg";
import Button from "components/Button";
import ArtworkCard from "components/ArtworkCard";
import plusIcon from "../assets/img/plus.svg";
import { useNavigate } from "react-router-dom";

const Artworks = () => {
  const hasArtworks = true;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-secondary-900 p-4 text-neutral-50 mt-14 ml-4 mr-4">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Your Artworks</h1>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </div>
          <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
            <img src={hamburgerIcon} alt="Menu" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {hasArtworks ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 justify-items-center">
          <div
            onClick={() => navigate("/upload")}
            className="w-[303px] h-[350px] bg-secondary-800 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="relative w-[280px] h-[328px] rounded-lg bg-secondary-700 flex flex-col items-center justify-center text-center">
              <h6 className="text-lg text-primary-500 font-semibold mb-3">
                Upload new artwork
              </h6>
              <img src={plusIcon} alt="Plus" className="w-24 h-24" />
            </div>
          </div>

          <ArtworkCard title="Working Man" />
          <ArtworkCard title="Sunset Glow" />
          <ArtworkCard title="Modern Art" />
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 pt-10">
          <img src={rocket} alt="Upload" className="w-32 h-32 mb-6" />
          <h6 className="text-lg font-semibold mb-2">Upload your artwork</h6>
          <p className="text-neutral-300 mb-6">
            To use it in an exposition or tour.
          </p>
          <div className="w-full max-w-xs">
            <Button label="Upload" type="button" onClick={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Artworks;
