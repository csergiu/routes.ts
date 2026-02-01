import { describe, it, expect } from 'vitest';
import { matchRoute } from '../src/match.js';

describe('matchRoute', () => {
  describe('static routes', () => {
    it('matches exact static path', () => {
      expect(matchRoute('/login', '/login')).toEqual({});
    });

    it('matches root path', () => {
      expect(matchRoute('/', '/')).toEqual({});
    });

    it('returns null for mismatch', () => {
      expect(matchRoute('/login', '/register')).toBeNull();
    });

    it('returns null for different depth', () => {
      expect(matchRoute('/a/b', '/a/b/c')).toBeNull();
    });
  });

  describe('single parameter', () => {
    it('extracts a single param', () => {
      expect(matchRoute('/users/:id', '/users/42')).toEqual({ id: '42' });
    });

    it('extracts string param values', () => {
      expect(matchRoute('/blog/:slug', '/blog/hello-world')).toEqual({
        slug: 'hello-world',
      });
    });

    it('decodes encoded param values', () => {
      expect(matchRoute('/search/:q', '/search/hello%20world')).toEqual({
        q: 'hello world',
      });
    });
  });

  describe('multiple parameters', () => {
    it('extracts two params', () => {
      expect(
        matchRoute('/users/:userId/posts/:postId', '/users/5/posts/99')
      ).toEqual({ userId: '5', postId: '99' });
    });

    it('extracts three params', () => {
      expect(
        matchRoute(
          '/org/:orgId/team/:teamId/member/:memberId',
          '/org/acme/team/eng/member/42'
        )
      ).toEqual({ orgId: 'acme', teamId: 'eng', memberId: '42' });
    });
  });

  describe('query string handling', () => {
    it('strips query string before matching', () => {
      expect(
        matchRoute('/blog/posts/:id', '/blog/posts/42?tab=comments')
      ).toEqual({ id: '42' });
    });

    it('strips complex query strings', () => {
      expect(
        matchRoute('/users/:id', '/users/7?foo=bar&baz=qux')
      ).toEqual({ id: '7' });
    });
  });

  describe('non-matches', () => {
    it('returns null when static segments differ', () => {
      expect(matchRoute('/blog/:id', '/users/42')).toBeNull();
    });

    it('returns null when path is shorter than pattern', () => {
      expect(matchRoute('/a/:b/c', '/a/1')).toBeNull();
    });

    it('returns null when path is longer than pattern', () => {
      expect(matchRoute('/a/:b', '/a/1/c')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles param values that look like params', () => {
      expect(matchRoute('/page/:id', '/page/:id')).toEqual({ id: ':id' });
    });

    it('handles empty param values', () => {
      // /users//posts → path part is empty string
      expect(matchRoute('/users/:id', '/users/')).toEqual({ id: '' });
    });
  });
});
