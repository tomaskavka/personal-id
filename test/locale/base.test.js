/* global describe */
/* global it */
/* global beforeEach */
/* global afterEach */
/* eslint-disable no-unused-expressions */

let Pin;
let LocaleProvider;
let expect;

if (typeof window === 'undefined') {
  Pin = require('./../../src/personal-id'); // eslint-disable-line global-require
  LocaleProvider = require('./../../src/locale/base').default; // eslint-disable-line global-require
  expect = require('chai').expect; // eslint-disable-line global-require, import/no-extraneous-dependencies
}

describe('Personal ID - base locale', () => {
  describe('contructor()', () => {
    it('should set all properties to default', () => {
      const locale = new LocaleProvider();

      expect(locale.pin)
        .to.equal(null);
      expect(locale.valid)
        .to.be.false;
      expect(locale.year)
        .to.equal(null);
      expect(locale.month)
        .to.equal(null);
      expect(locale.day)
        .to.equal(null);
      expect(locale.gender)
        .to.equal(null);
      expect(locale.ext)
        .to.equal(null);
      expect(locale.controlNumber)
        .to.equal(null);
      expect(locale.birthDate)
        .to.equal(null);
      expect(locale.match)
        .to.equal(null);
    });
  });

  describe('getData()', () => {
    let locale;

    beforeEach(() => {
      locale = new LocaleProvider();
    });

    it('should get all properties with default value', () => {
      const data = locale.getData();

      expect(data)
        .to.eql({
          code: 'base',
          pin: null,
          valid: false,
          gender: null,
          birthDate: null,
        });
    });

    it('should get all properties with changed value', () => {
      locale.pin = 'PersonalID';
      locale.valid = true;
      locale.gender = Pin.MALE;
      locale.birthDate = new Date('2016-01-01');
      const data = locale.getData();

      expect(data)
        .to.eql({
          code: 'base',
          pin: 'PersonalID',
          valid: true,
          gender: Pin.MALE,
          birthDate: new Date('2016-01-01'),
        });
    });
  });
});
