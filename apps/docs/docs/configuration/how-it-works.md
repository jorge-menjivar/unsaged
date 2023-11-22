---
sidebar_position: 1
---

# How it Works

To make it easy to configure unSAGED, we use environment variables as the main configuration format. This allows anyone deploying unSAGED to Vercel to easily configure their instance of unSAGED without having to modify the source code.

When building locally, use `apps/unsaged/.env.local` to set your environment variables. When deploying to Vercel, use the Vercel dashboard to set your environment variables.

Also, set `apps/unsaged` as the [Root Directory](https://vercel.com/docs/deployments/configure-a-build#root-directory) in your Vercel project's settings.
