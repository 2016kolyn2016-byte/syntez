# Syntez.js

### Synchronizing Theses

Syntez is a lightweight, dependency-free framework for data-driven systems. It focuses on the controlled synthesis of application logic and the precise synchronization of internal state (theses) across defined host projections.

### Key Concepts

* **Unified Data Model:** Treats JS objects and primitive types as the primary building blocks for both logic and structure.
* **Declarative Definitions:** Define system states and projections using plain JavaScript object literals, where functions serve as reactive values.
* **Automatic Reactivity:** State and related entities remain in sync via a lightweight dependency tracking mechanism.
* **Minimal Footprint:** No virtual DOM, no build tools, no external dependencies. Pure JavaScript.

### Usage Guidelines

**Note:** Syntez is designed to be initialized **once**. The application structure and dynamics should be described using functions that react to data changes. Avoid calling `syntez()` repeatedly; instead, encapsulate your logic and state within the initial definition, allowing the framework to handle updates reactively.

### Data Projection and Mapping

To manage data flow, use these conventions:

* **Input/State:** Incoming data and external controls are defined via `syntez.<method>()`. These serve as your reactive state sources.
* **Output/Projection:** Target entities are defined within the `syntez(...)` call. The structure and naming of the keys define the hierarchy and map the objects onto specific host interfaces (e.g., DOM, console, or file systems).



### Live Example

The following snippet demonstrates how reactive functions act as the glue between data and the interface:

```index.js
syn({
    console: syn.keys,
    view: [
        { b: 0x777777ff, c: 0x00aaffff, y: 0 },
        [{ b: 0x555555ff, c: 0x00aaffff }, 'Header'],
        ['Body'],
        [{ b: 0x555555ff, c: 0x00aaffff }, 'Footer']
    ]
})