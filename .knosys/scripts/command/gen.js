const { resolve: resolvePath } = require('path');
const { existsSync } = require('fs');

const { resolveRootPath, scanAndSortByAsc, ensureDirExists, getLocalDataRoot } = require('../helper');
const { createProjectGenerator } = require('../generator');

module.exports = {
  execute: dataSource => {
    const srcPath = resolvePath(resolveRootPath(), dataSource);

    if (!existsSync(srcPath)) {
      return;
    }

    ensureDirExists(getLocalDataRoot(), true);

    const sourceRootPath = resolvePath(srcPath, 'data');
    const sharedRootPath = resolvePath(srcPath, 'shared');

    const generators = {
      projects: createProjectGenerator(sourceRootPath, sharedRootPath),
    };

    scanAndSortByAsc(sharedRootPath).forEach(collection => generators[collection] && generators[collection]());
  },
};
