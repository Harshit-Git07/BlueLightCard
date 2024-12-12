declare module '*.md?raw' {
  const value: string;
  export default value;
}

// Handles svg imports
declare module '*.svg' {
  const content: unknown;
  return content;
}
