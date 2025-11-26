module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: `*.action.ts ファイルが先頭で 'use server' を宣言していることを保証する`,
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename()

    if (!filename.endsWith('.action.ts')) {
      return {}
    }

    return {
      'Program:exit'(node) {
        // 'use server' の ExpressionStatement を全て取得
        const useServerStatements = node.body.filter(
          (statement) =>
            statement.type === 'ExpressionStatement' &&
            statement.expression &&
            statement.expression.type === 'Literal' &&
            statement.expression.value === 'use server'
        )

        if (useServerStatements.length === 0) {
          // 1 つも無ければ先頭に追加する修正を提案
          context.report({
            node,
            loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
            message: `*.action.ts files must start with 'use server' directive`,
            fix(fixer) {
              return fixer.insertTextBeforeRange([0, 0], "'use server'\n\n")
            },
          })
          return
        }

        const firstStatement = node.body[0]
        if (
          !(
            firstStatement &&
            firstStatement.type === 'ExpressionStatement' &&
            firstStatement.expression &&
            firstStatement.expression.type === 'Literal' &&
            firstStatement.expression.value === 'use server'
          )
        ) {
          // 先頭以外にある場合も先頭へ移動させる修正を提示
          context.report({
            node: firstStatement || node,
            message: `*.action.ts files must start with 'use server' directive`,
            fix(fixer) {
              return fixer.insertTextBeforeRange([0, 0], "'use server'\n\n")
            },
          })
        }

        // 複数存在していたら 2 つ目以降を削除
        useServerStatements.slice(1).forEach((statement) => {
          context.report({
            node: statement,
            message: "Duplicate 'use server' directive",
            fix(fixer) {
              return fixer.remove(statement)
            },
          })
        })
      },
    }
  },
}
