import type { ExtractParams } from './types.js';

/**
 * Test whether a pathname matches a route pattern and extract parameter values.
 * Returns an object of extracted params on match, or `null` on mismatch.
 *
 * @param pattern  - A route pattern string (e.g. '/users/:id')
 * @param pathname - The actual URL pathname to test
 * @returns Extracted parameters, or null if no match
 *
 * @example
 *   matchRoute('/blog/posts/:id', '/blog/posts/42')
 *   // → { id: '42' }
 *
 * @example
 *   matchRoute('/users/:userId/posts/:postId', '/users/5/posts/99')
 *   // → { userId: '5', postId: '99' }
 *
 * @example
 *   matchRoute('/blog/posts/:id', '/login')
 *   // → null
 *
 * @example
 *   // Query strings are stripped before matching
 *   matchRoute('/blog/posts/:id', '/blog/posts/42?tab=comments')
 *   // → { id: '42' }
 */
export function matchRoute<T extends string>(
  pattern: T,
  pathname: string,
): Record<ExtractParams<T>, string> | null {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('?')[0].split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith(':')) {
      params[patternPart.slice(1)] = decodeURIComponent(pathPart);
    } else if (patternPart !== pathPart) {
      return null;
    }
  }

  return params as Record<ExtractParams<T>, string>;
}
