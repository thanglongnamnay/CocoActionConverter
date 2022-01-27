import { build } from 'esbuild'
build({
    entryPoints: ['index.js'],
    bundle: true,
    watch: true,
    platform: 'node',
    outfile: 'bundle.cjs',
  }).catch(() => process.exit(1))