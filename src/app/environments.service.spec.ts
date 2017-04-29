import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MockBackendBuilder } from './testing/mock-backend-builder';

import { Environment, EnvironmentResponseFormat } from './models/environment'

import { EnvironmentsService } from './environments.service';

const APPLICATION = {
    name: "application",
    healthCheckUrl: "url"
};
const ENVIRONMENTS_URL: string = "./assets/environments.json";
const ENVIRONMENTS_RESPONSE : EnvironmentResponseFormat = {
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

      MockBackendBuilder
        .mockBackend(mockBackend)
        .withUrl(ENVIRONMENTS_URL)
        .withResponse(ENVIRONMENTS_RESPONSE)
        .withStatus(200)
        .build();

      service.getEnvironments().subscribe(
        (environments) => {
          expect(environments.length).toEqual(1);

          expect(environments[0].name).toEqual("environment");
          expect(environments[0].applications).toEqual([APPLICATION]);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an empty Observable<Environment> when the request is unsuccessful', 
        inject([EnvironmentsService, MockBackend], (service: EnvironmentsService, mockBackend: MockBackend) => {

      MockBackendBuilder
        .mockBackend(mockBackend)
        .withUrl(ENVIRONMENTS_URL)
        .withFail()
        .build();

      service.getEnvironments().subscribe(
        (environments) => {
          expect(environments.length).toEqual(0);
        },
        (error) => {
          fail(error); 
        });
    }));
  });
});
