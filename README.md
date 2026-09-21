# Syntez.js

## Declarative applications as values

Syntez.js is an experimental runtime for describing applications as declarative structures of values.

A Syntez application is declared once with `syn(...)`. The declaration contains:

- constant values;
- system inputs;
- derived values;
- nested objects;
- arrays;
- output descriptions.

User code describes **what values must exist and how they are determined**. The runtime evaluates these relationships and connects the resulting values to the surrounding environment.

```js
syn({
    console: function () {
        return [
            'Location: ' + syn.location(),
            'Keys: ' + JSON.stringify(syn.keys())
        ].join('\n')
    },

    view: [
        { b: 0x777777ff, c: 0x00aaffff, y: 0 },
        function () {
            return 'Current location: ' + syn.location()
        }
    ]
})
```

The user does not manually subscribe to changes, trigger recalculation, update the screen, or synchronize outputs. These are runtime responsibilities.

---

## The central idea

Syntez treats an application as a declarative hierarchy of values.

A value can be:

- a constant;
- a system input;
- an object;
- an array;
- a function that describes a derived value.

For example:

```js
function status() {
    return 'Location: ' + syn.location()
}
```

The function does not describe an action. It describes the value that must exist according to the current location.

If `syn.location()` changes, the value returned by `status` becomes different because the relationship is still valid:

```text
status = "Location: " + location
```

The user does not need to think about event handlers or subscriptions. The function is treated as a declarative rule.

A useful analogy is a spreadsheet:

```text
B1 = A1 * 2
```

The author of the formula does not manage the mechanism that recalculates `B1` when `A1` changes. They only describe the relationship between the values.

Syntez applies the same idea to application structures.

---

## Values, not procedures

Syntez code is intended to describe values rather than a sequence of commands.

A user functor normally:

- reads values;
- calculates a result;
- returns a result.

It does not normally:

- subscribe to events;
- trigger recalculation;
- update the DOM;
- write directly to files;
- send network requests;
- manage connections;
- manage cleanup;
- mutate unrelated application state.

For example:

```js
function greeting() {
    return 'Hello, ' + user().name
}
```

This describes a value derived from `user()`.

It does not say:

```text
when user changes, call greeting
```

It says:

```text
greeting is determined by user
```

The runtime uses this relationship to keep the application values consistent.

---

## The application is a dependency structure

A Syntez application can be understood as a structure like this:

```text
system input
      ↓
user functor
      ↓
derived value
      ↓
output driver
```

For example:

```text
keyboard state
      ↓
status()
      ↓
console
```

or:

```text
location
      ↓
page()
      ↓
view
```

The dependency is discovered when a functor reads a value during evaluation.

```js
function status() {
    return [
        'Location: ' + syn.location(),
        'Keys: ' + JSON.stringify(syn.keys())
    ].join('\n')
}
```

The runtime can see that `status` depends on:

- `syn.location()`;
- `syn.keys()`.

If a later evaluation reads a different set of values, the dependency structure is updated accordingly.

```js
function value() {
    if (syn.location().indexOf('#a') !== -1) {
        return syn.keys()
    }

    return syn.location()
}
```

In this example, the dependencies used by `value` may change according to the current location. The user does not declare or remove subscriptions manually.

---

## System inputs

System inputs expose values provided by the surrounding environment.

The current browser runtime provides:

### Keyboard input

```js
syn.keys()
```

Returns the current keyboard state.

```js
syn({
    console: function () {
        return JSON.stringify(syn.keys())
    }
})
```

### Mouse input

```js
syn.mouse()
```

Returns the current mouse-related state maintained by the browser driver.

### Browser location

```js
syn.location()
```

Returns the current browser location.

```js
syn({
    console: function () {
        return 'Current location: ' + syn.location()
    }
})
```

The value is updated when the browser location changes.

### Validated email value

```js
syn.email()
```

` syn.email(...) ` creates a value intended for email input and validation.

```js
var email = syn.email()

email('user@example.com')
```

The exact behavior of an input is defined by its system driver.

---

## Output drivers

Outputs are selected by properties in the application declaration.

The current browser runtime provides:

- `console`;
- `view`.

```js
syn({
    console: function () {
        return 'Current location: ' + syn.location()
    },

    view: [
        'Current keys: ',
        function () {
            return JSON.stringify(syn.keys())
        }
    ]
})
```

The same derived value can be used by several outputs:

```js
function status() {
    return 'Location: ' + syn.location()
}

syn({
    console: status,
    view: [status]
})
```

The function does not contain console-specific or view-specific logic. The surrounding declaration determines where its result is delivered.

This allows the same application model to use different output drivers for different environments.

Possible future drivers may connect values to:

- files;
- databases;
- HTTP APIs;
- WebSockets;
- remote systems;
- serial devices;
- embedded hardware;
- other external environments.

Such drivers are not currently implemented by the browser runtime unless explicitly provided by the application or runtime extension.

---

## Data and external systems

A driver interprets ordinary JavaScript values according to the rules of its environment.

For example, a database driver could interpret a JavaScript structure as desired database state:

```js
syn({
    db: function () {
        return {
            users: [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ]
        }
    }
})
```

The application describes the value. The database driver is responsible for deciding how to synchronize the external database with that value.

The user does not need to write low-level database operations such as:

```text
connect
begin transaction
insert
update
delete
commit
close
```

Those operations belong to the driver.

This principle applies to other environments as well:

```text
JavaScript value → system driver → external system
```

A driver may interpret a value as:

- current state to be synchronized;
- configuration;
- a document;
- a request;
- a command;
- a device state;
- a remote resource.

The meaning depends on the driver contract.

---

## Values can represent loading and errors

Syntez does not require loading states and application errors to be a separate user-facing control-flow mechanism.

A system driver can represent them as ordinary values.

For example, a request driver may return:

```js
new Error('Loading')
```

or:

```js
new Error('Connection failed')
```

A user functor can inspect the result and choose how to represent it:

```js
function requestView() {
    var result = syn.request()

    if (result instanceof Error) {
        return {
            message: result.message,
            color: 'red'
        }
    }

    return {
        message: result,
        color: 'black'
    }
}
```

The same error value can be:

- displayed under an input;
- displayed in a popup;
- written to the console;
- converted into a fallback value;
- passed to another driver;
- ignored by a particular part of the application.

The application decides how an error value should appear or propagate.

This is different from an unexpected JavaScript exception thrown because of a programming error. Such exceptions are runtime failures and are handled by the runtime separately from ordinary application values.

---

## External actions and activation

Some operations should happen only after an explicit external event.

For example, sending an email should not happen every time the form is recalculated. It should happen when the user activates a submit control.

This kind of behavior is represented by a system input or driver for activation.

Conceptually:

```text
form state
      ↓
submit activation
      ↓
submit value
      ↓
email driver
```

A future or custom driver may expose an activation primitive such as:

```js
syn.active(...)
```

The important distinction is:

- a normal value describes current state;
- an activation value represents an external occurrence;
- a driver decides how that occurrence is delivered;
- the user functor describes the value produced for that occurrence.

The current browser runtime does not yet provide a complete general activation API. This is part of the system-driver extension model.

---

## One declaration

A Syntez application is initialized with one call to `syn(...)`.

```js
syn({
    console: function () {
        return 'Hello'
    },

    view: [
        { b: 0x777777ff, c: 0x00aaffff },
        'Hello'
    ]
})
```

A typical browser page loads the runtime and then the application:

```html
<script src="/syntez.js"></script>
<script src="/index.js"></script>
```

The application declaration contains the user-visible model. Runtime code provides:

- dependency evaluation;
- browser input drivers;
- browser output drivers;
- environment integration.

---

## `syn.tez` and custom system extensions

`syn.tez(...)` is an internal low-level mechanism used to create reactive system values and implement drivers.

It is not intended to be part of normal application code.

A system-driver author may use it to connect an external source to the Syntez value model:

```js
function customInput() {
    var value = syn.tez(null)

    // External environment updates the value:
    // value(newValue)

    return value
}
```

Normal application code should use documented system inputs and outputs instead of calling `syn.tez(...)` directly.

The purpose of this separation is to keep environment-specific mechanisms inside drivers while application code remains focused on values and relationships.

---

## Why this model is useful

### Local definition of values

A derived value is described at a specific declaration site.

There is no normal public operation for arbitrary code to update that derived value from somewhere else. Its result is determined by:

- the functor that describes it;
- the values read by that functor;
- the system inputs used by those values.

This makes the origin of a value easier to find and understand.

### Fewer hidden mutations

In an ordinary mutable application, a value may be changed from many unrelated places:

```js
state.value = ...
store.dispatch(...)
eventBus.emit(...)
socket.on(...)
setTimeout(...)
```

This can make it difficult to determine why a value has a particular state.

In Syntez, the intended model is:

```text
value = declaration(inputs)
```

A value changes because its declared inputs change or because a system driver provides a new value.

### Traceable data flow

A value can be followed through the application:

```text
system input
    → functor
    → derived value
    → output driver
```

This can make it easier to:

- debug the application;
- inspect where a value came from;
- understand why an output changed;
- audit data flow;
- identify which external drivers are involved.

### System complexity belongs in drivers

Application code should not reimplement the same low-level mechanisms repeatedly.

Drivers can provide reusable implementations for:

- browser input;
- network communication;
- database access;
- files;
- devices;
- authentication;
- rendering;
- storage;
- remote systems.

The application describes the required values. The runtime and drivers implement the system operations needed to provide or consume those values.

---

## Purity and JavaScript limitations

The Syntez model assumes that user functors describe values and avoid unrelated side effects.

However, the current implementation uses ordinary JavaScript functions. JavaScript functions can still perform arbitrary operations:

```js
function unsafe() {
    window.someValue = 123
    document.cookie = '...'
    fetch('/somewhere')
    return 'value'
}
```

The current JavaScript runtime cannot prevent this automatically.

Therefore, the current project provides a declarative programming model and a convention for writing applications, but it is not a security sandbox.

To preserve the intended model, user functors should:

- read values;
- calculate values;
- return values;
- avoid mutating shared objects;
- avoid direct access to browser APIs;
- avoid direct network, file, or database operations;
- use system drivers for communication with the environment.

A future specialized language could enforce these rules more strictly by replacing arbitrary JavaScript functions with restricted formulas. That language is not part of the current project.

---

## Current browser implementation

The current implementation is an experimental browser runtime located in:

```text
web/syntez.js
```

The example application is located in:

```text
web/index.js
```

The browser runtime currently demonstrates:

- declarative application initialization;
- dependency discovery during evaluation;
- changing browser inputs;
- derived values;
- console output;
- declarative view output;
- custom reactive values through the internal `syn.tez(...)` mechanism.

The current implementation is intentionally small and focused on validating the core model.

It is not yet a complete production framework.

---

## Current limitations

The current project is experimental.

The following areas are not yet mature or fully implemented:

- a complete set of system input drivers;
- a complete set of output drivers;
- general request and database drivers;
- a general activation API;
- production-grade error reporting;
- resource cleanup for all possible drivers;
- comprehensive testing;
- development tools and dependency inspection;
- performance guarantees for large applications;
- a formal driver specification;
- a separate secure formula language.

These limitations concern the current implementation, not the general direction of the model.

The core purpose of the project is to explore whether application programming can be expressed primarily as a declarative structure of values and dependencies, with system-specific behavior implemented once inside the runtime and its drivers.

---

## Design principles

- **One application declaration** — the application is described through one `syn(...)` structure.
- **Values instead of procedures** — user code describes values and relationships rather than event-handling procedures.
- **Functions as declarative rules** — a function in the application structure describes a derived value.
- **Automatic dependency discovery** — dependencies are discovered from the values read during evaluation.
- **No user-managed subscriptions** — users do not manually subscribe or unsubscribe from ordinary system inputs.
- **No user-managed recalculation** — users do not manually trigger updates of dependent values.
- **System drivers own external operations** — input, output, I/O, communication, and environment integration belong to drivers.
- **Errors can be values** — loading and application-level failures can be represented and processed as ordinary values.
- **Explicit external activation** — operations that must happen after an external action should use an activation-oriented system driver.
- **Local value definition** — a derived value is determined by its declaration and its dependencies rather than arbitrary writes from unrelated code.
- **Ordinary JavaScript values** — objects, arrays, strings, numbers, functions, and other JavaScript values can participate in the application structure.
- **Minimal user vocabulary** — application authors should primarily need to understand values, functors, system inputs, output properties, and available drivers.

---

## Status

Syntez.js is an experimental project.

The current implementation focuses on validating a declarative application model in the browser:

```text
application structure
    → system inputs
    → derived values
    → output drivers
```

The long-term goal is to make application programming consist primarily of describing a coherent structure of values and dependencies, while the runtime and system drivers handle communication with the surrounding environment.