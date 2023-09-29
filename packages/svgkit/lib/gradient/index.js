'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
  .default;
exports.__esModule = true;
exports.RadialGradient = exports.LinearGradient = exports.Gradient = void 0;
var _createClass2 = _interopRequireDefault(
  require('@babel/runtime/helpers/createClass'),
);
var _inheritsLoose2 = _interopRequireDefault(
  require('@babel/runtime/helpers/inheritsLoose'),
);
var _uuid = _interopRequireDefault(require('../utils/uuid'));
/* eslint-disable prefer-destructuring */
/* eslint-disable max-classes-per-file */
var Gradient = /*#__PURE__*/ (function() {
  function Gradient(x1, y1, x2, y2) {
    this.id = (0, _uuid.default)();
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.stops = [];
    this.added = false;
  }
  var _proto = Gradient.prototype;
  _proto.stop = function stop(offset, color, opacity) {
    var stop = {
      offset: offset,
    };
    if (color.indexOf('rgba') !== -1) {
      // Separate alpha value, since webkit can't handle it
      var regex = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d?\.?\d*)\s*\)/gi;
      var matches = regex.exec(color);
      stop.color =
        'rgb(' + matches[1] + ',{' + matches[2] + '},' + matches[3] + ')';
      stop.opacity = matches[4];
    } else {
      stop.color = color;
      stop.opacity = opacity;
    }
    this.stops.push(stop);
    return this;
  };
  return Gradient;
})();
/* eslint-disable prefer-destructuring */
exports.Gradient = Gradient;
var LinearGradient = /*#__PURE__*/ (function(_Gradient) {
  (0, _inheritsLoose2.default)(LinearGradient, _Gradient);
  function LinearGradient(x1, y1, x2, y2) {
    var _this;
    _this = _Gradient.call(this, x1, y1, x2, y2) || this;
    _this.type = 'linearGradient';
    return _this;
  }
  (0, _createClass2.default)(LinearGradient, [
    {
      key: 'attributes',
      get: function get() {
        return {
          id: this.id,
          x1: this.x1,
          y1: this.y1,
          x2: this.x2,
          y2: this.y2,
          gradientUnits: 'userSpaceOnUse',
        };
      },
    },
  ]);
  return LinearGradient;
})(Gradient);
exports.LinearGradient = LinearGradient;
var RadialGradient = /*#__PURE__*/ (function(_Gradient2) {
  (0, _inheritsLoose2.default)(RadialGradient, _Gradient2);
  function RadialGradient(x1, y1, r1, x2, y2, r2) {
    var _this2;
    _this2 = _Gradient2.call(this, x1, y1, x2, y2) || this;
    _this2.r1 = r1;
    _this2.r2 = r2;
    _this2.type = 'radialGradient';
    return _this2;
  }
  (0, _createClass2.default)(RadialGradient, [
    {
      key: 'attributes',
      get: function get() {
        return {
          id: this.id,
          cx: this.x2,
          cy: this.y2,
          r: this.r2,
          fx: this.x1,
          fy: this.y1,
          gradientUnits: 'userSpaceOnUse',
        };
      },
    },
  ]);
  return RadialGradient;
})(Gradient);
exports.RadialGradient = RadialGradient;
