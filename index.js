var babylonToEspree = require("./babylon-to-espree");
var parse           = require("babylon").parse;
var tt              = require("babylon").tokTypes;
var traverse        = require("babel-traverse").default;

var eslintOptions = {};

exports.toEstree = function(ast, code) {
  babylonToEspree(ast, traverse, tt, code);
  return ast;
};

exports.parse = function (code, options) {
  options = options || {};
  eslintOptions.ecmaVersion = options.ecmaVersion = options.ecmaVersion || 6;
  eslintOptions.sourceType = options.sourceType = options.sourceType || "module";
  eslintOptions.allowImportExportEverywhere = options.allowImportExportEverywhere = options.allowImportExportEverywhere || false;
  if (options.sourceType === "module") {
    eslintOptions.globalReturn = false;
  } else {
    delete eslintOptions.globalReturn;
  }

  return exports.parseNoPatch(code, options);
};

exports.parseNoPatch = function (code, options) {
  var opts = {
    codeFrame: options.hasOwnProperty("codeFrame") ? options.codeFrame : true,
    sourceType: options.sourceType,
    allowImportExportEverywhere: options.allowImportExportEverywhere, // consistent with espree
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    plugins: [
      "flow",
      "jsx",
      "asyncFunctions",
      "asyncGenerators",
      "classConstructorCall",
      "classProperties",
      "decorators",
      "doExpressions",
      "exponentiationOperator",
      "exportExtensions",
      "functionBind",
      "functionSent",
      "objectRestSpread",
      "trailingFunctionCommas",
      "dynamicImport"
    ]
  };

  var ast = parse(code, opts);

  exports.toEstree(ast, code);

  return ast;
};
