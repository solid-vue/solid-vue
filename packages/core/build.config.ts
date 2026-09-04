import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/app', name: 'app' },
    { input: 'src/server', name: 'server' },
  ],
  declaration: true,
  clean: true,
})