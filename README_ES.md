# ¿Quieres descubrir nueva música?

¡Estás en el lugar correcto!

https://musicdiscover.vercel.app/

### Cómo desplegar

1. Clona este repositorio

```bash
git clone https://github.com/Victorsitou/musicdiscover.git
cd musicdiscover
```

2. Instala las dependencias

```bash
npm install
```

3. Publícalo en Vercel y sigue las instrucciones

```bash
npx vercel
```

4. Crea una cuenta de [Spotify Developer](https://developer.spotify.com/) y crea una app para obtener tu `CLIENT_ID` y `CLIENT_SECRET`.

5. Añade las siguientes Redirect URIs a la configuración de tu app de Spotify:

```
https://tu-dominio-de-vercel/api/auth/callback/spotify
https://tu-dominio-de-vercel/api/auth/signin/spotify
```

6. Selecciona `Web API` como la API que usará la app.

7. Añade las siguientes variables de entorno a tu proyecto de Vercel y vuelve a desplegar:

```
SPOTIFY_CLIENT_ID=tu_client_id
SPOTIFY_CLIENT_SECRET=tu_client_secret
NEXTAUTH_SECRET=tu_nextauth_secret
```

8. ¡Disfruta descubriendo nueva música!
