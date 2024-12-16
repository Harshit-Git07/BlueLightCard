declare module '*.md?raw' {
  const value: string;
  export default value;
}

// Handles svg imports
declare module '*.svg' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
