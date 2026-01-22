import { Outlet } from "react-router-dom";

const EmpleadoLayout = () => {
  return (
    <div>
      <h2>Layout Empleado</h2>
      <Outlet />
    </div>
  );
};

export default EmpleadoLayout;
