/** Classic decorator */
function memoize(func) {
  const results = new Map();
  return (arg, ...rest) => {
    if (results.has(arg)) {
      return results.get(arg);
    }
    const value = func(arg, ...rest);
    results.set(arg, value);
    return value;
  }
}

/** Parametrized decorator */
function partial(...preargs) {
  return func => (...args) => func(...preargs, ...args);
}

const USERS = {
  42: {
    name: "Dan"
  }
}

/** Wrap in block */
function init() {
  /** Hoisted call */
  search(42);

  /** Classic decorator appliance */
  @memoize
  /** Decorator factory appliance */
  @partial(USERS)
  function search(users, id) {
    return users[id];
  }

  return search;
}

init();
