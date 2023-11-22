# Auth0

You can use Auth0 as an authentication provider for your app. Create an Auth0 account and follow the instructions below to set up Auth0 authentication.

The callback URL should be set to `http://localhost:3000/api/auth/callback/auth0`. Replace `http://localhost:3000` with your domain if you are running in production.

You can enable Auth0 authentication by setting the following environment variables:

```sh
AUTH0_CLIENT_ID=xxxxxxxxxxxxx
AUTH0_CLIENT_SECRET=xxxxxxxxxxxxx
AUTH0_ISSUER=https://mydomain.us.auth0.com
```
