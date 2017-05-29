import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { Application } from './models/application'
import { Environment } from './models/environment'
import { HealthStatus } from './models/health-status'
import { HealthCheck, CombinedHealthCheck, HealthChecksResponse, HealthCheckMapper } from './models/health-check'

import 'rxjs';

@Injectable()
export class HealthChecksService {

  private static readonly HTTP_TIMEOUT = 10 * 1000;
  private healthCheckMapper: HealthCheckMapper;

  constructor(@Inject(Http) private http) { 
    this.healthCheckMapper = new HealthCheckMapper();
  }

  getHealthChecks(environment: Environment): Observable<CombinedHealthCheck[]> {
    return Observable.from(environment.applications)
            .flatMap(
              (application: Application) => {
                return this.getHealthCheckResponse(application);
              })
            .flatMap(
              (response: HealthChecksResponse) => {
                return response.getUnHealthyChecks();
              })
            .toArray()
            .map(
              (healthChecks: HealthCheck[]) => {
                return this.healthCheckMapper.combineHealthChecks(healthChecks);
              })
            .share();
  }

  private getHealthCheckResponse(application: Application): Observable<HealthChecksResponse> {
    return this.http.get(application.healthCheckUrl)
      .timeout(HealthChecksService.HTTP_TIMEOUT)
      .flatMap(response => this.toHealthChecksResponse(response, application))
      .catch(error => this.toHealthChecksResponse(error, application));
  }

  private toHealthChecksResponse(response: any, application: Application): Observable<HealthChecksResponse> {
    return Observable.of(
      this.healthCheckMapper.toHealthChecksResponse(response, application)
    );
  }
}
