# Audio stuff

* Working with different Audio components
---

### Audio element
```js
// please add this element to the DOM to make it work correctly
// DON'T USE it without adding to a DOM. It will break

// Audio element
let aud = elAudio(a => {
    // Set source to owrk with
    a.src("test.mp3");

    // Set looping
    a.loop(true);

    // Play
    a.play();

    // Plan seconds
    // Supports also numbers 1.4, 1.2, 1.8.
    // Number 1.23 is wrong and will eval as 1.2
    a.onSecond(0, () => a.volume(0.5))
    a.onSecond(1, () => a.volume(0.2))

    // Set volume to 20%
    a.volume(0.2);

    // Set time in seconds
    a.time(0);
    
    // Pause the audio
    // Planned seconds will not work
    a.pause()

    // Stops the audio
    // Works as same as pause() and time(0) together
    a.stop()

    // Return true if it's playing (not paused/stopped)
    a.playing()

    // Get AUDIO HTML element DOM object itself
    a.audio()

    // Will be called when audio ends playing
    // Will NOT call when looping
    a.onEnd(callback)

    // Callback for Beats
    // Every beat will be called
    //   bpm - beats per minute
    // When paused/stopped - it will not call
    // DO NOT reuse it. Otherwise it could be breaked
    a.onBeat(bpm, callback)
});

// To use that API again just call:
aud.api()

// Remove the element from DOM
// Alternative:  aud.remove()
aud.delete()
```