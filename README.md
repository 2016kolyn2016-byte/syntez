# Syntez

## Declarative Applications as a Virtual Machine

Syntez is an experimental language for describing applications as hierarchies of values and dependencies. Applications declare **what values must exist and how they are determined**. The virtual machine maintains these relationships, automatically updates values when inputs change, and mediates all external I/O through system drivers.

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

You do not manually subscribe to changes, trigger recalculation, update the screen, or synchronize outputs. These are runtime responsibilities.

---

## Core Concepts

### Values, Not Commands

Syntez contains no executable code, control flow, or side effects. Every expression describes a value.

```syntez
(
    user(text:); "text input"
    greeting('Hello, ' + (/user)); "default left operand is a current list with ;"
)
```

This describes: *"greeting is determined by user"* — not *"when user changes, call greeting."*

The VM keeps `greeting` consistent with `user`. You don't manage subscriptions, events, or state mutations.

### Types of Values

- **Nothing** — absence of a value
- **Error** — failures and exceptional states, treated as ordinary values
- **Number** — `42`
- **Text** — `'hello'`, `identifier`
- **Named Value** — `name(value)` creates a named entity
- **Set** — multiple values: `a; b; c`
- **Formula** — expressions combining operands with operators

### Operators

Eight operators. Semantics depend on operand types:

| Operator | Purpose | Example |
|----------|---------|---------|
| `+` | add / concatenate | `3 + 2`, `'hello' + 'world'` |
| `-` | subtract / remove | `5 - 3` |
| `*` | multiply | `4 * 2` |
| `/` | divide / lookup | `10 / 2`, `set / 'key'` |
| `^` | exponent | `2 ^ 8` |
| `:` | root / extract | `8 : 3` (cube root), `http:` (system input) |
| `~` | type check / convertion | `value ~` (get type), `text ~ 'syntez'` (parse) |
| `&` | logical AND | `a & b` |
| `\|` | logical OR / fallback | `a \| b` |
| `=` | equal | `a = b` |

### Named Values

Syntax: `name(value)`. The name is determined by the default operator, which creates a named entity.

```syntez
title('Page')       ← named value: key='title', value='Page'
color(255)          ← named value: key='color', value=255
status(http:)       ← named value: key='status', value=result of http: formula
```

Named values are used for metadata, structured output, and system driver contracts.

### Automatic Dependency Discovery

When a formula is evaluated, the VM observes which system inputs it reads. These become its dependencies.

```syntez
message: ((status: = 'ok') & 'Ready') | 'Not Ready'
```

- If `status:` equals `'ok'`, the formula reads `'Ready'`
- If `status:` is different, the formula reads `'Not Ready'`
- **Dependencies change at runtime based on control flow**

When `status:` changes, `message` is automatically recalculated. No manual subscription. No event handlers.

---

## System Inputs and Drivers

### System Inputs

Identifiers followed by `:` provide values from the environment:

```syntez
keys:           ← keyboard state
mouse:          ← mouse state
location:       ← browser URL
```

When inputs change, all dependent values are updated.

### Output Drivers

Reserved names in the root application declaration route values to outputs:

```syntez
console(value)  ← output to browser console
view(structure) ← render to the DOM
```

The same value can be sent to multiple outputs:

```syntez
data: location:;
console(data);
view(data);
```

### Future Drivers

The driver system is extensible. Planned: HTTP requests, timers, file I/O, database access. Syntax unchanged; drivers added as framework matures.

---

## Error Handling

Errors are first-class values. System drivers may return errors (network failure, missing data, etc.). Your application inspects error types and responds:

```syntez
status: http: 'https://api.example.com/status';
display: (/status ~ = error & ('Error: ' + (/status)) | /status)
```

If `http:` returns an Error, display shows the error. Otherwise, it shows the status.

Errors propagate through formulas by default:

- `Error + 5` → Error
- `Error & true` → Error
- `Error | 'fallback'` → `'fallback'` (OR operator recovers)

This eliminates try/catch boilerplate.

---

## The Application is a Dependency Structure

A Syntez application flow:

```text
system input
    ↓
formula (combining inputs and constants)
    ↓
derived value
    ↓
output driver
```

Example:

```text
location:
    ↓
view(location:)
    ↓
DOM update
```

Dependencies are discovered during evaluation. If a formula's condition changes, its dependencies change too. The user never declares or removes subscriptions manually.

---

## Security and Isolation

User code in `.syntez` files runs in a controlled VM environment.

**What user code cannot do:**

- Access browser APIs, DOM, network, or file system directly
- Access global state or other applications' data
- Escape the sandbox or bypass restrictions
- Perform arbitrary operations

**How I/O happens:**

All external interaction goes through system drivers. An application declares needed values; drivers decide how to provide them.

**Implications:**

- Safe execution of untrusted user-submitted applications
- Sandboxed multi-tenant environments
- Auditable data flow
- Isolation enforced by architecture, not convention

---

## Why This Model is Useful

**Local Value Definition**

A derived value is determined by its declaration and inputs. No arbitrary external updates. Origin is always traceable.

**Fewer Hidden Mutations**

Values change because inputs change or drivers provide new data, not because of unrelated code.

**Traceable Data Flow**

```text
system input → formula → value → output driver
```

**System Complexity in Drivers**

Application code describes required values. Drivers implement network, database, rendering, and storage operations.

**Portable Applications**

The same `.syntez` file can run on any platform with a Syntez VM.

---

## Current Implementation

Browser-based experimental runtime:

- `web/syntez.js` — virtual machine, parser, and drivers
- `web/index.syntez` — example application
- `web/index.html` — loader

### Features

- Declarative application structure
- Automatic dependency tracking
- System inputs: `keys:`, `mouse:`, `location:`
- Output drivers: `console`, `view`
- DOM rendering and CSS styling through named properties
- Arithmetic and logical operations

### Run It

```bash
cd web
python3 -m http.server 8000
# Open http://localhost:8000/
```

A local server is required because the VM loads applications via `fetch`.

---

## Current Limitations

Syntez is an experimental implementation. The following areas are not yet complete:

- Formal language grammar specification
- Complete operator semantics for every type
- HTTP, WebSocket, timer, file, and database drivers
- Activation API for explicit user actions
- Production-grade error diagnostics
- Comprehensive test suite
- Performance optimization
- Implementations in languages other than JavaScript

Other VM implementations are planned after the core concept has been validated.

---

## Design Principles

- Declarative value hierarchies, not command sequences
- Dependencies discovered automatically during evaluation
- System drivers own external operations
- Errors are ordinary values
- User code is isolated from the environment
- The language specification is independent of the VM implementation
- Minimal vocabulary: values, operators, and driver names

---

## Vision

Syntez explores whether application programming can be expressed through:

1. Declarative hierarchies of values and dependencies
2. A language specification implemented by different VMs
3. Extensible system drivers for external operations

The goals are secure execution, portable applications, traceable data flow, and less infrastructure code in application logic.
