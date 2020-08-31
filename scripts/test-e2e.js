/* eslint-disable no-console */
const includes = require('lodash/includes');
const exec = require('shell-utils').exec;

const release = includes(process.argv, '--release');
const skipBuild = includes(process.argv, '--skipBuild');
const multi = includes(process.argv, '--multi');
const verbose = includes(process.argv, '--verbose');

run();

function run() {
  const configuration = release ? `ios.sim.release` : `ios.sim.debug`;
  const workers = multi ? 3 : 1;
  const loglevel = verbose ? '--loglevel verbose' : '';

  if (!skipBuild) {
    exec.execSync('npm run pod-install');
    exec.execSync(`detox build --configuration ${configuration}`);
  }
  exec.execSync(`detox test --configuration ${configuration} -w ${workers} ${loglevel}`);
}