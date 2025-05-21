import { useState } from "react";
import uploadPreview from "../assets/img/upload.png";
import uploadIcon from "../assets/img/upload_icon.svg";
import searchIcon from "../assets/img/search.svg";
import hamburgerIcon from "../assets/img/hamburger.svg";
import Button from "components/Button";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";

const ArtworkUpload = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="min-h-screen bg-secondary-900 text-neutral-50 px-4 mt-14">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-2xl font-bold">Your Artworks</h1>
        <div className="flex gap-2">
          <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
            <img src={searchIcon} alt="Search" className="w-5 h-5" />
          </div>
          <div className="md:hidden">
            <Navigation />
          </div>
        </div>
        <div className="hidden lg:block w-[250px]">
          <NavigationDesktop />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <img
          src={uploadPreview}
          alt="Preview"
          className="w-full h-auto mb-8 mt-12"
        />

        <div
          onClick={() => setClicked(!clicked)}
          className={`
            w-full h-[294px] border border-dashed border-neutral-500 rounded-lg 
            flex flex-col items-center justify-center text-center px-4 cursor-pointer
            transition-all duration-300
            ${
              clicked
                ? "bg-neutral-950 shadow-none"
                : "bg-transparent hover:shadow-uploadHover"
            }
          `}
        >
          <img src={uploadIcon} alt="Upload" className="w-10 h-10 mb-4" />
          <p className="text-base font-medium mb-1">
            Drag and drop a file to upload
          </p>
          <p className="text-sm text-neutral-400 mb-4">GLB, GLTF up to 5MB.</p>
          <span className="text-sm text-neutral-400 mb-4">OR</span>
          <div className="w-full px-4">
            <Button label="Browse files" type="button" onClick={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkUpload;
