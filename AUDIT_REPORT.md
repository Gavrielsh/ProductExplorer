> **Summary:** 7 orphans

# Project Audit Report

Generated: 2025-10-22T14:54:43.758Z

**Config**

- SRC: `C:\Users\gavri\Desktop\ProductExplorer\src`
- tsconfig: `C:\Users\gavri\Desktop\ProductExplorer\tsconfig.json`


## Dependencies (depcheck)
- depcheck failed to run.

```
Command failed: npx --yes depcheck --skip-missing=true --json
```

## Unused exports/files (ts-prune)
- ts-prune failed to run.

```
C:\Users\gavri\AppData\Local\npm-cache\_npx\1532855dfcb86dac\node_modules\ts-prune\lib\runner.js:24
    var filterIgnored = config.ignore !== undefined ? presented.filter(function (file) { return !file.match(config.ignore); }) : presented;
                                                                                                      ^

SyntaxError: Invalid regular expression: /C:\Users\gavri\Desktop\ProductExplorer\src/**/*.test.*|C:\Users\gavri\Desktop\ProductExplorer\src/__tests__/**|**/*.spec.*/: Nothing to repeat
    at String.match (<anonymous>)
    at C:\Users\gavri\AppData\Local\npm-cache\_npx\1532855dfcb86dac\node_modules\ts-prune\lib\runner.js:24:103
    at Array.filter (<anonymous>)
    at Object.run (C:\Users\gavri\AppData\Local\npm-cache\_npx\1532855dfcb86dac\node_modules\ts-prune\lib\runner.js:24:65)
    at Object.<anonymous> (C:\Users\gavri\AppData\Local\npm-cache\_npx\1532855dfcb86dac\node_modules\ts-prune\lib\index.js:10:28)
    at Module._compile (node:internal/modules/cjs/loader:1706:14)
    at Object..js (node:internal/modules/cjs/loader:1839:10)
    at Module.load (node:internal/modules/cjs/loader:1441:32)
    at Function._load (node:internal/modules/cjs/loader:1263:12)
    at TracingChannel.traceSync (node:diagnostics_channel:328:14)

Node.js v22.21.0

```

## Dependencies graph (madge)
- Circular dependency groups: 0
- Orphan files (not imported by others): 7

<details>
<summary>Show orphan files</summary>

- __mocks__/react-native-vector-icons/Ionicons.js
- __tests__/FavoritesScreen.test.tsx
- __tests__/HomeScreen.test.tsx
- __tests__/ProductItem.test.tsx
- __tests__/productsSlice.async.test.ts
- __tests__/productsSlice.test.ts
- __tests__/selectors.test.ts

</details>

## ESLint (unused vars/imports)
- ESLint failed to run.

```

Oops! Something went wrong! :(

ESLint: 8.57.0

Error: .eslintrc.js » @react-native-community/eslint-config#overrides[2]:
	Environment key "jest/globals" is unknown

    at C:\Users\gavri\Desktop\ProductExplorer\node_modules\@eslint\eslintrc\dist\eslintrc.cjs:2079:23
    at Array.forEach (<anonymous>)
    at ConfigValidator.validateEnvironment (C:\Users\gavri\Desktop\ProductExplorer\node_modules\@eslint\eslintrc\dist\eslintrc.cjs:2073:34)
    at ConfigValidator.validateConfigArray (C:\Users\gavri\Desktop\ProductExplorer\node_modules\@eslint\eslintrc\dist\eslintrc.cjs:2223:18)
    at CascadingConfigArrayFactory._finalizeConfigArray (C:\Users\gavri\Desktop\ProductExplorer\node_modules\@eslint\eslintrc\dist\eslintrc.cjs:3985:23)
    at CascadingConfigArrayFactory.getConfigArrayForFile (C:\Users\gavri\Desktop\ProductExplorer\node_modules\@eslint\eslintrc\dist\eslintrc.cjs:3791:21)
    at FileEnumerator._iterateFilesRecursive (C:\Users\gavri\Desktop\ProductExplorer\node_modules\eslint\lib\cli-engine\file-enumerator.js:486:49)
    at _iterateFilesRecursive.next (<anonymous>)
    at FileEnumerator.iterateFiles (C:\Users\gavri\Desktop\ProductExplorer\node_modules\eslint\lib\cli-engine\file-enumerator.js:299:49)
    at iterateFiles.next (<anonymous>)

```
