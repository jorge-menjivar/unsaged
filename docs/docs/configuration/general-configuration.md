---
sidebar_position: 2
---

# General Configuration

## Environment Variables

### NEXT_PUBLIC_SUPABASE_URL

#### Description

The base url for your Supabase instance. This is a required environment variable.

#### Example

```sh
NEXT_PUBLIC_SUPABASE_URL=https://your_supabase_url.supabase.co
```

---

### NEXT_PUBLIC_SUPABASE_ANON_KEY

#### Description

The anonymous key for your Supabase instance. This is a required environment variable.

#### Example

```sh
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### SUPABASE_SERVICE_ROLE_KEY

#### Description

The service role key for your Supabase instance. This is a required environment variable.

#### Example

```sh
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

### SUPABASE_JWT_SECRET

#### Description

The JWT secret for your Supabase instance. This is a required environment variable.

#### Example

```sh
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

---

### NEXTAUTH_SECRET

#### Description

The secret used to encrypt cookies. This is a required environment variable.

#### Example

```sh
NEXTAUTH_SECRET=your_nextauth_secret
```

---

### NEXTAUTH_URL

#### Description

The base url for your app. This is a required environment variable when running in production.

#### Example

```sh
NEXTAUTH_URL=https://yourdomain.com
```

---

### NEXT_PUBLIC_DEFAULT_MODEL

#### Description

By default a new conversation keeps the same model as the last conversation in the list. This environment variable allows you to override this behavior and set a default model for new conversations.

#### Example

```sh
NEXT_PUBLIC_DEFAULT_MODEL=gpt-4
```

---

### NEXT_PUBLIC_DEBUG_MODE

#### Description

When set to `true` this environment variable enables debug mode. This will log environment variables and other debug information to the console.

#### Example

```sh
NEXT_PUBLIC_DEBUG_MODE=true
```
