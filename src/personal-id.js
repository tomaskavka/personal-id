import locales from './locale';

export default class PersonalId {
  static DEFAULT_MIN = new Date('1900-01-01');
  static DEFAULT_MAX = new Date();
  static DEFAULT_LOCALE = 'cs';
  static MALE = 'male';
  static FEMALE = 'female'

  pin = null;
  validation = {
    valid: false,
    locales: {},
    data: null,
  };

  constructor(pin, userOpts = {}) {
    if (typeof pin === 'undefined' || pin === null) {
      throw Error('Personal ID: param \'pin\' has to be defined.'); // @TODO: add link to docs, how to add locale
    }

    this.opts = Object.assign({
      locales: [PersonalId.DEFAULT_LOCALE],
      min: PersonalId.DEFAULT_MIN,
      max: PersonalId.DEFAULT_MAX,
    }, userOpts);
    this.pin = pin.toString();

    if (typeof pin !== 'string') {
      // eslint-disable-next-line no-console
      console.warn(
        `Personal ID: param 'pin' should be a string, other types have side effects. Pin value after convert to a string: '${this.pin}'.`
      ); // @TODO: add link to docs
    }

    // Add locales
    this.opts.locales.forEach((code) => {
      this.addLocale(code, locales[code]);
    });
  }

  addLocale(code, provider) {
    if (typeof code !== 'string') {
      throw Error('Personal ID: param \'code\' has to be defined.');
    }

    if (typeof provider !== 'function') {
      throw Error('Personal ID: param \'provider\' has to be a function.');
    }

    this.validation.locales[code] = new provider(); // eslint-disable-line new-cap
  }

  validate() {
    const codes = Object.keys(this.validation.locales);
    this.validation.valid = false;

    for (let i = 0; i < codes.length; i += 1) {
      const locale = this.validation.locales[codes[i]];
      locale.validate(this.pin, this.opts.min, this.opts.max);

      if (locale.valid || this.validation.data === null || this.validation.data.pin !== this.pin) {
        this.validation.valid = locale.valid;
        this.validation.data = locale.getData();
      }
    }
  }

  isValid(code) {
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

  prepare() {
    if (this.validation.data === null || this.validation.data.pin !== this.pin) {
      this.validate();
    }
  }

  getBirthDate() {
    this.prepare();

    return this.validation.data.birthDate;
  }

  getCode() {
    this.prepare();

    return this.validation.data.code;
  }

  isMale() {
    this.prepare();

    if (this.validation.data.gender === null) {
      return null;
    }

    return (this.validation.data.gender === PersonalId.MALE);
  }

  isFemale() {
    this.prepare();

    if (this.validation.data.gender === null) {
      return null;
    }

    return (this.validation.data.gender === PersonalId.FEMALE);
  }
}
