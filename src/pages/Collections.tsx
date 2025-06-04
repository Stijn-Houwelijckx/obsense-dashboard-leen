import rocket from "../assets/img/rakket.svg";
import searchIcon from "../assets/img/search.svg";
import Button from "components/Button";
import CollectionCard from "components/CollectionCard";
import plusIcon from "../assets/img/plus.svg";
import { useNavigate } from "react-router-dom";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useRef } from "react";

interface FileData {
  fileName: string;
  filePath: string;
  fileType?: string;
  fileSize?: number;
}

interface CollectionType {
  _id: string;
  title: string;
  description?: string;
  coverImage: FileData | null;
  status: "draft" | "published";
}

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await api.get("/artist/collections");
        setCollections(res.data.data.collections || []);
      } catch (err) {
        console.error("Failed to fetch collections", err);
      }
    };

    fetchCollections();
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
      await api.delete(`/artist/collections/${idToDelete}`);
      setCollections((prev) => prev.filter((c) => c._id !== idToDelete));
      setIdToDelete(null);
    } catch (err) {
      console.error("Error deleting collection:", err);
      setIdToDelete(null);
    }
  };

  const filteredCollections = collections.filter((collection) =>
    collection.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary-900 pt-14 text-neutral-50 md:pl-[166px] md:pr-[74px] px-4">
      <div className="flex items-center justify-between mb-10 w-full">
        <h1 className="text-2xl font-title font-bold">Your Collections</h1>

        <div className="flex justify-end gap-2">
          <div className="lg:hidden" ref={searchRef}>
            {!isSearchOpen ? (
              <div
                className="w-10 h-10 bg-secondary-800 rounded-full flex items-center justify-center cursor-pointer"
                onClick={() => setIsSearchOpen(true)}
              >
                <img src={searchIcon} alt="Search" className="w-5 h-5" />
              </div>
            ) : (
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search collections"
                className="text-sm text-neutral-50 bg-secondary-800 border border-neutral-500 rounded-[10px] px-4 py-2 focus:outline-none"
                autoFocus
              />
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
              className="ml-2 text-sm text-neutral-50 bg-transparent w-full focus:outline-none"
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

      {filteredCollections.length > 0 ? (
        <div className="grid gap-5 justify-items-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-8">
          <div
            onClick={() => navigate("/choose")}
            className="w-full h-[350px] p-[11px] bg-secondary-800 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="relative w-full h-[328px] p-[11px] rounded-lg bg-secondary-700 flex flex-col items-center justify-center text-center">
              <h6 className="text-lg font-text text-primary-500 font-semibold mb-3">
                Upload new tour or exposition
              </h6>
              <img src={plusIcon} alt="Plus" className="w-24 h-24" />
            </div>
          </div>

          {filteredCollections.map((collection) => (
            <CollectionCard
              key={collection._id}
              _id={collection._id}
              title={collection.title}
              image={collection.coverImage?.filePath || ""}
              status={collection.isPublished ? "published" : "draft"}
              collectionId={collection._id}
              onRequestDelete={handleRequestDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 pt-10">
          <img src={rocket} alt="Upload" className="w-32 h-32 mb-6" />
          <h6 className="text-lg font-text font-semibold mb-2">
            No tours or expositions yet
          </h6>
          <p className="text-neutral-300 font-text mb-6">Start here</p>
          <div className="w-full max-w-xs">
            <Button
              label="Upload"
              type="button"
              onClick={() => navigate("/choose")}
            />
          </div>
        </div>
      )}

      {idToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-secondary-800 rounded-[10px] max-w-md w-full text-neutral-50 flex flex-col items-center text-center gap-6 px-8 py-10">
            <h4 className="text-xl font-title font-semibold">
              Are you sure you want to delete your tour or exposition?
            </h4>
            <p className="font-text">
              Users who have bought your tour will have 30 days to complete it.
            </p>
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

export default Collections;
