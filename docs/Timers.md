# Timers

* Here is Timers and Count-down stuff
* For example here are timer which lives as long as it's DOM element
    * So when scene is cleared or reloaded - that timer will disappear
* Better to use `elTimer` than `setInterval`

---



### Timer Element
```js
// Create timer element
// ontick - calls everytick
// will stop if element is disconnected from the DOM
// elTimerOnce - used to make one-time timer
let t = elTimer(intervalMs, ontimer)
let t = elTimerOnce(intervalMs, ontimer)

// Start the timer (Before that it will not run)
t.start()

// Retunrs how many ticks were happen
t.count()

// Set timer to be paused
// Will not call callbacks during pause
// To unpase:   t.pause(false)
t.pause(true)

// Stops the timer
// Will also remove it from DOM
// Do NOT use it after this call
t.stop()

// Sample
elTimer(500, t => {
    // Stop when ticks is more than 25
    if (t.count() > 25) t.stop()
})

// Set t.onFree to set callback in case timer will be stopped and removed
t.onFree = () => {
    // Do something
}

// Set live controller for the timer
// By default it checks that element is not deleted from DOM
// If callback returns true - then timer lives
// If callback returns false - then timer will die (Don't use timer after dead)
//
// Be careful with this
t.liveWhile(callback)

// Returns true if Timer is "dead"
t.dead();
```



### Count-down text
```js
// This element will count-down until 0
// Each time it counting, it will call the callback with remaining number
// 32   - count down number. Will be counting from 32 -> 0
// 1000 - milliseconds per step
let c = elCountDown(32, 1000, n => {
    // If n == 0 then we lose :)
    if (n == 0) window.alert("You lose!");

    // We can delete it when done
    if (n == 0) c.api.stop();
})

// Delete the count-down scene
c.api.stop();
```




