import { describe, it, expect } from 'vitest';
import { defineRoutes } from '../src/define.js';

describe('defineRoutes', () => {
  it('returns the same structure', () => {
    const routes = defineRoutes({
      home: '/',
      login: '/login',
    });
    expect(routes.home).toBe('/');
    expect(routes.login).toBe('/login');
  });

  it('supports nested route objects', () => {
    const routes = defineRoutes({
      blog: {
        root: '/blog',
        post: '/blog/:slug',
      },
    });
    expect(routes.blog.root).toBe('/blog');
    expect(routes.blog.post).toBe('/blog/:slug');
  });

  it('deeply freezes the result', () => {
    const routes = defineRoutes({
      home: '/',
      settings: {
        root: '/settings',
        profile: '/settings/profile',
      },
    });

    expect(Object.isFrozen(routes)).toBe(true);
    expect(Object.isFrozen(routes.settings)).toBe(true);
  });

  it('prevents mutation of top-level properties', () => {
    const routes = defineRoutes({ home: '/' });
    expect(() => {
      // @ts-expect-error — intentional mutation test
      routes.home = '/changed';
    }).toThrow();
  });

  it('prevents mutation of nested properties', () => {
    const routes = defineRoutes({
      blog: { root: '/blog' },
    });
    expect(() => {
      // @ts-expect-error — intentional mutation test
      routes.blog.root = '/changed';
    }).toThrow();
  });

  it('handles deeply nested structures', () => {
    const routes = defineRoutes({
      api: {
        v1: {
          users: {
            list: '/api/v1/users',
            byId: '/api/v1/users/:id',
          },
        },
      },
    });
    expect(routes.api.v1.users.byId).toBe('/api/v1/users/:id');
    expect(Object.isFrozen(routes.api.v1.users)).toBe(true);
  });
});
