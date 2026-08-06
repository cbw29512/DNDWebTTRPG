import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const testsDirectory = path.resolve(process.cwd(), 'tests');

try {
  const testFiles = fs.readdirSync(testsDirectory)
    .filter(file => file.endsWith('.test.mjs'))
    .sort((left, right) => left.localeCompare(right));

  if (testFiles.length === 0) {
    throw new Error('No regression test files were found.');
  }

  for (const file of testFiles) {
    const relativePath = path.join('tests', file);
    console.log(`\n▶ ${relativePath}`);

    const result = spawnSync(process.execPath, [relativePath], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'inherit'
    });

    if (result.error) {
      throw new Error(`Unable to start ${relativePath}: ${result.error.message}`);
    }

    if (result.status !== 0) {
      throw new Error(`${relativePath} failed with exit code ${result.status ?? 'unknown'}.`);
    }
  }

  console.log(`\n✓ All ${testFiles.length} regression files passed.`);
} catch (error) {
  console.error('Regression suite failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
