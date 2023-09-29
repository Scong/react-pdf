'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
  .default;
exports.__esModule = true;
exports.default = void 0;
var _text = _interopRequireDefault(require('./text'));
var _vector = _interopRequireDefault(require('./vector'));
var _images = _interopRequireDefault(require('./images'));
var _styles = _interopRequireDefault(require('./styles'));
var _transform = _interopRequireDefault(require('./transform'));
var _element = require('./element');
var _getPageSize = _interopRequireDefault(require('../utils/getPageSize'));
/* eslint-disable guard-for-in */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-syntax */
// const DEFAULT_MARGINS = {
//   top: 0,
//   left: 0,
//   bottom: 0,
//   right: 0,
// };
var SVGPage = /*#__PURE__*/ (function() {
  function SVGPage(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 'letter' : _ref$size,
      _ref$orientation = _ref.orientation,
      orientation = _ref$orientation === void 0 ? 'portrait' : _ref$orientation;
    var _getSize = (0, _getPageSize.default)(size, orientation),
      width = _getSize.width,
      height = _getSize.height;
    this.width = width;
    this.height = height;
    this.setDefaultStyles();
    this.groupStack = [];
    this.stack = [this.getStyleState()];
    this.root = (0, _element.createElement)('svg');
    this.root.setAttribute('version', '1.1');
    this.root.setAttribute('width', this.width);
    this.root.setAttribute('height', this.height);
    this.defs = (0, _element.createElement)('defs');
    this.root.appendChild(this.defs);
    this.currentElement = (0, _element.createElement)('g');
    this.root.appendChild(this.currentElement);
  }
  var _proto = SVGPage.prototype;
  _proto.closestGroupOrSvg = function closestGroupOrSvg(node) {
    node = node || this.currentElement;
    if (node.nodeName === 'g' || node.nodeName === 'svg') return node;
    return this.closestGroupOrSvg(node.parentNode);
  };
  _proto.save = function save() {
    var group = (0, _element.createElement)('g');
    var parent = this.closestGroupOrSvg();
    this.groupStack.push(parent);
    parent.appendChild(group);
    this.currentElement = group;
    this.stack.push(this.getStyleState());
  };
  _proto.restore = function restore() {
    this.currentElement = this.groupStack.pop();
    this.currentElementsToStyle = null;
    if (!this.currentElement) {
      this.currentElement = this.root.childNodes[1];
    }
    var state = this.stack.pop();
    this.applyStyleState(state);
  };
  return SVGPage;
})();
var mixin = function mixin(methods) {
  return (function() {
    var result = [];
    for (var name in methods) {
      var method = methods[name];
      result.push((SVGPage.prototype[name] = method));
    }
    return result;
  })();
};
mixin(_text.default);
mixin(_vector.default);
mixin(_styles.default);
mixin(_images.default);
mixin(_transform.default);
var _default = SVGPage;
exports.default = _default;
