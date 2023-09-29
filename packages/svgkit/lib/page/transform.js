'use strict';

exports.__esModule = true;
exports.default = void 0;
var _element = require('./element');
/* eslint-disable no-param-reassign */
var _default = {
  addTransform: function addTransform(t) {
    var parent = this.closestGroupOrSvg();
    if (parent.childNodes.length > 0) {
      var group = (0, _element.createElement)('g');
      parent.appendChild(group);
      this.currentElement = group;
    }
    var transform = this.currentElement.getAttribute('transform');
    if (transform) {
      transform += ' ';
    } else {
      transform = '';
    }
    transform += t;
    this.currentElement.setAttribute('transform', transform);
  },
  translate: function translate(x, y) {
    this.addTransform('translate(' + x + ',' + y + ')');
  },
  rotate: function rotate(angle, origin) {
    if (origin === void 0) {
      origin = [0, 0];
    }
    this.addTransform(
      'rotate(' + angle + ',' + origin[0] + ',' + origin[1] + ')',
    );
  },
  scale: function scale(x, y) {
    if (y === undefined) y = x;
    this.addTransform('scale(' + x + ',' + y + ')');
  },
};
exports.default = _default;
