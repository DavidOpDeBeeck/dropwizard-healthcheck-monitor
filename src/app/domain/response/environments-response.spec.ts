import { MockResponse } from './../../testing/mock-response';

import { Application } from './../application';
import { Environment } from './../environment';
import { EnvironmentsResponseParser, EnvironmentsResponseValidator } from './environments-response';

const application: Application = new Application("application", "url");
const validResponse: MockResponse = new MockResponse({ "environment": [{ "name": "application", "healthCheckUrl" : "url" }] });
const responseWithInvalidSchema: MockResponse = new MockResponse("invalid response");
const responseWithNullEnvironment: MockResponse = new MockResponse({ "environment": null });
const responseWithNullApplication: MockResponse = new MockResponse({ "environment": [null] });
const responseWithUndefinedApplication: MockResponse = new MockResponse({ "environment": [undefined] });
const responseWithInvalidApplicationType: MockResponse = new MockResponse({ "environment": [{ "name": 1, "healthCheckUrl" : 2 }] });

describe('EnvironmentsResponseParser', () => {
  describe('parseResponse', () => {
    it('should create a response when the input is valid', () => {
      const parser = new EnvironmentsResponseParser();

      let response = parser.parseResponse(validResponse);

      expect(response.environments)
          .toEqual([
            new Environment("environment", [application])
          ]);
    });

    it('should create an empty response when the input is invalid', () => {
      const parser = new EnvironmentsResponseParser();

      let response = parser.parseResponse(responseWithInvalidSchema);

      expect(response.environments).toEqual([]);
    });
  });
});

describe('EnvironmentsResponseValidator', () => {
  describe('isValid', () => {
    it('should return "true" when the input is valid', () => {
      const validator = new EnvironmentsResponseValidator();

      let valid = validator.isValid(validResponse);

      expect(valid).toBeTruthy();
    });

    it('should return "false" when the input is undefined or null', () => {
      const validator = new EnvironmentsResponseValidator();

      let nullIsValid = validator.isValid(null);
      let undefinedIsValid = validator.isValid(undefined);

      expect(nullIsValid).toBeFalsy();
      expect(undefinedIsValid).toBeFalsy();
    });

    it('should return "false" when the input has an invalid schema', () => {
      const validator = new EnvironmentsResponseValidator();

      let valid = validator.isValid(responseWithInvalidSchema);

      expect(valid).toBeFalsy();
    });

    it('should return "false" when the input has an invalid environment', () => {
      const validator = new EnvironmentsResponseValidator();

      /* 
        It is not necessary to test the undefined environment,
        because a key with an undefined value will not be collected by Object.keys
      */

      let valid = validator.isValid(responseWithNullEnvironment);

      expect(valid).toBeFalsy();
    });

    it('should return "false" when the input has an invalid application', () => {
      const validator = new EnvironmentsResponseValidator();

      let nullApplicationIsValid = validator.isValid(responseWithNullApplication);
      let undefinedApplicationIsValid = validator.isValid(responseWithUndefinedApplication);

      expect(nullApplicationIsValid).toBeFalsy();
      expect(undefinedApplicationIsValid).toBeFalsy();
    });

    it('should return "false" when the input has an invalid application type', () => {
      const validator = new EnvironmentsResponseValidator();

      let valid = validator.isValid(responseWithInvalidApplicationType);

      expect(valid).toBeFalsy();
    });
  });
});
