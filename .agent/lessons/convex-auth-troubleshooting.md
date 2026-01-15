# Convex Auth + Next.js 16 集成经验总结

> 记录于 2026-01-15，解决 SnipVault 项目中 Convex Auth Password 模式的多个问题

## 🎯 问题概述

在使用 Convex Auth 的 Password provider 时遇到以下问题：
1. 登录成功但前端无反应
2. 创建数据时 `userId` 格式不匹配 schema
3. 生产环境认证 400 错误

---

## 📌 问题 1：登录后前端无反应

### 症状
- Convex 日志显示 `auth:signIn` 成功
- 前端页面没有跳转，状态未更新

### 根因
Next.js 需要使用 **专用的 Convex Auth Next.js 组件**，而不是通用的 React 组件。

### 解决方案

**1. 修改 `src/components/convex-client-provider.tsx`**

```tsx
// ❌ 错误
import { ConvexAuthProvider } from "@convex-dev/auth/react";

// ✅ 正确
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    return (
        <ConvexAuthNextjsProvider client={convex}>
            {children}
        </ConvexAuthNextjsProvider>
    );
}
```

**2. 修改 `src/app/layout.tsx`**

```tsx
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

export default function RootLayout({ children }) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en">
                <body>
                    <ConvexClientProvider>
                        {children}
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    );
}
```

### 关键点
- 客户端使用 `ConvexAuthNextjsProvider`（来自 `@convex-dev/auth/nextjs`）
- 服务端使用 `ConvexAuthNextjsServerProvider`（来自 `@convex-dev/auth/nextjs/server`）
- 两个 Provider 必须正确嵌套

---

## 📌 问题 2：userId 格式不匹配

### 症状
```
Failed to insert or update a document in table "snippets" 
because it does not match the schema:
Path: .userId
Value: "k177hv23xbdcqwt4kq02x9kq4h7z8rq5|jh7eh5g08t804qj4n42fak2ct97z8a9a"
Validator: v.id("users")
```

### 根因
使用 `ctx.auth.getUserIdentity().subject` 获取的是认证 subject 字符串（格式：`providerId|subjectId`），而 schema 期望的是 Convex `users` 表的文档 ID。

### 解决方案

使用 Convex Auth 提供的 `getAuthUserId` 函数：

```typescript
// ❌ 错误
import { auth } from "./auth";

async function getAuthenticatedUserId(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    return identity.subject; // 返回的是 "providerId|subjectId" 格式
}

// ✅ 正确
import { getAuthUserId } from "@convex-dev/auth/server";

async function getAuthenticatedUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
        throw new Error("Not authenticated.");
    }
    return userId; // 返回的是真正的 Id<"users">
}
```

---

## 📌 问题 3：生产环境 400 错误

### 症状
```
api/auth: Failed to load resource: the server responded with a status of 400
```

### 根因
`auth.config.ts` 中的 `domain` 配置错误。对于 Convex Auth 内置的 providers（如 Password），domain 应该是 **Convex 的 site URL**（`.convex.site`），而不是你自己的网站域名。

### 解决方案

**1. 正确配置 `convex/auth.config.ts`**

```typescript
export default {
    providers: [
        {
            // ❌ 错误：使用自己的网站域名
            // domain: "https://your-website.com",
            
            // ✅ 正确：使用 Convex 的 site URL
            domain: process.env.AUTH_DOMAIN ?? process.env.CONVEX_SITE_URL,
            applicationID: "convex",
        },
    ],
};
```

**2. 设置生产环境变量**

```bash
# 使用 --prod 确保设置到生产环境
npx convex env set AUTH_DOMAIN https://YOUR-PROJECT.convex.site --prod
```

**3. 重新部署**

```bash
npx convex deploy --yes
```

### Convex Dashboard 验证
在 Convex Dashboard → Settings → Authentication 中，应该看到：
- Domain: `https://YOUR-PROJECT.convex.site`（不是你的网站域名）
- Application ID: `convex`
- Type: OIDC provider

---

## 📌 问题 4：开发环境 Convex 不同步

### 症状
修改 `convex/` 目录下的文件后，后端没有更新

### 根因
`pnpm dev` 只运行了 `next dev`，没有同时运行 `convex dev`

### 解决方案

更新 `package.json` 的 dev 脚本：

```json
{
  "scripts": {
    "dev": "concurrently \"next dev --turbopack\" \"convex dev\"",
    "build": "next build",
    "start": "next start"
  }
}
```

需要安装 `concurrently`：
```bash
pnpm add -D concurrently
```

---

## 🔧 完整配置清单

### 必需文件

| 文件 | 用途 |
|------|------|
| `convex/auth.ts` | 定义 Password provider |
| `convex/auth.config.ts` | OIDC 配置（domain 设为 Convex site URL）|
| `convex/schema.ts` | 包含 `...authTables` |
| `src/app/layout.tsx` | 包含 `ConvexAuthNextjsServerProvider` |
| `src/components/convex-client-provider.tsx` | 包含 `ConvexAuthNextjsProvider` |
| `src/middleware.ts` | 使用 `convexAuthNextjsMiddleware` |

### 必需环境变量（生产环境）

| 变量名 | 值示例 | 说明 |
|--------|--------|------|
| `AUTH_DOMAIN` | `https://xxx.convex.site` | Convex site URL |
| `NEXT_PUBLIC_CONVEX_URL` | `https://xxx.convex.cloud` | Convex cloud URL |

### 部署命令

```bash
# 部署 Convex 后端到生产
npx convex deploy --yes

# 设置生产环境变量
npx convex env set VARIABLE_NAME value --prod
```

---

## 📚 参考资料

- [Convex Auth 官方文档](https://labs.convex.dev/auth)
- [Convex Auth Password Provider](https://labs.convex.dev/auth/config/passwords)
- [Next.js Integration](https://labs.convex.dev/auth/setup/nextjs)
