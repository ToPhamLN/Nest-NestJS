module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'eslint-config-prettier',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        bracketSameLine: false,
        bracketSpacing: true,
        semi: false,
        experimentalTernaries: false,
        singleQuote: true,
        quoteProps: 'as-needed',
        trailingComma: 'none',
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        vueIndentScriptAndStyle: false,
        proseWrap: 'preserve',
        insertPragma: false,
        requirePragma: false,
        tabWidth: 2,
        useTabs: false,
        embeddedLanguageFormatting: 'auto',
        endOfLine: 'auto',
        printWidth: 85,
        jsxSingleQuote: true
      }
    ]
  }
}
