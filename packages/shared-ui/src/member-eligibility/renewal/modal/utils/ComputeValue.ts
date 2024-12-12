export function computeValue<Value>(callback: () => Value): Value {
  return callback();
}
