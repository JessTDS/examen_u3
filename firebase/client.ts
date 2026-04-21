// Importar las funciones necesarias de Firebase
import { getApp, getApps, initializeApp } from "firebase/app";
// getAuth -- da acceso a todo lo de autenticación
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./config";

// Evita inicializar Firebase más de una vez
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
