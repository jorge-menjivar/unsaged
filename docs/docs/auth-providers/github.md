# GitHub

To set up GitHub authentication, you need to [register a new OAuth application](https://github.com/settings/applications/new) in your GitHub settings.

In the github settings, the callback URL should be set to `http://localhost:3000/api/auth/callback/github`. Replace `http://localhost:3000` with your domain if you are running in production.

You can enable GitHub authentication by setting the following environment variables:

```sh
GITHUB_CLIENT_ID=xxxxxxxxxxxxx
GITHUB_CLIENT_SECRET=xxxxxxxxxxxxx
```
