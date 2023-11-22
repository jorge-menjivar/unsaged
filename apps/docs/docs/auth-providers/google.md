# Google

To set up Google authentication, you will need to create a Google Cloud project. You will also need to create a Google OAuth 2.0 client ID and secret. You can do all of this from the [Google Cloud Console](https://console.cloud.google.com/).

In the cloud console, the callback URL should be set to `http://localhost:3000/api/auth/callback/google`. Replace `http://localhost:3000` with your domain if you are running in production.

You can enable Google authentication by setting the following environment variables:

```sh
GOOGLE_CLIENT_ID="xxxxxxxxxxxxxxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxx
```
