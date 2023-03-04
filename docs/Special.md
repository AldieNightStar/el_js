# Special Stuff

### Events
```js
// Create Event object
// It's not an Element (Don't append it to a scene or DOM)
let evt = elEvent();

// Connect to Events
evt.connect(dat => {
    // Do something with data
    console.log(dat);
    
    // Keep connection
    // Recommended:   return elem.isConnected
    return true
});

// Broadcast data
evt.emit("Hello");

// Clear the events
evt.clear();
```




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

// Make variable by name
// Under the hood it works as get/set
let v = store.variable('a')
v.set(123);
v.get();
v.isNull();    // Returns true if variable is null or undefined
v.inital(val); // If variable is null then default 'val' will be set
```