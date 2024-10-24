const childProcess = require('child_process');
const { promisify } = require('util');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

const EXCLUDE_DIRECTORIES = ['build', 'node_modules', '.git', '.vscode'];
const EXCLUDE_FILES = ['productionBuild.js', '.env', '.env.example'];
const PRODUCTION_URL = 'https://olejesawiniec.pl';


const EXCLUDED = [...EXCLUDE_FILES, ...EXCLUDE_DIRECTORIES];
const runScript = promisify(childProcess.exec);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readDir = promisify(fs.readdir);
const lstat = promisify(fs.lstat);


(async () => {
  console.log(`\n\nBUILD STARTED`);
  console.time('TOTAL TIME');
  // Read the default .env file
  const buff = await readFile('./.env');
  const envData = buff.toString();

  // Grab variables to replace
  const AUTH_TRUST_HOST = /AUTH_TRUST_HOST=".{0,50}"/;
  const NEXT_PUBLIC_SERVER_URL = /NEXT_PUBLIC_SERVER_URL=".{0,50}"/;

  // Replace variables
  const newEnv = envData
    .replace(AUTH_TRUST_HOST, `AUTH_TRUST_HOST="${PRODUCTION_URL}/"`)
    .replace(NEXT_PUBLIC_SERVER_URL, `NEXT_PUBLIC_SERVER_URL="${PRODUCTION_URL}"`)

  // Write new variables
  await writeFile('./.env', newEnv)

  // Create zip archive
  const output = fs.createWriteStream(path.join(__dirname, 'build', `${new Date().toISOString().replace(/:/g, '')}.zip`));
  console.log(path.join(__dirname, 'build', `${new Date().toISOString().replace(/:/g, '')}.zip`));
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  archive.pipe(output);

  // Zip listeners
  output.on('close', () => {
    console.log(`BUILD READY! (${archive.pointer()} bytes)`);
    console.timeEnd('TOTAL TIME');
  });
  archive.on('error', function (err) {
    throw err;
  });

  // Start nextjs build
  await runScript('npm run build');

  // Compress files
  const files = await readDir('./');
  await Promise.all(files.map(async (file) => {
    if (EXCLUDED.includes(file)) return;
    const stat = await lstat(file);
    if (stat.isDirectory()) {
      archive.directory(`${file}/`)
    } else {
      archive.append(fs.createReadStream(file), { name: file })
    }
  })); -
    archive.finalize();


  // Rollback the old env file
  await writeFile('./.env', envData);
})();

