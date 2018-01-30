const fs = require('fs');
const path = require('path');

/**
 * Finds files with similar locale in `folders` and creates one file for each locale in `{destinationPath}/{newFilePrefix}_{locale}.{ext}`
 * @param {string[]} folders - list of folders containing locale files
 * @param {string} destinationPath - Path to create new files
 * @param {string} newFilePrefix - Prefix of new file `{newFilePrefix}_{locale}.{ext}`
 */
export function merge(folders: string[], destinationPath: string, newFilePrefix: string) {
  initFiles();
  folders.forEach((folder) => {
    let fileNames;
    if (fs.existsSync(folder)) {
      fileNames = fs.readdirSync(folder);
    }

    if (!fileNames) {
      console.warn(folder + ' contains no files');
      return;
    }

    fileNames.forEach((fileName) => {
      const filePath = folder + '/' + fileName;

      const {locale, fileType} = getFileDefinitions(fileName);

      const typedFiles = files[fileType];

      if (!typedFiles || !locale) {
        return;
      }

      if (typedFiles.type === MergeType.ASSIGN) {
        typedFiles.locales[locale] = Object.assign({}, JSON.parse(getFileContents(filePath)), typedFiles.locales[locale]);
      } else /* CONCAT and DEFAULT */ {
        typedFiles.locales[locale] = typedFiles.locales[locale] || '';
        typedFiles.locales[locale] += getFileContents(filePath);
      }
    });
  });

  createFiles(destinationPath, newFilePrefix);
}

enum MergeType {
  CONCAT,
  ASSIGN
}

let files;

function initFiles() {
  files = {
    js: {
      locales: {},
      type: MergeType.CONCAT
    },
    json: {
      locales: {},
      type: MergeType.ASSIGN
    }
  };
}

function createFiles(destinationPath: string, newFilePrefix: string) {
  createPathIfDoesntExist(destinationPath + '/a');

  Object.keys(files).forEach((fileExt) => {
    const locales = files[fileExt].locales;
    Object.keys(files[fileExt].locales).forEach((locale) => {
      const fileName = `${newFilePrefix}_${locale}.${fileExt}`;
      let fileContents;

      switch (files[fileExt].type) {
        case MergeType.ASSIGN:
          fileContents = JSON.stringify(locales[locale]);
          break;
        case MergeType.CONCAT:
        default:
          fileContents = locales[locale];
      }

      const filePath = destinationPath + '/' + fileName;

      fs.writeFileSync(filePath, fileContents);
    });
  });
}

function createPathIfDoesntExist(filepath) {
  const dirname = path.dirname(filepath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  createPathIfDoesntExist(dirname);
  fs.mkdirSync(dirname);
}

function getFileDefinitions(fileName): {locale: string, fileType: string} {
  const extIndex = fileName.lastIndexOf('.') + 1;
  const localeIndex = fileName.lastIndexOf('_') + 1;
  return {
    locale: localeIndex !== 0 ? fileName.substring(localeIndex, extIndex - 1) : null,
    fileType: fileName.substring(extIndex)
  };
}

function getFileContents(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}
