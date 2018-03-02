# Hoisting

Suggestion by @hax: Decorated function execution would not be hoist until first call.

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
