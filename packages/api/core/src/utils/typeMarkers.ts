export type Marked<T, Marker> = T & { readonly __marker: Marker | undefined };

export function mark<T, Marker>(t: T): Marked<T, Marker> {
  return t as Marked<T, Marker>;
}

export type MarkerType<T, Marker> = {
  of(t: T): Marked<T, Marker>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferMarkedType<MT extends MarkerType<any, any>> = MT extends MarkerType<infer T, infer Marker>
  ? Marked<T, Marker>
  : never;

export function createMarkedType<T, Marker>(): MarkerType<T, Marker> {
  return {
    of(t: T): Marked<T, Marker> {
      return mark(t);
    },
  };
}
