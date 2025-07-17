import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/button.tsx', 'src/card.tsx', 'src/input.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
})
