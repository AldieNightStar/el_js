# Animation stuff

* Here are some Animation components
* Used to create interactive elements or Novels

---

### Animation Element
```js
// Returns timer with animation executor
// Allows to create animations on the fly
// Runs while it's connected to DOM
let ani = elAnimation(ani => {
    // New time line
    // frames - count of frames
    ani.newLine(frames, line => {
        // Add interpolation (tween-like) animation. Between frames
        line.addInterpol(
            from_frame, to_frame,                // frame from-to
            from_val, to_val,                    // values from-to
            (frame, value) => updateVal(value)); // callback to assign effect

        // Use interpolation builder:   line.with(callback) ...
        line.with((x, y, z) => {})
            .on(1, 10).from(1, 2, 3).to(10, 20, 30).animate()
            .next(10).to(100, 200, 300).animate()
            .next(10).to(1000, 2000, 3000).animate()

        // Also we can add function for specific frame
        line.addFunction(frame, () => console.log("It's the X frame"))
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

    // Set time for single frame in milliseconds (Default: 50)
    ani.time(100)

    // Use existing line (ElAnimationLine)
    //   instead of:   ani.newLine(...)
    ani.fromLine(other_line)
});

// Terminate all the animation and Timer
// Will also remove the 'span' it creates
ani.stop();

// DEBUG Animation
// ====================
// Add true to the end. It will make animation in DEBUG mode
elAnimation(api => { /* ... */ }, true)
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

// Use interpolation builder
// Check documentation "Animation Interpol Builder" below
line.with((x, y, z) => {})
    .on(1, 10).from(1, 2, 3).to(10, 20, 30).animate()

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




### Animation Interpol Builder
* `line` has method `with(callback)` which creates builder.
* This one could be used for better animation coding.
* `animate()` is an animation step. This time `to(...)` values becomes `from(...)` values
* Also don't forget that `from(...)` values should have same length with `to(...)` values
```js
line.with((x, y) => player.setXY(x, y))
    .on(1, 10) // Set frames from 1 to 10 (inclusive)
    .from(0, 0) // Specify start values [0, 0]
    .to(100, 100) // Specify end values [100, 100]
    .animate() // Call animation process. Will also set from(...) values as to(...)

    // Then since last frame add another 5 frames
    // We use .next(frames) function for that
    .next(5).from(100, 100).to(0, 0).animate()
    .next(5).from(100, 100).to(200, 200).animate()
    .next(5).from(200, 200).to(100, 100).animate() // and so forth

    // We can also add static function on specific frame it will use only fromFrame variable inside,
    //   so it can be combined with values above
    line.with(action).on(1).func(() => jump())
        .next(1).func(() => duck())
        .next(5).func(() => stop()); // etc

```