
var babel = require('babel-core');
var t = require('babel-types');
var template = require("babel-template");

// var code = `

// var CustomBillItem = _react2.default.createClass({
//   a: 1,
//   b: 2
// });

// var CustomBillItem2 = _react2.default.createClass({
//   a: 1,
//   b: 2
// });

// `

var prepend = template(`var createClass = require("create-react-class")`);
var program = null;

var visitor = {
    Identifier(path) {
      // 调用了 createClass
      if (path.node.name === 'createClass') {
        // 调用方是类react 则替换为createClass
        if (path.parent && path.parent.object && /react/.test(path.parent.object.object.name)) {
          path.parentPath.replaceWith(
            t.identifier('createClass')
          );
          // 插入 createClass
          var newprogram = path.findParent((path) => path.isProgram());
          if (newprogram !== program) {
            program = newprogram;
            program.unshiftContainer("body", prepend());
          }
        }
      }
    }
}

module.exports = function (babel) {
  return {
      visitor
  };
}

// var result = babel.transform(code, {
//     plugins: [{
//         visitor: visitor
//     }]
// })
// var result2 = babel.transform(code, {
//   plugins: [{
//       visitor: visitor
//   }]
// })
// console.log(result.code) //import { _uniq, extend, flatten, cloneDeep } from "lodash";
// console.log(result2.code) 
