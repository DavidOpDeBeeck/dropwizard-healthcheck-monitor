import { Application } from './../application';
import { HealthCheck } from './../health-check';
import { HealthStatus } from './../health-status';
import { HealthChecksResponseParser, HealthChecksResponseValidator } from './health-checks-response';

import { MockResponse } from './../../testing/mock-response';

const application: Application = new Application("application", "anUrl");
const validResponse: MockResponse = new MockResponse({ "aCheck": { "healthy": true }, "anotherCheck": { "healthy": false } });
const responseWithInvalidTypes: MockResponse = new MockResponse({ "aCheck": { "healthy": 'string' } });
const responseWithInvalidSchema: MockResponse = new MockResponse("invalid response");

describe('HealthChecksResponseParser', () => {
  describe('parseResponse', () => {
    it('should create a response when the input is valid', () => {
      const parser = new HealthChecksResponseParser(application);

      let response = parser.parseResponse(validResponse);

      expect(response.healthChecks)
          .toEqual([
            new HealthCheck("aCheck", application, HealthStatus.Healthy),
            new HealthCheck("anotherCheck", application, HealthStatus.Unhealthy)
          ]);
    });

    it('should create an unreachable response when the input is invalid', () => {
      const parser = new HealthChecksResponseParser(application);

      let response = parser.parseResponse(responseWithInvalidSchema);

      expect(response.healthChecks)
          .toEqual([
            HealthCheck.unreachable(application)
          ]);
    });
  });
});

describe('HealthChecksResponseValidator', () => {
  describe('isValid', () => {
    it('should return "true" when the input is valid', () => {
      const validator = new HealthChecksResponseValidator();

      let valid = validator.isValid(validResponse);

      expect(valid).toBeTruthy();
    });

    it('should return "false" when the input has an invalid type', () => {
      const validator = new HealthChecksResponseValidator();

      let valid = validator.isValid(responseWithInvalidTypes);

      expect(valid).toBeFalsy();
    });

    it('should return "false" when the input has an invalid schema', () => {
      const validator = new HealthChecksResponseValidator();

      let valid = validator.isValid(responseWithInvalidSchema);

      expect(valid).toBeFalsy();
    });
  });
});
