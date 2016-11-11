'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LocaleProvider = function (_Base) {
  _inherits(LocaleProvider, _Base);

  function LocaleProvider() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, LocaleProvider);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = LocaleProvider.__proto__ || Object.getPrototypeOf(LocaleProvider)).call.apply(_ref, [this].concat(args))), _this), _this.code = 'cs', _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(LocaleProvider, [{
    key: 'setYear',
    value: function setYear(year, controlNumber) {
      if (typeof year === 'undefined' || year === null) {
        throw new Error('Personal ID: param \'year\' has to be defined.'); // @TODO: add link to docs
      }

      this.year = parseInt(year, 10);

      if (typeof controlNumber === 'undefined') {
        this.year += this.year < LocaleProvider.RULE_CONTROL_NUMBER_FROM - 1900 ? 1900 : 1800;
      } else {
        this.year += this.year < LocaleProvider.RULE_CONTROL_NUMBER_FROM - 1900 ? 2000 : 1900;
      }
    }
  }, {
    key: 'setMonthAndGender',
    value: function setMonthAndGender(month) {
      if (typeof month === 'undefined' || month === null) {
        throw new Error('Personal ID: param \'month\' has to be defined.'); // @TODO: add link to docs
      }

      this.gender = _base2.default.MALE;
      this.month = parseInt(month, 10);

      if (month > 50) {
        this.gender = _base2.default.FEMALE;
        this.month -= 50;

        if (month > 70 && this.year >= LocaleProvider.RULE_MONTH_FROM) {
          this.month -= 20;
        }
      } else if (month > 20 && this.year >= LocaleProvider.RULE_MONTH_FROM) {
        this.month -= 20;
      }
    }
  }, {
    key: 'validate',
    value: function validate(pin, min, max) {
      this.setDefaults();

      if (typeof pin === 'undefined' || pin === null) {
        throw new Error('Personal ID: param \'pin\' has to be defined.'); // @TODO: add link to docs
      }

      var match = pin.match(LocaleProvider.VALIDATION_REGEXP);
      this.valid = match !== null;

      if (!this.valid) {
        return false;
      }

      var _match = _slicedToArray(match, 6),
          fullMatch = _match[0],
          year = _match[1],
          month = _match[2],
          day = _match[3],
          ext = _match[4],
          controlNumber = _match[5];

      this.controlNumber = controlNumber !== '' ? parseInt(controlNumber, 10) : undefined;
      this.pin = pin;
      this.match = fullMatch;
      this.setYear(year, this.controlNumber);
      this.setMonthAndGender(month);
      this.day = parseInt(day, 10);
      this.ext = parseInt(ext, 10);

      if (typeof this.controlNumber !== 'undefined') {
        var modulo = [year, month, day, ext].join('') % 11;

        if (modulo === 10) {
          modulo = 0;
        }

        if (modulo !== this.controlNumber) {
          this.setDefaults();
          return false;
        }
      }

      this.birthDate = new Date(this.year + '-' + (this.month > 9 ? this.month : '0' + this.month) + '-' + this.day);

      if (isNaN(this.birthDate.getTime()) || min !== null && this.birthDate < min || max !== null && this.birthDate > max) {
        this.setDefaults();
        return false;
      }

      return this.valid;
    }
  }]);

  return LocaleProvider;
}(_base2.default);

LocaleProvider.VALIDATION_REGEXP = /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/;
LocaleProvider.RULE_CONTROL_NUMBER_FROM = 1954;
LocaleProvider.RULE_MONTH_FROM = 2004;
LocaleProvider.MIN = new Date('1855-01-01');
LocaleProvider.MAX = new Date('2053-31-12 23:59:59');
exports.default = LocaleProvider;