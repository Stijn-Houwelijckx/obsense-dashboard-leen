import { useState, useRef, DragEvent, ChangeEvent } from "react";
import uploadPreview from "../assets/img/upload.png";
import uploadIcon from "../assets/img/upload_icon.svg";
import fileIcon from "../assets/img/file.svg";
import Button from "components/Button";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import closeIcon from "../assets/img/close.svg";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ArtworkUpload = () => {
  const [clicked, setClicked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isValidFile = (file: File) => {
    const validExtensions = [".glb"];
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    return validExtensions.includes(extension);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("3DObject", file);

    const objectMeta = {
      object: {
        title: "Mijn titel",
        description: "Mijn beschrijving",
      },
    };
    formData.append("object", JSON.stringify(objectMeta));

    try {
      const response = await api.post("/objects", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          setUploadProgress(percentCompleted);
        },
      });

      const objectId = response.data.data.object._id;
      setIsUploading(false);
      navigate("/artwork", { state: { objectId } });
    } catch (err: any) {
      setIsUploading(false);
      setError("Something went wrong during upload.");
    }
  };

  const handleRemoveFile = () => {
    setFiles(null);
    setUploadProgress(0);
    setIsUploading(false);
    setError(null);
  };

  const validateAndSetFiles = async (selectedFiles: FileList) => {
    setError(null);
    if (selectedFiles.length === 0) return;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];

      if (!isValidFile(file)) {
        setError("Wrong file type. Only GLB");
        setFiles(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File too big. Max. 10MB");
        setFiles(null);
        return;
      }
    }

    setFiles(selectedFiles);

    await uploadFile(selectedFiles[0]);
  };

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
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

      <div className="flex flex-col items-center justify-center w-full bg-secondary-800 p-6 rounded-[16px] lg:h-[calc(85vh-56px)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:gap-6 w-full">
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
            <p className="text-base font-text font-medium mb-1">
              Drag and drop a file to upload
            </p>
            <p className="text-sm font-text text-neutral-400 mb-4">
              GLB up to 10MB.
            </p>
            <span className="text-sm font-text text-neutral-400 mb-4">OR</span>
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
              accept=".glb"
              style={{ display: "none" }}
            />
          </div>

          <img
            src={uploadPreview}
            alt="Preview Duplicate"
            className="hidden lg:block w-1/3 h-auto"
          />
        </div>

        <div className="w-full lg:w-1/3 mt-4 lg:mt-6 flex flex-col items-start justify-center">
          {files && files.length > 0 && (
            <div className="flex items-center gap-4 mt-6 relative">
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
              <p className="text-neutral-300 font-text break-words max-w-[220px]">
                {files[0].name}
              </p>
              <button
                onClick={handleRemoveFile}
                className="ml-2"
                aria-label="Remove file"
              >
                <img
                  src={closeIcon}
                  alt="Remove"
                  className="w-4 h-4 opacity-70 hover:opacity-100"
                />
              </button>
            </div>
          )}

          {isUploading && (
            <>
              <div
                className="w-full h-3 rounded-full mt-6 bg-primary-500/20 overflow-hidden"
                aria-label="Upload progress"
              >
                <div
                  className="h-3 bg-primary-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm font-text text-primary-500 mt-1">
                Loading...
              </p>
            </>
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
