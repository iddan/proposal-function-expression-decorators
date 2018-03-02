# Examples 

An example with [recompose](https://github.com/acdlite/recompose):

#### With Decorators
```js
import { pure, withState } from 'recompose'

@pure
@withState('data', 'setData', null)
const MyComponent = ({ data, setData }) => (
    <div onClick={() => setData(Math.random())}>{data}</div>
);
```

#### Without Decorators
```js
import { pure, withState } from 'recompose'

const MyComponent = pure(withState('data', 'setData', null)(({ data, setData }) => (
    <div onClick={() => setData(Math.random())}>{data}</div>
));
```

*or more precisely to retain function name*
```js
import { pure, withState } from 'recompose'

const MyComponent = pure(withState('data', 'setData', null)(function MyComponent ({ data, setData }) {
   return <div onClick={() => setData(Math.random())}>{data}</div>
}));
```

1. The first example is more readable. The visual pattern of `const [NAME] = (ARGS) => RESULT` stays and you get each higher order component to be on another line. 

2. When composing functions as long as the `|>` operator doesn't exists composing functions and applying them on inline functions becomes cumbersome and unreadable.

3. In the second example which is the common case for inlining functions and higher order ones `MyComponent.name` is "MyComponent" and not "" - this is very important for debugging and making sense of code.

### Metaprogramming

Metaprogramming can be easily distinguished visually for example in:

```javascript
@cached
const getData = () => localStorage.getItem('data')
```

`getData()` definition is easily distinguishable from the `@cached` which only suggests adding external functionality

#### In Callabacks

##### Usage

```javascript
scheduleForFrequentReexecution(@memoize function(value) { 
  value++
});
```

##### Decorator Defenition

```javascript
export function memoize(...) {
  // at minimum, the arguments of this function should contain:
  // - reference to the decorated function expression
  // - arguments passed into the memoize function (if any)

  // wrap the decorated function expression memoization implementation and return it
}
```
