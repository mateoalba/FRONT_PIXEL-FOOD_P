import { Outlet } from "react-router-dom";

const ClienteLayout = () => {
  return (
    <div>
      <h2>Layout Cliente</h2>
      <Outlet />
    </div>
  );
};

export default ClienteLayout;
