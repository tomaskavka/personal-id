import locales from './locale';

export default class PersonalId {

  static defaults = {
    localeCodes: [
      'cs',
    ],
  };

  pin = null;
  locales = {};
  state = {
    set: false,
    valid: false,
  };
  validationResults = {};

  constructor(pin, options = {}) {
    this.setPin(pin);

    options = Object.assign(PersonalId.defaults, options);

    // Define all locales
    options.localeCodes.forEach(code => {
      this.defineLocale(code, locales[code]);
    });

    // Validate
    this.validate();
  }

  defineLocale(code, options) {
    this.locales[code] = options;
  }

  validate() {
    if (!this.state.set) {
      return false;
    }

    this.state.valid = false;

    Object.keys(this.locales).forEach(code => {
      const match = this.pin.toString().match(this.locales[code].regExp);
      if (match !== null) {
        this.state.valid = true;
      }

      this.validationResults[code] = match;
    });
  }

  setLocale(code, options) {

  }

  getLocales() {
    return Object.keys(this.locales);
  }

  setPin(pin) {
    if (typeof pin === 'undefined' || pin === null) {
      return false;
    }

    this.pin = pin;
    this.state.set = true;
  }

  isValid(code) {
    if (this.state.valid === null) {
      this.validate();
    }

    return (
      typeof code !== 'undefined'
      ? this.validationResults[code] !== null
      : this.state.valid
    );
  }
}
