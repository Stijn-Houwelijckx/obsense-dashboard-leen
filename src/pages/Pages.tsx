import { BrowserRouter, Route, Routes } from "react-router-dom";

import RequireAuth from "../components/RequireAuth";

import Dashboard from "./Dashboard";
import Home from "./Home";
import NotFound from "./NotFound";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Artworks from "./Artworks";
import ArtworkUpload from "./ArtworkUpload";
import ArtworkForm from "./ArtworkForm";
import Collections from "./Collections";
import CreateCollection from "./CreateCollection";
import CollectionForm from "./CollectionForm";

const Pages = () => {
  return (
    <BrowserRouter>
      {/* <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/artworks" element={<Artworks />} />
        <Route path="/upload" element={<ArtworkUpload />} />
        <Route path="/artworkform" element={<ArtworkForm />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/create" element={<CreateCollection />} />
        <Route
          path="/form"
          element={
            <CollectionForm
              mode="tour" // of "expo"
              onCancel={() => console.log("Cancel clicked")}
              onNext={() => console.log("Next clicked")}
            />
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;
