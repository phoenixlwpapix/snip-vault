# SnipVault 🗄️

A modern, reactive code snippet manager built with **Next.js 16**, **Tailwind CSS 4**, and **Convex** for real-time data synchronization.

## ✨ Features

- **⚡ Real-time Sync**: Snippets update instantly across all devices using Convex's reactive architecture
- **🔐 Secure Authentication**: Convex Auth with email/password (easily extendable to OAuth)
- **📋 One-Click Copy**: Copy any snippet to clipboard with visual feedback
- **🏷️ Category Management**: Organize snippets with custom categories
- **🌙 Dark Theme**: Beautiful dark mode with premium glassmorphism design
- **📱 Responsive**: Works seamlessly on desktop and mobile

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org) | React Framework (App Router) |
| [TypeScript](https://www.typescriptlang.org) | Type Safety |
| [Convex](https://convex.dev) | Backend Platform (Database + Functions) |
| [Convex Auth](https://labs.convex.dev/auth) | Authentication |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling (CSS-first config) |
| [Shadcn UI](https://ui.shadcn.com) | UI Components |
| [Lucide Icons](https://lucide.dev) | Icons |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone and install dependencies**
   ```bash
   cd snippet-vault
   pnpm install
   ```

2. **Set up Convex**
   ```bash
   # Login to Convex (creates account if needed)
   npx convex login

   # Initialize and start Convex dev server
   npx convex dev
   ```
   
   This will:
   - Create a new Convex project
   - Generate `.env.local` with your `NEXT_PUBLIC_CONVEX_URL`
   - Start syncing your schema and functions

3. **Configure Convex Auth**
   
   Run the auth initialization:
   ```bash
   npx @convex-dev/auth
   ```
   
   Then generate the JWT keys and set environment variables in Convex Dashboard:
   ```bash
   node -e "import('jose').then(async ({generateKeyPair, exportPKCS8, exportJWK}) => { const keys = await generateKeyPair('RS256', { extractable: true }); const privateKey = await exportPKCS8(keys.privateKey); const publicKey = await exportJWK(keys.publicKey); console.log('JWT_PRIVATE_KEY=\"' + privateKey.trimEnd().replace(/\\n/g, ' ') + '\"'); console.log('JWKS=' + JSON.stringify({ keys: [{ use: 'sig', ...publicKey }] })); })"
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
snippet-vault/
├── convex/                 # Convex backend
│   ├── schema.ts          # Database schema (authTables + snippets)
│   ├── auth.ts            # Auth configuration (Password provider)
│   ├── auth.config.ts     # Auth config
│   ├── http.ts            # HTTP routes for auth
│   └── snippets.ts        # CRUD mutations/queries
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Root layout with providers
│   │   ├── page.tsx       # Landing page
│   │   ├── (auth)/
│   │   │   └── sign-in/   # Sign in/up page
│   │   └── dashboard/     # Protected dashboard
│   ├── components/
│   │   ├── ui/            # Shadcn UI components
│   │   ├── convex-client-provider.tsx
│   │   ├── sign-in-form.tsx
│   │   ├── snippet-card.tsx
│   │   └── create-snippet-dialog.tsx
│   └── middleware.ts      # Route protection
└── ...
```

## 🔑 Key Concepts

### Real-time Data with Convex

The magic happens with `useQuery`:

```tsx
// This query AUTOMATICALLY updates when data changes!
const snippets = useQuery(api.snippets.list);
```

No manual refresh, no SWR, no React Query configuration needed. Convex handles all the real-time syncing automatically.

### Authentication Flow

1. Middleware (`src/middleware.ts`) protects `/dashboard` routes
2. `ConvexAuthProvider` wraps the app for auth state
3. `useAuthActions()` provides `signIn` and `signOut`
4. Backend functions use `ctx.auth.getUserIdentity()` for security

## 🎨 Customization

### Adding OAuth Providers

Edit `convex/auth.ts` to add GitHub, Google, etc:

```ts
import GitHub from "@convex-dev/auth/providers/GitHub";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, GitHub],
});
```

### Extending the Schema

Add new tables in `convex/schema.ts`:

```ts
const schema = defineSchema({
  ...authTables,
  snippets: defineTable({ /* ... */ }),
  // Add your tables here
  tags: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),
});
```

## 📜 License

MIT — feel free to use this as a starter for your own projects!

---

Built with ❤️ using [Convex](https://convex.dev), [Next.js](https://nextjs.org), and [Tailwind CSS](https://tailwindcss.com)
