import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/img/search.svg";
import hamburgerIcon from "../assets/img/hamburger.svg";
import treeImage from "../assets/img/tree.png";
import Button from "components/Button";
import InputField from "../components/InputField";
import Navigation from "components/Navigation";

const ArtworkForm = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate("/artworks");
  };

  return (
    <div className="min-h-screen bg-secondary-900 text-neutral-50 px-4 mt-14 flex flex-col items-center">
      <div className="w-full max-w-md mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Artworks</h1>
          <div className="flex gap-2">
            <div className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center">
              <img src={searchIcon} alt="Search" className="w-5 h-5" />
            </div>
            <Navigation />
          </div>
        </div>
      </div>

      <div className="w-full bg-secondary-800 p-6 pt-12 rounded-[16px] max-w-md flex flex-col items-center text-center mb-6">
        <div className="relative">
          <div className="w-full h-[400px] bg-secondary-700 rounded-lg overflow-hidden relative flex items-center justify-center mt-7">
            <img
              src={treeImage}
              alt="Artwork"
              className="object-cover w-full h-full"
            />
            <div className="absolute -top-6 right-2">
              <Button
                label="Preview"
                type="button"
                onClick={() => {}}
                className="w-full h-[48px] text-sm"
              />
            </div>
          </div>
          <button className="absolute -top-8 right-0 text-sm font-semibold text-red-400 border border-red-600 rounded px-3 py-2 bg-[#FCA5A5] hover:opacity-90">
            Delete artwork
          </button>
        </div>

        <div className="w-full flex flex-col gap-5 items-start mb-6 mt-7">
          <h3 className="text-neutral-50 text-lg font-semibold">
            Artwork Information
          </h3>

          <div className="flex flex-col gap-[21px] text-left mb-7">
            <div className="flex flex-row gap-[20px]">
              <p className="text-neutral-50 text-sm">File size</p>
              <p className="text-neutral-300 text-sm">50MB</p>
            </div>
            <div className="flex flex-row gap-[20px]">
              <p className="text-neutral-50 text-sm">Uploaded on</p>
              <p className="text-neutral-300 text-sm">17 May 2025</p>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-start gap-4 mb-7">
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
        </div>

        <div className="flex gap-4 w-full">
          <button className="w-1/3 h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-2/3 h-[48px] bg-primary-500 text-white font-medium rounded-lg hover:opacity-90 transition"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkForm;
