'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault')
  .default;
exports.__esModule = true;
exports.default = void 0;
var _uuid = _interopRequireDefault(require('../utils/uuid'));
var _gradient2 = require('../gradient');
var _element = require('./element');
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
var _default = {
  beginPath: function beginPath() {
    this.currentPath = '';
    this.currentPosition = {};
    var path = (0, _element.createElement)('path');
    var parent = this.closestGroupOrSvg();
    parent.appendChild(path);
    this.currentElement = path;
  },
  addPathCommand: function addPathCommand(command) {
    if (!this.currentPath) this.beginPath();
    this.currentPath += ' ';
    this.currentPath += command;
  },
  closePath: function closePath() {
    if (this.currentPath) {
      this.addPathCommand('Z');
    }
  },
  moveTo: function moveTo(x, y) {
    if (!this.currentPath) this.beginPath();
    if (this.currentElement.nodeName !== 'path') this.beginPath();
    this.currentPosition = {
      x: x,
      y: y,
    };
    this.addPathCommand('M ' + x + ' ' + y);
  },
  lineTo: function lineTo(x, y) {
    if (!this.currentPath) this.beginPath();
    this.currentPosition = {
      x: x,
      y: y,
    };
    if (this.currentPath.indexOf('M') > -1) {
      this.addPathCommand('L ' + x + ' ' + y);
    } else {
      this.addPathCommand('M ' + x + ' ' + y);
    }
  },
  bezierCurveTo: function bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    if (!this.currentPath) this.beginPath();
    this.currentPosition = {
      x: x,
      y: y,
    };
    this.addPathCommand(
      'C ' + cp1x + ' ' + cp1y + ' ' + cp2x + ' ' + cp2y + ' ' + x + ' ' + y,
    );
  },
  quadraticCurveTo: function quadraticCurveTo(cpx, cpy, x, y) {
    if (!this.currentPath) this.beginPath();
    this.currentPosition = {
      x: x,
      y: y,
    };
    this.addPathCommand('Q ' + cpx + ' ' + cpy + ' ' + x + ' ' + y);
  },
  rect: function rect(x, y, width, height) {
    this.beginPath();
    this.moveTo(x, y);
    this.lineTo(x + width, y);
    this.lineTo(x + width, y + height);
    this.lineTo(x, y + height);
    this.lineTo(x, y);
    this.closePath();
  },
  circle: function circle(x, y, radius) {
    this.beginPath();
    var startX = x + radius * Math.cos(0);
    var startY = y + radius * Math.sin(0);
    this.lineTo(startX, startY);
    this.addPathCommand(
      'A ' + radius + ' ' + radius + ' 0 1 1 ' + startX + ' ' + (startY - 0.5),
    );
    this.closePath();
  },
  gradient: function gradient(_gradient) {
    if (_gradient.added) return;
    var element = (0, _element.createElement)(
      _gradient.type,
      _gradient.attributes,
    );
    _gradient.stops.forEach(function(stop) {
      var stopChild = (0, _element.createElement)('stop');
      stopChild.setAttribute('offset', stop.offset);
      stopChild.setAttribute('stop-color', stop.color);
      stopChild.setAttribute('stop-opacity', stop.opacity);
      element.appendChild(stopChild);
    });
    this.defs.appendChild(element);
    _gradient.added = true;
  },
  fill: function fill() {
    var fillColorStyle = this.fillColorStyle;
    if (this.currentElement.nodeName === 'path') {
      this.currentElement.setAttribute('paint-order', 'stroke fill markers');
    }
    this.applyCurrentPath();
    if (this.fillColorStyle instanceof _gradient2.Gradient) {
      this.gradient(fillColorStyle);
      fillColorStyle = "url('#" + fillColorStyle.id + "')";
    }
    this.currentElement.setAttribute('stroke', 'none');
    this.currentElement.setAttribute('fill', fillColorStyle);
    this.currentElement.setAttribute('opacity', this.opacityStyle);
    this.currentElement.setAttribute('fill-rule', this.fillRuleStyle);
    this.currentElement.setAttribute('fill-opacity', this.fillOpacityStyle);
    this.currentPath = '';
  },
  stroke: function stroke() {
    if (this.currentElement.nodeName === 'path') {
      this.currentElement.setAttribute('paint-order', 'fill stroke markers');
    }
    this.applyCurrentPath();
    this.currentElement.setAttribute('fill', 'none');
    this.currentElement.setAttribute('opacity', this.opacityStyle);
    this.currentElement.setAttribute('stroke', this.strokeColorStyle);
    this.currentElement.setAttribute('stroke-width', this.lineWidthStyle);
    this.currentElement.setAttribute('stroke-linecap', this.lineCapStyle);
    this.currentElement.setAttribute('stroke-linejoin', this.lineJoinStyle);
    this.currentElement.setAttribute('stroke-dasharray', this.lineDashStyle);
    this.currentElement.setAttribute('stroke-opacity', this.strokeOpacityStyle);
    this.currentPath = '';
  },
  fillAndStroke: function fillAndStroke() {
    if (this.currentElement.nodeName === 'path') {
      this.currentElement.setAttribute('paint-order', 'fill stroke markers');
    }
    this.applyCurrentPath();
    this.currentElement.setAttribute('fill', this.fillColorStyle);
    this.currentElement.setAttribute('fill-rule', this.fillRuleStyle);
    this.currentElement.setAttribute('fill-opacity', this.fillOpacityStyle);
    this.currentElement.setAttribute('opacity', this.opacityStyle);
    this.currentElement.setAttribute('stroke', this.strokeColorStyle);
    this.currentElement.setAttribute('stroke-width', this.lineWidthStyle);
    this.currentElement.setAttribute('stroke-linecap', this.lineCapStyle);
    this.currentElement.setAttribute('stroke-linejoin', this.lineJoinStyle);
    this.currentElement.setAttribute('stroke-dasharray', this.lineDashStyle);
    this.currentElement.setAttribute('stroke-opacity', this.strokeOpacityStyle);
    this.currentPath = '';
  },
  applyCurrentPath: function applyCurrentPath() {
    if (this.currentElement.nodeName === 'path') {
      this.currentElement.setAttribute('d', this.currentPath);
    }
  },
  clip: function clip() {
    var group = this.closestGroupOrSvg();
    var clipPath = (0, _element.createElement)('clipPath');
    var id = (0, _uuid.default)();
    var newGroup = (0, _element.createElement)('g');
    this.applyCurrentPath();
    group.removeChild(this.currentElement);
    clipPath.setAttribute('id', id);
    clipPath.appendChild(this.currentElement);
    this.defs.appendChild(clipPath);
    group.setAttribute('clip-path', 'url(#' + id + ')');
    group.appendChild(newGroup);
    this.currentElement = newGroup;
  },
};
exports.default = _default;
