/* global describe */
/* global it */
/* global beforeEach */
/* global afterEach */
/* eslint-disable no-unused-expressions */

let Pin;
let LocaleProvider;
let expect;

if (typeof window === 'undefined') {
  Pin = require('./../../src/personal-id').default; // eslint-disable-line global-require
  LocaleProvider = require('./../../src/locale/cs').default; // eslint-disable-line global-require
  expect = require('chai').expect; // eslint-disable-line global-require, import/no-extraneous-dependencies
}

describe('Personal ID - cs locale', () => {
  let locale;

  beforeEach(() => {
    locale = new LocaleProvider();
  });

  describe('setPin()', () => {
    it('should be a null', () => {
      locale.setPin(null);
      expect(locale.pin)
        .to.equal(null);

      locale.setPin(['890416/1147']);
      expect(locale.pin)
        .to.equal(null);

      locale.setPin('12');
      expect(locale.pin)
        .to.equal(null);
    });

    it('should set a pin', () => {
      locale.setPin('8904164005');
      expect(locale.pin)
        .to.equal('890416/4005');

      locale.setPin('890416/4005');
      expect(locale.pin)
        .to.equal('890416/4005');

      locale.setPin('890416400');
      expect(locale.pin)
        .to.equal('890416/400');
    });
  });

  describe('setYear()', () => {
    it('should throw an error because of the missing year', () => {
      expect(() => {
        locale.setYear();
      })
        .to.throw(Error);
    });

    it('should throw an error because of the null year', () => {
      expect(() => {
        locale.setYear(null);
      })
        .to.throw(Error);
    });

    it('should set an year before 1954', () => {
      locale.setYear('53');
      expect(locale.year)
        .to.equal(1953);

      locale.setYear('54');
      expect(locale.year)
        .to.equal(1854);
    });

    it('should set an year after 1954 included', () => {
      locale.setYear('54', 1);
      expect(locale.year)
        .to.equal(1954);

      locale.setYear('00', 1);
      expect(locale.year)
        .to.equal(2000);
    });
  });

  describe('setMonthAndGender()', () => {
    it('should throw an error because of the missing month', () => {
      expect(() => {
        locale.setMonthAndGender();
      })
        .to.throw(Error);
    });

    it('should throw an error because of the null month', () => {
      expect(() => {
        locale.setMonthAndGender(null);
      })
        .to.throw(Error);
    });

    it('should set a month', () => {
      locale.year = 2004;
      locale.setMonthAndGender('03');
      expect(locale.month)
        .to.equal(3);

      locale.setMonthAndGender('23');
      expect(locale.month)
        .to.equal(3);

      locale.setMonthAndGender('53');
      expect(locale.month)
        .to.equal(3);

      locale.setMonthAndGender('73');
      expect(locale.month)
        .to.equal(3);
    });

    it('should set a male gender', () => {
      locale.setMonthAndGender('03');
      expect(locale.gender)
        .to.equal(Pin.MALE);

      locale.setMonthAndGender('32');
      expect(locale.gender)
        .to.equal(Pin.MALE);
    });

    it('should set a female gender', () => {
      locale.setMonthAndGender('53');
      expect(locale.gender)
        .to.equal(Pin.FEMALE);

      locale.setMonthAndGender('82');
      expect(locale.gender)
        .to.equal(Pin.FEMALE);
    });
  });

  describe('validate()', () => {
    it('should throw an error because of the missing pin', () => {
      expect(() => {
        locale.validate();
      })
        .to.throw(Error);
    });

    it('should throw an error because of the null pin', () => {
      expect(() => {
        locale.validate(null);
      })
        .to.throw(Error);
    });

    it('shouldn\'t set a pin because of the unmatched pin', () => {
      locale.validate('03');
      expect(locale.pin)
        .to.equal(null);

      locale.validate('invalid');
      expect(locale.pin)
        .to.equal(null);

      locale.validate('90416/5501');
      expect(locale.pin)
        .to.equal(null);
    });

    it('should be invalid', () => {
      locale.validate('03');
      expect(locale.valid)
        .to.be.false;

      locale.validate('invalid');
      expect(locale.valid)
        .to.be.false;

      locale.validate('90416/5501');
      expect(locale.valid)
        .to.be.false;

      locale.validate('690416/2046');
      expect(locale.valid)
        .to.be.false;

      locale.validate('890416/0046');
      expect(locale.valid)
        .to.be.false;

      locale.validate('892416/0068');
      expect(locale.valid)
        .to.be.false;

      locale.validate('8990416/0049');
      expect(locale.valid)
        .to.be.false;

      locale.validate('559416/0044');
      expect(locale.valid)
        .to.be.false;
    });

    it('should be invalid because birth date is under the min', () => {
      locale.validate('991231/2007', new Date('2000-01-01'));
      expect(locale.valid)
        .to.be.false;
    });

    it('should be invalid because birth date is over the max', () => {
      locale.validate('161028/0002', null, new Date('2016-10-27'));
      expect(locale.valid)
        .to.be.false;
    });

    it('should be valid', () => {
      locale.validate('1610250191');
      expect(locale.valid)
        .to.be.true;

      locale.validate('780123/3540');
      expect(locale.valid)
        .to.be.true;

      locale.validate('161025/0191');
      expect(locale.valid)
        .to.be.true;

      locale.validate('780123/3540');
      expect(locale.valid)
        .to.be.true;

      locale.validate('0405019330');
      expect(locale.valid)
        .to.be.true;

      locale.validate('0425019310');
      expect(locale.valid)
        .to.be.true;

      locale.validate('0455019312');
      expect(locale.valid)
        .to.be.true;

      locale.validate('0475019314');
      expect(locale.valid)
        .to.be.true;

      locale.validate('000416/005');
      expect(locale.valid)
        .to.be.true;

      locale.validate('000101/0020', new Date('00-01-01'));
      expect(locale.valid)
        .to.be.true;

      locale.validate('161027/0002', null, new Date('2016-10-27'));
      expect(locale.valid)
        .to.be.true;
    });
  });
});
