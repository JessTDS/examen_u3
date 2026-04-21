"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

// Tipo de dato que representa al usuario autenticado
type AuthUser = {
  email: string;
};

// Función que valida que el correo tenga formato válido (que tenga @ y .)
function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  // Estados del formulario
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  // Cambia el texto del botón según si está cargando o no
  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    // Evita que la página se recargue al hacer clic en el botón
    event.preventDefault();

    // Limpia cualquier error anterior
    setError("");

    // Valida que los campos no estén vacíos
    if (!correo || !contrasena) {
      setError("Por favor completa todos los campos.");
      return;
    }

    // Valida que el correo tenga formato válido
    if (!esCorreoValido(correo)) {
      setError("El formato del correo no es válido.");
      return;
    }

    // Activa el estado de carga
    setCargando(true);

    try {
      // Configura si la sesión se recuerda o no según el checkbox
      await configurarPersistencia(recordarme);

      // Manda el correo y contraseña a Firebase para verificar
      const resultado = await autenticarUsuario(correo, contrasena);

      // Si Firebase dice que está bien, guarda el usuario en el estado
      setUsuario({ email: resultado.user.email ?? "" });

    } catch {
      // Si algo sale mal muestra el error en pantalla
      setError("No fue posible iniciar sesión.");
    } finally {
      // Siempre al final apaga el estado de carga
      setCargando(false);
    }
  }

  async function salir() {
    // Le dice a Firebase que cierre la sesión
    await cerrarSesionUsuario();

    // Limpia el usuario del estado para volver a mostrar el formulario
    setUsuario(null);

    // Limpia el formulario
    setCorreo("");
    setContrasena("");
    setError("");
    setRecordarme(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-gray-100">
      {/* bg-gray-100 → fondo gris clarito de toda la pantalla */}

      <section className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* bg-white → tarjeta blanca */}
        {/* rounded-2xl → bordes redondeados */}
        {/* shadow-lg → sombra para que se vea elevada */}
        {/* p-8 → espacio interior */}

        <div className="mb-6 text-center">
          {/* mb-6 → margen abajo, text-center → texto centrado */}
          <h1 className="text-2xl font-bold text-gray-800">Acceso escolar</h1>
          <p className="text-sm text-gray-500 mt-1">Completa la funcionalidad de inicio de sesión.</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="flex flex-col gap-4">
            {/* flex flex-col → apila los campos uno abajo del otro */}
            {/* gap-4 → espacio entre cada campo */}

            <div className="flex flex-col gap-1">
              <label htmlFor="correo" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              {/* border → borde gris, focus:border-blue-500 → azul al hacer clic */}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="contrasena" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              {/* flex items-center → checkbox y texto alineados */}
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="accent-blue-600"
              />
              {/* accent-blue-600 → checkbox azul */}
              Recordarme
            </label>

            {error ? (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg px-3 py-2">
                {/* bg-red-50 → fondo rojo suave, text-red-600 → texto rojo */}
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg py-2 text-sm transition-colors"
            >
              {/* bg-blue-600 → botón azul */}
              {/* hover:bg-blue-700 → azul más oscuro al pasar el mouse */}
              {/* disabled:bg-gray-400 → gris cuando está cargando */}
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">

            <div className="bg-green-50 border border-green-300 rounded-lg p-4 text-center">
              {/* bg-green-50 → fondo verde suave para el éxito */}
              <p className="text-sm text-green-600">Inicio de sesión correcto</p>
              <h2 className="text-lg font-bold text-gray-800 mt-1">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            <button
              type="button"
              onClick={salir}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2 text-sm transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
