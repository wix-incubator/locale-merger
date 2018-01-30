import {expect} from 'chai';
import {merge} from '../src/index';
import * as mock from 'mock-fs';
const fs = require('fs');

describe('Merge Locales', () => {
  beforeEach(() => {
    mock({
      js: {
        path1: {
          'messages1_en.js': '1',
        },
        path2: {
          'messages1_en.js': '2',
          'messages1_de.js': '3',
        },
        path3: {}
      },
      jsonPath1: {
        'messages1_en.json': '{"a":2}',
        'messages1_de.json': '{"a":3}',
      },
      jsonPath2: {
        'messages1_en.json': '{"b":1,"c":2}',
        'messages1_de.json': '{"a":2}',
      },
      jsAndJsonPath1: {
        'messages1_en.json': '{"b":1,"c":2}',
        'messages1_en.js': '1'
      },
      jsAndJsonPath2: {
        'messages1_en.json': '{"b":3,"c":2,"z":0,"a":9}',
        'messages1_en.js': '2',
      },
      unsupportedFilePath: {
        'unsupportedFile.scss': '',
        'messages1_en.js': '2'
      },
      withInnerFolderPath: {
        innerFolder: {},
        'messages1_en.js': '3'
      },
      fileWithoutLocaleSuffixPath: {
        'messages1.js': '3',
        'messages1_en.js': '2'
      }
    });
  });

  afterEach(() => mock.restore());

  it('should handle one js file', () => {
    merge(['js/path1'], 'newFolder', 'prefix1');

    expect(fs.readFileSync('newFolder/prefix1_en.js', 'utf-8')).to.be.equal('1');
  });

  it('should handle empty directory', () => {
    merge(['js/path1', 'js/path3'], 'newFolder', 'prefix1');

    expect(fs.readFileSync('newFolder/prefix1_en.js', 'utf-8')).to.be.equal('1');
  });

  it('should handle directory that doesn\'t exist', () => {
    merge(['js/path1', 'js/2/4'], 'newFolder', 'prefix1');

    expect(fs.readFileSync('newFolder/prefix1_en.js', 'utf-8')).to.be.equal('1');
  });

  it('should handle two js files', () => {
    merge(['js/path1', 'js/path2'], 'newFolder', 'prefix2');

    expect(fs.readFileSync('newFolder/prefix2_en.js', 'utf-8')).to.be.equal('12');
    expect(fs.readFileSync('newFolder/prefix2_de.js', 'utf-8')).to.be.equal('3');
  });

  it('should handle two json files', () => {
    merge(['jsonPath1', 'jsonPath2'], 'newFolder', 'prefix3');

    expect(fs.readFileSync('newFolder/prefix3_en.json', 'utf-8')).to.be.equal('{"b":1,"c":2,"a":2}');
    expect(fs.readFileSync('newFolder/prefix3_de.json', 'utf-8')).to.be.equal('{"a":3}');
  });

  it('should handle two js and json files', () => {
    merge(['jsAndJsonPath1', 'jsAndJsonPath2'], 'newFolder1', 'prefix4');

    expect(fs.readFileSync('newFolder1/prefix4_en.json', 'utf-8')).to.be.equal('{"b":1,"c":2,"z":0,"a":9}');
    expect(fs.readFileSync('newFolder1/prefix4_en.js', 'utf-8')).to.be.equal('12');
  });

  it('should ignore unsupported file types and inner folders', () => {
    merge(['js/path1', 'unsupportedFilePath', 'withInnerFolderPath'], 'newFolder', 'prefix5');

    expect(fs.readFileSync('newFolder/prefix5_en.js', 'utf-8')).to.be.equal('123');
  });

  it('should ignore file without locale suffix', async () => {
    merge(['js/path1', 'fileWithoutLocaleSuffixPath'], 'newFolder', 'prefix6');

    expect(fs.readFileSync('newFolder/prefix6_en.js', 'utf-8')).to.equal('12');

    await fs.readdir('newFolder', (err, filenames) => {
      expect(filenames).to.deep.equal(['prefix6_en.js']);
    });
  });
});
