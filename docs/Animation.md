# Animation stuff

* Here are some Animation components
* Used to create interactive elements or Novels

---

### Animation Element
* Uses [ElAnimationLine](ElAnimationLine.md) for animation
```js
// Returns timer with animation executor
// Allows to create animations on the fly
// Runs while it's connected to DOM
let ani = elAnimation(ani => {
    // Create new timeline (ElAnimationLine)
    // REQUIRED to be called (Alternative: ani.setLine(...))
    // Check "ElAnimationLine" documentation for details on how to use
    let line = ani.newLine();

    // Starting frame. We can specify start-point frame (Default: 1)
    ani.frame(10);

    // Will execute when animation will end up
    // Works even with repeatable animations
    ani.onEnd(p => {
        // p - is player itself

        // Get ended frame number
        p.pos

        // Example of using 'p.pos'
        console.log("Done on " + p.pos + " frame")
    })

    // Set animation to be repeating
    ani.repeat(true)

    // Set time for single frame in milliseconds (Default: 50)
    ani.time(100)

    // Use existing line (ElAnimationLine)
    //   instead of:   ani.newLine(...)
    ani.fromLine(other_line)
});

// Set animation to be paused
ani.paused(true)

// Get frame count in the animation
ani.frames();

// Get position of the player. Current frame number
timer.getFrame()

// Set current frame number
timer.setFrame(id)

// Terminate all the animation and Timer
// Will also remove the 'span' it creates
// DO NOT use it after that command. It will be removed from DOM
ani.stop();

// DEBUG Animation
// ====================
// Add true to the end. It will make animation in DEBUG mode
elAnimation(api => { /* ... */ }, true)
```







### Floating Element
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