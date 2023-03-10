# Animation stuff

- [Floating Element](animation/FloatingElement.md)
- [ElAnimationLine (Animation TimeLine)](ElAnimationLine.md)

---

### Animation Element
* Uses [ElAnimationLine](ElAnimationLine.md) for animation
* Animation is NOT reusable. After it ends (for non-repeating one) - it will be deleted from DOM
* To make animation play again - create new one and add it to DOM
```js
// Returns timer with animation executor
// Allows to create animations on the fly
// Runs while it's connected to DOM
let timer = elAnimation(ani => {
    // Create new timeline (ElAnimationLine)
    // REQUIRED to be called (Alternative: ani.setLine(...))
    // Check "ElAnimationLine" documentation for details on how to use
    let line = ani.newLine();

    // Set animation to NOT start (Pause on start)
    // To unpause - call:    timer.paused(false)
    ani.paused();

    // Starting frame. We can specify start-point frame (Default: 1)
    ani.frame(10);

    // Will execute when animation will end up
    // Works even with repeatable animations
    ani.onEnd(player => {
        // p - is player itself

        // Current frame (from 1 to last one)
        player.pos

        // Set to be pause
        // false - to unpause
        player.paused = true

        // Set animation to be ended
        // Destroys animation/player/DOM element (DO NOT USE after that)
        player.ended = true

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

// Set timer to be paused
// false - to unpause
//
// Please DON'T use stop() to pause
timer.paused(true)

// Returns true if animation is currently paused
timer.isPaused();

// Get frame count in the animation
timer.frames();

// Get position of the player. Current frame number
timer.getFrame()

// Set current frame number
timer.setFrame(id)

// Terminate all the animation and Timer
// Will also remove the 'span' it creates
// DO NOT use it after that command. It will be removed from DOM
timer.stop();
```



