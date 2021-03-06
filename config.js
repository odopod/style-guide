const path = require('path');
const fs = require('fs');
const requireDir = require('require-dir');
const camelcase = require('camelcase');

// Helpers
const getFilteredColors = require('./templates/helpers/get-filtered-colors');
const getSpecData = require('./templates/helpers/get-spec-data');
const color = require('./templates/helpers/color');
const trimSingleQuotes = require('./templates/helpers/trim-single-quotes');
const getObjectKeys = require('./templates/helpers/get-object-keys');
const getRatioNames = require('./templates/helpers/get-ratio-names');
const groupStyles = require('./templates/helpers/group-styles');

const root = path.resolve(__dirname);

module.exports = {
  dir: {
    root,
    templates: path.join(root, 'templates'),
    pages: path.join(root, 'templates/pages'),
    js: path.join(root, 'js'),
    scss: path.join(root, 'css'),
  },

  patterns: {
    js: '**/*.js',
    json: '**/*.json',
    nunjucks: '**/*.nunjucks',
    scss: '**/*.scss',
  },

  current: null,
};

/**
 * Get the global list of icons.
 * @param {string} iconDirectory icon directory in source.
 * @return {Array.<string>} An array of SVG file names.
 */
function getIcons(iconDirectory) {
  if (iconDirectory) {
    return fs.readdirSync(iconDirectory)
      .filter(icon => path.extname(icon) === '.svg')
      .map(icon => path.basename(icon, '.svg'));
  }

  return [];
}

module.exports.getTemplateData = function getTemplateData() {
  // Read all .json files into an object and merge with the user-defined config.
  const icons = { iconList: getIcons(module.exports.current.iconPath) };
  const jsonFiles = requireDir(module.exports.current.jsonSource, {
    mapKey: (value, base) => camelcase(base),
  });
  const templateUtils = {
    color,
    getFilteredColors,
    getSpecData,
    getObjectKeys,
    trimSingleQuotes,
    getRatioNames,
    groupStyles,
  };

  return Object.assign(
    {},
    module.exports.current,
    icons,
    jsonFiles,
    templateUtils
  );
};
