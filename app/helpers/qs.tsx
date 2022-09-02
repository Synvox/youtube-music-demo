export function qs(obj: Record<string, any>) {
  return new URLSearchParams(Object.entries(obj).filter(([_, v]) => v));
}

export function toObject<Keys extends string>(qs: URLSearchParams | FormData) {
  return Object.fromEntries(qs.entries()) as unknown as Record<
    Keys,
    string | undefined
  >;
}
