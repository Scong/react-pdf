'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
  .default;
exports.__esModule = true;
exports.default = void 0;
var _page = _interopRequireDefault(require('../page'));
var _serialize = _interopRequireDefault(require('./serialize'));
var _gradient = require('../gradient');
/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
// import { PDFFont } from '@react-pdf/pdfkit';
var SVGDocument = /*#__PURE__*/ (function() {
  function SVGDocument(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
      font = _ref.font;
    this.info = {};
    this.pages = [];
    this.currentPage = null;
    this.defaultFont = font;
  }
  var _proto = SVGDocument.prototype;
  _proto.addPage = function addPage(options) {
    if (options === void 0) {
      options = {};
    }
    var page = new _page.default(options);
    this.pages.push(page);
    this.currentPage = page;
    if (this.defaultFont) {
      this.font(this.defaultFont);
    }
    return this;
  };
  _proto.save = function save() {
    this.currentPage.save();
    return this;
  };
  _proto.restore = function restore() {
    this.currentPage.restore();
    return this;
  };
  _proto.scale = function scale(x, y) {
    this.currentPage.scale(x, y);
    return this;
  };
  _proto.translate = function translate(x, y) {
    this.currentPage.translate(x, y);
    return this;
  };
  _proto.rotate = function rotate(angle, options) {
    if (options === void 0) {
      options = {};
    }
    var _options = options,
      origin = _options.origin;
    this.currentPage.rotate(angle, origin);
    return this;
  };
  _proto.fillColor = function fillColor(color) {
    this.currentPage.fillColor(color);
    return this;
  };
  _proto.fillOpacity = function fillOpacity(opacity) {
    this.currentPage.fillOpacity(opacity);
    return this;
  };
  _proto.strokeColor = function strokeColor(color) {
    this.currentPage.strokeColor(color);
    return this;
  };
  _proto.strokeOpacity = function strokeOpacity(opacity) {
    this.currentPage.strokeOpacity(opacity);
    return this;
  };
  _proto.opacity = function opacity(_opacity) {
    this.currentPage.opacity(_opacity);
    return this;
  };
  _proto.lineWidth = function lineWidth(width) {
    this.currentPage.lineWidth(width);
    return this;
  };
  _proto.lineCap = function lineCap(value) {
    this.currentPage.lineCap(value);
    return this;
  };
  _proto.lineJoin = function lineJoin(value) {
    this.currentPage.lineJoin(value);
    return this;
  };
  _proto.moveTo = function moveTo(x, y) {
    this.currentPage.moveTo(x, y);
    return this;
  };
  _proto.lineTo = function lineTo(x, y) {
    this.currentPage.lineTo(x, y);
    return this;
  };
  _proto.bezierCurveTo = function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this.currentPage.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    return this;
  };
  _proto.quadraticCurveTo = function quadraticCurveTo(cpx, cpy, x, y) {
    this.currentPage.quadraticCurveTo(cpx, cpy, x, y);
    return this;
  };
  _proto.rect = function rect(x, y, width, height) {
    this.currentPage.rect(x, y, width, height);
    return this;
  };
  _proto.circle = function circle(x, y, radius) {
    this.currentPage.circle(x, y, radius);
    return this;
  };
  _proto.polygon = function polygon() {
    var _this$currentPage;
    for (
      var _len = arguments.length, points = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      points[_key] = arguments[_key];
    }
    (_this$currentPage = this.currentPage).moveTo.apply(
      _this$currentPage,
      Array.from(points.shift() || []),
    );
    for (
      var _i = 0, _Array$from = Array.from(points);
      _i < _Array$from.length;
      _i++
    ) {
      var _this$currentPage2;
      var point = _Array$from[_i];
      (_this$currentPage2 = this.currentPage).lineTo.apply(
        _this$currentPage2,
        Array.from(point || []),
      );
    }
    return this.currentPage.closePath();
  };
  _proto.path = function path(_path) {
    this.currentPage.addPathCommand(_path);
    return this;
  };
  _proto.fill = function fill(color, rule) {
    if (/(even-?odd)|(non-?zero)/.test(color)) {
      rule = color;
      color = null;
    }
    if (color) this.fillColor(color);
    if (rule) this.currentPage.fillRule(rule);
    this.currentPage.fill();
    return this;
  };
  _proto.stroke = function stroke(color) {
    if (color) this.strokeColor(color);
    this.currentPage.stroke();
    return this;
  };
  _proto.fillAndStroke = function fillAndStroke(
    fillColor,
    strokeColor,
    fillRule,
  ) {
    if (fillColor) this.fillColor(fillColor);
    if (strokeColor) this.strokeColor(strokeColor);
    if (fillRule) this.currentPage.fillRule(fillRule);
    this.currentPage.fillAndStroke();
  };
  _proto.clip = function clip() {
    this.currentPage.clip();
    return this;
  };
  _proto.closePath = function closePath() {
    this.currentPage.closePath();
    return this;
  };
  _proto.dash = function dash(length, options) {
    var space;
    if (options == null) options = {};
    if (length == null) return this;
    if (Array.isArray(length)) {
      length = Array.from(length).join(' ');
    } else {
      space = options.space != null ? options.space : length;
    }
    this.currentPage.lineDash(length, space);
    return this;
  };
  _proto.undash = function undash() {
    this.currentPage.lineDash(0, 0);
    return this;
  };
  _proto.linearGradient = function linearGradient(x1, y1, x2, y2) {
    return new _gradient.LinearGradient(x1, y1, x2, y2);
  };
  _proto.radialGradient = function radialGradient(x1, y1, r1, x2, y2, r2) {
    return new _gradient.RadialGradient(x1, y1, r1, x2, y2, r2);
  };
  _proto.image = function image(data, x, y, opts) {
    if (opts === void 0) {
      opts = {};
    }
    var _opts = opts,
      width = _opts.width,
      height = _opts.height;
    if (!width || !height)
      throw new Error(
        'svgkit only supports image rendering with explicit width and height',
      );
    var href = 'data:image;base64,' + Buffer.from(data).toString('base64');
    return this.currentPage.image(href, x, y, width, height);
  };
  _proto.font = function font(src, family, size) {
    if (size) {
      this.fontSize(size);
    }
    if (typeof src === 'string') {
      this.currentPage.fontFamily(src);
      return this;
    }

    // const encodeGlyphs = glyphs => {
    //   const res = [];

    //   for (const glyph of Array.from(glyphs)) {
    //     for (const codePoint of glyph.codePoints) {
    //       res.push(`00${codePoint.toString(16)}`.slice(-2));
    //     }
    //   }

    //   return res;
    // };

    // this._font = { ...PDFFont.open(null, font), encodeGlyphs };

    return this;
  };
  _proto.fontSize = function fontSize(size) {
    this.currentPage.fontSize(size);
    return this;
  };
  _proto.text = function text(_text, x, y) {
    this.currentPage.text(_text, x, y);
    return this;
  };

  // _glyphs(glyphs, positions, x, y, options) {
  //   this.currentPage.text(glyphs, positions, x, y, options);
  //   return this;
  // }
  _proto.note = function note() {
    console.warn('note is not yet supported on svgkit');
    return this;
  };
  _proto.end = function end() {
    this.serialized = this.pages
      .map(function(page) {
        return (0, _serialize.default)(page.root);
      })
      .join('');
  };
  return SVGDocument;
})();
var _default = SVGDocument;
exports.default = _default;
