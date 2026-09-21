# Syntez.js

## Declarative programming through a self-evaluating structure

Syntez.js is a declarative data runtime. An application is described once as a JavaScript object passed to `syn(...)`. The object defines the data of the application, the relationships between its values, and the system interfaces through which those values are received or emitted.

Syntez is built around two ideas:

1. **A declarative application structure** — the application is described as a hierarchy of named values.
2. **Self-evaluating functors** — functions inside that structure describe derived values. They read other values and are re-evaluated automatically when the values they used change.

A functor describes a value. It is not an event handler, command, callback, or effect. User functors do not open connections, subscribe to events, write files, update the DOM, or perform other side effects. Those operations belong to the runtime and its drivers.

```js
syn({
    input: syn.keys,

    value: () => input(),

    message: () => `Current input: ${value()}`,

    console: () => message()
})
```

The user describes the values and their dependencies. The runtime determines when a value must be evaluated and where the resulting data must be sent.

## The application is one declaration

The user-facing application is written in `index.js` and is initialized with one call to `syn(...)`:

```js
syn({
    console: syn.keys,
    view: [
        { b: 0x777777ff, c: 0x00aaffff, y: 0 },
        [{ b: 0x555555ff, c: 0x00aaffff }, 'Header'],
        ['Body'],
        [{ b: 0x555555ff, c: 0x00aaffff }, 'Footer']
    ]
})
```

The object may contain:

- values supplied by system inputs;
- constants;
- nested objects and arrays;
- functors that derive new values from existing values;
- named output properties understood by the runtime.

The hierarchy is part of the application model. Names and positions are not merely implementation details: they describe where data belongs and which system driver should interpret it.

## Inputs and outputs

External systems are represented by system inputs exposed through `syn.X()` or the corresponding runtime property. A keyboard event, URL change, completed request, file update, or device signal is simply a new value supplied by a system input.

Outputs are selected declaratively by the name of a property. The runtime knows how to interpret that property and how to deliver its value to the corresponding environment.

For example, the web runtime currently provides a `view` driver and a `console` driver. Other drivers can be provided by the runtime for other destinations, such as files, services, devices, or remote systems.

The same derived value does not need to know where it will be used:

```js
syn({
    source: syn.someInput(),

    result: () => transform(source()),

    view: () => result(),
    console: () => result()
})
```

The user writes the data transformation once. The output driver is responsible for materializing it in its own environment.

> Driver names, available system inputs, and the structure expected by each driver are part of the Syntez API and are documented separately.

## Functors and dependencies

A functor is a function used as a declarative value:

```js
syn({
    first: syn.someInput(),
    second: syn.anotherInput(),

    combined: () => `${first()} ${second()}`
})
```

When `combined` is evaluated, the runtime records the system values it reads. If one of those values changes, `combined` is evaluated again. If a later evaluation reads a different set of values, obsolete dependencies are removed automatically.

User code does not need to:

- register dependencies;
- call an update method;
- trigger a redraw;
- subscribe or unsubscribe;
- manage cleanup for recalculation;
- know what caused a recalculation.

The runtime owns the dependency graph. User code only describes values.

## Asynchronous values

An asynchronous operation is represented by a system input that receives a new value when the operation progresses or completes. From the user’s perspective, this is no different from a keyboard input or any other changing source.

A functor can therefore use an asynchronous value in exactly the same way as any other value:

```js
syn({
    response: syn.remoteData(),

    text: () => response() && response().text,

    view: () => text()
})
```

The runtime and the driver handle the asynchronous operation. The user declaration only describes what should be derived from the current value.

## No verbs in the application model

Syntez applications describe a world of values and relationships, not a sequence of commands.

User declarations do not contain operations such as:

- opening or closing connections;
- subscribing to events;
- writing to files;
- updating a screen manually;
- sending requests;
- starting or stopping a lifecycle;
- calling a rerender function.

These are runtime responsibilities. A driver may perform such work internally, but it is not exposed as the user’s programming model.

This separation keeps application code focused on the data it describes and the relationships between that data.

## Runtime and drivers

`web/syntez.js` is currently the browser runtime. It contains the dependency engine, the browser inputs, and the web output driver used by the example application. The browser is currently the primary environment because it provides a convenient way to develop and inspect the system.

The runtime is intended to be replaceable. Other environments may provide their own implementations of the same underlying model and their own input/output drivers. Possible environments include server processes, files, remote systems, serial devices, and embedded hardware.

A custom driver may be implemented when a required system interface is not yet available. This is an extension mechanism, not the normal way an application is written.

Internal calls such as `syn.tez(function () { ... })` belong to the runtime. They are implementation mechanisms of the dependency engine and are not part of the normal user-facing application API.

## Current web usage

The repository currently contains a minimal browser setup:

```html
<script src="/syntez.js"></script>
<script src="/index.js"></script>
```

`index.js` contains the application declaration. `syntez.js` and the other files in `web/` provide the runtime and presentation layer.

A minimal application can be written as:

```js
syn({
    console: () => `Year: ${syn.year()}`,
    view: ['p', () => `Year: ${syn.year()}`]
})
```

The exact values and drivers available depend on the runtime in which the declaration is executed.

## Design principles

- **One application declaration.** The application is initialized once with `syn(...)`.
- **JavaScript as the user language.** The declaration uses ordinary JavaScript objects, arrays, values, and functions.
- **Values instead of procedures.** User functors describe derived values and do not perform effects.
- **Automatic evaluation.** The runtime evaluates dependent functors when their inputs change.
- **Driver-defined interpretation.** Property names identify the system interfaces that consume or provide data.
- **No user-managed lifecycle.** Connections, subscriptions, output updates, and cleanup are runtime concerns.
- **Environment independence.** The declaration describes the application; the runtime determines how it is connected to its environment.
- **Minimal vocabulary.** The user should learn the application structure, the available `syn.X()` inputs, and the documented output properties—not a separate programming model for every kind of input or output.

## Status

Syntez.js is an experimental project. The current implementation focuses on the web runtime and on validating the declarative data model. The public API, available drivers, and runtime architecture may change as the system develops.

The central goal is to make an application expressible as a clear declarative structure whose values continuously describe the state of its world, while the runtime handles evaluation and communication with the surrounding environment.
````