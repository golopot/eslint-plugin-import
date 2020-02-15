import {RuleTester} from 'eslint'
import {testFilePath} from '../utils'

import rule from '../../../src/rules/default-import-match-filename' // eslint-disable-line import/default

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
  },
})

function getMessage(filename) {
  return `Default import name does not match filename "${filename}".`
}

/**
 * @param {string} code
 * @param {string} expectedFilename
 * @param {string} [filename]
 */
function fail(code, expectedFilename, filename) {
  return {
    code,
    errors: [
      {
        message: getMessage(expectedFilename),
      },
    ],
    filename,
  }
}

ruleTester.run('default-import-match-filename', rule, {
  valid: [
    'import Cat from "./cat"',
    'import cat from "./cat"',
    'import cat from "./Cat"',
    'import Cat from "./Cat"',
    'import cat from "./cat.js"',
    'import cat from "./cat.ts"',
    'import cat from "./cat.jpeg"',
    'import cat from ".cat"',
    'import cat_ from "./cat"',
    'import cat from "./cat/index"',
    'import cat from "./cat/index.js"',
    'import cat from "./cat/index.css"',
    'import cat from "../cat/index.js"',
    'import merge from "lodash/merge"',
    'import loudCat from "./loud-cat"',
    'import LOUDCAT from "./loud-cat"',
    'import loud_cat from "./loud-cat"',
    'import loudcat from "./loud_cat"',
    'import loud_cat from "./loud_cat"',
    'import loudCat from "./loud_cat"',
    'import catModel from "./cat.model"',
    'import catModel from "./cat.model.js"',
    'import doge from "cat"',
    'import doge from "loud-cat"',
    'import doge from ".cat"',
    'import doge from ""',
    'import {doge} from "./cat"',
    'import cat, {doge} from "./cat"',
    'const cat = require("./cat")',
    'const cat = require("../cat")',
    'const cat = require("./cat/index")',
    'const cat = require("./cat/index.js")',
    'const doge = require("cat")',
    'const {f, g} = require("./cat")',
    {
      code: `
        import QWER from './ignore-dir/a';
        import WRYYY from '../models/mmm';
      `,
      options: [{ignorePaths: ['ignore-dir/', 'mmm']}],
    },
    {
      code: `
        import someDirectory from ".";
        import someDirectory_ from "./";
        const someDirectory__ = require('.');
      `,
      filename: testFilePath(
        'default-import-match-filename/some-directory/a.js',
      ),
    },
    {
      code: `
        import packageName from "..";
        import packageName_ from "../";
        import packageName__ from "./..";
        import packageName___ from "./../";
        const packageName____ = require('..');
      `,
      filename: testFilePath(
        'default-import-match-filename/some-directory/a.js',
      ),
    },
    {
      code: 'import doge from "../index.js"',
      filename: 'doge/a/a.js',
    },
  ],
  invalid: [
    fail('import cat0 from "./cat"', 'cat'),
    fail('import catfish from "./cat"', 'cat'),
    fail('import catfish, {cat} from "./cat"', 'cat'),
    fail('import catModel from "./models/cat"', 'cat'),
    fail('import cat from "./cat.model.js"', 'cat.model.js'),
    fail('import doge from "./cat/index"', 'cat'),
    fail('import doge from "./cat/index.js"', 'cat'),
    fail('import doge from "../cat/index.js"', 'cat'),
    fail('import doge from "../cat/index.css"', 'cat'),
    fail('import doge from "lodash/merge"', 'merge'),
    fail('import doge from "lodash/a/b/c"', 'c'),
    fail('import doge from "/cat"', 'cat'),
    fail('import cat7 from "./cat8"', 'cat8'),
    fail('const catfish = require("./cat")', 'cat'),
    fail('const doge = require("./cat/index")', 'cat'),
    fail('const doge = require("./cat/index.js")', 'cat'),
    fail('const doge = require("../models/cat")', 'cat'),
    fail(
      'import nope from "."',
      'some-directory',
      testFilePath('default-import-match-filename/some-directory/a.js'),
    ),
    fail(
      'import nope from ".."',
      'package-name',
      testFilePath('default-import-match-filename/some-directory/a.js'),
    ),
    fail(
      'import nope from "../../index.js"',
      'package-name',
      testFilePath('default-import-match-filename/some-directory/foo/a.js'),
    ),
    {
      code: `import QWERTY from '../bbb/ccc';`,
      output: `import QWERTY from '../bbb/ccc';`,
      options: [{ignorePaths: ['aaa']}],
      errors: [{message: getMessage('ccc')}],
    },
  ],
})
