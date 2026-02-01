// ============================================================================
// Type utilities for extracting and enforcing route parameter types
// ============================================================================

/**
 * Extracts parameter names from a route pattern string.
 *
 * @example
 *   type P = ExtractParams<'/users/:userId/posts/:postId'>;
 *   // → 'userId' | 'postId'
 *
 *   type P = ExtractParams<'/login'>;
 *   // → never
 */
export type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

/**
 * Maps extracted parameter names to a required Record.
 * If the route has no parameters, resolves to an empty record.
 *
 * @example
 *   type P = RouteParams<'/users/:id'>;
 *   // → { id: string | number }
 *
 *   type P = RouteParams<'/login'>;
 *   // → Record<string, never>
 */
export type RouteParams<T extends string> =
  ExtractParams<T> extends never
    ? Record<string, never>
    : Record<ExtractParams<T>, string | number>;

/** Query string parameters — values are serialized with encodeURIComponent. */
export type QueryParams = Record<string, string | number | boolean | undefined>;

/**
 * Deeply marks all properties as readonly (recursive).
 * Used to freeze route definition objects.
 */
export type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? T[K]
    : T[K] extends object
      ? DeepReadonly<T[K]>
      : T[K];
};

/** A route definition: either a string pattern or a nested object of patterns. */
export type RouteDefinition = string | { readonly [key: string]: RouteDefinition };

/**
 * Argument signature for generateRoute.
 * - Routes with params: (params: { ... }, query?) — params required
 * - Routes without params: (query?) — no params needed
 */
export type GenerateArgs<T extends string> =
  ExtractParams<T> extends never
    ? [params?: Record<string, never>, query?: QueryParams]
    : [params: RouteParams<T>, query?: QueryParams];
