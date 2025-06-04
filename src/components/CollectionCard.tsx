import artworkImg from "assets/img/artwork.png";
import editIcon from "assets/img/edit.svg";
import { useNavigate } from "react-router-dom";
import deleteIcon from "assets/img/delete.svg";

interface CollectionCardProps {
  _id: string;
  title: string;
  image: string;
  status: "draft" | "published";
  collectionId: string;
  onRequestDelete: (id: string) => void;
}

const CollectionCard = ({
  _id,
  title,
  image,
  status,
  onRequestDelete,
}: CollectionCardProps) => {
  const navigate = useNavigate();

  const badgeColor = status === "draft" ? "bg-[#9747FF]" : "bg-primary-500";
  const badgeText = status === "draft" ? "Draft" : "Published";

  return (
    <div className="w-full h-[350px] bg-secondary-800 rounded-lg p-[11px]">
      <div className="w-full h-[330px]  bg-secondary-700 rounded-lg flex flex-col">
        <div className="relative w-full h-[264px] rounded-lg bg-secondary-700 overflow-hidden">
          <img
            src={image || artworkImg}
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

          <div
            className={`absolute top-2 left-2 w-28 h-[24px] ${badgeColor} text-white font-text text-xs font-medium rounded-full flex items-center justify-center`}
          >
            {badgeText}
          </div>
        </div>

        <div className="w-full h-[64px] bg-secondary-600 rounded-b-lg rounded-t-none flex items-center justify-between px-4">
          <h6 className="text-primary-500 font-title font-semibold">{title}</h6>
          <button aria-label="Edit collection">
            <img
              src={editIcon}
              alt="Edit"
              className="w-5"
              onClick={() => {
                navigate("/edit", {
                  state: { collectionId: _id },
                });
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
