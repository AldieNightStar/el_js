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

// Retunrs how many ticks were happen
t.count()

// Stops the timer
t.stop()

// Sample
elTimer(500, t => {
    // Stop when ticks is more than 25
    if (t.count() > 25) t.stop()
})

// Set t.onFree to set callback in case timer will be removed
t.onFree = () => {
    // Do something
}
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




