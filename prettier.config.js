/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    tabWidth: 4,
    singleQuote: true,
    jsxSingleQuote: true,
    quoteProps: 'consistent',
    semi: true,
    trailingComma: 'none',
    plugins: ['prettier-plugin-tailwindcss', 'prettier-plugin-sort-imports']
};

export default config;
