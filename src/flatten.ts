import type { RouteDefinition } from './types.js';

/**
 * Flatten a nested route definition into a flat `{ 'dotted.key': '/path' }` map.
 * Useful for debugging, sitemap generation, or integration with tools that
 * expect a flat list of routes.
 *
 * @param routes - A nested route definition object
 * @param prefix - Internal prefix for recursion (leave empty)
 * @returns A flat Record mapping dotted keys to route pattern strings
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
 *   flattenRoutes(routes)
 *   // → {
 *   //     'home': '/',
 *   //     'blog.root': '/blog',
 *   //     'blog.post': '/blog/:slug',
 *   //   }
 */
export function flattenRoutes(
  routes: Record<string, RouteDefinition>,
  prefix = '',
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(routes)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenRoutes(value as Record<string, RouteDefinition>, fullKey));
    }
  }

  return result;
}
