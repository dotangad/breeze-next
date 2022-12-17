module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    browser: true,
    es6: true,
    commonjs: true,
  },
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest", // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of import
    // project: "./tsconfig.eslint.json", // Allows for the use of rules which require parserServices to be generated
  },
  plugins: ["react", "@next/eslint-plugin-next", "prettier", "unicorn"],
  rules: {
    "import/prefer-default-export": 0,
    "no-console": "warn",
    "no-nested-ternary": 0,
    "no-underscore-dangle": 0,
    "no-unused-expressions": [
      "error",
      { allowTernary: true, allowShortCircuit: true },
    ],
    camelcase: 0,
    "react/self-closing-comp": 1,
    "react/jsx-filename-extension": [1, { extensions: [".js", "jsx"] }],
    "react/prop-types": 0,
    "react/destructuring-assignment": 0,
    "react/jsx-no-comment-textnodes": 0,
    "react/jsx-props-no-spreading": 0,
    "react/no-array-index-key": 0,
    "react/no-unescaped-entities": 0,
    "react/require-default-props": 0,
    "react/react-in-jsx-scope": 0,
    "linebreak-style": ["error", "unix"],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "prettier/prettier": ["error", { usePrettierrc: true }],
    "@typescript-eslint/ban-ts-comment": "off",
  },
};
