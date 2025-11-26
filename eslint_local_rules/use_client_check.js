const path = require('path')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: `client系のコンポーネント／providerが先頭に 'use client' を持つようにする`,
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },
  create(context) {
    const filename = context.filename || context.getFilename()

    // stories/test/spec を除く .tsx ファイルのみが対象
    if (
      !filename.endsWith('.tsx') ||
      filename.endsWith('.stories.tsx') ||
      filename.endsWith('.test.tsx') ||
      filename.endsWith('.spec.tsx')
    ) {
      return {}
    }

    // ディレクトリを解析して対象ディレクトリか判断
    const dirname = path.dirname(filename)

  // client / providers 以下、もしくは shared/components/ui 系の判定
    let shouldHaveUseClient = false
    let dirType = ''

    if (dirname.includes('/client/') || dirname.endsWith('/client')) {
      shouldHaveUseClient = true
      dirType = 'client'
    } else if (
      dirname.includes('/providers/') ||
      dirname.endsWith('/providers')
    ) {
      shouldHaveUseClient = true
      dirType = 'providers'
    }

    if (!shouldHaveUseClient && dirname.includes('shared/components/ui')) {
      shouldHaveUseClient = true
      dirType = 'shared/components/ui'
    }

    // app 直下（route entry）には 'use client' を禁止する
    const isDirectlyUnderApp =
      dirname.endsWith('/src/app') || dirname.endsWith('\\src\\app')

    return {
      'Program:exit'(node) {
        const sourceCode = context.getSourceCode()
        const text = sourceCode.getText()

        // 先頭の directive を確認
        const trimmedText = text.trim()
        const startsWithUseClient =
          trimmedText.startsWith("'use client'") ||
          trimmedText.startsWith('"use client"')

        // If file is directly under app directory, it should NOT have 'use client'
        if (isDirectlyUnderApp && startsWithUseClient) {
          context.report({
            node: node,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 12 },
            },
            message: `Files directly under 'app' directory must not have 'use client' directive`,
            fix(fixer) {
              // Find the 'use client' directive and remove it with any following newlines
              const useClientMatch = text.match(/^['"]use client['"][\r\n]+/)
              if (useClientMatch) {
                return fixer.removeRange([0, useClientMatch[0].length])
              }
            },
          })
          return
        }

        // If file should have 'use client' but doesn't
        if (shouldHaveUseClient && !startsWithUseClient) {
          context.report({
            node: node,
            loc: {
              start: { line: 1, column: 0 },
              end: { line: 1, column: 0 },
            },
            message: `Components in '${dirType}' directory must start with 'use client' directive`,
            fix(fixer) {
              return fixer.insertTextBeforeRange([0, 0], "'use client'\n\n")
            },
          })
        }
      },
    }
  },
}
