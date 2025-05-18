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
    <div className="w-[303px] h-[350px] bg-secondary-800 rounded-lg p-[11px]">
      <div className="w-[280px] h-[330px] bg-secondary-700 rounded-lg flex flex-col">
        <div className="relative w-[280px] h-[264px] rounded-lg bg-secondary-700 overflow-hidden">
          <img
            src={artworkImg}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Status badge */}
          <div
            className={`absolute top-2 left-2 w-[88px] h-[24px] ${badgeColor} text-white text-xs font-medium rounded-full flex items-center justify-center`}
          >
            {badgeText}
          </div>
        </div>

        <div className="w-[280px] h-[64px] bg-secondary-600 rounded-b-lg rounded-t-none flex items-center justify-between px-4">
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
