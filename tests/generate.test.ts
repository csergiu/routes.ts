import { describe, it, expect } from 'vitest';
import { generateRoute } from '../src/generate.js';

describe('generateRoute', () => {
  describe('static routes (no params)', () => {
    it('returns the route as-is', () => {
      expect(generateRoute('/login')).toBe('/login');
    });

    it('handles root path', () => {
      expect(generateRoute('/')).toBe('/');
    });

    it('handles deeply nested static paths', () => {
      expect(generateRoute('/api/v1/auth/callback')).toBe('/api/v1/auth/callback');
    });
  });

  describe('single parameter', () => {
    it('substitutes a string param', () => {
      expect(generateRoute('/users/:id', { id: 'abc' })).toBe('/users/abc');
    });

    it('substitutes a numeric param', () => {
      expect(generateRoute('/users/:id', { id: 42 })).toBe('/users/42');
    });

    it('encodes special characters', () => {
      expect(generateRoute('/search/:query', { query: 'hello world' })).toBe(
        '/search/hello%20world'
      );
    });

    it('encodes slashes in params', () => {
      expect(generateRoute('/files/:path', { path: 'a/b' })).toBe('/files/a%2Fb');
    });
  });

  describe('multiple parameters', () => {
    it('substitutes two params', () => {
      expect(
        generateRoute('/users/:userId/posts/:postId', { userId: 5, postId: 99 })
      ).toBe('/users/5/posts/99');
    });

    it('substitutes three params', () => {
      expect(
        generateRoute('/org/:orgId/team/:teamId/member/:memberId', {
          orgId: 'acme',
          teamId: 'eng',
          memberId: 42,
        })
      ).toBe('/org/acme/team/eng/member/42');
    });
  });

  describe('query strings', () => {
    it('appends a single query parameter', () => {
      expect(
        generateRoute('/blog/posts/:id', { id: 1 }, { tab: 'comments' })
      ).toBe('/blog/posts/1?tab=comments');
    });

    it('appends multiple query parameters', () => {
      const result = generateRoute(
        '/blog/posts/:id',
        { id: 1 },
        { tab: 'comments', page: 2 }
      );
      expect(result).toBe('/blog/posts/1?tab=comments&page=2');
    });

    it('filters out undefined query values', () => {
      const result = generateRoute(
        '/search',
        {},
        { q: 'test', page: undefined, sort: 'date' }
      );
      expect(result).toBe('/search?q=test&sort=date');
    });

    it('handles boolean query values', () => {
      expect(generateRoute('/items', {}, { active: true })).toBe('/items?active=true');
    });

    it('encodes query keys and values', () => {
      expect(
        generateRoute('/search', {}, { 'my key': 'my value' })
      ).toBe('/search?my%20key=my%20value');
    });

    it('skips query string when all values are undefined', () => {
      expect(
        generateRoute('/login', {}, { next: undefined })
      ).toBe('/login');
    });

    it('adds query to static route', () => {
      expect(
        generateRoute('/blog', {}, { category: 'tech' })
      ).toBe('/blog?category=tech');
    });
  });

  describe('error handling', () => {
    it('throws on missing required param', () => {
      expect(() =>
        // @ts-expect-error — intentionally passing incomplete params
        generateRoute('/users/:id', {})
      ).toThrow('Missing required route parameter: "id"');
    });

    it('includes the route pattern in error message', () => {
      expect(() =>
        // @ts-expect-error — intentionally passing incomplete params
        generateRoute('/users/:userId/posts/:postId', { userId: 1 })
      ).toThrow('for route "/users/:userId/posts/:postId"');
    });
  });

  describe('edge cases', () => {
    it('handles param at very end of route', () => {
      expect(generateRoute('/file/:name', { name: 'readme.md' })).toBe(
        '/file/readme.md'
      );
    });

    it('handles zero as param value', () => {
      expect(generateRoute('/page/:num', { num: 0 })).toBe('/page/0');
    });

    it('handles empty string as param value', () => {
      expect(generateRoute('/prefix/:val', { val: '' })).toBe('/prefix/');
    });

    it('handles underscored param names', () => {
      expect(
        generateRoute('/items/:item_id', { item_id: 7 })
      ).toBe('/items/7');
    });
  });
});
