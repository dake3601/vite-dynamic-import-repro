# Vite 8 dynamic import bug: comments break `dynamicImportVarsPlugin`

## Bug

A comment inside a dynamic `import()` with a template literal prevents Vite 8's `dynamicImportVarsPlugin` from transforming it into a static glob map.

```js
// BROKEN — import is left untransformed, matching files are not bundled
const strings = await import(/* strings */ `./translations/${locale}/strings.json`);

// WORKS — transformed into a static Object.assign map with all matching files
const strings = await import(`./translations/${locale}/strings.json`);
```

## Expected behavior

Both forms should produce identical output: a `_rolldown_dynamic_import_helper_default` call with a static `Object.assign` map containing all files matching `./translations/*/strings.json`.

## Reproduce

```bash
npm install
npx vite build
```

Inspect `dist/assets/index-*.js`:

- **With comment**: the `import()` passes through untransformed — no translation chunks are emitted.
- **Without comment**: `dynamicImportVarsPlugin` produces the expected static map and separate chunks for each translation file.

## Impact

Libraries compiled by TypeScript/SWC often preserve `/* webpackChunkName: "..." */` comments in their output. These are harmless in Vite 7 (Rollup and Rolldown) but break dynamic import resolution in Vite 8 (Rolldown).
