Locale Merger
==========================


## How To Use:
1. Install `npm -i --save-dev locale-merger` 
2. Create a `.js` file in your project.
3. Write the following in the file:
    ```typescript
    const {merge} = require('locale-merger');
    
    merge(folderArray, destinationPath, newFilePrefix);
    ```
    (This will Take all files from any of the folders in `folderArray` and merge them into a file per Locale in the `destinationPath` named `${newFilePrefix}_${locale}.${ext}`)
    Example:
    ```typescript
    const {merge} = require('./mergeLocales.js');
    merge([
            'dist/statics/assets/locale/store-manager',
            'node_modules/wixstores-dashboard-storemanager-common/dist/statics/assets/locale/storemanager-common',
            'node_modules/wix-locale-data/dist/scripts/locale'
          ],
          'dist/statics/assets/locale/all',
          'locale');
    ```
    Which will create a file called `locale_${locale}.${ext}` for each local in the given folders.
4. in your `package.json` add `node path/to/file.js` to your build process.
  
  
## The merge function

```typescript
merge(folderArray, destinationPath, newFilePrefix);
```

| Property         | Type       | Required | Description                              |
| ---------------- | ---------- | :------: | ---------------------------------------- |
| `folderArray`    | `string[]` |   Yes    | List of folder containing locale files   |
| `destinationPath`| `string`   |   Yes    | Destination to put merged files          |
| `newFilePrefix`  | `string`   |   Yes    | Prefix for all newly created files.      |
