import {
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "./client";

export async function configurarPersistencia(recordarme: boolean): Promise<void> {
  // Si recordarme es true -- guardamos sesión permanente (localStorage)
  // Si recordarme es false -- sesión temporal (se borra al cerrar navegador)
  if (recordarme) {
    await setPersistence(auth, browserLocalPersistence);
  } else {
    await setPersistence(auth, browserSessionPersistence);
  }
}

export async function autenticarUsuario(
  correo: string,
  contrasena: string,
): Promise<UserCredential> {
  // Se manda a Firebase el correo y contraseña que escribió el usuario
  // Firebase los verifica y si son correctos regresa los datos del usuario
  return await signInWithEmailAndPassword(auth, correo, contrasena);
}

export async function cerrarSesionUsuario(): Promise<void> {
  // Le dice a Firebase que cierre la sesión del usuario actual
  await signOut(auth);
}
