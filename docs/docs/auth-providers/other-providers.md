# Other Providers

In general, you can use the same pattern for all supported authentication providers:

1. Create an account with the provider.
2. Create an app with the provider.
3. Configure the app with the appropriate callback URL.
4. Set the appropriate environment variables.

```sh
<PROVIDER>_CLIENT_ID=xxxxxxxxxxxxx
<PROVIDER>_CLIENT_SECRET=xxxxxxxxxxxxx
```

You may need to include the issuer environment variable for some providers:

```sh
<PROVIDER>_ISSUER=https://mydomain.us.myprovider.com
```

## Supported Providers

- APPLE
- AUTH0
- COGNITO
- DISCORD
- FACEBOOK
- GITHUB
- GITLAB
- GOOGLE
- OKTA
- REDDIT
- SALESFORCE
- SLACK
- SPOTIFY
- TWITCH
- TWITTER
