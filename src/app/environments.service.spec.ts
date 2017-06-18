import { TestBed, inject } from '@angular/core/testing';
import { HttpModule, Http, Response, ResponseOptions, BaseRequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { MockBackendBuilder } from './testing/mock-response';

import { Environment } from './core/environment'
import { EnvironmentResponseFormat } from './core/environment-response'
import { Application } from './core/application'

import { EnvironmentsService } from './environments.service';

const application: Application = new Application("application", "url");
const environmentsUrl: string = "./assets/environments.json";
const environmentsResponse: EnvironmentResponseFormat = { "environment" : [application] };

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
        .withMockBackend(mockBackend)
        .withUrl(environmentsUrl)
        .withResponse(environmentsResponse)
        .withStatus(200)
        .build();

      service.getEnvironments().subscribe(
        (environments) => {
          expect(environments.length).toEqual(1);

          expect(environments[0].name).toEqual("environment");
          expect(environments[0].applications).toEqual([application]);
        },
        (error) => {
          fail(error); 
        });
    }));

    it('should return an empty Observable<Environment> when the request is unsuccessful', 
        inject([EnvironmentsService, MockBackend], (service: EnvironmentsService, mockBackend: MockBackend) => {

      MockBackendBuilder
        .withMockBackend(mockBackend)
        .withUrl(environmentsUrl)
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
