// @ts-check
// these aliases are shared between vitest and rollup
import { readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const resolveEntryForPkg = p =>
  path.resolve(
    fileURLToPath(import.meta.url),
    `../../packages/${p}/src/index.ts`
  )

const dirs = readdirSync(new URL('../packages', import.meta.url))

const entries = {
  lymp: resolveEntryForPkg('lymp')
}

for (const dir of dirs) {
  const key = `@lymp/${dir}`
  if (
    dir !== 'lymp' &&
    !(key in entries) &&
    statSync(new URL(`../packages/${dir}`, import.meta.url)).isDirectory()
  ) {
    entries[key] = resolveEntryForPkg(dir)
  }
}

export { entries }
