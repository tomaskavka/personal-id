/* global describe */
/* global it */
/* global beforeEach */
/* global afterEach */
/* eslint-disable no-unused-expressions */

let Pin;
let LocaleProvider;
let expect;
let sinon;

if (typeof window === 'undefined') {
  Pin = require('./../src/personal-id').default; // eslint-disable-line global-require
  LocaleProvider = require('./../src/locale/cs').LocaleProvider; // eslint-disable-line global-require
  expect = require('chai').expect; // eslint-disable-line global-require, import/no-extraneous-dependencies
  sinon = require('sinon'); // eslint-disable-line global-require, import/no-extraneous-dependencies
} else {
  Pin = window.Validator;
  expect = window.chai.expect;
}

describe('Personal ID', () => {
  describe('constructor()', () => {
    let p;

    beforeEach(() => {
      sinon.spy(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore(); // eslint-disable-line no-console
    });

    it('should throw an error because of undefined', () => {
      const fn = () => {
        new Pin(); // eslint-disable-line no-new
      };

      expect(fn).to.throw(Error);
    });

    it('should throw an error because of null', () => {
      const fn = () => {
        new Pin(null); // eslint-disable-line no-new
      };

      expect(fn).to.throw(Error);
    });

    it('should have a pin property equal to 8904165571 but warning should fire because of integer', () => {
      p = new Pin(8904165571); // eslint-disable-line no-new

      expect(console.warn.called) // eslint-disable-line no-console
        .to.be.true;
      expect(p.pin)
        .to.equal('8904165571');
    });

    it('should have a pin property equal to 19', () => {
      p = new Pin('19');

      expect(p.pin)
        .to.equal('19');
    });
  });

  describe('addLocale()', () => {
    let p;

    beforeEach(() => {
      p = new Pin('1610250191');
    });

    it('should throw an error because of missing code or wrong type', () => {
      expect(() => {
        p.addLocale();
      })
        .to.throw(Error);

      expect(() => {
        p.addLocale(['cs']);
      })
        .to.throw(Error);
    });

    it('should throw an error because of wrong type of options', () => {
      expect(() => {
        p.addLocale('xx', 'wrooooong');
      })
        .to.throw(Error);
    });
  });

  describe('isValid()', () => {
    let p;

    beforeEach(() => {
      sinon.spy(console, 'warn');
    });

    afterEach(() => {
      console.warn.restore(); // eslint-disable-line no-console
    });

    describe('without code param', () => {
      it('should be invalid', () => {
        p = new Pin('19');
        expect(p.isValid())
          .to.be.false;

        p = new Pin('invalid');
        expect(p.isValid())
          .to.be.false;

        p = new Pin('690416/2046');
        expect(p.isValid())
          .to.be.false;

        p = new Pin('890416/0046');
        expect(p.isValid())
          .to.be.false;

        p = new Pin('892416/0068');
        expect(p.isValid())
          .to.be.false;

        p = new Pin('8990416/0049');
        expect(p.isValid())
          .to.be.false;

        p = new Pin('550416/004');
        expect(p.isValid())
          .to.be.false;

        // History date
        p = new Pin('540416/004');
        expect(p.isValid())
          .to.be.false;

        // Future date
        p = new Pin('250416/0043');
        expect(p.isValid())
          .to.be.false;
      });

      it('should be valid', () => {
        p = new Pin('1610250191');
        expect(p.isValid())
          .to.be.true;

        p = new Pin('780123/3540');
        expect(p.isValid())
          .to.be.true;

        p = new Pin('161025/0191');
        expect(p.isValid())
          .to.be.true;

        p = new Pin('780123/3540');
        expect(p.isValid())
          .to.be.true;

        p = new Pin('0405019330');
        expect(p.isValid())
          .to.be.true;

        p = new Pin('0425019310');
        expect(p.isValid())
          .to.be.true;

        p = new Pin('0455019312');
        expect(p.isValid())
          .to.be.true;

        p = new Pin('0475019314');
        expect(p.isValid())
          .to.be.true;

        // History date
        p = new Pin('560416/004', {
          min: LocaleProvider.MIN,
        });
        expect(p.isValid())
          .to.be.true;

        // Future date
        p = new Pin('250416/0043', {
          max: LocaleProvider.MAX,
        });
        expect(p.isValid())
          .to.be.true;
      });
    });

    describe('with code param', () => {
      it('should be invalid and warning fired because of missing locale', () => {
        p = new Pin('1610250191');
        expect(p.isValid('xx'))
          .to.be.false;

        expect(console.warn.called) // eslint-disable-line no-console
          .to.be.true;
      });

      it('should be valid for specific locale', () => {
        p = new Pin('161025/0191');
        expect(p.isValid('cs'))
          .to.be.true;
      });
    });
  });

  describe('getBirthDate()', () => {
    let p;

    it('should be null', () => {
      p = new Pin('19');
      expect(p.getBirthDate())
        .to.equal(null);

      p = new Pin('651202/5555');
      expect(p.getBirthDate())
        .to.equal(null);
    });

    describe('by gender', () => {
      it('should be male date', () => {
        // Male
        p = new Pin('161025/0191');
        expect(p.getBirthDate())
          .to.eql(new Date('2016-10-25'));

        p = new Pin('890416/2025');
        expect(p.getBirthDate())
          .to.eql(new Date('1989-04-16'));

        p.pin = '161025/0191';
        expect(p.getBirthDate())
          .to.eql(new Date('2016-10-25'));

        p = new Pin('163025/0171');
        expect(p.getBirthDate())
          .to.eql(new Date('2016-10-25'));

        p = new Pin('531025/517');
        expect(p.getBirthDate())
          .to.eql(new Date('1953-10-25'));

        p = new Pin('831025/217');
        expect(p.getBirthDate())
          .to.eql(new Date('1883-10-25'));

        p = new Pin('950202/506');
        expect(p.getBirthDate())
          .to.eql(new Date('1895-02-02 00:00:00'));
      });

      it('should be female date', () => {
        // Female
        p = new Pin('165125/3197');
        expect(p.getBirthDate())
          .to.eql(new Date('2016-01-25'));

        p = new Pin('166025/3199');
        expect(p.getBirthDate())
          .to.eql(new Date('2016-10-25'));

        p = new Pin('167125/3199');
        expect(p.getBirthDate())
          .to.eql(new Date('2016-01-25'));
        p = new Pin('168025/5192');
        expect(p.getBirthDate())
          .to.eql(new Date('2016-10-25'));
      });
    });
  });

  describe('isMale()', () => {
    let p;

    it('should be null', () => {
      p = new Pin('19');
      expect(p.isMale())
        .to.equal(null);

      p = new Pin('651202/5555');
      expect(p.isMale())
        .to.equal(null);

      p = new Pin('022456/2025');
      expect(p.isMale())
        .to.equal(null);
    });

    it('should be ok', () => {
      p = new Pin('161025/0191');
      expect(p.isMale())
        .to.be.true;

      p = new Pin('890416/2025');
      expect(p.isMale())
        .to.be.true;

      p = new Pin('163005/0191');
      expect(p.isMale())
        .to.be.true;

      p = new Pin('531025/517');
      expect(p.isMale())
        .to.be.true;

      p = new Pin('831025/217');
      expect(p.isMale())
        .to.be.true;
    });
  });

  describe('isFemale()', () => {
    let p;
    it('should be null', () => {
      p = new Pin('19');
      expect(p.isFemale())
        .to.equal(null);

      p = new Pin('656202/5555');
      expect(p.isFemale())
        .to.equal(null);

      p = new Pin('027456/2025');
      expect(p.isFemale())
        .to.equal(null);
    });

    it('should be ok', () => {
      p = new Pin('935228/8880');
      expect(p.isFemale())
        .to.be.true;

      p = new Pin('161025/0191');
      p.pin = '165125/0095';
      expect(p.isFemale())
        .to.be.true;

      p = new Pin('166005/0491');
      expect(p.isFemale())
        .to.be.true;

      p = new Pin('168005/0691');
      expect(p.isFemale())
        .to.be.true;

      p = new Pin('536025/567');
      expect(p.isFemale())
        .to.be.true;

      p = new Pin('836025/267');
      expect(p.isFemale())
        .to.be.true;
    });
  });
});
