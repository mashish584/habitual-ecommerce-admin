module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "eslint-plugin-import"],
  extends: ["airbnb-base"],
  rules: {
    quotes: [2, "double", { avoidEscape: true }],
    "import/extensions": "off",
    "import/prefer-default-export": "off",
    "import/order": 2,
    "no-tabs": 0,
    "default-case": 0,
    "no-param-reassign": 0,
    "array-callback-return": 0,
    "no-plusplus": 0,
    "no-unused-vars": ["warn", { vars: "all", args: "none", ignoreRestSiblings: false }],
    "@typescript-eslint/no-unused-vars": ["error", { vars: "all", args: "none", ignoreRestSiblings: false }],
    "max-len": 0,
    camelcase: 0,
    "no-restricted-syntax": 0,
    "global-require": 0,
    "consistent-return": 0,
    "no-shadow": 0,
    radix: 0,
    "no-restricted-globals": 0,
    "no-await-in-loop": 0,
    "guard-for-in": 0,
    "default-param-last": 0,
    "object-curly-newline": 0,
    "import/no-unresolved": 0,
    "class-methods-use-this": 0,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "no-undef": "off",
      },
    },
  ],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".ts"],
      },
    },
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};
