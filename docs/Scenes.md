# Scenes

### Scene Element
```js
// Creates Scene Element
// Allows to clear itself etc
let scene = elScene(api => {
    // Clear the scene
    // Will just destroy everything
    api.clear();

    // Reload the scene (Will call the api again)
    api.reload();

    // Get span DOM object which scene is
    api.span();

    // Add element without next line
    api.append(el(...));

    // Add element with next line
    api.appendLn(el(...));

    // Will completely remove the scene
    api.stop();

    // Change scene code to some another API call
    // Will reload then call that function
    // New function will replace old one
    api.change(api => {
        api.appendLn(elText("Hi there"));
    })

    // Will add a timer to the scene
    // Timer will remain working until clear/stop
    let timer = api.timer(ms, callback);
    timer.stop(); // Stop the timer manually;
    timer.count(); // Get ticks done by timer counter
})

// Get the same api here
scene.api
```


### Named Scenes
```js
// Create named scenes from storageVariable
//     storageVariable could be get from elStorage
//     for example:   storage.variable("name")
// Works as simple scenes
// BUT has differences in API
// First scene name is "main"
let scene = elNamedScenes(nameVar, {
    main: api => {
        // API mostly the same as Scene API
        // Differences:
        
        // Change scene to another (by name)
        // Here we provide name (not a function)
        api.change("scene1");

        // Reload will work by getting name
        //   from variable and then resolve
        //   which scene need to load
        api.reload();
    },
    scene1: api => {},
    scene2: api => {}
});
```




### Sequence of Scenes
```js
// Create sequental scenes
// Uses countVar (elStorage Variable) to remember the position
//     Can be taken from elStorage
//     For example:   storage.variable("seq_1")
// To switch to the next, use:           api.next()
// To check that this is the last one:   api.isLast()
let scene = elSeq(countVar
    api => {
        api.appendLn(elText("This is how i go!"))
        api.appendLn(elButton("Next >>", api.next))
        // api.next() - will switch scene to the next one
    },
    api => {
        api.appendLn(elText("The new world"))
        api.appendLn(elButton("Next >>", api.next))
        // api.next() - will switch scene to the next one
    },
    api => {
        api.appendLn(elText("This is all"))
    }
)

scene.api.next() // Next sequent scene
scene.api.isLast() // true if it's last scene
scene.api.stop() // Stops the scene to display
```




### Sequence of Texts
```js
// Creates sequental text scenes
// Used only for long stories with 'next'-button based interactivity
// Uses countVar (elStorage Variable) to remember the position
//     Can be taken from elStorage
//     For example:   storage.variable("seq_1")
let scene = elSeqText(countVar,
    "This is the world",
    "We are here",
    "Now all set",
    "Done"
)
scene.api.next() // Set scene to the next text sequence
scene.api.isLast() // true if it's last text
scene.api.stop() // Stop displaying that scene
```