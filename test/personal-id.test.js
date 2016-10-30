/* global describe */
/* global it */
/* global beforeEach */
/* global afterEach */
/* eslint-disable no-unused-expressions */

import Pin from './../src/personal-id'; // eslint-disable-line global-require
import FakeLocaleProvider from './lib/fakeLocale'; // eslint-disable-line global-require
import { expect } from 'chai'; // eslint-disable-line global-require, import/no-extraneous-dependencies
import sinon from 'sinon'; // eslint-disable-line global-require, import/no-extraneous-dependencies

const opts = {
  locales: [],
};

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
      p = new Pin(8904165571, opts); // eslint-disable-line no-new
      expect(console.warn.called) // eslint-disable-line no-console
        .to.be.true;
      expect(p.pin)
        .to.equal('8904165571');
    });

    it('should have a pin property equal to 19', () => {
      p = new Pin('19', opts);
      expect(p.pin)
        .to.equal('19');
    });

    it('should have a pin property equal to 19 and add cs locale', () => {
      p = new Pin('19', {
        locales: ['cs'],
      });
      expect(p.pin)
        .to.equal('19');
    });
  });

  describe('addLocale()', () => {
    let p;

    beforeEach(() => {
      p = new Pin('1610250191', opts);
    });

    it('should throw an error because of missing code or wrong type', () => {
      expect(() => {
        p.addLocale();
      })
        .to.throw(Error);

      expect(() => {
        p.addLocale(['fake']);
      })
        .to.throw(Error);
    });

    it('should throw an error because of wrong type of provider', () => {
      expect(() => {
        p.addLocale('xx', 'wrooooong');
      })
        .to.throw(Error);
    });

    it('should be ok', () => {
      expect(() => {
        p.addLocale('fake', FakeLocaleProvider);
      })
        .to.not.throw(Error);

      expect(Object.keys(p.validation.locales))
        .to.eql(['fake']);
    });
  });

  describe('isValid()', () => {
    let p;

    beforeEach(() => {
      sinon.spy(console, 'warn');

      p = new Pin('', opts);
      p.addLocale('fake', FakeLocaleProvider);
    });

    afterEach(() => {
      console.warn.restore(); // eslint-disable-line no-console
    });

    describe('without code param', () => {
      it('should be invalid', () => {
        p.pin = '19';
        expect(p.isValid())
          .to.be.false;
      });

      it('should be valid', () => {
        p.pin = 'PersonalID1989';
        expect(p.isValid())
          .to.be.true;
      });

      it('should be valid and then invalid after a pin change', () => {
        p.pin = 'PersonalID1989';
        expect(p.isValid())
          .to.be.true;

        p.pin = 'PersonalID';
        expect(p.isValid())
          .to.be.false;
      });
    });

    describe('with code param', () => {
      it('should be invalid and warning fired because of missing locale', () => {
        expect(p.isValid('xx'))
          .to.be.false;

        expect(console.warn.called) // eslint-disable-line no-console
          .to.be.true;
      });

      it('should be valid for specific locale', () => {
        p.pin = 'PersonalID1989';
        expect(p.isValid('fake'))
          .to.be.true;
      });
    });

    describe('with code param', () => {
      it('should be invalid and warning fired because of missing locale', () => {
        expect(p.isValid('xx'))
          .to.be.false;

        expect(console.warn.called) // eslint-disable-line no-console
          .to.be.true;
      });

      it('should be valid for fake locale', () => {
        p.pin = 'PersonalID1989';
        expect(p.isValid('fake'))
          .to.be.true;
      });

      it('should be valid for fake locale but not for cs', () => {
        p = new Pin('PersonalID1989');
        p.addLocale('fake', FakeLocaleProvider);
        p.isValid('fake');
        expect(p.isValid('fake'))
          .to.be.true;
      });
    });
  });

  describe('getBirthDate()', () => {
    let p;

    beforeEach(() => {
      p = new Pin('', opts);
      p.addLocale('fake', FakeLocaleProvider);
    });

    it('should be a null', () => {
      p.pin = 'PersonalID';
      expect(p.getBirthDate())
        .to.equal(null);
    });

    it('should be a date', () => {
      p.pin = 'PersonalID1989';
      p.getBirthDate();
      expect(p.getBirthDate())
        .to.eql(new Date('1989-01-01'));
    });

    it('should be a date and then null after a pin change', () => {
      p.pin = 'PersonalID1989';
      expect(p.getBirthDate())
        .to.eql(new Date('1989-01-01'));

      p.pin = 'PersonalID';
      expect(p.getBirthDate())
        .to.equal(null);
    });

    it('should be a date and then another date after a pin change', () => {
      p.pin = 'PersonalID1989';
      expect(p.getBirthDate())
        .to.eql(new Date('1989-01-01'));

      p.pin = 'PersonalID1993';
      expect(p.getBirthDate())
        .to.eql(new Date('1993-01-01'));
    });
  });

  describe('getCode()', () => {
    let p;

    beforeEach(() => {
      p = new Pin('', opts);
      p.addLocale('fake', FakeLocaleProvider);
    });

    it('should be a null', () => {
      p.pin = 'PersonalID';
      expect(p.getCode())
        .to.equal('fake');
    });

    it('should be a locale code', () => {
      p.pin = 'PersonalID1989';
      expect(p.getCode())
        .to.equal('fake');
    });
  });

  describe('isMale()', () => {
    let p;

    beforeEach(() => {
      p = new Pin('', opts);
      p.addLocale('fake', FakeLocaleProvider);
    });

    it('should be null', () => {
      p.pin = '19';
      expect(p.isMale())
        .to.equal(null);
    });

    it('should be ok', () => {
      p.pin = 'PersonalID1989';
      expect(p.isMale())
        .to.be.true;
    });

    it('should be ok and then null after a pin change', () => {
      p.pin = 'PersonalID1989';
      expect(p.isMale())
        .to.be.true;

      p.pin = 'PersonalID19';
      expect(p.isMale())
        .to.equal(null);
    });

    it('should be ok and then false after a pin change', () => {
      p.pin = 'PersonalID1989';
      expect(p.isMale())
        .to.be.true;

      p.pin = 'PersonalID1994';
      expect(p.isMale())
        .to.be.false;
    });
  });

  describe('isFemale()', () => {
    let p;

    beforeEach(() => {
      p = new Pin('', opts);
      p.addLocale('fake', FakeLocaleProvider);
    });

    it('should be null', () => {
      p.pin = '19';
      expect(p.isFemale())
        .to.equal(null);
    });

    it('should be ok', () => {
      p.pin = 'PersonalID1990';
      expect(p.isFemale())
        .to.be.true;
    });

    it('should be ok and then null after a pin change', () => {
      p.pin = 'PersonalID1990';
      expect(p.isFemale())
        .to.be.true;

      p.pin = 'PersonalID19';
      expect(p.isFemale())
        .to.equal(null);
    });

    it('should be ok and then false after a pin change', () => {
      p.pin = 'PersonalID1990';
      expect(p.isFemale())
        .to.be.true;

      p.pin = 'PersonalID1995';
      expect(p.isFemale())
        .to.be.false;
    });
  });
});
