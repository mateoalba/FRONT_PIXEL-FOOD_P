import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { Mail, Lock, LogIn, User, Phone, MapPin } from "lucide-react"; 
import { FaTiktok, FaInstagram, FaFacebookF } from "react-icons/fa";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
    direccion: "",
    contrasena: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await axios.post("/auth/login", {
          correo: form.correo,
          contrasena: form.contrasena,
        });

        login({
          user: res.data.user,
          token: res.data.access_token,
        });

        navigate("/home", { replace: true });
      } else {
        await axios.post("/usuario", form);
        setIsLogin(true);
        setError("¡Registro exitoso! Ya puedes ingresar.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E53935] flex items-center justify-center p-6 pixel-font">
      <div className="w-full max-w-7xl bg-[#E53935] p-0 border-4 border-black shadow-[20px_20px_0px_#000]">
        <div className="bg-white border-4 border-black grid md:grid-cols-2">

          {/* IZQUIERDA - FORMULARIO */}
          <div className="p-16 border-r-4 border-black flex flex-col justify-center">
            <h1 className="font-pixel text-3xl mb-4">{isLogin ? "Ingresar" : "Registrarse"}</h1>
            <p className="text-xs mb-6 text-gray-600">
              {isLogin ? "ACCEDE A TU CUENTA" : "CREA TU CUENTA PARA EMPEZAR"}
            </p>

            {error && (
              <div className="mb-4 border-2 border-black bg-yellow-200 p-2 text-[10px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] block mb-1">NOMBRE</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input name="nombre" placeholder="Nombre" onChange={handleChange} className="w-full border-4 border-black pl-10 py-2 text-xs" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] block mb-1">APELLIDO</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input name="apellido" placeholder="Apellido" onChange={handleChange} className="w-full border-4 border-black pl-10 py-2 text-xs" required />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-[10px] block mb-2">CORREO ELECTRÓNICO</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                  <input
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    className="w-full border-4 border-black pl-10 py-3 text-xs"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <>
                 <div>
                   <label className="text-[10px] block mb-2">TELÉFONO</label>
                   <div className="relative">
                     <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                     <input name="telefono" onChange={handleChange} className="w-full border-4 border-black pl-10 py-3 text-xs" required />
                   </div>
                 </div>

                 <div>
                   <label className="text-[10px] block mb-2">DIRECCIÓN</label>
                   <div className="relative">
                     <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                     <input name="direccion" onChange={handleChange} className="w-full border-4 border-black pl-10 py-3 text-xs" required />
                   </div>
                 </div>
                </>
              )}

              <div>
                <label className="text-[10px] block mb-2">CONTRASEÑA</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                  <input
                    type="password"
                    name="contrasena"
                    value={form.contrasena}
                    onChange={handleChange}
                    className="w-full border-4 border-black pl-10 py-3 text-xs"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E53935] text-white border-4 border-black py-3 flex items-center justify-center gap-2 shadow-[6px_6px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "PROCESANDO..." : (isLogin ? "INGRESAR" : "REGISTRARSE")}
              </button>
            </form>

            <div className="flex items-center my-6 gap-4">
              <div className="flex-1 h-1 bg-black"></div>
              <div className="w-2 h-2 border-2 border-black rounded-full"></div>
              <div className="flex-1 h-1 bg-black"></div>
            </div>

            <button className="w-full border-4 border-black py-3 text-xs flex items-center justify-center gap-3 shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" />
              CONTINUAR CON GOOGLE
            </button>

            <p 
              className="mt-6 text-center text-[10px] text-[#E53935] cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "¿NO TIENES CUENTA? REGÍSTRATE" : "¿YA TIENES CUENTA? INGRESA"}
            </p>
          </div>

          {/* DERECHA - BANNER (Iconos ajustados) */}
          <div className="bg-[#FBC02D] p-16 flex flex-col justify-center items-center relative text-center">
            <div className="w-24 h-24 bg-[#E53935] border-4 border-black mb-8 shadow-[6px_6px_0px_#000] flex items-center justify-center">
              <div className="bg-white border-2 border-black w-10 h-10 flex items-center justify-center">
                ▢▢
              </div>
            </div>

            <h2 className="text-2xl mb-4">Bienvenido a</h2>
            <h1 className="text-5xl text-[#E53935] mb-8 font-bold">PIXEL-FOOD</h1>
            {/* Aumentado mb-10 a mb-20 para bajar los iconos */}
            <p className="text-ms mb-20">TU FAST FOOD DIGITAL</p>

            {/* Contenedores aumentados de w-14 a w-20 e iconos de text-xl a text-3xl */}
            <div className="flex gap-6">
              <a href="https://www.tiktok.com" target="_blank" className="w-20 h-20 bg-[#E53935] border-4 border-black shadow-[6px_6px_0px_#000] flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <FaTiktok className="text-white text-3xl" />
              </a>
              <a href="https://www.instagram.com" target="_blank" className="w-20 h-20 bg-white border-4 border-black shadow-[6px_6px_0px_#000] flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <FaInstagram className="text-black text-3xl" />
              </a>
              <a href="https://www.facebook.com" target="_blank" className="w-20 h-20 bg-[#1877F2] border-4 border-black shadow-[6px_6px_0px_#000] flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all cursor-pointer">
                <FaFacebookF className="text-white text-3xl" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginRegister;