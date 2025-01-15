# Spotify Recently Played

Display your recently played Spotify tracks on your GitHub profile README. Powered by [Vercel](https://vercel.com).

## Getting Started

Click the button below to connect your Spotify account with the Vercel app. This is needed to access your recently played tracks.

> [!NOTE]
> By authorizing the app, you agree to have your Spotify username, access token, and refresh token stored on a secure database. This is required so you only need to authorize once and the app can automatically refresh access tokens in order to retrieve recent tracks.
>
> You can revoke the app at [Spotify Apps](https://www.spotify.com/account/apps).

### Custom track count

To a custom number of tracks, pass the query parameter `count` and set it to the number of tracks to display.

> Default: `7`\
> Min: `1`\
> Max: `15`

### Custom card width

To set a custom card width, pass the query parameter `width` and set it to the desired width in px.

> Default: `490`\
> Min: `490`\
> Max: `1000`

### Unique tracks

To show only unique tracks of the recently played list, pass the `unique` query parameter and set it to `true`

> Default: `false`

## Deploying own Vercel instance

Deploy your own Vercel instance using the link above. Next, set the following environment variables:

| Name                       | Description                                   |
| -------------------------- | --------------------------------------------- |
| `VITE_SPOTIFY_CLIENT_ID` | Client ID of the Spotify application|
| `VITE_SPOTIFY_CLIENT_SECRET`     | Client Secret of the Spotify application|
| `VITE_SPOTIFY_REDIRECT_URI`    | Redirect URI (callback) after Spotify authentication                         |
| `VITE_FIREBASE_API_KEY`            | API Key for the Firebase project|
| `VITE_FIREBASE_AUTH_DOMAIN`      | Domain used for Firebase Authentication|
| `VITE_FIREBASE_PROJECT_ID` |	Firebase project ID|
| `VITE_FIREBASE_STORAGE_BUCKET`    | Firebase Storage Bucket URL|
| `VITE_FIREBASE_MESSAGING_SENDER_ID`    | Sender ID for Firebase Cloud Messaging|
| `VITE_FIREBASE_APP_ID`               |Firebase App ID|
|`VITE_FIREBASE_MEASUREMENT_ID`|Measurement ID for Firebase Analytics (if applicable)
|

## Running locally

1. Clone Git repo
   ```sh
   $ git clone https://github.com/MegumiKatou02/spotify-recently-played.git
   ```
2. Install Node dependencies
   ```sh
   $ npm install
   ```
3. Create `.env` file containing required environment variables:
   ```sh
    VITE_SPOTIFY_CLIENT_ID=
    VITE_SPOTIFY_CLIENT_SECRET=
    VITE_SPOTIFY_REDIRECT_URI = 

    VITE_FIREBASE_API_KEY=
    VITE_FIREBASE_AUTH_DOMAIN=
    VITE_FIREBASE_PROJECT_ID=
    VITE_FIREBASE_STORAGE_BUCKET=
    VITE_FIREBASE_MESSAGING_SENDER_ID=
    VITE_FIREBASE_APP_ID=
    VITE_FIREBASE_MEASUREMENT_ID=
   ```
4. Run development server
   ```sh
   $ npm run dev
   ```

The app will be running at [http://localhost:5173](http://localhost:5173).

## License

[Apache-2.0](LICENSE)
