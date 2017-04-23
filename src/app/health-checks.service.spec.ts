import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Environment } from './models/environment'
import { Application } from './models/application'
import { HealthStatus } from './models/health-status'
import { HealthCheck, HealthChecksResponse } from './models/health-check'

import { HealthChecksService } from './health-checks.service';

const UNHEALTHY_HEALTH_CHECK_REPONSE : HealthChecksResponse = {
  "healthyHealthCheckName" : {
      healthy: true
  },
  "unhealthyHealthCheckName" : {
      healthy: false
  }
};

const HEALTHY_HEALTH_CHECK_REPONSE : HealthChecksResponse = {
  "healthyHealthCheckName" : {
      healthy: true
  },
  "unhealthyHealthCheckName" : {
      healthy: true
  }
};

const APPLICATION : Application = {
  name: "application",
  healthCheckUrl: "url"
};

const ENVIRONMENT : Environment = {
    name: "environment",
    applications: [APPLICATION]
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
    it('should return an empty Observable<Array<HealthCheck>> when the request is successfull and all the healthchecks are healthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(HEALTHY_HEALTH_CHECK_REPONSE)
        })));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks.length).toEqual(0);
      });
    }));

    it('should return an Observable<Array<HealthCheck>> when the request is successfull and at least one healthcheck is unhealthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(UNHEALTHY_HEALTH_CHECK_REPONSE)
        })));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
        expect(healthChecks[0].applications).toEqual([APPLICATION]);
        expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);
      });
    }));

    it('should return an Observable<Array<HealthCheck>> when the request is unsuccessfull', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Error("unreachable"));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks[0].name).toEqual("unreachable");
        expect(healthChecks[0].applications).toEqual([APPLICATION]);
        expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
      });
    }));
  });
});
