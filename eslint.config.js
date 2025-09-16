import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import configTypeScript from "@vue/eslint-config-typescript";
import configPrettier from "@vue/eslint-config-prettier";

export default [
  // Base JavaScript configuration
  js.configs.recommended,

  // Vue.js configuration
  ...pluginVue.configs["flat/recommended"],

  // TypeScript configuration
  ...configTypeScript(),

  // Prettier configuration (must be last)
  configPrettier,

  {
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
    },
    rules: {
      // Vue.js specific rules
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "warn",
      "vue/require-default-prop": "error",
      "vue/require-prop-types": "error",
      "vue/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "vue/no-mutating-props": "error",
      "vue/component-definition-name-casing": ["error", "PascalCase"],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/custom-event-name-casing": ["error", "camelCase"],
      "vue/define-emits-declaration": "error",
      "vue/define-props-declaration": "error",
      "vue/no-duplicate-attributes": "error",
      "vue/no-template-key": "error",
      "vue/no-textarea-mustache": "error",
      "vue/no-v-text-v-html-on-component": "error",
      "vue/prefer-separate-static-class": "error",
      "vue/prefer-true-attribute-shorthand": "error",
      "vue/require-v-for-key": "error",
      "vue/valid-v-for": "error",
      "vue/valid-v-slot": "error",

      // TypeScript specific rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",

      // General JavaScript rules
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-unused-vars": "off", // Use TypeScript version instead
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "prefer-template": "error",
      "template-curly-spacing": "error",
      "arrow-spacing": "error",
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "no-case-declarations": "error",
    },
  },

  // Specific overrides for different file types
  {
    files: ["**/*.vue"],
    rules: {
      // Vue template specific rules
      "vue/html-self-closing": [
        "error",
        {
          html: {
            void: "always",
            normal: "always",
            component: "always",
          },
          svg: "always",
          math: "always",
        },
      ],
      "vue/max-attributes-per-line": [
        "error",
        {
          singleline: { max: 3 },
          multiline: { max: 1 },
        },
      ],
      "vue/html-indent": ["error", 2],
      "vue/script-indent": ["error", 2, { baseIndent: 0 }],
      "vue/block-spacing": "error",
      "vue/brace-style": "error",
      "vue/comma-spacing": "error",
      "vue/key-spacing": "error",
      "vue/keyword-spacing": "error",
      "vue/no-spaces-around-equal-signs-in-attribute": "error",
      "vue/object-curly-spacing": ["error", "always"],
      "vue/space-infix-ops": "error",
      "vue/space-unary-ops": "error",
    },
  },

  // Configuration files
  {
    files: ["*.config.js", "*.config.ts", "vite.config.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
    },
  },

  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "*.min.js",
      "public/**",
      "tmp/**",
    ],
  },
];
