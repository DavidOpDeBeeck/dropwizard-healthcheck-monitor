import { Application } from './application';
import { HealthCheck } from './health-check';
import { HealthStatus } from './health-status';
import { HealthChecksResponseFormat, HealthChecksResponse, HealthChecksResponseParser } from './health-check-response';

import { MockResponse } from './../testing/mock-response';

const application: Application = new Application("application", "anUrl");
const validResponse: MockResponse = new MockResponse({ "aCheck": { "healthy": true }, "anotherCheck": { "healthy": false } });
const invalidResponse: MockResponse = new MockResponse("invalid response");

describe('HealthCheckResponseParser', () => {
  describe('parseResponse', () => {
    it('should create a response when the input is valid', () => {
      const parser = new HealthChecksResponseParser();

      let response = parser.parseResponse(validResponse, application);

      expect(response.healthChecks)
          .toContain(
              new HealthCheck("aCheck", application, HealthStatus.Healthy),
              new HealthCheck("anotherCheck", application, HealthStatus.Unhealthy));
    });

    it('should create an unreachable response when the input is invalid', () => {
      const parser = new HealthChecksResponseParser();

      let response = parser.parseResponse(invalidResponse, application);

      expect(response.healthChecks)
          .toContain(HealthCheck.unreachable(application));
    });
  });
});
