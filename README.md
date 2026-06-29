# Syntez.js

### Synchronizing Theses

A lightweight, dependency-free framework for data-driven systems. Syntez provides a unified approach to managing application state, host-level entities, and their dynamic projections.
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

```javascript
syntez({
    log: () => JSON.stringify(syntez.keys()),
    html: {
        lang: 'ua',
        head: [
            {tag: 'meta', charset: 'utf-8'},
            {tag: 'title', val: 'Syntez.js'},
            {tag: 'style', val: `
                html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
                body { overflow-y: scroll; }
            `}
        ],
        body: [
            {tag: 'header', val: 'Syntez Header'},
            {tag: 'main', val: () => {
                var name = syntez.control('Anonim');
                return [ 
                    {tag: 'input', val: name}, 
                    {val: () => 'Hello, ' + name.val() + '!'} 
                ]
            }},
            {tag: 'aside', val: 'Syntez Aside'},
            {tag: 'footer', val: 'Syntez Footer'}
        ]
    }
});
