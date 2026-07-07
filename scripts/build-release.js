const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const releaseDir = path.join(root, 'release');
const stagingDir = path.join(root, '.build-staging');
const publicDir = path.join(releaseDir, 'public');
const exePath = path.join(releaseDir, 'ScheduleManagement.exe');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function prepareStaging() {
  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }

  copyDir(path.join(root, 'server'), path.join(stagingDir, 'server'));
  copyDir(publicDir, path.join(stagingDir, 'public'));
}

console.log('Building client...');
execSync('npm run build --prefix client', { cwd: root, stdio: 'inherit' });

fs.mkdirSync(releaseDir, { recursive: true });

console.log('Copying client build to release/public...');
if (fs.existsSync(publicDir)) {
  fs.rmSync(publicDir, { recursive: true, force: true });
}
copyDir(path.join(root, 'client', 'dist'), publicDir);

fs.copyFileSync(
  path.join(root, 'server', '.env.example'),
  path.join(releaseDir, '.env.example')
);

console.log('Preparing package staging folder...');
prepareStaging();

console.log('Packaging Windows executable...');
if (fs.existsSync(exePath)) {
  fs.rmSync(exePath, { force: true });
}

const nodeBinary = '{{caxa}}/node_modules/.bin/node';

execSync(
  [
    'npx --yes caxa',
    `--input "${stagingDir}"`,
    `--output "${exePath}"`,
    '--',
    `"${nodeBinary}"`,
    '"{{caxa}}/server/launcher.js"',
  ].join(' '),
  { cwd: root, stdio: 'inherit', shell: true }
);

fs.rmSync(stagingDir, { recursive: true, force: true });

console.log('');
console.log('Build complete.');
console.log(`  Executable: ${exePath}`);
console.log('');
console.log('Before running:');
console.log('  1. Start MySQL (e.g. XAMPP)');
console.log('  2. Copy release/.env.example to release/.env and set DB_PASSWORD if needed');
console.log('  3. Double-click ScheduleManagement.exe');
