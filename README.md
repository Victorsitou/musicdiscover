# Want to discover new music?

You're in the right place!

https://musicdiscover.vercel.app/

### Disclaimer

The [website](https://musicdiscover.vercel.app/) won't work if you try to use it because the Spotify app I'm using is not public. That means you won't be able to log in with your Spotify account. If you want to use it, you'll need to deploy your own version.

### How to deploy

1. Clone this repository

```bash
git clone https://github.com/Victorsitou/musicdiscover.git
cd musicdiscover
```

2. Install dependencies

```bash
npm install
```

3. Publish to Vercel and follow the instructions

```bash
npx vercel
```

4. Create a [Spotify Developer](https://developer.spotify.com/) account and create an app to get your `CLIENT_ID` and `CLIENT_SECRET`.

5. Add the following Redirect URIs to your Spotify app settings:

```
https://your-vercel-domain/api/auth/callback/spotify
https://your-vercel-domain/api/auth/signin/spotify
```

6. Select `Web API` as the API the app will use.

7. Add the following environment variables to your Vercel project and redeploy:

```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

8. Enjoy discovering new music!
