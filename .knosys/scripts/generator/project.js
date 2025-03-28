const { isArray, noop, pick } = require('@ntks/toolbox');

const { sortByDate, readData, readMetadata } = require('../helper');
const { getItemSourceDir, createGenerator } = require('./helper');

const collectionName = 'projects';

function resolveItemData(sourceRootPath, id, item) {
  const sourceDir = getItemSourceDir(sourceRootPath, item);
  const project = { ...readMetadata(sourceDir), id };

  if (!isArray(project.tags) || project.tags.indexOf('indie-dev') === -1) {
    return null;
  }

  const sharedMetadata = readData(`${sourceDir}/.meta/shared.yml`) || {};

  if (sharedMetadata.date) {
    project.sharedAt = sharedMetadata.date;
  }

  if (Array.isArray(project.tasks)) {
    project.tasks = project.tasks.map(task => ({ ...task, status: task.status || 'waiting' }));
  }

  return pick(project, ['id', 'title', 'date', 'git', 'links', 'tasks', 'share', 'sharedAt','']);
}

module.exports = {
  createProjectGenerator: (sourceRootPath, sharedRootPath) => createGenerator(sourceRootPath, sharedRootPath, collectionName, {
    transformItem: resolveItemData.bind(null, sourceRootPath),
    transformData: items => ({ items, sequence: sortByDate(Object.keys(items).map(key => items[key])).map(({ id }) => id) }),
    readEach: noop,
  }),
};
