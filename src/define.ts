import type { DeepReadonly } from './types.js';

/**
 * Define your application's route map. This is an identity function that
 * provides two benefits:
 *
 * 1. **Deep freezes** the object at runtime (preventing accidental mutation)
 * 2. **Infers literal types** so TypeScript knows the exact string values
 *
 * @param routes - A nested object of route pattern strings
 * @returns The same object, deeply frozen, with literal types preserved
 *
 * @example
 *   const routes = defineRoutes({
 *     home: '/',
 *     blog: {
 *       root: '/blog',
 *       post: '/blog/:slug',
 *     },
 *   });
 *
 *   routes.blog.post  // type: '/blog/:slug'
 *   routes.home        // type: '/'
 */
export function defineRoutes<
  T extends { readonly [key: string]: string | T[keyof T] },
>(routes: T): DeepReadonly<T> {
  return deepFreeze(routes) as DeepReadonly<T>;
}

function deepFreeze<T extends object>(obj: T): T {
  Object.freeze(obj);

  for (const value of Object.values(obj)) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return obj;
}
