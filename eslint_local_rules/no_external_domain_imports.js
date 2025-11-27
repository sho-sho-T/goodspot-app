// eslint rule: externalレイヤー以外から '@/external/domain/**' をインポートすることを禁止する
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        "externalレイヤー以外から '@/external/domain/**' をインポートすることを禁止する",
      category: 'Best Practices',
      recommended: false,
    },
    schema: [],
    messages: {
      noExternalDomain:
        "Don't import from '@/external/domain/**' outside the external layer. Re-export needed types from a feature/shared types module.",
    },
  },
  create(context) {
    // '@/external/domain/**' からのインポートを検知し、違反を報告する
    function reportIfExternalDomainImport(source, node) {
      if (
        typeof source === 'string' &&
        source.startsWith('@/external/domain/')
      ) {
        context.report({ node, messageId: 'noExternalDomain' })
      }
    }

    return {
      ImportDeclaration(node) {
        // ESM import のパスをチェック
        reportIfExternalDomainImport(
          node.source && node.source.value,
          node.source || node
        )
      },
      CallExpression(node) {
        // CommonJS の require 呼び出しも対象にする
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments &&
          node.arguments.length === 1
        ) {
          const arg = node.arguments[0]
          if (arg && arg.type === 'Literal') {
            reportIfExternalDomainImport(arg.value, arg)
          }
        }
      },
    }
  },
}
