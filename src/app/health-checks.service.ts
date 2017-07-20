import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { AppSettings } from './app.settings'
import { Application } from './domain/application'
import { Environment } from './domain/environment'
import { HealthStatus } from './domain/health-status'
import { HealthChecksResponse, HealthChecksResponseParser } from './domain/response/health-check-response'
import { HealthCheck, CombinedHealthCheck, HealthCheckMapper } from './domain/health-check'

import 'rxjs';

@Injectable()
export class HealthChecksService {

  private mapper: HealthCheckMapper;
  private responseParser: HealthChecksResponseParser;

  constructor(@Inject(Http) private http) { 
    this.mapper = new HealthCheckMapper();
    this.responseParser = new HealthChecksResponseParser();
  }

  getUnHealthChecks(environment: Environment): Observable<CombinedHealthCheck[]> {
    return Observable.from(environment.applications)
            .flatMap(application => this.getHealthCheckResponse(application))
            .flatMap(response => response.getUnHealthyChecks())
            .toArray()
            .map(healthChecks => this.mapper.combine(healthChecks))
            .share();
  }

  private getHealthCheckResponse(application: Application): Observable<HealthChecksResponse> {
    return this.http.get(application.healthCheckUrl)
      .timeout(AppSettings.httpTimeout)
      .flatMap(response => this.toHealthChecksResponse(response, application))
      .catch(error => this.toHealthChecksResponse(error, application));
  }

  private toHealthChecksResponse(response: any, application: Application): Observable<HealthChecksResponse> {
    return Observable.of(
      this.responseParser.parseResponse(response, application)
    );
  }
}
