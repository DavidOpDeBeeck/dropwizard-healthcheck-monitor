import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MockBackendBuilder } from './testing/mock-backend-builder';

import { Environment } from './models/environment';
import { Application } from './models/application';
import { HealthStatus } from './models/health-status';
import { HealthCheck, HealthChecksResponseFormat } from './models/health-check';

import { HealthChecksService } from './health-checks.service';

const APPLICATION_URL = "/url/healthcheck.json";
const APPLICATION = new Application("application", APPLICATION_URL);
const ENVIRONMENT = new Environment("environment", [APPLICATION]);
const UNHEALTHY_REPONSE: HealthChecksResponseFormat = {
  "healthyHealthCheckName": {
      healthy: true
  },
  "unhealthyHealthCheckName": {
      healthy: false
  },
  "anotherunhealthyHealthCheckName": {
      healthy: false
  }
};
const HEALTHY_REPONSE : HealthChecksResponseFormat = {
  "healthyHealthCheckName": {
      healthy: true
  },
  "unhealthyHealthCheckName": {
      healthy: true
  }
};
const INVALID_RESPONSE = {
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

  describe('getHealthChecks', () => {
    it('should return an empty Observable<HealthCheck[]> when the request is successful and the response is healthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {
      
      MockBackendBuilder
        .mockBackend(mockBackend)
        .withUrl(APPLICATION_URL)
        .withResponse(HEALTHY_REPONSE)
        .withStatus(200)
        .build();

      service.getHealthChecks(ENVIRONMENT).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(0);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unhealthy Observable<HealthCheck[]> when the request is successful and the response is unhealthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockBackendBuilder
        .mockBackend(mockBackend)
        .withUrl(APPLICATION_URL)
        .withResponse(UNHEALTHY_REPONSE)
        .withStatus(200)
        .build();

      service.getHealthChecks(ENVIRONMENT).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(2);

          expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
          expect(healthChecks[0].applications).toEqual([APPLICATION]);
          expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);
          
          expect(healthChecks[1].name).toEqual("anotherunhealthyHealthCheckName");
          expect(healthChecks[1].applications).toEqual([APPLICATION]);
          expect(healthChecks[1].status).toEqual(HealthStatus.Unhealthy);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unhealthy Observable<HealthCheck[]> when the request is unsuccessful and the response is unhealthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockBackendBuilder
        .mockBackend(mockBackend)
        .withUrl(APPLICATION_URL)
        .withResponse(UNHEALTHY_REPONSE)
        .withStatus(500)
        .build();

      service.getHealthChecks(ENVIRONMENT).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(2);

          expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
          expect(healthChecks[0].applications).toEqual([APPLICATION]);
          expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);

          expect(healthChecks[1].name).toEqual("anotherunhealthyHealthCheckName");
          expect(healthChecks[1].applications).toEqual([APPLICATION]);
          expect(healthChecks[1].status).toEqual(HealthStatus.Unhealthy);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unreachable Observable<HealthCheck[]> when the request is unsuccessful and the response not a HealthChecksResponse', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockBackendBuilder
        .mockBackend(mockBackend)
        .withUrl(APPLICATION_URL)
        .withResponse(INVALID_RESPONSE)
        .withStatus(500)
        .build();

      service.getHealthChecks(ENVIRONMENT).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(1);

          expect(healthChecks[0].name).toEqual("unreachable");
          expect(healthChecks[0].applications).toEqual([APPLICATION]);
          expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an unreachable Observable<HealthCheck[]> when the request is unsuccessful', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      MockBackendBuilder
        .mockBackend(mockBackend)
        .withUrl(APPLICATION_URL)
        .withFail()
        .build();

      service.getHealthChecks(ENVIRONMENT).subscribe(
        (healthChecks) => {
          expect(healthChecks.length).toEqual(1);

          expect(healthChecks[0].name).toEqual("unreachable");
          expect(healthChecks[0].applications).toEqual([APPLICATION]);
          expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
        },
        (error) => {
          fail(error); 
        });
    }));
  });
});
