# ElVariable

* Used to create Varaibles for the elements
* Could be created from scratch
* Could be taken from `elStorage` element

### Variable object
```js
// Create ElVariable from getter and setter
// getter - func() -> value
// setter - func(val) -> bool
let v = ElVariable(getter, setter);

// Set value
v.set(123);

// Get value
v.get();

// Returns true if variable is null or undefined
v.isNull();

// If variable is null then default 'val' will be set
v.inital(val);
```