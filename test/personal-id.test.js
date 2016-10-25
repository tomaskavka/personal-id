/* global describe */
/* global it */

let Pin, expect;
if (typeof window === 'undefined') {
  Pin = require('./../src/personal-id').default;
  expect = require('chai').expect;
} else {
  Pin = window.Validator;
  expect = window.chai.expect;
}

describe('Personal ID constructor', () => {
  let pin;

  beforeEach(() => {
    pin = {
      empty: new Pin(),
      invalid: new Pin(19),
      valid: new Pin(8904160045),
      validWithSlash: new Pin('890416/0045'),
    };
  });

  /*it('should expose on window if browser', function() {
    if (typeof window !== 'undefined') {
      expect(window.Pin).to.not.be.undefined;
    }
  });*/

  describe('Empty pin', () => {

    it('should use default locale', () => {
      expect(pin.empty.getLocales()).to.be.instanceof(Array);
      expect(pin.empty.getLocales()).to.eql(['cs']);
    });

    it('should have a pin property equal to null', () => {
      expect(pin.empty.pin).to.equal(null);
    });

    it('should\'t be set', () => {
      expect(pin.empty.state.set).to.be.false;
    });

    it('should\'t be valid', () => {
      expect(pin.empty.state.valid).to.be.false;
      expect(pin.empty.isValid()).to.be.false;
    });

    it('should use default (cs) locale', () => {
      expect(pin.empty.getLocales()).to.be.instanceof(Array);
      expect(pin.empty.getLocales()).to.eql(['cs']);
    });
  });

  describe('Invalid pin', () => {

    it('should use default locale', () => {
      expect(pin.invalid.getLocales()).to.be.instanceof(Array);
      expect(pin.invalid.getLocales()).to.eql(['cs']);
    });

    it('should have a pin property equal to 19', () => {
      expect(pin.invalid.pin).to.equal(19);
    });

    it('should be set', () => {
      expect(pin.invalid.state.set).to.be.true;
    });

    it('should\'t be valid', () => {
      expect(pin.invalid.state.valid).to.be.false;
      expect(pin.invalid.isValid()).to.be.false;
    });

    it('should\'t be valid in default locale', () => {
      expect(pin.invalid.isValid('cs')).to.be.false;
    });
  });

  describe('Valid pin', () => {

    it('should use default locale', () => {
      expect(pin.valid.getLocales()).to.be.instanceof(Array);
      expect(pin.valid.getLocales()).to.eql(['cs']);
    });

    it('should have a pin property equal to 8904160045', () => {
      expect(pin.valid.pin).to.equal(8904160045);
    });

    it('should be set', () => {
      expect(pin.valid.state.set).to.be.true;
    });

    it('should be valid', () => {
      expect(pin.valid.state.valid).to.be.true;
      expect(pin.valid.isValid()).to.be.true;
    });

    it('should be valid in default locale', () => {
      expect(pin.valid.isValid('cs')).to.be.true;
    });
  });

  describe('Valid pin with slash', () => {

    it('should use default locale', () => {
      expect(pin.validWithSlash.getLocales()).to.be.instanceof(Array);
      expect(pin.validWithSlash.getLocales()).to.eql(['cs']);
    });

    it('should have a pin property equal to 890416/0045', () => {
      expect(pin.validWithSlash.pin).to.equal('890416/0045');
    });

    it('should be set', () => {
      expect(pin.validWithSlash.state.set).to.be.true;
    });

    it('should be valid', () => {
      expect(pin.validWithSlash.state.valid).to.be.true;
      expect(pin.validWithSlash.isValid()).to.be.true;
    });

    it('should be valid in default locale', () => {
      expect(pin.validWithSlash.isValid('cs')).to.be.true;
    });
  });
});
