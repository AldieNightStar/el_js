# Animation stuff

* Here are some Animation components
* Used to create interactive elements or Novels

---

### Animation Element
```js
// Returns timer with animation executor
// Allows to create animations on the fly
let ani = elAnimation(ani => {
    // Create animation timeline
    // We also could reuse other line (ElAnimationLine):
    //     ani.fromLine(line);
    // Receives:
    //     frames    - maximum frames in the new line
    //     callback  - callback for new line API
    ani.newLine(frames, line => {
        // Add interpolation (tween-like) animation. Between frames
        //     from_frame, to_frame      - used to indicate range in frames (from->to)
        //     from_val,   to_val        - used to specify numbers to interpolate between frames
        //     callback(frame, value)    - Callback
        //         frame                 - Current frame
        //         value                 - Value to be used (Interpolation result)
        line.addInterpol(from_frame, to_frame, from_val, to_val, (frame, value) => {
            // You can set position of some element according to 'value' result
            // For example:
            flying_head.style.top = value + ".px";
        });

        // Also we can add function for specific frame
        // First argument
        line.addFunction(frame, () => console.log("It's 80 frame"))
    })

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

    // Set how much time ALL the animation will go
    // It will automatically calculate time per each frame
    ani.time(3000)

    // Use existing line (ElAnimationLine)
    ani.fromLine(other_line)

    // Create new line (ElAnimationLine)
    ani.newLine(line => { /* ... */ }) // Check example above
});

// Terminate all the animation and Timer
ani.stop();
```




### Animation class
* Can be used to prepare some animations
```js
// Create new Animation line
// frames  - frame count
let line = new ElAnimationLine(frames);

// Add interpolation animation (Between frame)
line.addInterpol(from_frame, to_frame, from_val, to_val, (frame, val) => { /* ... */ })

// Add function on specific frame
line.addFunction(frame, () => { /* ... */ })

// Get player from it    (ElAnimationPlayer)
let player = line.player(isRepeating, player => {
    // Will execute on last frame
    // player - is player itself
    
    // Get frame position (current frame)
    player.pos
});

// Play one frame
// Need to use it in 'elTimer'
// Returns true  - when able to play next frame
// Returns false - when ended
player.step();

// Get player ended or not (true/false)
player.ended
```