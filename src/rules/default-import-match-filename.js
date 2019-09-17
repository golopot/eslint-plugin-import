import docsUrl from '../docsUrl'
import isStaticRequire from '../core/staticRequire'
import Path  from 'path'

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
 * Test if path starts with "./" or "../".
 * @param {string} path
 * @returns {boolean}
 */
function isLocalModule(path) {
  return /^(\.\/|\.\.\/)/.test(path)
}

/**
 * Get filename from a path.
 * @param {string} path
 * @returns {string | undefined}
 */
function getFilename(path) {
  if (!isLocalModule(path)) return undefined
  const basename = Path.basename(path)

  const filename = /^index$|^index\./.test(basename)
    ? Path.basename(Path.join(path, '..'))
    : basename

  if (filename === '' || filename === '.' || filename === '..') {
    return undefined
  }
  return filename
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      url: docsUrl('default-import-match-filename'),
    },
  },

  create(context) {
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

        const filename = getFilename(node.source.value)

        if (!filename) {
          return
        }

        if (!isCompatible(defaultImportName, filename)) {
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

        const filename = getFilename(node.arguments[0].value)

        if (!filename) {
          return
        }

        if (!isCompatible(localName, filename)) {
          context.report({
            node: node.parent.id,
            message: `Default import name does not match filename "${filename}".`,
          })
        }
      },
    }
  },
}
