# Hoisting

Unlike decorating function expressions, decorating function declarations exposes us to a TDZ issue due to the hoisting that function declarations are subject to.

## Possible Solutions

### Mirrors

The TDZ issue can be resolved using [Mirrors](https://gist.github.com/rbuckton/8e6806fb6852b50e4052/) and if this proves to be an acceptable solution this proposal can be expanded to include function declarations as well.

### New syntax without hoisting

```js
@deco
let f() {}

@deco
const g() {}
```

### Lazy evaluation ([by @hax](https://github.com/tc39/proposal-decorators/issues/40#issuecomment-369867557) and [revised by @rbuckton](https://github.com/tc39/proposal-decorators/issues/40#issuecomment-370010647))

Make decorator evaluation lazy and apply it at one of two times (whichever comes first):

- When the function declaration is encountered during evaluation,
- The first time the function declaration is accessed as a value.

```javascript
let g = f; // access f before declaration
f(); // invoke f before declaration

@deco function f() {
  f(); // invoke f inside of declaration
}
```

Could be transpiled to:

```javascript
let g = $$get_f(); // access f before declaration
$$get_f()(); // invoke f before declaration

function f() {
  $$get_f()(); // invoke f inside of declaration
}
var $$f_decorated
function $$get_f() {
  return $$f_decorated || $$f_decorated = deco(f);
}
$$get_f(); // eval decorator if not already accessed
```
