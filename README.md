# spanan-local-storage

Simple [spanan](https://github.com/chrmod/spanan) localStorage wrapper used for testing spanan.

To try it out load spanan.js and and try:
```
var storage = spanan.import("https://chrmod.github.io/spanan-local-storage");
storage.set("testKey", "testValue").then(function () {
  storage.get("testKey").then(function (value) {
    console.log(value);
  });
});
```


