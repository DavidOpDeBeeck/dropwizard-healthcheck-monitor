import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MockResource } from './testing/mock-response';

import { Environment } from './domain/environment';
import { Application } from './domain/application';
import { HealthStatus } from './domain/health-status';
import { HealthChecksResponseFormat } from './domain/response/health-checks-response';
import { HealthCheck } from './domain/health-check';

import { HealthChecksService } from './health-checks.service';

const applicationUrl: string = "/url/healthcheck.json";
const application: Application = new Application("application", applicationUrl);
const anotherApplicationUrl: string = "/url/another/healthcheck.json";
const anotherApplication: Application = new Application("anotherApplication", anotherApplicationUrl);
const environment: Environment = new Environment("environment", [application]);
const environmentWithMultipleApplications: Environment = new Environment("environmentWithMultipleApplications", [application, anotherApplication]);
const unhealthyReponse: HealthChecksResponseFormat = {
  "healthyHealthCheckName": { healthy: true },
  "unhealthyHealthCheckName": { healthy: false },
  "anotherunhealthyHealthCheckName": { healthy: false }
};
const anotherUnhealthyReponse: HealthChecksResponseFormat = {
  "healthyHealthCheckName": { healthy: true },
  "yetAnotherunhealthyHealthCheckName": { healthy: false }
};
const healthyResponse: HealthChecksResponseFormat = {
  "healthyHealthCheckName": { healthy: true },
  "unhealthyHealthCheckName": { healthy: true }
};
const invalidResponse: object = {
  "key1": {},
  "key2": []
};

describe('HealthchecksService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        HealthChecksService, 
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend, options) => { return new Http(backend, options); }
        }
      ]});
  });

  describe('getUnHealthyChecks', () => {
    it('should return an empty Observable<HealthCheck[]> when the request is successful and the response is healthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {
      
      MockResource
        .withMockBackend(mockBackend)
        .withUrl(applicationUrl)
        .withResponse(healthyResponse)
        .withStatus(200)
        .build();

      service.getUnHealthyChecks(environment).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(0);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unhealthy Observable<HealthCheck[]> when the request is successful and the response is unhealthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockResource
        .withMockBackend(mockBackend)
        .withUrl(applicationUrl)
        .withResponse(unhealthyReponse)
        .withStatus(200)
        .build();

      service.getUnHealthyChecks(environment).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(2);

          expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
          expect(healthChecks[0].applications).toEqual([application]);
          expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);
          
          expect(healthChecks[1].name).toEqual("anotherunhealthyHealthCheckName");
          expect(healthChecks[1].applications).toEqual([application]);
          expect(healthChecks[1].status).toEqual(HealthStatus.Unhealthy);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unhealthy Observable<HealthCheck[]> when the request is successful and the response is unhealthy with multiple applications', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockResource
        .withMockBackend(mockBackend)
          .withUrl(applicationUrl)
          .withResponse(unhealthyReponse)
          .withStatus(200)
        .and()
          .withUrl(anotherApplicationUrl)
          .withResponse(anotherUnhealthyReponse)
          .withStatus(200)
        .build();

      service.getUnHealthyChecks(environmentWithMultipleApplications).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(3);

          expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
          expect(healthChecks[0].applications).toEqual([application]);
          expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);
          
          expect(healthChecks[1].name).toEqual("anotherunhealthyHealthCheckName");
          expect(healthChecks[1].applications).toEqual([application]);
          expect(healthChecks[1].status).toEqual(HealthStatus.Unhealthy);

          expect(healthChecks[2].name).toEqual("yetAnotherunhealthyHealthCheckName");
          expect(healthChecks[2].applications).toEqual([anotherApplication]);
          expect(healthChecks[2].status).toEqual(HealthStatus.Unhealthy);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unhealthy Observable<HealthCheck[]> when the request is unsuccessful and the response is unhealthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockResource
        .withMockBackend(mockBackend)
        .withUrl(applicationUrl)
        .withResponse(unhealthyReponse)
        .withStatus(500)
        .build();

      service.getUnHealthyChecks(environment).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(2);

          expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
          expect(healthChecks[0].applications).toEqual([application]);
          expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);

          expect(healthChecks[1].name).toEqual("anotherunhealthyHealthCheckName");
          expect(healthChecks[1].applications).toEqual([application]);
          expect(healthChecks[1].status).toEqual(HealthStatus.Unhealthy);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unreachable Observable<HealthCheck[]> when the request is unsuccessful and the response not a HealthChecksResponse', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockResource
        .withMockBackend(mockBackend)
        .withUrl(applicationUrl)
        .withResponse(invalidResponse)
        .withStatus(500)
        .build();

      service.getUnHealthyChecks(environment).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(1);

          expect(healthChecks[0].name).toEqual("unreachable");
          expect(healthChecks[0].applications).toEqual([application]);
          expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unreachable Observable<HealthCheck[]> when the request is unsuccessful', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockResource
        .withMockBackend(mockBackend)
        .withUrl(applicationUrl)
        .withErrorResponse()
        .build();

      service.getUnHealthyChecks(environment).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(1);

          expect(healthChecks[0].name).toEqual("unreachable");
          expect(healthChecks[0].applications).toEqual([application]);
          expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unreachable Observable<HealthCheck[]> when the request timed out', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      // no expectation

      service.getUnHealthyChecks(environment).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(1);

          expect(healthChecks[0].name).toEqual("unreachable");
          expect(healthChecks[0].applications).toEqual([application]);
          expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
        },
        (error) => {
          fail(error); 
        });
    }));
  });
});
