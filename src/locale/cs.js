// @TODO:
// import pin from '../personal-id';

export var config = {
  regExp: /^\s*(\d\d)(\d\d)(\d\d)[ /]*(\d\d\d)(\d?)\s*$/,
  getYear: (year, controlNum) => {
    if (controlNum === '') {
      return year + (year < 54 ? 1900 : 1800);
    }

    return year + (year < 54 ? 2000 : 1900);
  },
  process: (pin) => {
    const { fullMatch, year, month, day, ext, controlNum } = pin.toString().match(this.regExp);

    return {
      year: this.getYear(year, controlNum),
    }
  }
};

//export default pin.defineLocale('cs', config);
