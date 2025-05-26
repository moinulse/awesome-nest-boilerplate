/* eslint-disable @typescript-eslint/no-explicit-any */
export type Constructor<T = any, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T;

/**
 * Represents a universally unique identifier (UUID).
 * Uses a branded type to prevent accidental assignment of regular strings.
 */
export type Uuid = string & { readonly _uuidBrand: undefined };

export type KeyOfType<Entity, U> = {
  [P in keyof Required<Entity>]: Required<Entity>[P] extends U
    ? P
    : Required<Entity>[P] extends U[]
      ? P
      : never;
}[keyof Entity];
