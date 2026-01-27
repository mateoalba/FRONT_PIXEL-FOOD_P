import { Routes, Route, Navigate, useParams } from "react-router-dom";
import ResumenDashboard from "../pages/ResumenDashboard"; 

// Páginas existentes
import Categorias from "../pages/Categorias"; 
import Sucursales from "../pages/Sucursales";
import Mesas from "../pages/Mesas";
import Usuarios from "@/pages/Usuarios";
import Home from "@/pages/Home"; 
import RoleRoute from "@/auth/RoleRoute";
import AdminLayout from "@/layouts/AdminLayout";
import MainLayout from "@/layouts/MainLayout"; 
import PrivateRoute from "@/auth/PrivateRoute";
import Register from "@/auth/Register";
import Login from "@/auth/Login";
import Ingredientes from "@/pages/Ingredientes";
import Platos from "@/pages/Platos";
import Recetas from "@/pages/Recetas";
import Pedidos from "@/pages/Pedidos";
import Facturas from "@/pages/Facturas";
import DetallePedido from "@/pages/DetallePedido";
import PagoPage from "@/pages/PagoPage"; 
import MetodoPagos from "@/pages/MetodoPagos"; 
import Reservas from "@/pages/Reservas"; 
import AdminReservas from "@/pages/AdminReservas";
import MenuPage from "@/pages/MenuPage";
import { useState } from "react";

// Wrapper para Detalle de Pedido
const DetallePedidoWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <DetallePedido idPedido={id || ''} estadoPedido="PENDIENTE" />;
};

const AppRoutes = () => {
  // Estado simple para el carrito (puedes moverlo a un Context si prefieres)
  const [cart, setCart] = useState<any[]>([]);

  return (
    <Routes>
      {/* 1. RUTAS PÚBLICAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2. RUTAS PRIVADAS */}
      <Route element={<PrivateRoute />}>
        
        {/* --- RUTA DE PAGO UNIVERSAL --- 
            Ubicada aquí para que Admin, Empleado y Cliente puedan entrar 
            sin ser rebotados por permisos de 'AdminLayout' */}
        <Route path="/caja/:id" element={<PagoPage />} />
        
        {/* --- VISTAS DE CLIENTE (MainLayout) --- */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* NUEVA RUTA DEL MENÚ PÚBLICO */}
          <Route 
            path="/menu" 
            element={
              <MenuPage 
                onNavigate={(page) => console.log("Navegar a:", page)} 
                cart={cart} 
                setCart={setCart} 
              />
            } 
          />



          <Route path="reservas" element={<Reservas />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="mis-pedidos" element={<Facturas />} />
          <Route path="caja" element={<PagoPage />} />
        </Route>

        {/* --- VISTAS DE ADMINISTRACIÓN / STAFF --- */}
        <Route element={<RoleRoute roles={["Administrador", "Empleado"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ResumenDashboard />} /> 

            {/* Gestión de Reservas */}
            <Route element={<RoleRoute permisos={["ver_reservas"]} />}>
              <Route path="reservas" element={<AdminReservas />} />
            </Route>

            {/* Mantenimiento */}
            <Route element={<RoleRoute permisos={["ver_categorias"]} />}>
              <Route path="categorias" element={<Categorias />} />
            </Route>

            <Route element={<RoleRoute permisos={["ver_sucursales"]} />}>
              <Route path="sucursales" element={<Sucursales />} />
            </Route>

            <Route element={<RoleRoute permisos={["ver_mesas"]} />}>
              <Route path="mesas" element={<Mesas />} />
            </Route>

            <Route element={<RoleRoute permisos={["ver_metodos_pago"]} />}>
              <Route path="metodos-pago" element={<MetodoPagos />} />
            </Route>

            {/* Cocina e Inventario */}
            <Route element={<RoleRoute permisos={["ver_ingredientes"]} />}>
              <Route path="ingredientes" element={<Ingredientes />} />
            </Route>

            <Route element={<RoleRoute permisos={["ver_platos"]} />}>
              <Route path="platos" element={<Platos />} />
            </Route>

            <Route element={<RoleRoute permisos={["ver_recetas"]} />}>
              <Route path="recetas" element={<Recetas />} />
            </Route>

            {/* Ventas y Pedidos */}
            <Route element={<RoleRoute permisos={["ver_pedidos"]} />}>
              <Route path="pedidos" element={<Pedidos />} />
            </Route>

            <Route element={<RoleRoute permisos={["ver_facturas"]} />}>
              <Route path="facturas" element={<Facturas />} />
            </Route>

            {/* Usuarios */}
            <Route element={<RoleRoute permisos={["gestionar_usuarios"]} />}>
              <Route path="usuarios" element={<Usuarios />} />
            </Route>

            {/* Detalles dinámicos */}
            <Route element={<RoleRoute permisos={["ver_detalles_pedidos"]} />}>
              <Route path="pedidos/:id/detalle" element={<DetallePedidoWrapper />} />
            </Route>
          </Route>
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;