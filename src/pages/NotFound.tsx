import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-secondary-900 px-4 text-center overflow-hidden">
      <h1 className="text-[156px] lg:text-[520px] font-title font-bold text-primary-500 opacity-20 leading-none z-0 mb-4">
        404
      </h1>

      <img
        src="src/assets/img/404.png"
        alt="404 Graphic"
        className="absolute w-64 lg:w-[280px] top-[4%] lg:top-[20%] z-10"
      />

      <div className="z-20 mt-4 lg:mt-[-40px]">
        <h4 className="text-[18px] font-title lg:text-[28px] text-neutral-50 font-bold mb-2">
          Oops, seems you’ve wandered too far!
        </h4>
        <p className="text-neutral-300 font-text text-sm lg:text-base mb-8 max-w-[360px] lg:max-w-[420px] mx-auto">
          This page does not exist. Let’s get you back on track.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary-500 font-text hover:bg-primary-600 text-neutral-950 font-semibold px-6 py-2 rounded-xl transition w-[300px] lg:w-[320px]"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
