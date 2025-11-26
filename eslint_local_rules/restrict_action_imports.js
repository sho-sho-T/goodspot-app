// eslint rule: "use client" が付いていないコンポーネントからの *.action.ts インポートを禁止する
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        '"use client" 宣言のあるコンポーネントだけが *.action.ts をインポートできるように制限する',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      actionImportNotAllowed:
        'Components without "use client" directive cannot import *.action.ts files. Add "use client" directive, convert to a custom hook (use*.ts/tsx), or remove the action import.',
    },
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        const filename = context.getFilename()

        // 対象は .ts/.tsx のみ（型定義などは除外）
        if (!filename.endsWith('.tsx') && !filename.endsWith('.ts')) {
          return
        }

        // use*.ts(x) のカスタムフックはクライアント扱いのため対象外
        const basename = filename.split('/').pop()
        if (basename.startsWith('use')) {
          return
        }

        // *.action.ts を参照しているか判定
        const importPath = node.source.value
        if (
          !importPath.includes('.action') &&
          !importPath.endsWith('.action.ts')
        ) {
          return
        }

        // AST から先頭に 'use client' があるか確認
        const sourceCode = context.getSourceCode()
        const programNode = sourceCode.ast

        // 先頭 5 行程度に 'use client' ディレクティブがあるか判定
        const hasUseClient = programNode.body.some((statement, index) => {
          // Check only the first few statements for directives
          if (index > 5) return false

          return (
            statement.type === 'ExpressionStatement' &&
            statement.expression.type === 'Literal' &&
            statement.expression.value === 'use client'
          )
        })

        if (!hasUseClient) {
          context.report({
            node: node,
            messageId: 'actionImportNotAllowed',
          })
        }
      },
    }
  },
}
