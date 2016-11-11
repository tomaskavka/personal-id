'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseLocaleProvider = function () {
  function BaseLocaleProvider() {
    _classCallCheck(this, BaseLocaleProvider);

    this.code = 'base';

    this.setDefaults();
  }

  _createClass(BaseLocaleProvider, [{
    key: 'setDefaults',
    value: function setDefaults() {
      this.pin = null;
      this.valid = false;
      this.year = null;
      this.month = null;
      this.day = null;
      this.gender = null;
      this.ext = null;
      this.controlNumber = null;
      this.birthDate = null;
      this.match = null;
    }
  }, {
    key: 'getData',
    value: function getData() {
      return {
        code: this.code,
        pin: this.pin,
        valid: this.valid,
        gender: this.gender,
        birthDate: this.birthDate
      };
    }
  }]);

  return BaseLocaleProvider;
}();

BaseLocaleProvider.MALE = 'male';
BaseLocaleProvider.FEMALE = 'female';
exports.default = BaseLocaleProvider;