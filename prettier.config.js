/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    tabWidth: 4,
    singleQuote: true,
    jsxSingleQuote: true,
    quoteProps: 'consistent',
    semi: true,
    trailingComma: 'none',
    plugins: ['prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss']
};

export default config;
