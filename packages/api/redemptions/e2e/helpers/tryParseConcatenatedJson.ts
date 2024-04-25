/**
 * Attempts to parse a string of concatenated JSON objects into an array of objects.
 * If an object cannot be parsed, the error is included in the array.
 */
export function tryParseConcatenatedJSON(input: string): unknown[] {
  const objects: unknown[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    // Adjust depth based on current character
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
    }

    // Skip whitespace and new lines between objects
    if (depth === 0 && char.match(/\s/)) {
      start = i + 1;
      continue;
    }

    // When depth returns to 0, we've closed a complete object
    if (depth === 0) {
      const jsonString = input.substring(start, i + 1);
      try {
        objects.push(JSON.parse(jsonString));
      } catch (error) {
        objects.push(error);
      }
      start = i + 1; // Move start up for the next potential object
    }
  }

  return objects;
}
