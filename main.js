// BUG: With Nitro plugin, this dynamic import is not transformed by
// dynamicImportVarsPlugin due to the comment inside import().
// Remove the comment and it works correctly.
const locale = 'en';
const strings = await import(/* strings */ `./translations/${locale}/strings.json`);
console.log(strings);
