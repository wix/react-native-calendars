const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

const rnVersion = (function () {
  const rnPackageJson = require('react-native/package.json');
  return rnPackageJson.version;
})();

function cleanFindNodeScriptFileForRn64IOS() {
  const REACT_SCRIPTS_PATH = path.join('node_modules', 'react-native', 'scripts');
  const REACT_FIND_NODE_SCRIPT_PATH = path.join(REACT_SCRIPTS_PATH, 'find-node.sh');

  console.log('Clean content of find-node.sh file..');
  try {
    fs.writeFileSync(REACT_FIND_NODE_SCRIPT_PATH, '');
  } catch (e) {
    console.warn("Couldn't clean content find-node.sh file");
  }
}

function run() {
  console.log('Running post-install script...');

  if (semver.minor(rnVersion) === 64) {
    console.log('Detected RN version .64! Applying necessary patches...');
    cleanFindNodeScriptFileForRn64IOS();
  }
}

run();
