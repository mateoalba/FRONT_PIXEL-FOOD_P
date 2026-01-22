import { Routes, Route, Navigate, useParams } from "react-router-dom";
import Categorias from "../pages/Categorias"; 
import Sucursales from "../pages/Sucursales";
import Mesas from "../pages/Mesas";
import Usuarios from "@/pages/Usuarios";
import Home from "@/pages/Home"; 
import RoleRoute from "@/auth/RoleRoute";
import AdminLayout from "@/layouts/AdminLayout";
import PrivateRoute from "@/auth/PrivateRoute";
import Register from "@/auth/Register";
import Login from "@/auth/Login";
import Ingredientes from "@/pages/Ingredientes";
import Platos from "@/pages/Platos";
import Recetas from "@/pages/Recetas";
import Pedidos from "@/pages/Pedidos";
import Facturas from "@/pages/Facturas";
import DetallePedido from "@/pages/DetallePedido";

/**
 * ✅ COMPONENTE WRAPPER
 * Este componente captura el ":id" de la URL y se lo inyecta a DetallePedido
 * como la prop "idPedido" que el componente está esperando.
 */
const DetallePedidoWrapper = () => {
  const { id } = useParams<{ id: string }>();
  // Pasamos el id de la URL a la prop idPedido
  // El estado lo ponemos 'PENDIENTE' por defecto para habilitar el botón de agregar
  return <DetallePedido idPedido={id || ''} estadoPedido="PENDIENTE" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. Rutas Protegidas */}
      <Route element={<PrivateRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/home" element={<Home />} />
          
          <Route index element={<Navigate to="/home" replace />} />

          <Route element={<RoleRoute permisos={["ver_categorias"]} />}>
            <Route path="categorias" element={<Categorias />} />
          </Route>

          <Route element={<RoleRoute permisos={["ver_sucursales"]} />}>
            <Route path="sucursales" element={<Sucursales />} />
          </Route>

          <Route element={<RoleRoute permisos={["ver_mesas"]} />}>
            <Route path="mesas" element={<Mesas />} />
          </Route>

          <Route element={<RoleRoute permisos={["ver_ingredientes"]} />}>
            <Route path="ingredientes" element={<Ingredientes />} />
          </Route>

          <Route element={<RoleRoute permisos={["ver_platos"]} />}>
            <Route path="platos" element={<Platos />} />
          </Route>

          <Route element={<RoleRoute permisos={["ver_recetas"]} />}>
            <Route path="recetas" element={<Recetas />} />
          </Route>

          <Route element={<RoleRoute permisos={["ver_pedidos"]} />}>
            <Route path="pedidos" element={<Pedidos />} />
          </Route>

          <Route element={<RoleRoute permisos={["ver_facturas"]} />}>
            <Route path="facturas" element={<Facturas />} />
          </Route>

          {/* ✅ RUTA DE DETALLES ACTUALIZADA 
              Usamos el Wrapper para evitar errores de propiedades faltantes y asegurar la navegación.
          */} 
          <Route element={<RoleRoute permisos={["ver_detalles_pedidos"]} />}>
            <Route path="pedidos/:id/detalle" element={<DetallePedidoWrapper />} />
          </Route>

          <Route element={<RoleRoute permisos={["gestionar_usuarios"]} />}>
            <Route path="usuarios" element={<Usuarios />} />
          </Route>

        </Route>
      </Route>

      {/* 3. Si no existe la ruta, al login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;