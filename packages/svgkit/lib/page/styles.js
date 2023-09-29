'use strict';

exports.__esModule = true;
exports.default = void 0;
var STYLES = {
  strokeColorStyle: '#000000',
  fillColorStyle: '#000000',
  lineWidthStyle: 1,
  fillRuleStyle: 'nonzero',
  lineCapStyle: 'butt',
  lineJoinStyle: 'miter',
  lineDashStyle: '0 0',
  fillOpacityStyle: 1,
  strokeOpacityStyle: 1,
  opacityStyle: 1,
  fontSizeStyle: 12,
  fontFamilyStyle: 'Helvetica',
};
var _default = {
  setDefaultStyles: function setDefaultStyles() {
    var keys = Object.keys(STYLES);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      this[key] = STYLES[key];
    }
  },
  getStyleState: function getStyleState() {
    var styleState = {};
    var keys = Object.keys(STYLES);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      styleState[key] = this[key];
    }
    return styleState;
  },
  applyStyleState: function applyStyleState(styleState) {
    var keys = Object.keys(styleState);
    for (var i = 0; i < keys.length; i += 1) {
      var key = keys[i];
      this[key] = styleState[key];
    }
  },
  opacity: function opacity(_opacity) {
    this.opacityStyle = _opacity;
  },
  fillRule: function fillRule(rule) {
    this.fillRuleStyle = rule.replaceAll('-', '');
  },
  fillColor: function fillColor(color) {
    this.fillColorStyle = color;
  },
  fillOpacity: function fillOpacity(opacity) {
    this.fillOpacityStyle = opacity;
  },
  strokeColor: function strokeColor(color) {
    this.strokeColorStyle = color;
  },
  strokeOpacity: function strokeOpacity(opacity) {
    this.strokeOpacityStyle = opacity;
  },
  lineCap: function lineCap(value) {
    this.lineCapStyle = value;
  },
  lineJoin: function lineJoin(value) {
    this.lineJoinStyle = value;
  },
  lineWidth: function lineWidth(width) {
    this.lineWidthStyle = width;
  },
  lineDash: function lineDash(length, space) {
    this.lineDashStyle = (length + ' ' + (space || '')).trim();
  },
  fontSize: function fontSize(size) {
    this.fontSizeStyle = size;
  },
  fontFamily: function fontFamily(_fontFamily) {
    this.fontFamilyStyle = _fontFamily;
  },
};
exports.default = _default;
