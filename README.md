# Syntez.js

## Declarative applications as data structures

Syntez.js is a declarative runtime for describing applications as data.

An application is defined once as a JavaScript structure passed to `syn(...)`. This structure contains system inputs, derived values, and named outputs. The runtime evaluates the structure, tracks its dependencies, and updates the corresponding outputs whenever input values change.

```js
syn((function () {
    function status() {
        return [
            'Location: ' + syn.location(),
            'Keys: ' + JSON.stringify(syn.keys())
        ].join('\n')
    }

    return {
        console: status,

        view: [
            { b: 0x777777ff, c: 0x00aaffff, y: 0 },
            [status]
        ]
    }
})())
```

The user describes values and relationships between them. The runtime handles evaluation and communication with the surrounding environment.

## Core concept

Syntez treats an application as a declarative hierarchy of values.

A value may be:

- a constant;
- a system input;
- a nested object;
- an array;
- a self-evaluating functor.

A functor is an ordinary JavaScript function used as a value. It reads other values and returns a result:

```js
function status() {
    return 'Location: ' + syn.location()
}
```

When the runtime evaluates `status`, every system input read by the function becomes its dependency. If one of those inputs changes, the runtime evaluates `status` again and updates every output that uses its result.

The functor does not know:

- what caused the recalculation;
- how many times it will be evaluated;
- where its result will be delivered;
- whether the input is synchronous or asynchronous.

It only describes the value that must exist.

## Inputs and outputs

System inputs are provided by the runtime through `syn.X()` calls. In the browser runtime, available inputs include:

- `syn.keys()`
- `syn.mouse()`
- `syn.location()`
- `syn.email(...)`

Calling an input reads its current value. The runtime updates that value when the corresponding external source changes.

Output drivers are selected by property names in the application structure. The current browser runtime provides:

- `console`
- `view`

Other runtimes may provide outputs for files, APIs, remote systems, serial devices, embedded hardware, and other environments.

```js
syn({
    console: function () {
        return 'Location: ' + syn.location()
    },

    view: [
        'Current keys: ',
        function () {
            return JSON.stringify(syn.keys())
        }
    ]
})
```

The same value can be sent to several outputs. The value itself does not contain output-specific logic. Its destination is determined by the structure in which it is declared.

## No event handlers or effects

User code describes values, not actions.

A user functor does not:

- subscribe to events;
- open or close connections;
- read or write files;
- update the screen;
- send requests;
- trigger recalculation;
- manage cleanup or lifecycle.

These operations belong to system drivers and the runtime.

An external event is represented as a change of a system input. A completed request, a keyboard event, a file update, a network message, or a device signal all have the same meaning for user code:

```text
a system value has changed
```

The dependent functors are then evaluated again.

Asynchronous processing is therefore not a separate programming model. It is another way for a system input to receive a new value.

## Dependency evaluation

Dependencies are discovered automatically during evaluation.

```text
system input → user functor → derived value → output driver
```

The user does not declare subscriptions or dependency lists. If a functor reads a different set of inputs during a later evaluation, dependencies that are no longer used are removed automatically.

The dependency graph is formed from system inputs to derived values and outputs. User code only reads values and returns values; it does not create reverse dependencies or perform side effects.

## One application declaration

A Syntez application is initialized once with `syn(...)`.

The application structure is written by the user in `index.js`. Runtime files, dependency tracking, system inputs, and output drivers are provided by the environment.

```html
<script src="/syntez.js"></script>
<script src="/index.js"></script>
```

The browser implementation is currently the primary runtime because it provides a convenient environment for development and inspection. The same declarative model can be implemented for other environments without changing the programming model.

## Runtime and custom drivers

`web/syntez.js` is the current browser runtime. It contains:

- the dependency engine;
- browser input drivers;
- browser output drivers;
- environment-specific runtime code.

Internal mechanisms such as `syn.tez(...)` belong to the runtime and are not part of the normal application API.

A custom driver may be implemented when the runtime does not yet provide a required input or output. This is an extension mechanism. Normal application code should use documented system drivers and declarative values.

## Design principles

- **One declaration** — the application is described once through `syn(...)`.
- **Data instead of procedures** — the application consists of values and relationships, not commands.
- **Ordinary JavaScript** — user code uses JavaScript objects, arrays, functions, closures, and modules.
- **Self-evaluating functors** — functions describe derived values and are evaluated automatically when their inputs change.
- **Uniform inputs** — keyboard, network, files, URLs, timers, and devices are represented as changing system values.
- **Uniform outputs** — screen, console, files, APIs, and devices receive values through named output drivers.
- **No user-managed lifecycle** — subscriptions, connections, asynchronous work, and cleanup are runtime responsibilities.
- **Environment-independent model** — the application describes a world of values; the runtime connects it to a particular environment.
- **Minimal user vocabulary** — the user needs to understand the declaration structure, system inputs, functors, and documented output properties.

## Status

Syntez.js is an experimental project.

The current implementation focuses on the browser runtime and on validating the declarative data model.

The goal of Syntez is to make application programming consist primarily of describing a coherent structure of values and dependencies, while the runtime handles evaluation and interaction with the surrounding world.