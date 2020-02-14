import docsUrl from '../docsUrl'
import isStaticRequire from '../core/staticRequire'
import Path from 'path'
import fs from 'fs'

/**
 * @param {string} filename
 * @returns {string}
 */
function removeExtension(filename) {
  return Path.basename(filename, Path.extname(filename))
}

/**
 * @param {string} filename
 * @returns {string}
 */
function normalizeFilename(filename) {
  return filename.replace(/[-_.]/g, '').toLowerCase()
}

/**
 * Test if local name matches filename.
 * @param {string} localName
 * @param {string} filename
 * @returns {boolean}
 */
function isCompatible(localName, filename) {
  const normalizedLocalName = localName.replace(/_/g, '').toLowerCase()

  return (
    normalizedLocalName === normalizeFilename(filename) ||
    normalizedLocalName === normalizeFilename(removeExtension(filename))
  )
}

/**
 * Match 'foo' but not 'foo/bar.js' and './foo'
 * @param {string} path
 * @returns {boolean}
 */
function isBarePackageImport(path) {
  return path !== '.' && path !== '..' && !path.includes('/')
}

/**
 * Match paths consisting of only '.' and '..', like '.', './', '..', '../..'.
 * @param {string} path
 * @returns {boolean}
 */
function isAncestorRelativePath(path) {
  return (
    path.length > 0 &&
    !path.startsWith('/') &&
    path
      .split('/')
      .every(segment => segment === '..' || segment === '.' || segment === '')
  )
}

/**
 * @param {string} packageJsonPath
 * @returns {string | undefined}
 */
function getPackageJsonName(packageJsonPath) {
  try {
    const packageJsonContent = String(fs.readFileSync(packageJsonPath))
    const packageJson = JSON.parse(packageJsonContent)
    return packageJson.name || undefined
  } catch (_) {
    return undefined
  }
}

function getNameFromPackageJsonOrDirname(path, context) {
  const directoryName = Path.join(context.getFilename(), path, '..')
  const packageJsonPath = Path.join(directoryName, 'package.json')
  const packageJsonName = getPackageJsonName(packageJsonPath)
  return packageJsonName || Path.basename(directoryName)
}

/**
 * Get filename from a path.
 * @param {string} path
 * @param {object} context
 * @returns {string | undefined}
 */
function getFilename(path, context) {
  // like require('lodash')
  if (isBarePackageImport(path)) {
    return undefined
  }

  // like require('.'), require('..'), require('../..')
  if (isAncestorRelativePath(path)) {
    return getNameFromPackageJsonOrDirname(path, context)
  }

  const basename = Path.basename(path)

  const filename = /^index$|^index\./.test(basename)
    ? Path.basename(Path.dirname(path))
    : basename

  if (filename === '' || filename === '.' || filename === '..') {
    return undefined
  }
  return filename
}

/**
 * @param {string[]} ignorePaths
 * @param {string} path
 * @returns {boolean}
 */
function isIgnored(ignorePaths, path) {
  return ignorePaths.some(pattern => path.includes(pattern))
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: docsUrl('default-import-match-filename'),
    },
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          ignorePaths: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
    ],
  },

  create(context) {
    const ignorePaths = context.options[0]
      ? context.options[0].ignorePaths || []
      : []

    return {
      ImportDeclaration(node) {
        const defaultImportSpecifier = node.specifiers.find(
          ({type}) => type === 'ImportDefaultSpecifier'
        )

        const defaultImportName =
          defaultImportSpecifier && defaultImportSpecifier.local.name

        if (!defaultImportName) {
          return
        }

        const filename = getFilename(node.source.value, context)

        if (!filename) {
          return
        }

        if (
          !isCompatible(defaultImportName, filename) &&
          !isIgnored(ignorePaths, node.source.value)
        ) {
          context.report({
            node: defaultImportSpecifier,
            message: `Default import name does not match filename "${filename}".`,
          })
        }
      },

      CallExpression(node) {
        if (
          !isStaticRequire(node) ||
          node.parent.type !== 'VariableDeclarator' ||
          node.parent.id.type !== 'Identifier'
        ) {
          return
        }

        const localName = node.parent.id.name

        const filename = getFilename(node.arguments[0].value, context)

        if (!filename) {
          return
        }

        if (
          !isCompatible(localName, filename) &&
          !isIgnored(ignorePaths, node.arguments[0].value)
        ) {
          context.report({
            node: node.parent.id,
            message: `Default import name does not match filename "${filename}".`,
          })
        }
      },
    }
  },
}
