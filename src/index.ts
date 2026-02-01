// ============================================================================
// routes.ts
// Zero-dependency, type-safe route management for any framework.
// ============================================================================

export { defineRoutes } from './define.js';
export { generateRoute } from './generate.js';
export { matchRoute } from './match.js';
export { flattenRoutes } from './flatten.js';

export type {
  ExtractParams,
  RouteParams,
  QueryParams,
  DeepReadonly,
  RouteDefinition,
  GenerateArgs,
} from './types.js';
