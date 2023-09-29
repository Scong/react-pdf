'use strict';

exports.__esModule = true;
exports.default = void 0;
var serializeAttributes = function serializeAttributes(attributes) {
  var res = Object.keys(attributes).map(function(key) {
    return key + '="' + attributes[key] + '"';
  });
  return res.join(' ');
};
var serializeXML = function serializeXML(element) {
  var res = '';
  if (typeof element === 'string') {
    res += element;
  } else {
    res +=
      '<' + element.type + ' ' + serializeAttributes(element.attributes) + '>';
    element.children.forEach(function(child) {
      res += serializeXML(child);
    });
    res += '</' + element.type + '>';
  }
  return res;
};
var _default = serializeXML;
exports.default = _default;
