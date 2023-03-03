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
let t = elTimer(intervalMs, ontick)

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



### Sequence Text Element
```js
// Creates Sequence of texts
let t = elSeqText(api => {
    api.then("First line")
    api.then("Second line")
    api.then("Third line")
    api.then("Final line")
    api.nextButton(elButton("Next")) // Do not forget to set next button
})
```

### Scene Element
```js
// Creates Scene Element
// Allows to clear itself etc
let s = elScene(api => {
    // Clear the scene
    api.clear();

    // Add element without next line
    api.append(el(...));

    // Add element with next line
    api.appendLn(el(...));

    // Will completely remove the scene
    api.stop();

    // Will add a timer to the scene
    // Timer will remain working until clear/stop
    let timer = api.timer(ms, callback);
    timer.stop(); // Stop the timer manually;
    timer.count(); // Get ticks done by timer counter
})
```