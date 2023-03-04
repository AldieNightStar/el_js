# Storage stuff

* Building block for most elements
* Used to save/restore states and data in elements
* Allows you to create `ElVariable`'s and choose where to save them

---


### Storage
```js
// Create storage memory
// Its not an Element (Don't add to a Scene or DOM)
// Each storage should have it's own namespace. For example "mystore"
// provider - is a function which provide connection to a memory. By Default: () => sessionStorage
//     providers:
//         elStorage.SESSION   - used for sessionStorage connection
//         elStorage.LOCAL     - used for localStorage connection
//         elStorage.CACHE     - used for temporary (lossy on refresh) connection
//     custom provider:
//         just create function which returns object with functions:
//             setItem(name, value)
//             getItem(name)
let store = elStorage("mystore", provider);

// Set items by name
store.set('a', val1);

// Get items by name
store.get('a');

// Make ElVariable by name (Check Variable part)
// Under the hood it works as get/set
let v = store.variable('a')
```





### Variable
```js
// Create ElVariable from getter and setter
// getter - func() -> value
// setter - func(val) -> bool
let v = ElVariable(getter, setter);

// Set value
v.set(123);

// Get value
v.get();

// Returns true if variable is null or undefined
v.isNull();

// If variable is null then default 'val' will be set
v.inital(val);
```