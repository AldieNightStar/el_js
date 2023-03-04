# README

* You can create elements with: `el(tag, cb)`
	* You can add them to existing elements with: `elto(elem, el(...))`
	* You can use predefined components like: `elButton("Caption", onclick, cb)`

	* `cb` - means that this will call after blank element creation. So all the parameters you make yourself

### Core Element functionality
```js
// Creates element from scratch
let e = el("span", span => {
    span.innerHTML = "Hello!";
})

// It has also additional functional helpers
//
// elements allowing 'then' chain function calls
// It allows to add a lot of callbacks to the element
// And it will still return previous element
el("span")
    .then(elInner("Hello!"))      // elInner - changes innerHTML
    .then(elStyle("width: 32px")) // elStyle - set's style parameters
    .then(elClass("class"))       // elClass - set's the class
    .then(elId("id"))             // elId    - set's the id
    .then(elSet("test", 123))     // elSet   - set provided parameter
    .then(span => { /* ... */ })  // also you can use your own callbacks

// Additional API
// ==============

// Will delete the element
e.delete();
```

# Documentation

(Basic Elements)[docs/Basic.md]
(Interactive Elements)[docs/Interactive.md]
(Scene related stuff)[docs/Scenes.md]
(Timers etc)[docs/Timers.md]
(Special Elements)[docs/Special.md]