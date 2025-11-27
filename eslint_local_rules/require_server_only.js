// eslint rule: サーバー用の特定ファイルで "server-only" のインポートを必須にする
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        '特定のサーバー用ファイルに "server-only" のインポートを必須にする',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingServerOnly:
        'Server files must import "server-only" at the top of the file',
    },
  },
  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename()

        // server-only が必要なパスかどうかを判定
        const requiresServerOnly =
          // features/<feature>/servers/<name>.ts
          /\/features\/[^/]+\/servers\/[^/]+\.ts$/.test(filename) ||
          // shared/servers/<name>.ts
          /\/shared\/servers\/[^/]+\.ts$/.test(filename) ||
          // external/handlers/<domain>/<name>.query.ts
          /\/external\/handlers\/[^/]+\/[^/]+\.query\.ts$/.test(filename) ||
          // external/handlers/<domain>/<name>.command.ts
          /\/external\/handlers\/[^/]+\/[^/]+\.command\.ts$/.test(filename) ||
          // external/services/<domain>/<name>.service.ts
          /\/external\/services\/[^/]+\/[^/]+\.service\.ts$/.test(filename)

        if (!requiresServerOnly) {
          return
        }

        // 先頭付近に import "server-only" があるかを調べる
        const hasServerOnlyImport = node.body.some((statement) => {
          return (
            statement.type === 'ImportDeclaration' &&
            statement.source.value === 'server-only'
          )
        })

        if (!hasServerOnlyImport) {
          context.report({
            node: node,
            messageId: 'missingServerOnly',
            fix(fixer) {
              // Add import "server-only" at the beginning of the file
              const firstStatement = node.body[0]
              if (firstStatement) {
                return fixer.insertTextBefore(
                  firstStatement,
                  'import "server-only";\n'
                )
              }
              return fixer.insertTextAfterRange(
                [0, 0],
                'import "server-only";\n'
              )
            },
          })
        }
      },
    }
  },
}
