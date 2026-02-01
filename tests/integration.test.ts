import { describe, it, expect } from 'vitest';
import { defineRoutes, generateRoute, matchRoute, flattenRoutes } from '../src/index.js';

describe('integration', () => {
  const routes = defineRoutes({
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    settings: {
      root: '/settings',
      profile: '/settings/profile',
      billing: '/settings/billing',
    },
    blog: {
      root: '/blog',
      posts: {
        list: '/blog/posts',
        byId: '/blog/posts/:id',
        bySlug: '/blog/posts/:slug',
      },
    },
    users: {
      root: '/users',
      byId: '/users/:userId',
      posts: '/users/:userId/posts/:postId',
    },
  });

  it('generates and matches a single-param route', () => {
    const url = generateRoute(routes.blog.posts.byId, { id: 42 });
    expect(url).toBe('/blog/posts/42');

    const matched = matchRoute(routes.blog.posts.byId, url);
    expect(matched).toEqual({ id: '42' });
  });

  it('generates and matches a multi-param route', () => {
    const url = generateRoute(routes.users.posts, { userId: 5, postId: 99 });
    expect(url).toBe('/users/5/posts/99');

    const matched = matchRoute(routes.users.posts, url);
    expect(matched).toEqual({ userId: '5', postId: '99' });
  });

  it('generates with query and still matches the path', () => {
    const url = generateRoute(
      routes.blog.posts.byId,
      { id: 7 },
      { tab: 'comments', page: 3 }
    );
    expect(url).toBe('/blog/posts/7?tab=comments&page=3');

    // matchRoute strips the query string
    const matched = matchRoute(routes.blog.posts.byId, url);
    expect(matched).toEqual({ id: '7' });
  });

  it('flattens the entire route tree', () => {
    const flat = flattenRoutes(routes);
    expect(flat).toEqual({
      home: '/',
      login: '/login',
      register: '/register',
      dashboard: '/dashboard',
      'settings.root': '/settings',
      'settings.profile': '/settings/profile',
      'settings.billing': '/settings/billing',
      'blog.root': '/blog',
      'blog.posts.list': '/blog/posts',
      'blog.posts.byId': '/blog/posts/:id',
      'blog.posts.bySlug': '/blog/posts/:slug',
      'users.root': '/users',
      'users.byId': '/users/:userId',
      'users.posts': '/users/:userId/posts/:postId',
    });
  });

  it('static routes work end-to-end', () => {
    const url = generateRoute(routes.login);
    expect(url).toBe('/login');

    const matched = matchRoute(routes.login, url);
    expect(matched).toEqual({});
  });

  it('route object is deeply frozen', () => {
    expect(Object.isFrozen(routes)).toBe(true);
    expect(Object.isFrozen(routes.blog)).toBe(true);
    expect(Object.isFrozen(routes.blog.posts)).toBe(true);
    expect(Object.isFrozen(routes.settings)).toBe(true);
  });
});
