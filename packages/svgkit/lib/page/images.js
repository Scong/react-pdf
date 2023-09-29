'use strict';

exports.__esModule = true;
exports.default = void 0;
var _element = require('./element');
var _default = {
  image: function image(href, x, y, width, height) {
    var image = (0, _element.createElement)('image');
    var parent = this.closestGroupOrSvg();
    image.setAttribute('x', x);
    image.setAttribute('y', y);
    image.setAttribute('width', width);
    image.setAttribute('height', height);
    image.setAttribute('xlink:href', href);
    image.setAttribute('preserveAspectRatio', 'none');
    parent.appendChild(image);
  },
};
exports.default = _default;
