export default class BaseLocaleProvider {

  static MALE = 'male';
  static FEMALE = 'female';

  code = 'base';

  constructor() {
    this.setDefaults();
  }

  setDefaults() {
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

  getData() {
    return {
      code: this.code,
      pin: this.pin,
      valid: this.valid,
      gender: this.gender,
      birthDate: this.birthDate,
    };
  }
}
