import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";

interface CollectionType {
  _id: string;
  title: string;
  status: "draft" | "published";
  bought?: number; // als je dat hebt, zo niet, fallback
  likes?: number;
  views?: number;
}

const Home = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await api.get("/artist/collections");
        const collectionsData = res.data.data.collections as CollectionType[];

        // Als bought, likes, views niet in API zitten, hier dummy data toevoegen
        const collectionsWithStats = collectionsData.map((c) => ({
          ...c,
          bought: c.bought ?? 0,
          likes: c.likes ?? 0,
          views: c.views ?? 0,
        }));

        setCollections(collectionsWithStats);
      } catch (err) {
        console.error("Failed to fetch collections", err);
      }
    };

    fetchCollections();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-secondary-900 pt-14 px-4 text-neutral-50 md:pl-[166px] md:pr-[74px]">
        <div className="flex items-center justify-between mb-10 w-full">
          <h1 className="text-2xl font-title font-bold">Home</h1>
          <div className="flex gap-2">
            <div className="md:hidden">
              <Navigation />
            </div>
          </div>
          <div className="hidden md:block w-[250px]">
            <NavigationDesktop />
          </div>
        </div>

        <div className="w-full bg-secondary-800 p-6 rounded-[16px] text-neutral-50 mt-16">
          <div className="w-full flex text-sm font-semibold mb-4">
            <h4 className="w-1/4 font-title text-left">Tour / Expo</h4>
            <h4 className="w-1/4 font-title text-left">Times bought</h4>
            <h4 className="w-1/4 font-title text-left">Likes</h4>
            <h4 className="w-1/4 font-title text-left">Views</h4>
          </div>

          <div className="flex flex-col w-full text-sm">
            {collections.map((collection, index, arr) => (
              <div key={collection._id} className="py-4">
                <div className="flex w-full">
                  <div className="w-1/4 font-text text-left">
                    {collection.title}
                  </div>
                  <div className="w-1/4 font-text text-left">
                    {collection.bought}
                  </div>
                  <div className="w-1/4 font-text text-left">
                    {collection.likes}
                  </div>
                  <div className="w-1/4 font-text text-left">
                    {collection.views}
                  </div>
                </div>
                {index < arr.length - 1 && (
                  <div className="mt-4 mb-4 border-b border-neutral-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
