import { BrowserRouter, Route, Routes } from "react-router-dom";

import RequireAuth from "../components/RequireAuth";

import Dashboard from "./Dashboard";
import Home from "./Home";
import NotFound from "./NotFound";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Pages;
