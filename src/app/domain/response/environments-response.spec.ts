import { MockResponse } from './../../testing/mock-response';

import { Application } from './../application';
import { Environment } from './../environment';
import { EnvironmentsResponseFormat, EnvironmentsResponse, EnvironmentsResponseParser } from './environments-response';

const application: Application = new Application("application", "url");
const validResponse: MockResponse = new MockResponse({ "environment": [{ "name": "application", "healthCheckUrl" : "url" }] });
const invalidResponse: MockResponse = new MockResponse("invalid response");

describe('EnvironmentsResponseParser', () => {
  describe('parseResponse', () => {
    it('should create a response when the input is valid', () => {
      const parser = new EnvironmentsResponseParser();

      let response = parser.parseResponse(validResponse);

      expect(response.environments)
          .toContain(new Environment("environment", [application]));
    });

    it('should create an empty response when the input is invalid', () => {
      const parser = new EnvironmentsResponseParser();

      let response = parser.parseResponse(invalidResponse);

      expect(response.environments).toEqual([]);
    });
  });
});
