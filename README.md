# README

* You can create elements with: `el(tag, cb)`
	* You can add them to existing elements with: `elto(elem, el(...))`
	* You can use predefined components like: `elButton("Caption", onclick, cb)`

	* `cb` - means that this will call after blank element creation. So all the parameters you make yourself

# Defined elements
---

### Element
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

### Button
```js
// Create button element with onClick stuff
// and optional 'cb' to add additional elements
let b = elButton(caption, onClick, cb)
```



### Self Replaceable Button
```js
// Create button which will replace with it's context when clicked
// It will be replaced with scene
let b = elButtonR(caption, api => {
    // api - Same as in scene (Check out elScene element)
})
```



### Text Label
```js
// Create text element
let t = elText(text, cb);

// Set new text to it
t.setText(text)
```



### Timer Element
```js
// Create timer element
// ontick - calls everytick
// will stop if element is disconnected from the DOM
// elTimerOnce - used to make one-time timer
let t = elTimer(intervalMs, ontimer)
let t = elTimerOnce(intervalMs, ontimer)

// Retunrs how many ticks were happen
t.count()

// Stops the timer
t.stop()

// Sample
elTimer(500, t => {
    // Stop when ticks is more than 25
    if (t.count() > 25) t.stop()
})
```




### Prefixed Text element
```js
// Created prefixed text/number
let t = elPrefixed("Life: ", 32)

// Update text (Prefix will leave as is)
t.setText(t);
```




### Multitext Element
```js
// Creates multiplied text according to a given number
// prefix    - used to prefix the multitext
// character - used to be multiplied by 'num'
let t = elPrefixMultext(prefix, character, num)

// Remultiply text. Change count of symbols
t.setNum(10)
```



### Scene Element
```js
// Creates Scene Element
// Allows to clear itself etc
let scene = elScene(api => {
    // Clear the scene
    // Will just destroy everything
    api.clear();

    // Reload the scene (Will call the api again)
    api.reload();

    // Get span DOM object which scene is
    api.span();

    // Add element without next line
    api.append(el(...));

    // Add element with next line
    api.appendLn(el(...));

    // Will completely remove the scene
    api.stop();

    // Change scene code to some another API call
    // Will reload then call that function
    // New function will replace old one
    api.change(api => {
        api.appendLn(elText("Hi there"));
    })

    // Will add a timer to the scene
    // Timer will remain working until clear/stop
    let timer = api.timer(ms, callback);
    timer.stop(); // Stop the timer manually;
    timer.count(); // Get ticks done by timer counter
})

// Get the same api here
scene.api
```


### Named Scenes
```js
// Create named scenes from storageVariable
//     storageVariable could be get from elStorage
//     for example:   storage.variable("name")
// Works as simple scenes
// BUT has differences in API
// First scene name is "main"
let scene = elNamedScenes(nameVar, {
    main: api => {
        // API mostly the same as Scene API
        // Differences:
        
        // Change scene to another (by name)
        // Here we provide name (not a function)
        api.change("scene1");

        // Reload will work by getting name
        //   from variable and then resolve
        //   which scene need to load
        api.reload();
    },
    scene1: api => {},
    scene2: api => {}
});
```




### Sequence of Scenes
```js
// Create sequental scenes
// Uses countVar (elStorage Variable) to remember the position
//     Can be taken from elStorage
//     For example:   storage.variable("seq_1")
// To switch to the next, use:           api.next()
// To check that this is the last one:   api.isLast()
let scene = elSeq(countVar
    api => {
        api.appendLn(elText("This is how i go!"))
        api.appendLn(elButton("Next >>", api.next))
        // api.next() - will switch scene to the next one
    },
    api => {
        api.appendLn(elText("The new world"))
        api.appendLn(elButton("Next >>", api.next))
        // api.next() - will switch scene to the next one
    },
    api => {
        api.appendLn(elText("This is all"))
    }
)
scene.api.stop() // Stops the scene to display
```




### Sequence of Texts
```js
// Creates sequental text scenes
// Used only for long stories with 'next'-button based interactivity
// Uses countVar (elStorage Variable) to remember the position
//     Can be taken from elStorage
//     For example:   storage.variable("seq_1")
let scene = elSeqText(countVar,
    "This is the world",
    "We are here",
    "Now all set",
    "Done"
)
scene.api.next() // Set scene to the next text sequence
scene.api.stop() // Stop displaying that scene
```





### Choice
```js
// Will create set of buttons to choose
// According to text we will do something
elChoose((api, result) => {
    // Callback when we done the choice
    // api    - is the same as in Scene api (We can see it in the Scene api object)
    // result - will have a chosen value
    api.append(elText("We choosed: "))
    api.appendLn(elText(result))
},
    // Our variants to choose
    ["Adult", 21],
    ["Young but Adult", 18],
    ["Young boy", 16],
    ["Child", 8],
);
```




### Input Element
```js
// Component which allows you to write the some text and wait to be changed
let inp = elInput("Enter your name", name => {
    window.alert("Your name is " + name);
})
```



### Order of Elements
```js
// Allows user to manage order of each element
// Will not be saved during reload. Need to know it
elOrder(elements => {
    // Will call on any change in order
    // elements - list of elements to work with
},
    // Elements to put into for ordering
    elText("Alpha"),
    elText("Beta"),
    elText("Gamma"),
    elText("Delta"),
    elText("Omega")
)

// Short usage of this method is
elOrder(cb, ...elements)
```


### Collapser
```js
// Will add scene with ability to collapse
// When collapsed - all elements are removed
let c = elCollapse("Items", api => {
    // api - same as in Scene element
})
```





### Count-down text
```js
// This element will count-down until 0
// Each time it counting, it will call the callback with remaining number
// 32   - count down number. Will be counting from 32 -> 0
// 1000 - milliseconds per step
let c = elCountDown(32, 1000, n => {
    // If n == 0 then we lose :)
    if (n == 0) window.alert("You lose!");

    // We can delete it when done
    if (n == 0) c.api.stop();
})

// Delete the count-down scene
c.api.stop();
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




### Event Element
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