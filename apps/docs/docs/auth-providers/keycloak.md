# Keycloak

To set up Keycloak authentication, you will need to create a "client" in your Keycloak installation. See [NextAuth keycloak module documentation](https://next-auth.js.org/providers/keycloak) and [keycloak documentation](https://www.keycloak.org/docs/latest/server_admin/#_oidc_clients)

You can enable Keycloak authentication by setting the following environment variables:

```sh
KEYCLOAK_ID=xxxx
KEYCLOAK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
KEYCLOAK_ISSUER=https://keycloakhost/auth/realms/yourrealm
```
