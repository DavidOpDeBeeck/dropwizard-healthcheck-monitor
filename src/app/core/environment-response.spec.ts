import { MockResponse } from './../testing/mock-response';

import { Application } from './application';
import { Environment } from './environment';
import { EnvironmentResponseFormat, EnvironmentResponse, EnvironmentResponseParser } from './environment-response';

const application: Application = new Application("application", "url");
const validResponse: MockResponse = new MockResponse({ "environment": [{ "name": "application", "healthCheckUrl" : "url" }] });
const invalidResponse: MockResponse = new MockResponse("invalid response");

describe('EnvironmentResponseParser', () => {
  describe('parseResponse', () => {
    it('should create a response when the input is valid', () => {
      const parser = new EnvironmentResponseParser();

      let response = parser.parseResponse(validResponse);

      expect(response.environments)
          .toContain(new Environment("environment", [application]));
    });

    it('should create an empty response when the input is invalid', () => {
      const parser = new EnvironmentResponseParser();

      let response = parser.parseResponse(invalidResponse);

      expect(response.environments).toEqual([]);
    });
  });
});
