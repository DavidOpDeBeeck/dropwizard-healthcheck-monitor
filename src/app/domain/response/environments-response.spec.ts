import { MockResponse } from './../../testing/mock-response';

import { Application } from './../application';
import { Environment } from './../environment';
import { EnvironmentsResponseParser, EnvironmentsResponseValidator } from './environments-response';

const application: Application = new Application("application", "url");
const validResponse: MockResponse = new MockResponse({ "environment": [{ "name": "application", "healthCheckUrl" : "url" }] });
const responseWithInvalidType: MockResponse = new MockResponse({ "environment": [{ "name": 1, "healthCheckUrl" : 2 }] });
const responseWithInvalidSchema: MockResponse = new MockResponse("invalid response");

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

    it('should return "false" when the input has an invalid type', () => {
      const validator = new EnvironmentsResponseValidator();

      let valid = validator.isValid(responseWithInvalidType);

      expect(valid).toBeFalsy();
    });

    it('should return "false" when the input has an invalid schema', () => {
      const validator = new EnvironmentsResponseValidator();

      let valid = validator.isValid(responseWithInvalidSchema);

      expect(valid).toBeFalsy();
    });
  });
});
