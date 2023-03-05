# Basic Elements

* Here are some Basic elements like 'buttons', 'text labels', 'self-replace buttons' etc

---

### Text Label
```js
// Create text element
let t = elText(text, cb);

// Set new text to it
t.setText(text)
```




### Button
```js
// Create button element with onClick stuff
// and optional 'cb' to add additional elements
let b = elButton(caption, onClick, cb)
```




### Input Element
```js
// Component which allows you to write the some text and wait to be changed
let inp = elInput("Enter your name", name => {
    window.alert("Your name is " + name);
})
```




### Self Replaceable Button
```js
// Create button which will replace with it's context when clicked
// It will be replaced with scene
let b = elButtonR(caption, api => {
    // api - Same as in scene (Check out elScene element)
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






### Div element
```js
// It's just an alias for: el('div', callback)
// API the same as for el(...) elements
let div = elDiv(callback)
```
