import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { Environment, EnvironmentResponse } from './models/environment'

import { EnvironmentsService } from './environments.service';

const APPLICATION = {
    name: "application",
    healthCheckUrl: "url"
};

const ENVIRONMENTS_RESPONSE : EnvironmentResponse = {
  "environment" : [APPLICATION]
};

describe('EnvironmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        EnvironmentsService, 
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          deps: [MockBackend, BaseRequestOptions],
          useFactory: (backend, options) => { return new Http(backend, options); }
        }
      ]});
  });

  describe('getEnvironments', () => {
    it('should return an Observable<Environment> when the request is successful', 
        inject([EnvironmentsService, MockBackend], (service: EnvironmentsService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({
          body: JSON.stringify(ENVIRONMENTS_RESPONSE)
        })));
      });

      service.getEnvironments().subscribe((environments) => {
        expect(environments[0].name).toEqual("environment");
        expect(environments[0].applications).toEqual([APPLICATION]);
      });
    }));

    it('should return an empty Observable<HealthCheck> when the request is unsuccessful', 
        inject([EnvironmentsService, MockBackend], (service: EnvironmentsService, mockBackend: MockBackend) => {

      mockBackend.connections.subscribe((connection: MockConnection) => {
        connection.mockError(new Error("unreachable"));
      });

      service.getEnvironments().subscribe((environments) => {
        expect(environments.length).toEqual(0);
      });
    }));
  });
});
