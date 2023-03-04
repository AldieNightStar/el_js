# Interactive Elements



### Choice
```js
// Will create set of buttons to choose
// According to text we will do something
elChoose((api, result) => {
    // Callback when we done the choice
    // api    - is the same as in Scene api (We can see it in the Scene api object)
    // result - will have a chosen value
    api.append(elText("We choosed: "))
    api.appendLn(elText(result))
},
    // Our variants to choose
    ["Adult", 21],
    ["Young but Adult", 18],
    ["Young boy", 16],
    ["Child", 8],
);
```





### List of Elements
```js
// Renders list of elements converted from list of values
// Accepts:
//     values   - list of values (not elements)
//     renderer - function(id, val) -> element
//         it accepts id and value from list
//         and should return element for this value
elList(
    ["Aldie", "Richard", "Tiffie", "Timmy", "Nimferia"],
    (id, val) => elText(val)
);
```




### Order of Elements
```js
// Allows user to manage order of each element
// Accepts:
//     values   - list of values (not elements)
//     renderer - function(id, value) -> element
//         it accepts id and value from list
//         and should return element for this value
//     callback - function which calls everytime order is changed
//         accepts list of values (not elements)
elOrder(
    ["Alpha", "Beta", "Gamma", "Omega"],
    (id, val) => elText(val),
    elems => console.log(elems)
);
```




### Collapser
```js
// Will add scene with ability to collapse
// When collapsed - all elements are removed
let c = elCollapse("Items", api => {
    // api - same as in Scene element
})
```




