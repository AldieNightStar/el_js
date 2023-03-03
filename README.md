# README

* You can create elements with: `el(tag, cb)`
	* You can add them to existing elements with: `elto(elem, el(...))`
	* You can use predefined components like: `elButton("Caption", onclick, cb)`

	* `cb` - means that this will call after blank element creation. So all the parameters you make yourself

# Defined elements
---



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
let b = elButtonR(caption, api = {
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
// will stop if element is disconnected from DOM
// elTimerOnce - used to make one-time timer
let t = elTimer(intervalMs, ontimer)
let t = elTimerOnce(intervalMs, ontimer)

// Retunrs how many ticks were happen
t.count()

// Stops the timer
t.stop()
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
        api.appendLn(elText("Hi there"))
        api.clear();
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




### Sequence of Scenes
```js
// Create sequental scenes
// To switch to the next, use:           api.next()
// To check that this is the last one:   api.isLast()
let scene = elSeq(
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
let scene = elSeqText(
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
// ACcording to text we will do something
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




