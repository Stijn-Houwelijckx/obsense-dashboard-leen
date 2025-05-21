import React from "react";
import artworkImg from "assets/img/artwork.png";
import deleteIcon from "assets/img/delete.svg";
import editIcon from "assets/img/edit.svg";
import { useNavigate } from "react-router-dom";

interface ArtworkCardProps {
  title: string;
}

const ArtworkCard = ({ title }: ArtworkCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[350px] bg-secondary-800 rounded-lg p-3">
      <div className="w-full h-[330px] bg-secondary-700 rounded-lg flex flex-col">
        <div className="relative w-full h-[264px] rounded-lg bg-secondary-700 overflow-hidden">
          <img
            src={artworkImg}
            alt={title}
            className="w-1/2 h-full object-cover rounded-lg mx-auto"
          />
          <button
            className="absolute top-2 right-2 w-10 h-10 bg-secondary-700 rounded-full flex items-center justify-center"
            aria-label="Delete artwork"
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
              className="w-5"
              onClick={() => navigate("/artworkform")}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
