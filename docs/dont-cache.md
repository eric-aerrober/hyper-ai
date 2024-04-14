# Dont cache

Instance of a cache which does not cache anything.

Will always trigger the model to be invoked and never save the result.

```js
const cache = new NoCache()
```