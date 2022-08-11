const url = 'https://nextjs.org/docs/messages/next-head-key'

module.exports = {
  meta: {
    docs: {
      description: 'Enforce `key` property on tags inside `next/head`.',
      recommended: true,
      url,
    },
    type: 'problem',
    schema: [],
  },
  create: function (context) {
    let isNextHead = null

    return {
      ImportDeclaration(node) {
        if (node.source.value === 'next/head') {
          isNextHead = node.source.value
        }
      },
      JSXElement(node) {
        if (!isNextHead) {
          return
        }

        if (
          node.openingElement &&
          node.openingElement.name &&
          node.openingElement.name.name !== 'Head'
        ) {
          return
        }

        const nestedChildren = node.children.reduce((acc, child) => {
          if (child.type === 'JSXFragment') {
            acc.push(...child.children)
          }

          if (
            child.type === 'JSXExpressionContainer' &&
            child.expression.type === 'ArrayExpression'
          ) {
            acc.push(...child.expression.elements)
          }

          return acc
        }, [])

        const tags = [...node.children, ...nestedChildren].filter(
          (child) =>
            child.openingElement &&
            child.openingElement.name &&
            child.openingElement.name.name !== 'title' &&
            child.openingElement.name.type === 'JSXIdentifier'
        )

        tags.forEach((tag) => {
          const hasKeyAttribute = tag.openingElement.attributes
            .filter((attr) => attr.type === 'JSXAttribute')
            .some(
              (attribute) =>
                attribute.name.name === 'key' && attribute.value !== null
            )

          if (!hasKeyAttribute) {
            context.report({
              node,
              message: `Tags in \`next/head\` must use the \`key\` property to make sure they are only rendered once. See: ${url}`,
            })
          }
        })
      },
    }
  },
}
