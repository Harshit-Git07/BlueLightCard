declare module '*.md?raw' {
  const value: string;
  export default value;
}
declare module 'multiple-cucumber-html-reporter' {
  export function generate(...args): void;
}
