# Syntez

## Declarative Applications Without Code Execution

Syntez is an experimental language for describing applications as hierarchies of values and dependencies. An application declares **what values must exist and how they are determined**. The virtual machine maintains these relationships, automatically updates values when inputs change, and mediates all external I/O through system drivers.

```syntez
console(location:);
view(
    y(0);
    b(2004318207);
    c(11206655);
    
    (b(255); 'Header');
    'Body';
    (b(255); 'Footer')
);
```

You describe values, not procedures. The virtual machine handles dependency tracking, recalculation, and output synchronization.

---

## Core Concepts

### Values, Not Commands

Syntez has no executable code, control flow, or side effects. Every expression describes a value.

```syntez
status: location:
```

This says: *"status is determined by the current location"* — not *"when location changes, call a function."*

When location updates, status is automatically recalculated. You do not manage subscriptions, events, or state mutations.

### Seven Types of Values

1. **Nothing** — Absence of a value
2. **Error** — Failures and exceptional states, treated as ordinary values
3. **Number** — Integer or floating-point literals: `42`, `3.14`
4. **Text** — Quoted or unquoted: `'hello'`, `identifier`
5. **Named Value** — Key-value pair: `color(255)`, `title('Page')`
6. **Set** — Multiple values: `a; b; c`
7. **Formula** — Expressions combining operands with operators

### Operators

| Operator | Purpose | Example |
|----------|---------|---------|
| `+` | add / concatenate | `3 + 2`, `'hello' + 'world'` |
| `-` | subtract / remove | `5 - 3` |
| `*` | multiply | `4 * 2` |
| `/` | divide / lookup | `10 / 2`, `set / 'key'` |
| `^` | exponent | `2 ^ 8` |
| `:` | root | `8 : 3` (cube root) |
| `~` | type check / parse | `value ~` (get type), `text ~ 'syntez'` (parse) |
| `&` | logical AND | `a & b` |
| `\|` | logical OR / fallback | `a \| b` |

Each operator has semantics defined by the types of its operands. Errors propagate and can be recovered:

```syntez
result: api_call: | 'Default Value'
display: (result ~ = error & ('Error: ' + result)) | result
```

### Dependencies Discovered Automatically

When a value is computed, the VM records which system inputs it reads. If those inputs change, the value is automatically recalculated. Dependencies are discovered at runtime, not declared statically.

---

## System Inputs and Drivers

### System Inputs

Certain identifiers followed by `:` provide values from the environment:

```syntez
keys:           ← current keyboard state
mouse:          ← current mouse state
location:       ← current URL
```

When these inputs change, all dependent values are updated.

### Output Drivers

Reserved names in the root application declaration route values to outputs:

```syntez
console(value)  ← output to browser console
view(structure) ← render to the DOM
```

The same value can be sent to multiple drivers:

```syntez
value: location:;
console(value);
view(value);
```

### Future Drivers

The driver system is extensible. Planned drivers include HTTP requests, timers, file I/O, and database access. The language and syntax remain unchanged; new drivers are added as the framework matures.

---

## Error Handling

Errors are first-class values. Drivers may return errors (network failure, missing data, etc.). Your application inspects error types and responds accordingly:

```syntez
status: http:;
display: (/status ~ = error & 'Request failed') | ('Status: ' + /status)
```

Errors propagate through formulas by default and can be caught with the `|` (OR) operator.

---

## Security and Sandboxing

User code in `.syntez` files runs in a controlled environment:

- No direct access to browser APIs, DOM, file system, or network
- No global state or cross-application data access
- All external interaction mediated through drivers
- Code cannot escape the sandbox

This design makes Syntez suitable for untrusted user-submitted applications and multi-tenant environments.

---

## Current Implementation

The current browser-based runtime demonstrates:

- Declarative application structure
- Automatic dependency tracking
- System inputs: `keys:`, `mouse:`, `location:`
- Output drivers: `console`, `view`
- DOM rendering and CSS styling through named properties
- Arithmetic and logical operations

Located in:
- `web/syntez.js` — Virtual machine, parser, and drivers
- `web/index.syntez` — Example application
- `web/index.html` — Loader

### Run It

```bash
cd web
python3 -m http.server 8000
# Open http://localhost:8000/
```

(A local server is required because the VM loads applications via `fetch`.)

---

## Limitations

This is an experimental implementation validating the core concept. Not yet implemented:

- Formal language grammar specification
- Complete set of system drivers and operations per type
- HTTP, WebSocket, timer, file, and database drivers
- General activation API for explicit actions
- Production-grade error diagnostics
- Comprehensive test suite
- Performance optimization (parallelization, memoization, dead-code elimination)
- Implementations in languages other than JavaScript

These are implementation limitations, not limitations of the language model.

---

## Vision

Syntez explores whether application programming can be expressed entirely as:

1. Declarative hierarchies of values and dependencies
2. A language-agnostic specification implemented by different VMs
3. Extensible system drivers for all external operations

The goal is to enable:

- **Secure** — User code runs in isolation
- **Portable** — Same `.syntez` file runs on any platform with a VM
- **Auditable** — Data flow is explicit and traceable
- **Simple** — No imperative code, state mutations, or side effects to reason about

---

## Design Principles

- Applications are value hierarchies, not command sequences
- Dependencies are discovered automatically during evaluation
- System drivers own all external operations (I/O, input, output)
- Errors are ordinary values, not exceptions
- User code is isolated and cannot access the environment directly
- The same language specification can be implemented on any platform
- Minimal vocabulary: values, operators, and driver names
```
