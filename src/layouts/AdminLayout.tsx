import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div>
      <h1>Panel Administrador</h1>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
