# Cache On Disk

Will cache the results of the model invoke onto the disk at the given location.

Will create the directory if it does not exist.

```js
const cache = new CacheOnDisk('./hyper/cache/my-cache-location')
```