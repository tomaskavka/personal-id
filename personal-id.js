'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _locale = require('./locale');

var _locale2 = _interopRequireDefault(_locale);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PersonalId = function () {
  function PersonalId(pin) {
    var _this = this;

    var userOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, PersonalId);

    this.pin = null;
    this.validation = {
      valid: false,
      locales: {},
      data: null
    };

    console.log(_locale2.default);
    if (typeof pin === 'undefined' || pin === null) {
      throw Error('Personal ID: param \'pin\' has to be defined.'); // @TODO: add link to docs, how to add locale
    }

    this.opts = Object.assign({
      locales: [PersonalId.DEFAULT_LOCALE],
      min: PersonalId.DEFAULT_MIN,
      max: PersonalId.DEFAULT_MAX
    }, userOpts);
    this.pin = pin.toString();

    if (typeof pin !== 'string') {
      // eslint-disable-next-line no-console
      console.warn('Personal ID: param \'pin\' should be a string, other types have side effects. Pin value after convert to a string: \'' + this.pin + '\'.'); // @TODO: add link to docs
    }

    // Add locales
    this.opts.locales.forEach(function (code) {
      _this.addLocale(code, _locale2.default[code]);
    });
  }

  _createClass(PersonalId, [{
    key: 'addLocale',
    value: function addLocale(code, provider) {
      if (typeof code !== 'string') {
        throw Error('Personal ID: param \'code\' has to be defined.');
      }

      if (typeof provider !== 'function') {
        throw Error('Personal ID: param \'provider\' has to be a function.');
      }

      this.validation.locales[code] = new provider(); // eslint-disable-line new-cap
    }
  }, {
    key: 'validate',
    value: function validate() {
      var codes = Object.keys(this.validation.locales);
      this.validation.valid = false;

      for (var i = 0; i < codes.length; i += 1) {
        var locale = this.validation.locales[codes[i]];
        locale.validate(this.pin, this.opts.min, this.opts.max);

        if (locale.valid || this.validation.data === null || this.validation.data.pin !== this.pin) {
          this.validation.valid = locale.valid;
          this.validation.data = locale.getData();
        }
      }
    }
  }, {
    key: 'isValid',
    value: function isValid(code) {
      this.validate();

      if (typeof code === 'undefined') {
        return this.validation.valid;
      }

      if (typeof this.validation.locales[code] === 'undefined') {
        // @TODO: add link to docs, how to add locale
        console.warn('Personal ID: locale isn\'t added.'); // eslint-disable-line no-console
        return false;
      }

      return this.validation.locales[code].valid;
    }
  }, {
    key: 'prepare',
    value: function prepare() {
      if (this.validation.data === null || this.validation.data.pin !== this.pin) {
        this.validate();
      }
    }
  }, {
    key: 'getBirthDate',
    value: function getBirthDate() {
      this.prepare();

      return this.validation.data.birthDate;
    }
  }, {
    key: 'getCode',
    value: function getCode() {
      this.prepare();

      return this.validation.data.code;
    }
  }, {
    key: 'isMale',
    value: function isMale() {
      this.prepare();

      if (this.validation.data.gender === null) {
        return null;
      }

      return this.validation.data.gender === PersonalId.MALE;
    }
  }, {
    key: 'isFemale',
    value: function isFemale() {
      this.prepare();

      if (this.validation.data.gender === null) {
        return null;
      }

      return this.validation.data.gender === PersonalId.FEMALE;
    }
  }]);

  return PersonalId;
}();

PersonalId.DEFAULT_MIN = new Date('1900-01-01');
PersonalId.DEFAULT_MAX = new Date();
PersonalId.DEFAULT_LOCALE = 'cs';
PersonalId.MALE = 'male';
PersonalId.FEMALE = 'female';
exports.default = PersonalId;