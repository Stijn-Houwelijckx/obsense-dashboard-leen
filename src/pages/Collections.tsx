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

const Collections = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const hasCollections = collections.length > 0;

  interface FileData {
    fileName: string;
    filePath: string;
    fileType?: string;
    fileSize?: number;
  }
  interface CollectionType {
    _id: string;
    title: string;
    coverImage: FileData | null;
    status: "draft" | "published";
  }

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await api.get("/artist/collections");
        console.log("API response:", res.data); // <-- hier even loggen
        const collectionsData = res.data.data.collections as CollectionType[];

        collectionsData.forEach((c) =>
          console.log("Cover image URL:", c.coverImage)
        );

        // Check de URLs even in de console
        collectionsData.forEach((c) =>
          console.log("Cover image URL:", c.coverImage)
        );
        setCollections(collectionsData);

        // setCollections(res.data.data.collections);
      } catch (err) {
        console.error("Failed to fetch collections", err);
      }
    };

    fetchCollections();
  }, []);
  return (
    <div className="min-h-screen bg-secondary-900 pt-14 text-neutral-50 md:pl-[166px] md:pr-[74px] px-4">
      <div className="flex items-center justify-between mb-10 w-full">
        <h1 className="text-2xl font-bold">Your Collections</h1>

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

      {hasCollections ? (
        <div className="grid gap-5 justify-items-center grid-cols-[repeat(auto-fit,minmax(250px,1fr))] pb-8">
          <div
            onClick={() => navigate("/create")}
            className="w-full h-[350px] p-[11px] bg-secondary-800 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="relative w-full h-[328px] p-[11px] rounded-lg bg-secondary-700 flex flex-col items-center justify-center text-center">
              <h6 className="text-lg text-primary-500 font-semibold mb-3">
                Upload new tour or exposition
              </h6>
              <img src={plusIcon} alt="Plus" className="w-24 h-24" />
            </div>
          </div>

          {collections.map((collection) => {
            console.log("Collection ID:", collection._id);
            return (
              <CollectionCard
                key={collection._id}
                title={collection.title}
                image={collection.coverImage?.filePath || ""}
                status={collection.status}
                collectionId={collection._id}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-4 pt-10">
          <img src={rocket} alt="Upload" className="w-32 h-32 mb-6" />
          <h6 className="text-lg font-semibold mb-2">
            No tours or expositions yet
          </h6>
          <p className="text-neutral-300 mb-6">Start here</p>
          <div className="w-full max-w-xs">
            <Button label="Upload" type="button" onClick={() => {}} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
