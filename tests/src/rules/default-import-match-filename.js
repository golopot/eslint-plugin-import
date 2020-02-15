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

const parserOptions = {
  ecmaVersion: 6,
  sourceType: 'module',
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
    {
      filename: 'JordanHarband.js',
      parserOptions,
      code: 'export default JordanHarband;',
    },
    {
      filename: 'JordanHarband.js',
      parserOptions,
      code: 'export default function () {}',
    },
    {
      filename: 'JordanHarband.jsx',
      parserOptions,
      code: 'export default JordanHarband;',
    },
    {
      filename: '/some/path/to/JordanHarband.js',
      parserOptions,
      code: 'export default JordanHarband;',
    },
    {
      filename: '/another/path/to/JordanHarband.jsx',
      parserOptions,
      code: 'export default JordanHarband;',
    },
    {
      filename: '/another/path/to/jordanHarband.js',
      parserOptions,
      code: 'export default jordanHarband;',
    },
    {
      filename: '/another/path/to/jordanHarband.js',
      parserOptions,
      code: 'export default function jordanHarband(){};',
    },
    {
      filename: '/another/path/to/JordanHarband.jsx',
      parserOptions,
      code: 'export default class JordanHarband {}',
    },
    {
      filename: 'JordanHarband.jsx',
      parserOptions,
      code: 'export default class JordanHarband {}',
    },
    {
      filename: 'JordanHarband.js',
      parserOptions,
      code: 'export default class JordanHarband {}',
    },
    {
      filename: 'JordanHarband.jsx',
      parserOptions,
      code: 'export default function JordanHarband() {}',
    },
    {
      filename: 'JordanHarband.js',
      parserOptions,
      code: 'export default function JordanHarband() {}',
    },
    {
      filename: '/path/to/JordanHarband/index.jsx',
      parserOptions,
      code: 'export default class JordanHarband {}',
    },
    {
      filename: 'TaeKim.ts',
      parserOptions,
      code: 'export default TaeKim;',
      settings: {
        'import/extensions': ['.ts'],
      },
    },
    {
      filename: 'TaeKim.tsx',
      parserOptions,
      code: 'export default TaeKim;',
      settings: {
        'import/extensions': ['.tsx'],
      },
    },
    {
      filename: 'TaeKim.js',
      parserOptions,
      code: 'export default TaeKim;',
      settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    {
      filename: 'TaeKim.jsx',
      parserOptions,
      code: 'export default TaeKim;',
      settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    {
      filename: 'TaeKim.ts',
      parserOptions,
      code: 'export default TaeKim;',
      settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    {
      filename: 'TaeKim.tsx',
      parserOptions,
      code: 'export default TaeKim;',
      settings: {
        'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
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
    {
      filename: 'NotJordanHarband.js',
      code: 'export default JordanHarband;',
      output: 'export default JordanHarband;',
      parserOptions,
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'Identifier',
      }],
    },
    {
      filename: 'NotJordanHarband.jsx',
      code: 'export default JordanHarband;',
      output: 'export default JordanHarband;',
      parserOptions,
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'Identifier',
      }],
    },
    {
      filename: 'path/to/something/NotJordanHarband.jsx',
      code: 'export default JordanHarband;',
      output: 'export default JordanHarband;',
      parserOptions,
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'Identifier',
      }],
    },
    {
      filename: 'path/to/something/NotJordanHarband.jsx',
      code: 'export default class JordanHarband {}',
      output: 'export default class JordanHarband {}',
      parserOptions,
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'ClassDeclaration',
      }],
    },
    {
      filename: 'path/to/something/NotJordanHarband.jsx',
      code: 'export default function JordanHarband () {}',
      output: 'export default function JordanHarband () {}',
      parserOptions,
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'FunctionDeclaration',
      }],
    },
    {
      filename: 'path/to/something/JoRdAnHaRbAnD.jsx',
      code: 'export default function jordanHarband () {}',
      output: 'export default function jordanHarband () {}',
      parserOptions,
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'FunctionDeclaration',
      }],
    },
    {
      filename: 'index.js',
      parserOptions,
      code: 'export default class JordanHarband {}',
      output: 'export default class JordanHarband {}',
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'ClassDeclaration',
      }],
    },
    {
      filename: 'NotJordanHarband/index.js',
      parserOptions,
      code: 'export default class JordanHarband {}',
      output: 'export default class JordanHarband {}',
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'ClassDeclaration',
      }],
    },
    {
      filename: 'JordanHarband/foobar.js',
      parserOptions,
      code: 'export default class JordanHarband {}',
      output: 'export default class JordanHarband {}',
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'ClassDeclaration',
      }],
    },
    {
      filename: 'path/to/JoRdAnHaRbAnD/index.js',
      parserOptions,
      code: 'export default class JordanHarband {}',
      output: 'export default class JordanHarband {}',
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'ClassDeclaration',
      }],
    },
    {
      filename: 'path/to/Jo_RdAnH_aRbAnD/index.js',
      parserOptions,
      code: 'export default class JordanHarband {}',
      output: 'export default class JordanHarband {}',
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'ClassDeclaration',
      }],
    },
    {
      filename: '/path/to/JordanHarbandReducer.js',
      parserOptions,
      code: 'export default function jordanHarband() {}',
      output: 'export default function jordanHarband() {}',
      errors: [{
        message: getMessage('JordanHarband'),
        type: 'FunctionDeclaration',
      }],
    },
    {
      filename: 'NotTaeKim.ts',
      code: 'export default TaeKim;',
      output: 'export default TaeKim;',
      parserOptions,
      errors: [{
        message: getMessage('TaeKim'),
        type: 'Identifier',
      }],
      settings: {
        'import/extensions': ['.ts'],
      },
    },
    {
      filename: 'NotTaeKim.tsx',
      code: 'export default TaeKim;',
      output: 'export default TaeKim;',
      parserOptions,
      errors: [{
        message: getMessage('TaeKim'),
        type: 'Identifier',
      }],
      settings: {
        'import/extensions': ['.tsx'],
      },
    },
  ],
})
