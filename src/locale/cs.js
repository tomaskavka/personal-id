import Base from './base';

export default class LocaleProvider extends Base {
  static VALIDATION_REGEXP = /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/;
  static RULE_CONTROL_NUMBER_FROM = 1954;
  static RULE_MONTH_FROM = 2004;
  static MIN = new Date('1855-01-01');
  static MAX = new Date('2053-31-12 23:59:59');

  code = 'cs';

  setPin(pin) {
    if (pin === null || typeof pin !== 'string') {
      this.pin = null;
    } else {
      const match = pin.match(/([\d]{6})\/?([\d]{3,4})/);

      this.pin = (match === null ? null : `${match[1]}/${match[2]}`);
    }
  }

  setYear(year, controlNumber) {
    if (typeof year === 'undefined' || year === null) {
      throw new Error('Personal ID: param \'year\' has to be defined.'); // @TODO: add link to docs
    }

    this.year = parseInt(year, 10);

    if (typeof controlNumber === 'undefined') {
      this.year += (this.year < (LocaleProvider.RULE_CONTROL_NUMBER_FROM - 1900) ? 1900 : 1800);
    } else {
      this.year += (this.year < (LocaleProvider.RULE_CONTROL_NUMBER_FROM - 1900) ? 2000 : 1900);
    }
  }

  setMonthAndGender(month) {
    if (typeof month === 'undefined' || month === null) {
      throw new Error('Personal ID: param \'month\' has to be defined.'); // @TODO: add link to docs
    }

    this.gender = Base.MALE;
    this.month = parseInt(month, 10);

    if (month > 50) {
      this.gender = Base.FEMALE;
      this.month -= 50;

      if (month > 70 && this.year >= LocaleProvider.RULE_MONTH_FROM) {
        this.month -= 20;
      }
    } else if (month > 20 && this.year >= LocaleProvider.RULE_MONTH_FROM) {
      this.month -= 20;
    }
  }

  validate(pin, min, max) {
    this.setDefaults();

    if (typeof pin === 'undefined' || pin === null) {
      throw new Error('Personal ID: param \'pin\' has to be defined.'); // @TODO: add link to docs
    }

    const match = pin.match(LocaleProvider.VALIDATION_REGEXP);
    this.valid = (match !== null);

    if (!this.valid) {
      return false;
    }

    const [fullMatch, year, month, day, ext, controlNumber] = match;
    this.controlNumber = (
      controlNumber !== ''
      ? parseInt(controlNumber, 10)
      : undefined
    );
    this.match = fullMatch;
    this.setPin(pin);
    this.setYear(year, this.controlNumber);
    this.setMonthAndGender(month);
    this.day = parseInt(day, 10);
    this.ext = parseInt(ext, 10);

    if (typeof this.controlNumber !== 'undefined') {
      let modulo = [year, month, day, ext].join('') % 11;

      if (modulo === 10) {
        modulo = 0;
      }

      if (modulo !== this.controlNumber) {
        this.setDefaults();
        return false;
      }
    }

    this.birthDate = new Date(`${this.year}-${(this.month > 9 ? this.month : `0${this.month}`)}-${this.day}`);

    if (
      isNaN(this.birthDate.getTime())
      || (min !== null && this.birthDate < min)
      || (max !== null && this.birthDate > max)
    ) {
      this.setDefaults();
      return false;
    }

    return this.valid;
  }
}
