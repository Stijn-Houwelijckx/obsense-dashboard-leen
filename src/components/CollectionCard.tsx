import React from "react";
import artworkImg from "assets/img/artwork.png";
import editIcon from "assets/img/edit.svg";
import { useNavigate } from "react-router-dom";

interface CollectionCardProps {
  title: string;
  status: "draft" | "published";
}

const CollectionCard = ({ title, status }: CollectionCardProps) => {
  const navigate = useNavigate();

  const badgeColor = status === "draft" ? "bg-[#9747FF]" : "bg-primary-500";
  const badgeText = status === "draft" ? "Draft" : "Published";

  return (
    <div className="w-full h-[350px] bg-secondary-800 rounded-lg p-[11px]">
      <div className="w-full h-[330px] bg-secondary-700 rounded-lg flex flex-col">
        <div className="relative w-full h-[264px] rounded-lg bg-secondary-700 overflow-hidden">
          <img
            src={artworkImg}
            alt={title}
            className="w-1/2 h-full object-cover rounded-lg mx-auto"
          />

          {/* Status badge */}
          <div
            className={`absolute top-2 left-2 w-28 h-[24px] ${badgeColor} text-white text-xs font-medium rounded-full flex items-center justify-center`}
          >
            {badgeText}
          </div>
        </div>

        <div className="w-full h-[64px] bg-secondary-600 rounded-b-lg rounded-t-none flex items-center justify-between px-4">
          <h6 className="text-primary-500 font-semibold">{title}</h6>
          <button aria-label="Edit collection">
            <img
              src={editIcon}
              alt="Edit"
              className="w-5"
              onClick={() => navigate("/form")}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
