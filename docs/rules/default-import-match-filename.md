# import/default-import-match-filename

Enforces default import name to match filename. Name matching is case-insensitive, and characters `._-` are stripped.

## Rule Details

### Fail

```js
import notFoo from './foo';
import utilsFoo from '../utils/foo';
import notFoo from '../foo/index.js';
import foo from '../foo/index.js';
import notMerge from 'lodash/merge';
const bar = require('./foo');
const bar = require('../foo');
```

### Pass

```js
import foo from './foo';
import foo from '../foo/index.js';
import merge from 'lodash/merge';
import anything from 'foo';
import foo_ from './foo';
import foo from './foo.js';
import fooBar from './foo-bar';
import FoObAr from './foo-bar';
import catModel from './cat.model.js';
const foo = require('./foo');
```
