// Página donde se maneja el inicio de sesión con Spotify (por ejemplo, pages/login.js)
"use client";

import { signIn } from 'next-auth/react';

export default function LoginPage() {
  return (
    <div>
      <h1>Iniciar sesión con Spotify</h1>
      <button onClick={() => signIn("spotify")}>Iniciar sesión con Spotify</button>
    </div>
  );
}
