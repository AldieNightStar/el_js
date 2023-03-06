# ElAnimationLine

### Usage
* Can be used to prepare some animations
```js
// Create new Animation line
// in "elAnimation" could be done via "newLine()" function
let line = new ElAnimationLine();

// Add interpolation animation (Between frame)
line.addInterpol(from_frame, to_frame, from_val, to_val, (frame, val) => { /* ... */ })

// Add function on specific frame
line.addFunction(frame, () => { /* ... */ })

// Uses interpolation builder
// Check documentation for "Interpolation Builder" below
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






### Interpolation Builder
* `line` has method `with(callback)` which creates builder.
* This one could be used for better animation coding.
* `animate()` is an animation step. This time `to(...)` values becomes `from(...)` values
* Also don't forget that `from(...)` values should have same length with `to(...)` values
```js
line.with((x, y) => player.setXY(x, y))
    .on(1, 10) // Set frames from 1 to 10 (inclusive)
    .from(0, 0) // Specify start values [0, 0]
    .to(100, 100) // Specify end values [100, 100]
    .animate() // Call animation process. Will also set from(...) values as to(...).

    // Then since last frame add another 5 frames
    // We use .next(frames) function for that
    // .animate() is using as a key-frame
    .next(5).from(100, 100).to(0, 0).animate()
    .next(5).from(100, 100).to(200, 200).animate()
    .next(5).from(200, 200).to(100, 100).animate() // and so forth

    // We can also add static function on specific frame.
    //     ".func(...)" is NOT depending on ".animate()"
    //     So do NOT add ".animate()" after ".func(...)"
    // Used after ".next(...)" and ".on(...)" functions
    line.with(action).on(1).func(() => jump())
        .next(1).func(() => duck())
        .next(5).func(() => stop()); // etc

```



### Interpolation examples
* Move element right and back
    * Let's imagine element is `<img src=... id=hero>`
    * We will move _10 frames_ from `0` position to `100`
    * Then another _10 frames_ from `100` back to `0`
```js
line.with(x => { hero.style.left = x + "px" })
    .on( 1, 10).from( 0 ).to(100).animate()
    .next( 10 ).from(100).to( 0 ).animate()
```

* Move element to `100` then `200` then `300` then back to `0`
    * Let's imagine element is `<img src=... id=hero>`
    * We _will NOT_ use `from` more that once. As each `animate()` call remebers last position
```js
line.with(x => { hero.style.left = x + "px" })
    .on( 1, 10).from( 0 ).to(100).animate()
    .next( 10 ).to(200).animate()
    .next( 10 ).to(300).animate()
    .next( 10 ).to( 0 ).animate()
```