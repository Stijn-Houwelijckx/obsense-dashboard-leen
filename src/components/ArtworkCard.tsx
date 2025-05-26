import React, { useState } from "react";
import artworkImg from "assets/img/artwork.png";
import deleteIcon from "assets/img/delete.svg";
import editIcon from "assets/img/edit.svg";
import { useNavigate } from "react-router-dom";

interface ArtworkCardProps {
  _id: string;
  title: string;
  thumbnailUrl?: string;
  onRequestDelete: (id: string) => void; // anders dan onDelete: hier vraag je om bevestiging
}

const ArtworkCard = ({
  _id,
  title,
  thumbnailUrl,
  onRequestDelete,
}: ArtworkCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[350px] bg-secondary-800 rounded-lg p-3">
      <div className="w-full h-[330px] bg-secondary-700 rounded-lg flex flex-col">
        <div className="relative w-full h-[264px] rounded-lg bg-secondary-700 overflow-hidden">
          <img
            src={thumbnailUrl || artworkImg}
            alt={title}
            className="w-cover object-cover rounded-lg mx-auto"
          />
          <button
            onClick={() => onRequestDelete(_id)}
            className="absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center"
            aria-label="Request delete artwork"
          >
            <img src={deleteIcon} alt="Delete" className="w-5" />
          </button>
        </div>

        <div className="w-full h-[64px] bg-secondary-600 rounded-lg flex items-center justify-between px-4">
          <h6 className="text-primary-500 font-semibold">{title}</h6>
          <button aria-label="Edit artwork">
            <img
              src={editIcon}
              alt="Edit"
              className="w-5 cursor-pointer"
              onClick={() => {
                navigate("/artworkform", { state: { objectId: _id } });
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ArtworkCard;
