export default [
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly",
                require: "readonly",
                module: "readonly",
                __dirname: "readonly",
                __filename: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "error",
            "semi": ["error", "always"],
            "indent": ["error", 4],
            "no-undef": "error"
        }
    }
];
