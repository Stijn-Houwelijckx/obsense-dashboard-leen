import Navigation from "components/Navigation";
import NavigationDesktop from "components/NavigationDesktop";

const Home = () => {
  return (
    <>
      <div className="min-h-screen bg-secondary-900 pt-14 px-4 text-neutral-50 md:pl-[166px] md:pr-[74px]">
        <div className="flex items-center justify-between mb-10 w-full">
          <h1 className="text-2xl font-bold">Home</h1>
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
            <h4 className="w-1/4 text-left">Tour / Expo</h4>
            <h4 className="w-1/4 text-left">Times bought</h4>
            <h4 className="w-1/4 text-left">Likes</h4>
            <h4 className="w-1/4 text-left">Views</h4>
          </div>

          <div className="flex flex-col w-full text-sm">
            {[
              { title: "Christmas City", bought: 148, likes: 32, views: 158 },
              {
                title: "Halloween skeleton",
                bought: 148,
                likes: 32,
                views: 158,
              },
              { title: "Beach town", bought: 148, likes: 32, views: 158 },
            ].map((item, index, arr) => (
              <div key={item.title} className="py-4">
                <div className="flex w-full">
                  <div className="w-1/4 text-left">{item.title}</div>
                  <div className="w-1/4 text-left">{item.bought}</div>
                  <div className="w-1/4 text-left">{item.likes}</div>
                  <div className="w-1/4 text-left">{item.views}</div>
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
