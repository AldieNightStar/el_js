# Floating Element
```js
// Creates floating element from element provided
// Uses relative position. To make absolute:    f.absolute(true)
// Will create different span in which your element will be put
// x, y    - it's a coordinates in pixels
let f = elFloating(elem, x, y)

// Set new position for the floating element
f.setPos(x, y)

// Get position of the floating element
// Will return something like: {x: 100, y: 200}
f.getPos();

// Delete the floating element
// Will be deleted from DOM
// DO NOT USE it after this call
f.delete();

// Stop the floating
// true  - makes it floating again
f.floating(false)

// Get's element from the inside
f.elem()

// Makes element of absolute position
// false  - make it relative position
f.absolute(true)
```