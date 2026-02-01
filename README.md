# routes.ts

[![npm version](https://badge.fury.io/js/routes.ts.svg)](https://badge.fury.io/js/routes.ts)

Zero-dependency, type-safe route management for TypeScript. Define your routes once, get type-checked URL generation, pattern matching, and route tree utilities for free.

Works with **any framework** — Next.js, Express, React Router, SvelteKit, or plain TypeScript.

## Install

```bash
npm install routes.ts
```

## Quick Start

```ts
import { defineRoutes, generateRoute } from 'routes.ts';

const routes = defineRoutes({
  home: '/',
  login: '/login',
  blog: {
    list: '/blog',
    post: '/blog/posts/:id',
  },
  users: {
    profile: '/users/:userId',
    posts: '/users/:userId/posts/:postId',
  },
} as const);

// Static routes — just reference directly
routes.login               // → '/login'

// Dynamic routes — TypeScript enforces the params
generateRoute(routes.blog.post, { id: 42 })
// → '/blog/posts/42'

generateRoute(routes.users.posts, { userId: 5, postId: 99 })
// → '/users/5/posts/99'

// With query strings
generateRoute(routes.blog.post, { id: 42 }, { tab: 'comments', page: 2 })
// → '/blog/posts/42?tab=comments&page=2'
```

## API

### `defineRoutes(routes)`

Wraps your route definition object with `as const` inference and deep-freezes it at runtime. This is the single source of truth for all your routes.

```ts
const routes = defineRoutes({
  home: '/',
  settings: {
    root: '/settings',
    profile: '/settings/profile',
  },
} as const);

routes.settings.profile  // type: '/settings/profile' (string literal, not just string)
routes.home = '/x';      // ❌ TypeError — object is frozen
```

### `generateRoute(pattern, params?, query?)`

Substitutes `:param` segments in a route pattern and optionally appends a query string. TypeScript infers which parameters are required from the pattern string.

```ts
// Single param — { id: string | number } is required
generateRoute('/blog/:id', { id: 42 })
// → '/blog/42'

// Multiple params
generateRoute('/users/:userId/posts/:postId', { userId: 5, postId: 99 })
// → '/users/5/posts/99'

// With query string
generateRoute('/blog/:id', { id: 42 }, { tab: 'comments' })
// → '/blog/42?tab=comments'

// Static route with query string
generateRoute('/search', {}, { q: 'hello', page: 1 })
// → '/search?q=hello&page=1'

// Missing params → runtime error
generateRoute('/blog/:id', {})
// ❌ Error: Missing required route parameter: "id"
```

**Type safety in action:**

```ts
// ✅ Compiles — all params present
generateRoute(routes.users.posts, { userId: 5, postId: 99 })

// ❌ TypeScript error — missing 'postId'
generateRoute(routes.users.posts, { userId: 5 })

// ❌ TypeScript error — 'oops' is not a valid param
generateRoute(routes.blog.post, { oops: 42 })
```

### `matchRoute(pattern, pathname)`

Tests whether a pathname matches a route pattern and extracts parameter values. Returns an object of params on match, or `null` on mismatch. Query strings are stripped before matching.

```ts
matchRoute('/blog/:id', '/blog/42')
// → { id: '42' }

matchRoute('/users/:userId/posts/:postId', '/users/5/posts/99')
// → { userId: '5', postId: '99' }

matchRoute('/blog/:id', '/login')
// → null

// Query strings are ignored
matchRoute('/blog/:id', '/blog/42?tab=comments')
// → { id: '42' }
```

### `flattenRoutes(routes)`

Flattens a nested route tree into a flat `Record<string, string>` using dot-notation keys. Useful for debugging, sitemap generation, or admin dashboards.

```ts
flattenRoutes({
  home: '/',
  blog: {
    list: '/blog',
    post: '/blog/:slug',
  },
})
// → {
//     'home': '/',
//     'blog.list': '/blog',
//     'blog.post': '/blog/:slug',
//   }
```

## Type Exports

All types are exported for use in your own code:

```ts
import type {
  ExtractParams,   // Extracts ':param' names as a union type
  RouteParams,     // Maps param names to { [name]: string | number }
  QueryParams,     // Record<string, string | number | boolean | undefined>
  DeepReadonly,    // Recursive Readonly<T>
  RouteDefinition, // string | nested object of strings
  GenerateArgs,    // Conditional arg types for generateRoute
} from 'routes.ts';

// Example: extract params from a route pattern
type Params = ExtractParams<'/users/:userId/posts/:postId'>;
// → 'userId' | 'postId'
```

## Framework Examples

### Next.js

```ts
// lib/routes.ts
import { defineRoutes } from 'routes.ts';

export const routes = defineRoutes({
  home: '/',
  blog: { post: '/blog/:slug' },
} as const);
```

```tsx
// components/PostLink.tsx
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { generateRoute } from 'routes.ts';

export function PostLink({ slug, title }: { slug: string; title: string }) {
  return (
    <Link href={generateRoute(routes.blog.post, { slug })}>
      {title}
    </Link>
  );
}
```

```ts
// In router.push
const router = useRouter();
router.push(generateRoute(routes.blog.post, { slug: 'hello-world' }));
```

### Express / Node.js

```ts
import express from 'express';
import { routes, generateRoute, matchRoute } from './routes';

const app = express();

app.get('*', (req, res) => {
  const match = matchRoute(routes.blog.post, req.path);
  if (match) {
    return res.json({ slug: match.slug });
  }
  res.status(404).json({ error: 'Not found' });
});
```

### API Calls

```ts
const url = generateRoute(routes.api.users.byId, { id: userId });
const res = await fetch(url);
```

## Design Decisions

**Why not auto-generate from the filesystem?**
Filesystem-based route scanners (like `nextjs-routes`) are clever but fragile — they break across Next.js versions, require build plugins, and add hidden complexity. A plain TypeScript object is explicit, grepable, and works in any framework.

**Why `:param` syntax?**
It's the most widely understood parameter syntax (Express, Fastify, React Router, etc.). TypeScript template literal types can extract parameter names directly from these strings, giving you full type safety with zero code generation.

**Why deep freeze?**
Routes are constants. Accidentally mutating `routes.home = '/oops'` in a middleware would be a nasty bug. Freezing catches this immediately.

## License

MIT
