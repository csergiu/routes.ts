import { describe, it, expect } from 'vitest';
import { flattenRoutes } from '../src/flatten.js';

describe('flattenRoutes', () => {
  it('flattens a simple flat object', () => {
    expect(
      flattenRoutes({ home: '/', login: '/login' })
    ).toEqual({
      home: '/',
      login: '/login',
    });
  });

  it('flattens nested objects with dot notation', () => {
    expect(
      flattenRoutes({
        blog: {
          root: '/blog',
          post: '/blog/:slug',
        },
      })
    ).toEqual({
      'blog.root': '/blog',
      'blog.post': '/blog/:slug',
    });
  });

  it('flattens deeply nested objects', () => {
    expect(
      flattenRoutes({
        api: {
          v1: {
            users: {
              list: '/api/v1/users',
              byId: '/api/v1/users/:id',
            },
          },
        },
      })
    ).toEqual({
      'api.v1.users.list': '/api/v1/users',
      'api.v1.users.byId': '/api/v1/users/:id',
    });
  });

  it('handles mixed flat and nested', () => {
    expect(
      flattenRoutes({
        home: '/',
        blog: {
          root: '/blog',
          post: '/blog/:slug',
        },
        login: '/login',
      })
    ).toEqual({
      home: '/',
      'blog.root': '/blog',
      'blog.post': '/blog/:slug',
      login: '/login',
    });
  });

  it('returns empty object for empty input', () => {
    expect(flattenRoutes({})).toEqual({});
  });
});
