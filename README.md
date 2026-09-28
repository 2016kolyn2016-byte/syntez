# Syntez

## Declarative applications as a virtual machine

Syntez is an experimental framework for describing applications as declarative structures of values and dependencies. Applications are written in the `.syntez` language and executed by a language-agnostic virtual machine.

A Syntez application declares **what values must exist and how they are determined**. The virtual machine evaluates these relationships and connects the resulting values to the surrounding environment. User code never has direct access to system APIs or environment state.

```syntez
console(location:);
view(
    y(0);
    b(2004318207);
    c(11206655);
    
    (b(255); Header);
    Body;
    (b(255); Footer)
);
```

The user does not manually subscribe to changes, trigger recalculation, update the screen, or synchronize outputs. These are runtime responsibilities.

---

## Architecture

### The Central Idea

Syntez treats an application as a declarative hierarchy of values.

A value can be:

- a constant;
- a system input;
- an object;
- an array;
- a function that describes a derived value.

For example:

```syntez
status: location:;
```

The functor does not describe an action. It describes the value that must exist according to the current location.

If location changes, the value returned by `status` becomes different because the relationship is still valid:

```text
status = location
```

The user does not need to think about event handlers or subscriptions. The function is treated as a declarative rule.

A useful analogy is a spreadsheet:

```text
B1 = A1 * 2
```

The author of the formula does not manage the mechanism that recalculates `B1` when `A1` changes. They only describe the relationship between the values.

Syntez applies the same idea to application structures.

---

## Values, Not Procedures

Syntez code is intended to describe values rather than a sequence of commands.

A user functor normally:

- reads values;
- calculates a result;
- returns a result.

It does not normally:

- subscribe to events;
- trigger recalculation;
- update the screen;
- make network requests;
- manage state mutations;
- perform side effects;
- access system resources.

For example:

```syntez
greeting: 'Hello, ' + user:;
```

This describes a value derived from `user`.

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

## The Application is a Dependency Structure

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

If a later evaluation reads a different set of values, the dependency structure is updated accordingly. The user does not declare or remove subscriptions manually.

---

## System Inputs

System inputs expose values provided by the surrounding environment through the virtual machine.

The current browser runtime provides:

### Keyboard Input

```syntez
keys:
```

Returns the current keyboard state.

### Mouse Input

```syntez
mouse:
```

Returns the current mouse-related state maintained by the browser driver.

### Browser Location

```syntez
location:
```

Returns the current browser location.

```syntez
console(location:);
```

The value is updated when the browser location changes.

---

## Output Drivers

Outputs are selected by properties in the application declaration.

The current browser runtime provides:

- `console` — outputs to browser console;
- `view` — renders to the DOM.

```syntez
console(location:);
view(
    'Current location: ';
    location:
);
```

The same derived value can be used by several outputs.

The function does not contain console-specific or view-specific logic. The surrounding declaration determines where its result is delivered.

This allows the same application model to use different output drivers for different environments.

Possible future drivers may connect values to:

- HTTP APIs;
- WebSockets;
- files;
- databases;
- timers;
- remote systems;
- embedded hardware;
- other external environments.

Such drivers are not currently implemented unless explicitly provided.

---

## Data and External Systems

A driver interprets Syntez values according to the rules of its environment.

For example, a database driver could interpret a Syntez structure as desired database state. The application describes the value. The database driver is responsible for deciding how to synchronize the external database with that value.

This principle applies to other environments as well:

```text
Syntez value → system driver → external system
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

## Values Can Represent Loading and Errors

Syntez does not require loading states and application errors to be a separate control-flow mechanism.

A system driver can represent them as ordinary values.

For example, a request driver may return an error value representing a loading state or a connection failure. A user functor can inspect the result and choose how to represent it.

The same error value can be:

- displayed under an input;
- displayed in a popup;
- written to the console;
- converted into a fallback value;
- passed to another driver;
- ignored by a particular part of the application.

The application decides how an error value should appear or propagate.

---

## External Actions and Activation

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

The important distinction is:

- a normal value describes current state;
- an activation value represents an external occurrence;
- a driver decides how that occurrence is delivered;
- the user functor describes the value produced for that occurrence.

The current browser runtime does not yet provide a complete general activation API. This is part of the system-driver extension model.

---

## Security and Isolation

User code in `.syntez` files is executed in a controlled virtual machine environment.

**Security guarantees:**

- No direct access to browser APIs, DOM, network, or file system;
- No access to global state or other applications' data;
- Only sanctioned system drivers can interact with the external environment;
- Application code cannot escape the sandbox or bypass restrictions;
- All operations are mediated through explicit driver contracts.

This makes Syntez suitable for:

- untrusted user-submitted applications;
- sandboxed multi-tenant environments;
- embedded application scripting;
- secure plugin systems.

**Different from procedural languages:**

Unlike JavaScript or other general-purpose languages, Syntez code *cannot* perform arbitrary operations. The virtual machine enforces this through its architecture, not through convention or best practices.

---

## Language Independence

The Syntez language specification is independent of any programming language.

A single `.syntez` file can be executed by:

- JavaScript/Browser implementation (current);
- C++ implementation;
- PHP implementation;
- Python implementation;
- Go implementation;
- Rust implementation;
- Or any other language with a Syntez interpreter.

Each implementation:

- Parses the same `.syntez` syntax;
- Evaluates the same dependency model;
- Implements the same system drivers;
- Produces consistent results across platforms.

This makes applications portable across environments and allows developers to choose the best runtime for their use case.

---

## Why This Model is Useful

### Local Definition of Values

A derived value is described at a specific declaration site. There is no public operation for arbitrary code to update that derived value from somewhere else. Its result is determined by:

- the functor that describes it;
- the values read by that functor;
- the system inputs used by those values.

This makes the origin of a value easier to find and understand.

### Fewer Hidden Mutations

In an ordinary mutable application, a value may be changed from many unrelated places. This can make it difficult to determine why a value has a particular state.

In Syntez, the intended model is:

```text
value = declaration(inputs)
```

A value changes because its declared inputs change or because a system driver provides a new value.

### Traceable Data Flow

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

### System Complexity Belongs in Drivers

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

### Security and Portability

User code is sandboxed and cannot access the environment directly. Applications are language-agnostic and can run on any platform with a Syntez interpreter. This enables:

- safe execution of untrusted code;
- true portability across web, server, mobile, and desktop;
- multi-tenant application hosting.

---

## Current Implementation

### Browser Runtime

The current implementation is an experimental browser runtime located in:

```text
web/syntez.js
```

The example application is located in:

```text
web/index.syntez
```

### Language Parser

The `.syntez` language is parsed by the `String.prototype['~ syntez']` function in `syntez.js`. The parser converts the text representation into an abstract syntax tree and evaluates it according to the Syntez model.

### Browser-Specific Features

The browser runtime currently demonstrates:

- declarative application initialization;
- dependency discovery during evaluation;
- reactive system inputs (keyboard, mouse, location);
- derived values and recalculation;
- console output;
- DOM rendering and layout;
- CSS-based styling through declarative properties.

The current implementation is intentionally small and focused on validating the core model.

It is not yet a complete production framework.

---

## Current Limitations

The current project is experimental.

The following areas are not yet mature or fully implemented:

- formal `.syntez` language grammar and specification;
- a complete set of system input drivers;
- a complete set of output drivers;
- HTTP, WebSocket, timer, and file drivers;
- general request and database drivers;
- a general activation API;
- production-grade error reporting;
- resource cleanup for all possible drivers;
- comprehensive testing;
- development tools and dependency inspection;
- performance optimization and guarantees for large applications;
- reference implementations in languages other than JavaScript;
- formal driver specification and contract model.

These limitations concern the current implementation, not the general direction of the model.

---

## Design Principles

- **Declarative value model** — applications are described as structures of values and dependencies, not as sequences of commands.
- **One application declaration** — the application is described through one top-level structure.
- **Values instead of procedures** — user code describes values and relationships rather than event-handling procedures.
- **Automatic dependency discovery** — dependencies are discovered from the values read during evaluation.
- **No user-managed subscriptions** — users do not manually subscribe or unsubscribe from system inputs.
- **No user-managed recalculation** — users do not manually trigger updates of dependent values.
- **System drivers own external operations** — input, output, I/O, communication, and environment integration belong to drivers.
- **Errors can be values** — loading and application-level failures can be represented and processed as ordinary values.
- **Explicit external activation** — operations that must happen after an external action should use an activation-oriented system driver.
- **Local value definition** — a derived value is determined by its declaration and its dependencies rather than arbitrary writes from unrelated code.
- **Isolated execution** — user code runs in a sandbox and cannot access the environment directly.
- **Language independence** — the same `.syntez` specification can be implemented in any programming language.
- **Minimal user vocabulary** — application authors should primarily need to understand values, functors, system inputs, output properties, and available drivers.

---

## Status

Syntez is an experimental project exploring whether application programming can be expressed primarily as:

1. A declarative structure of values and dependencies;
2. A language-agnostic virtual machine that isolates user code;
3. System-specific behavior implemented through extensible drivers.

The long-term goal is to make it possible to:

- write secure, portable applications once;
- run them on any platform (web, server, mobile, desktop);
- extend them with new drivers and capabilities;
- audit and understand data flow and application behavior.
