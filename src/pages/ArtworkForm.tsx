import { useNavigate } from "react-router-dom";
import searchIcon from "../assets/img/search.svg";
import treeImage from "../assets/img/tree.png";
import Button from "components/Button";
import InputField from "../components/InputField";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";

const ArtworkForm = () => {
  const navigate = useNavigate();

  const handleSave = () => {
    navigate("/artworks");
  };

  const handleCancel = () => {
    navigate("/artworks");
  };

  return (
    <div className="min-h-screen md:pl-[166px] md:pr-[74px] bg-secondary-900 text-neutral-50 px-4 mt-14 flex flex-col items-center">
      <div className="w-full mb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Artworks</h1>
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
        <button className="absolute top-6 right-6 text-sm font-semibold text-red-400 border border-red-600 rounded px-3 py-2 bg-[#FCA5A5] hover:opacity-90 z-10">
          Delete artwork
        </button>

        <div className="lg:w-1/2 w-full flex flex-col items-center text-center">
          <div className="relative w-full h-[400px] bg-secondary-700 rounded-lg overflow-hidden flex items-center justify-center mt-7">
            <img
              src={treeImage}
              alt="Artwork"
              className="object-cover w-full md:w-1/2 h-full"
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

          <div className="w-full flex flex-col gap-5 items-start text-left mb-6 mt-7 px-2 lg:px-0">
            <h3 className="text-neutral-50 text-lg font-semibold">
              Artwork Information
            </h3>

            <div className="flex flex-col gap-[21px] mb-7">
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
        </div>

        <div className="lg:w-1/2 lg:mt-16 w-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 mb-7">
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

          <div className="w-full flex justify-center lg:justify-end mt-6">
            <div className="w-full max-w-[250px] flex gap-4">
              <button
                onClick={handleCancel}
                className="w-1/3 h-[48px] border border-primary-500 rounded-lg text-primary-500 font-medium hover:border-primary-600 transition"
              >
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
      </div>
    </div>
  );
};

export default ArtworkForm;
