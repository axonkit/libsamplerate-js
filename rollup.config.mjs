import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

// Both entries are built together so `src/wasm/module.ts` (which holds the
// loader overrides) lands in one shared chunk. Built separately, each entry
// got its own copy: the setters in `wasm-runtime` wrote state that `create()`
// never read, and were tree-shaken to empty functions.
//
// Chunks stay flat in `dist/` because the module resolves its default glue and
// `.wasm` URLs as `./wasm/...` relative to the file that contains it.
export default {
  input: {
    index: 'src/index.ts',
    'wasm-runtime': 'src/wasm-runtime.ts',
  },
  output: [
    {
      dir: 'dist',
      format: 'es',
      entryFileNames: '[name].mjs',
      chunkFileNames: 'chunk-[hash].mjs',
      sourcemap: true,
    },
    {
      dir: 'dist',
      format: 'cjs',
      entryFileNames: '[name].cjs',
      chunkFileNames: 'chunk-[hash].cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    typescript({ tsconfig: './tsconfig.json', declaration: true, declarationDir: 'dist' }),
    copy({ targets: [{ src: 'wasm/out/*', dest: 'dist/wasm' }] }),
  ],
};
