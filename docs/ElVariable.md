# ElVariable

* Used to create Variables for the elements
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

### Wrapping / Unwrapping / Checking
```js
// Will return variable from the value
// if value is ALREADY "ElVariable" then will return as is
let v = ElVariable.wrap(val);

// will unwrap ElVariable and return it's value
// If value is NOT ElVariable then it will be returned as is
let v = ElVariable.unwrap(val);

// Returns true if value is ElVariable
ElVariable.isVariable(val)
```