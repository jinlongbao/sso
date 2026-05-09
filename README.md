# Willin SSO

**Premium, Tech-Forward Open Source IDaaS System**

Built with Hono.js & SvelteKit. Featuring a modern glassmorphic UI and high-performance Cloudflare native architecture.

[![GitHub Repo stars](https://img.shields.io/github/stars/willin/sso?style=social)](https://github.com/willin/sso)
[![License](https://img.shields.io/github/license/willin/sso)](LICENSE)

---

## ✨ Features

- 🌑 **Premium Dark Mode**: Modern, high-contrast UI with glassmorphism and smooth transitions.
- ⚡ **High Performance**: Built on Cloudflare Workers, D1, and KV for global low-latency.
- 🌍 **Internationalization**: Full support for Chinese and English.
- 🔐 **OAuth2/OIDC Ready**: Easily integrate with any application using standard protocols.
- 🛠️ **Multi-Tenant Management**: Manage multiple applications and users from a single dashboard.
- 🔌 **Extensible Auth**: Built-in support for GitHub, Alipay, and Afdian.

---

## 🚀 Quick Start

### Prerequisites

- Cloudflare Account
- D1 Database & KV Namespace
- Bun (Recommended runtime)

### Local Development

1. **Clone & Install**
   ```bash
   git clone https://github.com/willin/sso.git
   cd sso
   bun install
   ```

2. **Environment Configuration**
   Create `apps/website/.dev.vars`:
   ```bash
   SESSION_SECRET=your-secret
   GITHUB_ID=...
   GITHUB_SECRET=...
   # See more in .dev.vars.example
   ```

3. **Database Initialization**
   ```bash
   cd apps/website
   npx wrangler d1 migrations apply sso --local
   ```

4. **Build & Dev**
   ```bash
   # From root
   bun run dev
   ```

---

## 📦 Project Structure

- `apps/website`: SvelteKit frontend and Hono backend.
- `packages/*`: Reusable auth providers and utilities.

---

## 🛠️ Deployment

1. Set up your Cloudflare environment variables.
2. Build the production bundle:
   ```bash
   cd apps/website
   bun x vite build
   ```
3. Deploy via Wrangler or GitHub Actions.

---

## 📄 License

Apache-2.0

Made with ❤️ by [Willin Wang](https://willin.wang)
