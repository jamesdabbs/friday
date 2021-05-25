import { BuildFailure, BuildResult, build, BuildOptions } from 'esbuild'

const buildOptions: BuildOptions = {
  platform: 'node',
  entryPoints: ['main.ts'],
  outfile: 'dist/main.js',
  bundle: true
}

function onRebuild(error: BuildFailure | null, _: BuildResult | null) {
  if (error) {
    return console.error('Build failed', { error })
  }

  console.info('Build succeeded')
  delete require.cache[require.resolve('../dist/main.js')]
  require('../dist/main.js')
}

(async function() {
  try {
    build({ ...buildOptions, watch: { onRebuild } })
    console.info('Watching for changes')

  } catch (error) {
    console.error('Watch failed', { error })
    process.exit(1)
  }

  try {
    console.info('Triggering initial build')
    const result = await build(buildOptions)
    onRebuild(null, result)
  } catch (error) {
    console.error('Initial build failed', { error })
  }
})()
