export function transformObjVariants(originalObject: Record<string, any>) {
  const newObject: Record<string, string> = {};

  for (const key in originalObject) {
    newObject[key] = originalObject[key].value;
  }

  return newObject;
}
