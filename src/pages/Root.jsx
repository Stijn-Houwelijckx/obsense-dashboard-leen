import { NavLink, Outlet } from "react-router-dom";

function Root() {
  return (
    <>
      <div style={{ display: "flex", gap: "1rem" }}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/signup">Sign up</NavLink>
      </div>
      <Outlet />
    </>
  );
}

export default Root;
