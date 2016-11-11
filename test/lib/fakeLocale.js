import Pin from './../../src/personal-id';
import Base from './../../src/locale/base';

export default class LocaleProvider extends Base {
  static VALIDATION_REGEXP = /^PersonalID(\d{4})$/;

  code = 'fake';

  validate(pin) {
    const match = pin.match(LocaleProvider.VALIDATION_REGEXP);
    this.valid = (match !== null);

    if (!this.valid) {
      this.setDefaults();
      return false;
    }

    this.pin = pin;
    this.year = match[1];
    this.gender = (this.year % 2 === 1 ? Pin.MALE : Pin.FEMALE);
    this.birthDate = new Date(`${this.year}-01-01`);

    return this.valid;
  }
}

// export default Pin.addLocale('cs', new LocaleProvider());
