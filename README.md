# EL.JS
## Library for creating component-based UI
---
- Developing as part of `Monna Histea` Project
---


* You can create elements with: `el(tag, cb)`
* You can add them to existing elements with: `elto(elem, el(...))`
* You can use predefined components like: `elButton("Caption", onclick, cb)`

* `cb` - means that this will call after blank element creation. So all the parameters you make yourself

# Install
* Will download file `el.js` to your working folder
```sh
curl https://raw.githubusercontent.com/AldieNightStar/el_js/master/el.js > el.js
```


# Documentation

- [Basic Elements](docs/Basic.md)
- [Interactive Elements](docs/Interactive.md)
- [Timers etc](docs/Timers.md)
- [Animation](docs/Animation.md)
- [Scenes](docs/Scenes.md)
- [Storage](docs/Storage.md)
- [ElVariable](docs/ElVariable.md)
- [Events](docs/Events.md)
- [Audio](docs/Audio.md)

### Core Element
```js
// Creates element from scratch
let e = el("span", span => {
    span.innerHTML = "Hello!";
})

// We can chain element callbacks with `then`
el("span").then(e => e.innerHTML = "Hello!")

// Also there is helpers:
el("span")
    .then(elInner("Hello!"))        // elInner - changes innerHTML
    .then(elStyle("width", "32px")) // elStyle - set's style parameters
    .then(elClass("class"))         // elClass - set's the class
    .then(elId("id"))               // elId    - set's the id
    .then(elSet("test", 123))       // elSet   - set provided parameter
    .then(span => { /* ... */ })    // also you can use your own callbacks

// Delete the element (It will be disconnected from DOM)
e.delete();

// Add element to "document.body"
elto(document.body, e);
```

