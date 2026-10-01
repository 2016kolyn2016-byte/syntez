# Syntez

## Declarative Programming Language

Syntez is a language for describing applications as values and their dependencies. You don't write commands for the computer — you describe what values should exist and how they relate to each other. The runtime automatically keeps everything consistent.

```syntez
user(text:);
greeting: 'Hello, ' + (/user);
view(/greeting)
```

When `user` changes, `greeting` automatically updates. When `greeting` changes, `view` automatically re-renders. No manual state management. No event handlers. No subscriptions.

---

## How Is Syntez Different?

| Feature | JavaScript | Syntez |
|---|---|---|
| What you write | Commands (imperative) | Declarations (declarative) |
| State management | You manage manually | Automatic |
| Dependencies | You track manually | Automatic |
| When input changes | You must update everything downstream | Automatic cascade |
| Sandbox | No | Yes (built-in) |

Syntez is closest to **Excel formulas** (automatic recalculation) and **SQL** (declarative), but for full applications.

---

## Core Concepts

### Values and Formulas

Syntez contains no commands or control flow. Every expression describes a value.

```syntez
x(5);                           // x is a value: 5
y: /x + 3;                      // y is a formula: always x + 3
message: 'Count: ' + (/y);      // message combines values
view(/message)                  // view displays the message
```

The VM keeps `y` and `message` consistent with `x`. When `x` changes, everything downstream updates.

### Types of Values

- **Nothing** — absence of a value
- **Error** — failures treated as ordinary values
- **Number** — `42`
- **Text** — `'hello'` or identifier
- **Named Value** — `name(value)` creates a key-value pair
- **Set** — multiple values: `a; b; c`
- **Formula** — expressions combining values with operators

### Automatic Dependency Tracking

When you reference a value in a formula, the VM automatically tracks the dependency:

```syntez
status(http: 'api/status');
message: ((status: = 'ok') & 'Ready') | 'Not Ready';
view(/message)
```

- If `status:` equals `'ok'`, `message` reads from the first branch
- If `status:` is different, `message` reads from the second branch
- **Dependencies change at runtime based on the condition**

When `status:` changes, `message` is automatically recalculated. No manual subscriptions.

---

## Operators

Eight core operators. Semantics depend on operand types:

| Operator | Purpose | Example |
|----------|---------|---------|
| `+` | add / concatenate | `3 + 2`, `'hello' + 'world'` |
| `-` | subtract / remove | `5 - 3` |
| `*` | multiply | `4 * 2` |
| `/` | divide / lookup | `10 / 2`, `set / 'key'` |
| `^` | exponent | `2 ^ 8` |
| `:` | extract / input | `8 : 3` (root), `http:` (system input) |
| `~` | type check / parse | `value ~` (type), `text ~ 'syntez'` (parse) |
| `=` | equal | `a = b` |
| `<` | less than | `a < b` |
| `>` | greater than | `a > b` |

**Important:** Operators have no precedence and are evaluated strictly left to right.

Example: `3 + 2 * 4` evaluates as `(3 + 2) * 4 = 20`, not `3 + (2 * 4) = 11`

### Logical Operators: `&` and `|`

The `&` and `|` operators work with data, not boolean logic.

**`&` (AND) — Keep left, or use right:**
- If left operand is **significant** (non-zero, non-empty, non-nothing), return it
- If left operand is **not significant** (0, empty string, nothing), return right operand

```syntez
quantity(0) & 'no items'        // → 'no items' (0 is not significant)
quantity(5) & 'items'           // → 'items' (5 is significant)

user(nothing) & 'guest';        // → 'guest' (nothing is not significant)
user('Alice') & 'welcome';      // → 'welcome' (non-empty is significant)
```

**`|` (OR) — Use left if significant, or right:**
- If left operand is **significant**, return it
- If left operand is **not significant**, return right operand

```syntez
cached_value(nothing) | http: 'api/data'   // → fetches data (cache is empty)
cached_value('data') | http: 'api/data'    // → 'data' (use cache)

input(0) | 100                  // → 100 (input is 0, use default)
input(50) | 100                 // → 50 (input is significant)
```

These operators are designed for **data flow**, not boolean tests. They're useful for fallbacks, defaults, and conditional data selection without explicit if/else.

---

## System Inputs and Drivers

### System Inputs

Inputs are named by identifiers followed by `:`. They represent values from the environment:

```syntez
keys:       // keyboard input
mouse:      // mouse state
location:   // browser URL
```

Formulas automatically depend on these inputs. When they change, dependent values recalculate:

```syntez
url_param: /location / 'id';
data: http: 'api/user/' + /url_param;
view(/data)
```

When `location:` changes, the URL param is extracted, data is re-fetched, and the view updates — all automatically.

### Output Drivers

Output is done through reserved names that route values to the system:

```syntez
view(value)     // render to DOM
console(value)  // log to browser console
```

The same value can be sent to multiple outputs:

```syntez
result(http: 'api/compute');
console(/result);
view(/result)
```

Future drivers (planned): HTTP requests, timers, file I/O, database access.

---

## Error Handling

Errors are first-class values. System drivers may return errors (network failure, missing data, etc.). Inspect and respond:

```syntez
status: http: 'https://api.example.com/status';
display: (/status ~ = error) & ('Error: ' + (/status)) | (/status)
```

If `http:` returns an Error, display shows it. Otherwise, it shows the value.

Errors propagate through formulas by default:

- `Error + 5` → Error
- `Error & 'fallback'` → `'fallback'` (AND recovers from error)
- `Error | 'fallback'` → `'fallback'` (OR recovers from error)

This eliminates try/catch boilerplate.

---

## How It Works

An application is a graph of values and their relationships:

1. System inputs (e.g., `keys:`, `location:`) change
2. Formulas depending on them are recalculated
3. Dependent values cascade update automatically
4. Output drivers (view, console) display the results

Example:

```syntez
item_count(0);
items: array_from(http: 'api/items');
count: /items | nothing;
message: /count & ('Items: ' + /count) | 'No items';
view(/message)
```

When you change `item_count(5)`, the entire chain updates automatically. No refresh needed.

---

## Common Patterns

### Conditional Display

```syntez
status(http: 'api/status');
display: (/status = 'ok') & 'Ready' | 'Loading...';
view(/display)
```

### Form with Validation

```syntez
email(text:);
is_valid: /email ~ 'email';
error: (/is_valid ~ = error) & /is_valid | nothing;
view(/error)
```

### Dependent Calculations

```syntez
quantity(5);
price(100);
total: /quantity * /price;
discount: /total > 500 & /total * 0.1 | 0;
final_price: /total - /discount;
view(/final_price)
```

### Fallback / Default Values

```syntez
user_preference(nothing);
theme: /user_preference | 'light';  // use preference, or default to 'light'
view(/theme)
```

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

## Why This Model Is Useful

**Local Value Definition**

A derived value is determined by its declaration and inputs. No arbitrary external updates. Origin is always traceable.

**Fewer Hidden Mutations**

Values change because inputs change or drivers provide new data, not because of unrelated code.

**Traceable Data Flow**

```text
system input → formula → derived value → output driver
```

**System Complexity in Drivers**

Application code describes required values. Drivers implement network, database, rendering, and storage operations.

**Portable Applications**

The same `.syntez` file runs on any platform with a Syntez VM.

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
- Arithmetic, comparison, and logical operations

### Limitations

Syntez is experimental. Incomplete areas:

- Formal language grammar specification
- Complete operator semantics for all types
- HTTP, WebSocket, timer, file, and database drivers
- Activation API for explicit user actions
- Production-grade error diagnostics
- Comprehensive test suite
- Performance optimization
- Implementations in other languages

Other VM implementations are planned after the core concept is validated.

---

## Who Should Use Syntez?

**Good fit:**
- Building user interfaces and dashboards
- Applications with complex dependencies
- Learning declarative programming
- Safe execution of untrusted code

**Not suitable for:**
- System programming (OS, drivers, embedded systems)
- Performance-critical algorithms
- Code that requires direct hardware access

---

## Design Principles

- Declarative value hierarchies, not command sequences
- Dependencies discovered and tracked automatically
- System drivers own external operations
- Errors are ordinary values
- User code is isolated from the environment
- Language specification is independent of VM implementation
- Minimal vocabulary: values, operators, and driver names

---

## Vision

Syntez explores whether application programming can be expressed through:

1. Declarative hierarchies of values and dependencies
2. A language specification implemented by different VMs
3. Extensible system drivers for external operations

The goals are secure execution, portable applications, traceable data flow, and less infrastructure code in application logic.
```
