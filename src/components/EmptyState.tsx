import Rocket from "assets/img/rakket.svg";
import Button from "./Button";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <img src={Rocket} alt="Rocket" className="w-200 h-200 mb-3" />

      <h6 className="text-lg font-semibold text-neutral-50 mb-3">
        Upload your artwork
      </h6>

      <p className="text-sm text-neutral-50 mb-3">
        To use it in an exposition or tour.
      </p>

      <div className="w-40">
        <Button label="Upload" type="button" onClick={() => {}} />
      </div>
    </div>
  );
};

export default EmptyState;
