import { useState, useRef, DragEvent, ChangeEvent } from "react";
import uploadPreview from "../assets/img/upload.png";
import uploadIcon from "../assets/img/upload_icon.svg";
import fileIcon from "../assets/img/file.svg"; // Zorg dat dit bestaat
import Button from "components/Button";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const ArtworkUpload = () => {
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isValidFile = (file: File) => {
    const validExtensions = [".glb", ".gltf"];
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    return validExtensions.includes(extension);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    console.log("uploadFile called with file:", file.name);
    setError(null);

    const formData = new FormData();
    formData.append("3DObject", file);

    const objectMeta = {
      object: {
        title: "Mijn titel", // Pas aan, bijvoorbeeld via een formulierveld
        description: "Mijn beschrijving", // Of een lege string
      },
    };
    formData.append("object", JSON.stringify(objectMeta)); // Dit is essentieel!

    try {
      const response = await api.post("/objects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response data:", response.data);

      // ✅ Haal het ID van het geüploade object op
      const objectId = response.data.data.object._id;

      // ✅ Geef het mee aan de volgende pagina
      navigate("/artworkform", { state: { objectId } });
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Something went wrong during upload.");
    }
  };

  const validateAndSetFiles = async (selectedFiles: FileList) => {
    console.log("validateAndSetFiles called with files:", selectedFiles);

    setError(null);
    if (selectedFiles.length === 0) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (!isValidFile(file)) {
        setError("Wrong file type. Only GLB or GLTF");
        setFiles(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File too big. Max. 20MB");
        setFiles(null);
        return;
      }
    }

    setFiles(selectedFiles);

    // Upload meteen de eerste file
    console.log("Files ready to upload:", selectedFiles[0]);

    await uploadFile(selectedFiles[0]);
  };

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("onFilesSelected triggered");
    const selectedFiles = event.target.files;
    console.log("Selected files:", selectedFiles);
    if (selectedFiles) {
      validateAndSetFiles(selectedFiles);
    }
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setClicked(false);
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles) {
      validateAndSetFiles(droppedFiles);
    }
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setClicked(true);
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setClicked(false);
  };

  return (
    <div className="min-h-screen md:pl-[166px] md:pr-[74px] bg-secondary-900 text-neutral-50 px-4 mt-14">
      <div className="flex items-center justify-between mb-10">
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

      <div className="flex flex-col items-center lg:flex-row lg:items-center lg:justify-center lg:gap-6 w-full bg-secondary-800 p-6 rounded-[16px] lg:h-[calc(85vh-56px)]">
        <img
          src={uploadPreview}
          alt="Preview"
          className="w-3/4 lg:w-1/3 h-auto mb-8 mt-12 lg:mb-0 lg:mt-0"
        />

        <div
          onClick={openFileDialog}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`
            w-full lg:w-1/3 h-[294px] border border-dashed border-neutral-500 rounded-lg 
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
          <p className="text-sm text-neutral-400 mb-4">GLB, GLTF up to 20MB.</p>
          <span className="text-sm text-neutral-400 mb-4">OR</span>
          <div className="w-full px-4">
            <Button
              label="Browse files"
              type="button"
              onClick={openFileDialog}
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onFilesSelected}
            accept=".glb,.gltf"
            style={{ display: "none" }}
          />
        </div>

        <img
          src={uploadPreview}
          alt="Preview Duplicate"
          className="hidden lg:block w-1/3 h-auto"
        />

        <div className="w-full lg:w-1/3 mt-4 lg:mt-6 flex flex-col items-start">
          {files && files.length > 0 && (
            <div className="flex items-center gap-4 mb-1">
              <div
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: "rgba(239, 254, 246, 0.05)",
                }}
              >
                <img src={fileIcon} alt="File Icon" className="w-6 h-6" />
              </div>
              <p className="text-neutral-300 break-words max-w-[220px]">
                {files[0].name}
              </p>
            </div>
          )}
          {error && (
            <p className="text-red-600 font-semibold text-sm mt-1">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkUpload;
