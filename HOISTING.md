# Hoisting

Unlike decorating function expressions, decorating function declarations exposes us to a TDZ issue due to the hoisting that function declarations are subject to.

### Suggestions

#### Mirrors

The TDZ issue can be resolved using [Mirrors](https://gist.github.com/rbuckton/8e6806fb6852b50e4052/) and if this proves to be an acceptable solution this proposal can be expanded to include function declarations as well.

#### Decorated function execution would not be hoist until first call. ([by @hax](https://github.com/tc39/proposal-decorators/issues/40#issuecomment-369867557))

```javascript
@deco
function f() {
  funcBody
}
```

Could be transpiled to:

```javascript
function f(...args) {
  $do_decorate_f()
  return $decorated_f.call(this, ...args)
}

var $decorated_f

function $do_decorate_f() {
  if (!$decorated_f) $decorated_f = deco(function f() {
    funcBody
  })
}

$do_decorate_f()
```
