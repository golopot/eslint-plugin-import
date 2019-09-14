import {RuleTester} from 'eslint'
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

function fail(code, filename) {
  return {
    code,
    errors: [
      {
        message: getMessage(filename),
      },
    ],
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
    'import loudCat from "./loud-cat"',
    'import LOUDCAT from "./loud-cat"',
    'import loud_cat from "./loud-cat"',
    'import loudcat from "./loud_cat"',
    'import loud_cat from "./loud_cat"',
    'import catModel from "./cat.model"',
    'import catModel from "./cat.model.js"',
    'import doge from "."',
    'import doge from "./"',
    'import doge from "./.."',
    'import doge from "./../"',
    'import doge from ".."',
    'import doge from "../"',
    'import doge from "../.."',
    'import doge from "cat"',
    'import doge from "loud-cat"',
    'import doge from ".cat"',
    'import doge from "/cat"',
    'import doge from ""',
    'import {doge} from "./cat"',
    'import cat, {doge} from "./cat"',
    'const cat = require("..")',
    'const cat = require("./cat")',
    'const cat = require("../cat")',
    'const {f, g} = require("./cat")',
  ],
  invalid: [
    fail('import cat0 from "./cat"', 'cat'),
    fail('import catfish from "./cat"', 'cat'),
    fail('import catfish, {cat} from "./cat"', 'cat'),
    fail('import catModel from "./models/cat"', 'cat'),
    fail('import cat from "./cat.model.js"', 'cat.model.js'),
    fail('import cat from "./cat/index"', 'index'),
    fail('import cat from "./cat/index.js"', 'index.js'),
    fail('import cat from "../cat/index.js"', 'index.js'),
    fail('import cat7 from "./cat8"', 'cat8'),
    fail('const catfish = require("./cat")', 'cat'),
    fail('const cat = require("./cat/index")', 'index'),
    fail('const cat = require("./cat/index.js")', 'index.js'),
    fail('const doge = require("../models/cat")', 'cat'),
  ],
})
