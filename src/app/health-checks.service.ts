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

  constructor(
    @Inject(Http) private http,
  ) { }

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
                return HealthCheckMapper.combineHealthChecks(healthChecks);
              })
            .share();
  }

  private getHealthCheckResponse(application: Application): Observable<HealthChecksResponse> {
    return this.http.get(application.healthCheckUrl)
      .timeout(10000, new Error('timeout exceeded'))
      .flatMap(res => this.toHealthChecksResponse(res, application))
      .catch(err => this.toHealthChecksResponse(err, application));
  }

  private toHealthChecksResponse(res: any, application: Application): Observable<HealthChecksResponse> {
    let body: any = res.json ? res.json() : res;
    let healthCheckResponse: HealthChecksResponse = HealthChecksResponse.fromResponse(body, application);
    return Observable.of(healthCheckResponse);
  }
}
