import type { ExtractParams, RouteParams, QueryParams, GenerateArgs } from './types.js';

/**
 * Generate a URL by substituting `:param` segments and optionally appending
 * a query string. Fully type-safe — TypeScript enforces that all required
 * parameters are provided.
 *
 * @param route  - A route pattern string (e.g. '/users/:id')
 * @param params - An object mapping parameter names to values
 * @param query  - Optional query string parameters
 * @returns The generated URL string
 *
 * @throws {Error} If a required parameter is missing
 *
 * @example
 *   generateRoute('/blog/posts/:id', { id: 42 })
 *   // → '/blog/posts/42'
 *
 * @example
 *   generateRoute('/users/:userId/posts/:postId', { userId: 5, postId: 99 })
 *   // → '/users/5/posts/99'
 *
 * @example
 *   generateRoute('/blog/posts/:id', { id: 42 }, { tab: 'comments', page: 2 })
 *   // → '/blog/posts/42?tab=comments&page=2'
 *
 * @example
 *   // Static routes — no params required
 *   generateRoute('/login')
 *   // → '/login'
 */
export function generateRoute<T extends string>(
  route: T,
  ...args: GenerateArgs<T>
): string {
  const [params, query] = args as [
    Record<string, string | number> | undefined,
    QueryParams | undefined,
  ];

  let result: string = route;

  // Substitute :param segments
  if (route.includes(':')) {
    result = route.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, key: string) => {
      if (!params) {
        throw new Error(
          `Missing required route parameter: "${key}" for route "${route}"`
        );
      }
      const value = params[key];
      if (value === undefined || value === null) {
        throw new Error(
          `Missing required route parameter: "${key}" for route "${route}"`
        );
      }
      return encodeURIComponent(String(value));
    });
  }

  // Append query string
  if (query) {
    const entries = Object.entries(query).filter(
      (entry): entry is [string, string | number | boolean] =>
        entry[1] !== undefined
    );

    if (entries.length > 0) {
      const qs = entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      result += `?${qs}`;
    }
  }

  return result;
}
