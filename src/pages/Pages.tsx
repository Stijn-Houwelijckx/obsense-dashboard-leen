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
import Settings from "./Settings";
import UpdateCollection from "./UpdateCollection";

const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/artworks" element={<Artworks />} />
          <Route path="/upload" element={<ArtworkUpload />} />
          <Route path="/artwork" element={<ArtworkForm />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/choose" element={<CreateCollection />} />
          <Route path="/edit" element={<UpdateCollection />} />
          <Route path="/settings" element={<Settings />} />
          <Route
            path="/create"
            element={
              <CollectionForm
              // mode="tour"
              // onCancel={() => console.log("Cancel clicked")}
              // onNext={() => console.log("Next clicked")}
              />
            }
          />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;
