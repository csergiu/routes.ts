// ============================================================================
// Example: Using routes.ts with Express / any Node.js server
// ============================================================================

import { defineRoutes, generateRoute, matchRoute, flattenRoutes } from 'routes.ts';

// ---------------------------------------------------------------------------
// Define routes (shared between client and server)
// ---------------------------------------------------------------------------

export const routes = defineRoutes({
  home: '/',
  products: {
    list: '/products',
    byId: '/products/:productId',
    reviews: '/products/:productId/reviews/:reviewId',
  },
  api: {
    products: '/api/products/:id',
    search: '/api/search',
  },
} as const);

// ---------------------------------------------------------------------------
// Server-side: match incoming requests
// ---------------------------------------------------------------------------

// In an Express middleware or handler:
//
//   app.get('*', (req, res) => {
//     const productMatch = matchRoute(routes.products.byId, req.path);
//     if (productMatch) {
//       // productMatch = { productId: '42' }
//       return res.render('product', { id: productMatch.productId });
//     }
//
//     const reviewMatch = matchRoute(routes.products.reviews, req.path);
//     if (reviewMatch) {
//       // reviewMatch = { productId: '42', reviewId: '7' }
//       return res.render('review', reviewMatch);
//     }
//
//     res.status(404).render('not-found');
//   });

// ---------------------------------------------------------------------------
// Client-side: generate URLs for API calls
// ---------------------------------------------------------------------------

//   const url = generateRoute(routes.api.products, { id: 42 });
//   const res = await fetch(url);

// ---------------------------------------------------------------------------
// Debug/admin: list all routes
// ---------------------------------------------------------------------------

console.log('All routes:');
const flat = flattenRoutes(routes);
for (const [key, pattern] of Object.entries(flat)) {
  console.log(`  ${key.padEnd(25)} → ${pattern}`);
}

// Output:
//   home                      → /
//   products.list             → /products
//   products.byId             → /products/:productId
//   products.reviews          → /products/:productId/reviews/:reviewId
//   api.products              → /api/products/:id
//   api.search                → /api/search

// ---------------------------------------------------------------------------
// Route matching demo
// ---------------------------------------------------------------------------

console.log('\nMatching examples:');
console.log(matchRoute(routes.products.byId, '/products/42'));
// → { productId: '42' }

console.log(matchRoute(routes.products.reviews, '/products/42/reviews/7'));
// → { productId: '42', reviewId: '7' }

console.log(matchRoute(routes.products.byId, '/login'));
// → null
