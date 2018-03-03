const parser = require('./parser')

module.exports = function (fileInfo, api, options) {
  const { j } = api
  return j(fileInfo.source)
    .find(j.FunctionDeclaration)
    .filter(path => path.node.decorators)
    .map(path => {
      const { node } = path
      const functionExpression = j.functionExpression(
        node.id,
        node.params,
        node.body
      )
      const resolved = node.decorators.reduceRight((acc, decorator) => {
        return j.callExpression(decorator.expression, [acc])
      }, functionExpression)
      path.replace(j.variableDeclaration('var', [
        j.variableDeclarator(
          node.id,
          resolved,
        )
      ]))
      return path
    })
    .toSource();
}

module.exports.parser = parser
