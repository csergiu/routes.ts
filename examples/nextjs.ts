// ============================================================================
// Example: Using routes.ts in a Next.js app
// ============================================================================
//
// 1. Create a routes.ts file in your lib/ or config/ directory
// 2. Import from there everywhere else
//

import { defineRoutes, generateRoute } from 'routes.ts';

// ---------------------------------------------------------------------------
// Step 1: Define all your routes in one place
// ---------------------------------------------------------------------------

export const routes = defineRoutes({
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  settings: {
    root: '/settings',
    profile: '/settings/profile',
    billing: '/settings/billing',
    notifications: '/settings/notifications',
  },
  blog: {
    root: '/blog',
    posts: {
      list: '/blog/posts',
      byId: '/blog/posts/:id',
      bySlug: '/blog/posts/:slug',
      category: '/blog/posts/category/:category',
    },
  },
  users: {
    list: '/users',
    profile: '/users/:userId',
    posts: '/users/:userId/posts/:postId',
  },
  api: {
    auth: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      refresh: '/api/auth/refresh',
    },
    users: {
      list: '/api/users',
      byId: '/api/users/:id',
    },
  },
} as const);

// ---------------------------------------------------------------------------
// Step 2: Use routes in components
// ---------------------------------------------------------------------------

// In a Next.js component:
//
//   import Link from 'next/link';
//   import { routes } from '@/lib/routes';
//   import { generateRoute } from 'routes.ts';
//
//   // Static link
//   <Link href={routes.login}>Sign In</Link>
//
//   // Dynamic link — TypeScript enforces { id: string | number }
//   <Link href={generateRoute(routes.blog.posts.byId, { id: post.id })}>
//     {post.title}
//   </Link>
//
//   // With query params
//   <Link href={generateRoute(routes.blog.posts.list, {}, { page: 2, sort: 'date' })}>
//     Page 2
//   </Link>

// ---------------------------------------------------------------------------
// Step 3: Use in router.push / router.replace
// ---------------------------------------------------------------------------

//   const router = useRouter();
//
//   // Navigate to a user's specific post
//   router.push(
//     generateRoute(routes.users.posts, { userId: 5, postId: 42 })
//   );
//
//   // Navigate with query string
//   router.push(
//     generateRoute(routes.dashboard, {}, { tab: 'analytics' })
//   );

// ---------------------------------------------------------------------------
// Step 4: Use in API calls
// ---------------------------------------------------------------------------

//   const res = await fetch(
//     generateRoute(routes.api.users.byId, { id: userId })
//   );

// ---------------------------------------------------------------------------
// Quick demo output
// ---------------------------------------------------------------------------

console.log('Static:  ', routes.login);
// → '/login'

console.log('Dynamic: ', generateRoute(routes.blog.posts.byId, { id: 42 }));
// → '/blog/posts/42'

console.log('Query:   ', generateRoute(routes.blog.posts.byId, { id: 42 }, { tab: 'comments' }));
// → '/blog/posts/42?tab=comments'

console.log('Multi:   ', generateRoute(routes.users.posts, { userId: 5, postId: 99 }));
// → '/users/5/posts/99'
