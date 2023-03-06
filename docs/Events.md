# Events System

* Here is Event system related stuff

---

### Events
```js
// Create Event object
// It's not an Element (Don't append it to a scene or DOM)
let evt = elEvent();

// Connect to Events
evt.connect(dat => {
    // Do something with data
    console.log(dat);
    
    // Keep connection
    // Recommended:   return elem.isConnected
    return true
});

// Broadcast data
evt.emit("Hello");

// Clear the events
evt.clear();

// Waits for the emit and returns emit data
await evt.wait()
```