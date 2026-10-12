import { readFile } from 'node:fs/promises'
import { JSONC } from 'bun'

// Audit the exact locked versions against npm's advisory database, including
// packages installed from registries that do not provide an audit endpoint.
const lock = JSONC.parse(
  await readFile(new URL('../bun.lock', import.meta.url), 'utf8')
)
const packages = {}
for (const [specifier] of Object.values(lock.packages)) {
  const separator = specifier.lastIndexOf('@')
  if (separator <= 0) throw new Error(`Unsupported lock entry: ${specifier}`)
  const name = specifier.slice(0, separator)
  const version = specifier.slice(separator + 1)
  if (!packages[name]) packages[name] = []
  if (!packages[name].includes(version)) packages[name].push(version)
}
const response = await fetch(
  'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk',
  {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(packages),
    signal: AbortSignal.timeout(30_000),
  }
)
if (!response.ok) throw new Error(`Audit failed: HTTP ${response.status}`)
const advisories = await response.json()
let count = 0
for (const [name, entries] of Object.entries(advisories)) {
  if (!Array.isArray(entries)) throw new Error('Invalid audit response')
  for (const entry of entries) {
    count++
    console.error(`${entry.severity}: ${name} — ${entry.title}\n${entry.url}`)
  }
}
console.log(
  `Audited ${Object.keys(packages).length} packages: ${count} known vulnerabilities`
)
if (count) process.exitCode = 1
