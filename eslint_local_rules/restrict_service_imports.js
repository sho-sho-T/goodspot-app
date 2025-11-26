module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "external/services からの import を handlers の *.command.ts / *.query.ts に限定する",
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      invalidServiceImport:
        'Services from external/services can only be imported in external/handlers/*.command.ts or external/handlers/*.query.ts files',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const filename = context.getFilename()

        // external/services 配下からの import でなければスキップ
        if (!importPath.includes('/external/services/')) {
          return
        }

        // handlers/<domain>/<name>.command.ts / .query.ts のみ許可
        const isHandlerCommand =
          /\/external\/handlers\/[^/]+\/[^/]+\.command\.ts$/.test(filename)
        const isHandlerQuery =
          /\/external\/handlers\/[^/]+\/[^/]+\.query\.ts$/.test(filename)

        if (isHandlerCommand || isHandlerQuery) {
          return
        }

        // その他のファイルで import していたら報告
        context.report({
          node,
          messageId: 'invalidServiceImport',
        })
      },
    }
  },
}
