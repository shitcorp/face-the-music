Each package must have the following at the very least for its scripts
(The only exception to this rule is the dashboard project)

```json
"scripts": {
    "build": "yarn run compile",
    "test": "yarn run compile && yarn run mocha",
    "mocha": "ts-mocha \"test/**/*.ts\" --recursive --exit",
    "compile": "shx rm -rf lib/ && tsc"
},
```

Add deps from `deps.md`