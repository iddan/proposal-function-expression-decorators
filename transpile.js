const acorn = require('acorn')
const recast = require('recast')
const { builders } = recast.types

function getTokenType(p, loose) {
  return loose ? p.tok.type : p.type;
}

var extendsAcorn = function (pp) {
  var loose = pp == (acorn.LooseParser && acorn.LooseParser.prototype);
  
  pp.parseDecorator = function() {
    var node = this.startNode();
    this.next();
    node.expression = this.parseMaybeAssign();
    return this.finishNode(node, "Decorator");
  }
  
  return function(instance) {
    instance.decorators = [];
  
    instance.extend('getTokenFromCode', function(inner) {
      return function(code) {
        if (code == 64) {
          ++this.pos; return this.finishToken(tt.at); 
        }
        return inner.call(this, code);
      };
    }); 
  
    instance.extend('parseStatement', function(inner) {
      return function(declaration, topLevel) {
        switch(getTokenType(this, loose)) {
          case tt.at:
            while (getTokenType(this, loose) === tt.at) {
              this.decorators.push(this.parseDecorator());
            }
            if (!loose && getTokenType(this, loose) !== tt._function) {
              this.raise(this.start, "Leading decorators must be attached to a function declaration");
            }
          case tt._class:
            if (!loose && !declaration) this.unexpected()
            if (this.decorators.length) {
              var node = inner.call(this, declaration, topLevel);
              node.decorators = this.decorators;
              // adjust start of ClassDeclaration with start of the first decorator (helpful for ES7 walk).
              node.start = node.decorators[0].start; 
              this.decorators = [];
              return node;
            }          
          }       
          return inner.call(this, declaration, topLevel);
      };
    });
  }
}

var tt = acorn.tokTypes;
tt.at = new acorn.TokenType('@');
// acorn 
acorn.plugins.es7 = extendsAcorn(acorn.Parser.prototype);
// acorn loose
if(acorn.LooseParser) acorn.pluginsLoose.es7 = extendsAcorn(acorn.LooseParser.prototype);

const parser = {
  parse(source) {
    return acorn.parse(source, {
      // Specify use of the plugin
      plugins:{es7:true},
      // Specify the ecmaVersion
      ecmaVersion:7
    })
  }
}

function transpile(code) {
  const ast = recast.parse(code, { parser })
  recast.types.visit(ast, {
    visitFunction(path) {
      const { node } = path
      if (node.decorators) {
        const functionExpression = builders.functionExpression(
          null, // Anonymize the function expression.
          node.params,
          node.body
        )
        const resolved = node.decorators.reduceRight((acc, decorator) => {
          return builders.callExpression(decorator.expression, [acc])
        }, functionExpression)
        path.replace(builders.variableDeclaration('var', [
          builders.variableDeclarator(
            node.id,
            resolved,
          )
        ]))
      }
      this.traverse(path)
    }
  })
  return recast.print(ast).code
}

console.log(transpile(`
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

function partial(...preargs) {
  return func => (...args) => func(...preargs, ...args);
}

const USERS = {
  42: {
    name: "Dan"
  }
}

function init() {
  search(42);

  @memoize
  @partial(USERS)
  function search(users, id) {
    return users[id];
  }

  return search;
}

init();
`))
