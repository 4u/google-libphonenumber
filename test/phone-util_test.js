'use strict';

/**
 * Module dependencies.
 */

import { PhoneNumberType as PNT } from '..';
import { PhoneNumberUtil } from '..';
import { PhoneNumberFormat as PNF } from '..';
import should from 'should';

const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Test `PhoneUtil`.
 */

describe('PhoneUtil', () => {
  const validNumbers = [
    '202-456-1414',
    '(202) 456-1414',
    '+1 (202) 456-1414',
    '202.456.1414',
    '202/4561414',
    '1 202 456 1414',
    '+12024561414',
    '1 202-456-1414'
  ];

  describe('International Format', () => {
    it('should format a number in the international format', () => {
      validNumbers.forEach((value) => {
        const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'US');

        phoneUtil.format(phoneNumber, PNF.INTERNATIONAL).should.equal('+1 202-456-1414');
      });
    });
  });

  describe('E164 Format', () => {
    it('should format a number in the E164 format', () => {
      validNumbers.forEach((value) => {
        const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'US');

        phoneUtil.format(phoneNumber, PNF.E164).should.equal('+12024561414');
      });
    });
  });

  describe('National Format', () => {
    it('should format a number in the national format', () => {
      validNumbers.forEach((value) => {
        const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'US');

        phoneUtil.format(phoneNumber, PNF.NATIONAL).should.equal('(202) 456-1414');
      });
    });
  });

  describe('RFC3966 Format', () => {
    it('should format a number in the RFC3966 format', () => {
      validNumbers.forEach((value) => {
        const phoneNumber = phoneUtil.parseAndKeepRawInput(value, 'US');

        phoneUtil.format(phoneNumber, PNF.RFC3966).should.equal('tel:+1-202-456-1414');
      });
    });
  });

  describe('Phone Number Type', () => {
    it('should return a valid phone number type', () => {
      const phoneNumber = phoneUtil.parseAndKeepRawInput(validNumbers[0], 'US');

      phoneUtil.getNumberType(phoneNumber).should.equal(PNT.FIXED_LINE_OR_MOBILE);
    });
  });

  describe('Malformatted Number', () => {
    it('should throw an error when attempting to format a malformatted number', () => {
      try {
        phoneUtil.parseAndKeepRawInput('111111111111111111111', 'US');

        should.fail();
      } catch (e) {
        e.should.be.an.instanceOf(Error);
        e.message.should.equal('The string supplied is too long to be a phone number');
      }
    });

    it('should return a reason for an invalid number', () => {
      const number = phoneUtil.parseAndKeepRawInput('123456', 'US');

      phoneUtil.isPossibleNumber(number).should.be.false();
      phoneUtil.isPossibleNumberWithReason(number).should.equal(PhoneNumberUtil.ValidationResult.TOO_SHORT);
    });
  });
});
