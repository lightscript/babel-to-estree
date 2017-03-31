# babel-to-estree

Translates a "Babel AST" to an "ESTree AST".
Intended for cases when an AST must be consumed by an ESTree-compliant consumer
after a babel-plugin traversal.

If you only need a babylon-parsed AST, and do not need traversal,
try the `"estree"` plugin that babylon [now offers](https://github.com/babel/babylon/#output) instead.


### Usage

```js
import { transform } from 'babel-core'
import { toEstree } from 'babel-to-estree'
import myPlugin from './my-babel-plugin'

const source = 'code("here");'

const { ast, code } = transform(source, { plugins: [myPlugin] })

// mutates `ast` input
toEstree(ast, source);

// contains Literal, not StringLiteral
console.log(ast.body[0].expression.arguments[0])

// Node {
//   type: 'Literal',
//   start: 5,
//   end: 11,
//   loc: SourceLocation {
//     start: Position { line: 1, column: 5 },
//     end: Position { line: 1, column: 11 } },
//   extra: { rawValue: 'here', raw: '"here"' },
//   value: 'here',
//   range: [ 5, 11 ],
//   _babelType: 'StringLiteral',
//   raw: '"here"'
// }
```

### Deviations Addressed

The [Babel AST format][] is based on [ESTree spec][] with the following deviations:

- [Literal][] token is replaced with [StringLiteral][], [NumericLiteral][], [BooleanLiteral][], [NullLiteral][], [RegExpLiteral][]
- [Property][] token is replaced with [ObjectProperty][] and [ObjectMethod][]
- [MethodDefinition][] is replaced with [ClassMethod][]
- [Program][] and [BlockStatement][] contain additional `directives` field with [Directive][] and [DirectiveLiteral][]
- [ClassMethod][], [ObjectProperty][], and [ObjectMethod][] value property's properties in [FunctionExpression][] is coerced/brought into the main method node.

AST for JSX code is based on [Facebook JSX AST][] with the addition of one node type:

- `JSXText`

[Babel AST format]: https://github.com/babel/babylon/blob/master/ast/spec.md
[ESTree spec]: https://github.com/estree/estree

[Literal]: https://github.com/estree/estree/blob/master/es5.md#literal
[Property]: https://github.com/estree/estree/blob/master/es5.md#property
[MethodDefinition]: https://github.com/estree/estree/blob/master/es2015.md#methoddefinition

[StringLiteral]: https://github.com/babel/babylon/blob/master/ast/spec.md#stringliteral
[NumericLiteral]: https://github.com/babel/babylon/blob/master/ast/spec.md#numericliteral
[BooleanLiteral]: https://github.com/babel/babylon/blob/master/ast/spec.md#booleanliteral
[NullLiteral]: https://github.com/babel/babylon/blob/master/ast/spec.md#nullliteral
[RegExpLiteral]: https://github.com/babel/babylon/blob/master/ast/spec.md#regexpliteral
[ObjectProperty]: https://github.com/babel/babylon/blob/master/ast/spec.md#objectproperty
[ObjectMethod]: https://github.com/babel/babylon/blob/master/ast/spec.md#objectmethod
[ClassMethod]: https://github.com/babel/babylon/blob/master/ast/spec.md#classmethod
[Program]: https://github.com/babel/babylon/blob/master/ast/spec.md#programs
[BlockStatement]: https://github.com/babel/babylon/blob/master/ast/spec.md#blockstatement
[Directive]: https://github.com/babel/babylon/blob/master/ast/spec.md#directive
[DirectiveLiteral]: https://github.com/babel/babylon/blob/master/ast/spec.md#directiveliteral
[FunctionExpression]: https://github.com/babel/babylon/blob/master/ast/spec.md#functionexpression

[Facebook JSX AST]: https://github.com/facebook/jsx/blob/master/AST.md

### History

Based on the `babylon-to-espree` module of [babel-eslint](https://github.com/babel/babel-eslint),
which was in turn based on [acorn-to-esprima](https://github.com/babel/acorn-to-esprima).
