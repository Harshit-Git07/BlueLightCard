// export default ["packages/*", "packages/api/*"];

import { defineWorkspace } from 'vitest/config'

// defineWorkspace provides a nice type hinting DX
export default defineWorkspace([
  'packages/api/**/*'
  //'packages/web/'
])