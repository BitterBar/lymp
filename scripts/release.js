// @ts-check
import minimist from 'minimist'
import fs from 'node:fs'
import path from 'node:path'
import chalk from 'chalk'
import execa from 'execa'
import enquirer from 'enquirer'
import semver from 'semver'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const { prompt } = enquirer
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const currentVersion = createRequire(import.meta.url)('../package.json').version
const args = minimist(process.argv.slice(2))
const skipBuild = args.skipBuild
const skipGit = args.skipGit
const preId = args.preid || semver.prerelease(currentVersion)?.[0]

const packages = fs
  .readdirSync(path.resolve(__dirname, '../packages'))
  .filter(p => !p.endsWith('.ts') && !p.startsWith('.'))

const inc = i => semver.inc(currentVersion, i, preId)
const getPkgRoot = pkg => path.resolve(__dirname, '../packages/' + pkg)
const step = msg => console.log(chalk.cyan(msg))

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])
]

const keepThePackageName = pkgName => pkgName

async function main() {
  let targetVersion = args._[0]

  if (!targetVersion) {
    // no explicit version, offer suggestions
    // @ts-ignore
    const { release } = await prompt({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
    })

    if (release === 'custom') {
      // @ts-ignore
      const result = await prompt({
        type: 'input',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion
      })
      // @ts-ignore
      targetVersion = result.version
    } else {
      targetVersion = release.match(/\((.*)\)/)[1]
    }
  }

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  // @ts-ignore
  const { yes: confirmRelease } = await prompt({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`
  })

  if (!confirmRelease) {
    return
  }

  // update all package versions and inter-dependencies
  step('\nUpdating cross dependencies...')
  updateVersions(targetVersion, keepThePackageName)

  if (!skipBuild) {
    await run('pnpm', ['run', 'build'])
    step('\nBuilding and testing types...')
    // await run('pnpm', ['test-dts']) // TODO check this
    await run('pnpm', ['run', 'build-dts'])
  } else {
    console.log(`(skipped)`)
  }

  if (!skipGit) {
    const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
    if (stdout) {
      step('\nCommitting changes...')
      await run('git', ['add', '-A'])
      await run('git', ['commit', '-m', `release: v${targetVersion}`])
    } else {
      console.log('No changes to commit.')
    }
  }

  // publish packages
  step('\nPublishing packages...')
  for (const pkg of packages) {
    await publishPackage(pkg, targetVersion)
  }

  // push to GitHub
  if (!skipGit) {
    step('\nPushing to GitHub...')
    await run('git', ['tag', `v${targetVersion}`])
    await run('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
    await run('git', ['push'])
  }
}

function updateVersions(version, getNewPackageName = keepThePackageName) {
  // 1. update root package.json
  updatePackage(path.resolve(__dirname, '..'), version, getNewPackageName)
  // 2. update all packages
  packages.forEach(p =>
    updatePackage(getPkgRoot(p), version, getNewPackageName)
  )
}

function updatePackage(pkgRoot, version, getNewPackageName) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.name = getNewPackageName(pkg.name)
  pkg.version = version
  updateDeps(pkg, 'dependencies', version, getNewPackageName)
  updateDeps(pkg, 'peerDependencies', version, getNewPackageName)
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

function updateDeps(pkg, depType, version, getNewPackageName) {
  const deps = pkg[depType]
  if (!deps) return
  Object.keys(deps).forEach(dep => {
    if (deps[dep] === 'workspace:*') {
      return
    }
    if (isCorePackage(dep)) {
      const newName = getNewPackageName(dep)
      const newVersion = newName === dep ? version : `npm:${newName}@${version}`
      console.log(
        chalk.yellow(`${pkg.name} -> ${depType} -> ${dep}@${newVersion}`)
      )
      deps[dep] = newVersion
    }
  })
}

const isCorePackage = pkgName => {
  if (!pkgName) return

  if (pkgName === 'lymp') {
    return true
  }

  return (
    pkgName.startsWith('@lymp') &&
    packages.includes(pkgName.replace(/^@lymp\//, ''))
  )
}

async function publishPackage(pkgName, version) {
  const pkgRoot = getPkgRoot(pkgName)
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  if (pkg.private) {
    return
  }

  let releaseTag = null
  if (args.tag) {
    releaseTag = args.tag
  } else if (version.includes('alpha')) {
    releaseTag = 'alpha'
  } else if (version.includes('beta')) {
    releaseTag = 'beta'
  } else if (version.includes('rc')) {
    releaseTag = 'rc'
  }

  step(`Publishing ${pkgName}...`)
  try {
    await run(
      // note: use of yarn is intentional here as we rely on its publishing
      // behavior.
      'npm',
      [
        'publish',
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public'
        // ...(isDryRun ? ['--dry-run'] : [])
      ],
      {
        cwd: pkgRoot,
        stdio: 'pipe'
      }
    )
    console.log(chalk.green(`Successfully published ${pkgName}@${version}`))
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`))
    } else {
      throw e
    }
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
