'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
  .default;
exports.__esModule = true;
exports.createElement = void 0;
var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);
/* eslint-disable import/prefer-default-export */
var Element = /*#__PURE__*/ (function() {
  function Element(type, attributes) {
    if (attributes === void 0) {
      attributes = {};
    }
    this.type = type;
    this.children = [];
    this.parent = null;
    this.attributes = attributes;
  }
  var _proto = Element.prototype;
  _proto.setAttribute = function setAttribute(name, value) {
    this.attributes[name] = value;
  };
  _proto.setAttributes = function setAttributes(values) {
    var keys = Object.keys(values);
    for (var i = 0; i < keys.length; i += 1) {
      var name = keys[i];
      this.attributes[name] = values[name];
    }
  };
  _proto.getAttribute = function getAttribute(name) {
    return this.attributes[name];
  };
  _proto.setParent = function setParent(parent) {
    this.parent = parent;
  };
  _proto.appendChild = function appendChild(element) {
    this.children.push(element);
    if (element.setParent) element.setParent(this);
  };
  _proto.removeChild = function removeChild(element) {
    var index = this.children.indexOf(element);
    if (index > -1) {
      this.children.splice(index, 1);
      element.setParent(null);
    }
  };
  (0, _createClass2.default)(Element, [
    {
      key: 'nodeName',
      get: function get() {
        return this.type;
      },
    },
    {
      key: 'childNodes',
      get: function get() {
        return this.children;
      },
    },
    {
      key: 'parentNode',
      get: function get() {
        return this.parent;
      },
    },
  ]);
  return Element;
})();
var createElement = function createElement(type, attributes) {
  return new Element(type, attributes);
};
exports.createElement = createElement;
