import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, ResponseType, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Environment } from './models/environment';
import { Application } from './models/application';
import { HealthStatus } from './models/health-status';
import { HealthCheck, HealthChecksResponse } from './models/health-check';

import { HealthChecksService } from './health-checks.service';

class ErrorResponse extends Response implements Error {
    name: any
    message: any
}

const UNHEALTHY_REPONSE : HealthChecksResponse = {
  "healthyHealthCheckName" : {
      healthy: true
  },
  "unhealthyHealthCheckName" : {
      healthy: false
  }
};

const HEALTHY_REPONSE : HealthChecksResponse = {
  "healthyHealthCheckName" : {
      healthy: true
  },
  "unhealthyHealthCheckName" : {
      healthy: true
  }
};

const INVALID_RESPONSE = {
  "key1": {},
  "key2": []
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
    it('should return an empty Observable<Array<HealthCheck>> when the request is successfull and the response is healthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(HEALTHY_REPONSE)
        })));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks.length).toEqual(0);
        expect(healthChecks instanceof Array).toBeTruthy();
      });
    }));

    it('should return an unhealthy Observable<Array<HealthCheck>> when the request is successfull and the response is unhealthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(UNHEALTHY_REPONSE)
        })));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
        expect(healthChecks[0].applications).toEqual([APPLICATION]);
        expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);
        expect(healthChecks instanceof Array).toBeTruthy();
      });
    }));

    it('should return an unhealthy Observable<Array<HealthCheck>> when the request is unsuccessfull and the response is unhealthy', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        let body = JSON.stringify(UNHEALTHY_REPONSE);
        let opts = { type: ResponseType.Error, status: 500, body: body };
        connection.mockError(new ErrorResponse(new ResponseOptions(opts)));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks[0].name).toEqual("unhealthyHealthCheckName");
        expect(healthChecks[0].applications).toEqual([APPLICATION]);
        expect(healthChecks[0].status).toEqual(HealthStatus.Unhealthy);
        expect(healthChecks instanceof Array).toBeTruthy();
      });
    }));

    it('should return an unreachable Observable<Array<HealthCheck>> when the request is unsuccessfull and the response not a HealthChecksResponse', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        let body = JSON.stringify(INVALID_RESPONSE);
        let opts = { type: ResponseType.Error, status: 500, body: body };
        connection.mockError(new ErrorResponse(new ResponseOptions(opts)));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks[0].name).toEqual("unreachable");
        expect(healthChecks[0].applications).toEqual([APPLICATION]);
        expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
        expect(healthChecks instanceof Array).toBeTruthy();
      });
    }));

    it('should return an unreachable Observable<Array<HealthCheck>> when the request is unsuccessfull', 
        inject([HealthChecksService, MockBackend], (service: HealthChecksService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Error("unreachable"));
      });

      service.getHealthChecks(ENVIRONMENT).subscribe((healthChecks) => {
        expect(healthChecks[0].name).toEqual("unreachable");
        expect(healthChecks[0].applications).toEqual([APPLICATION]);
        expect(healthChecks[0].status).toEqual(HealthStatus.UnReachable);
        expect(healthChecks instanceof Array).toBeTruthy();
      });
    }));
  });
});
