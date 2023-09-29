'use strict';

exports.__esModule = true;
exports.default = void 0;
/* eslint-disable import/prefer-default-export */

var uuid = function uuid() {
  var randomstring;
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  randomstring = '';
  for (var i = 0; i < 12; i += 1) {
    randomstring += chars[Math.floor(Math.random() * chars.length)];
  }
  return randomstring;
};
var _default = uuid;
exports.default = _default;
