# mcfunction-plus-plus

A module for [BlockBuild](https://docs.fluffycraft.net/blockbuild) that adds the ability to generate functions easily.

## Installation

`blockb install mcfpp`

## Quick Start

Add the `mcfpp:mcfpp` filter to your `blockbuild.config.json`:

```json
{
    "filters": [
        {
            "id": "mcfpp:mcfpp"
        }
    ]
}
```

Create a JavaScript file in `BP/mcfppfunctions`:

```js
// BP/mcfppfunctions/test.js
return {
    function(set, command) {
        command("say hello world");
    }
};
```

That mcfpp function will compile into this:

```
# BP/functions/test.mcfunction
say hello world
```

## More Examples

Here's a more advanced use case:

```js
// BP/mcfppfunctions/test2.js
return {
    sets: [0, 1, 2], // this should be an array of anything
    function(set, command) {
        if (set > 0) command("say greater than 0");
        else command("say equal to 0");
    }
};
```

This will compile into the following three functions:

```
# BP/functions/test2/0.mcfunction
say equal to 0
```

```
# BP/functions/test2/1.mcfunction
say greater than 0
```

```
# BP/functions/test2/2.mcfunction
say greater than 0
```

You can also change the output path of the function like this:

```js
// BP/mcfppfunctions/test3.js
return {
    path: "test4", // now this will output at BP/functions/test4.mcfunction instead of BP/functions/test3.mcfunction
    function() {}
};
```

Lastly, you can define multiple functions in one file like this:

```js
// BP/mcfppfunctions/test5.js
return [
    {
        path: "test5", // all functions must have a `path` value if multiple are specified.
        function() {}
    },
    {
        path: "test6", // all functions must have a `path` value if multiple are specified.
        function() {}
    },
    {
        path: "test7", // all functions must have a `path` value if multiple are specified.
        function() {}
    }
];
```
