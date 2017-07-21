import { timeout } from 'rxjs/operator/timeout';
import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

import { AppSettings } from './app.settings'
import { Application } from './domain/application'
import { Environment } from './domain/environment'
import { HealthStatus } from './domain/health-status'
import { HealthChecksResponse, HealthChecksResponseParser } from './domain/response/health-checks-response'
import { HealthCheck, CombinedHealthCheck, HealthCheckMapper } from './domain/health-check'

import 'rxjs';

@Injectable()
export class HealthChecksService {

  private mapper: HealthCheckMapper;
  private parser: HealthChecksResponseParser;

  private httpTimeout: Number = AppSettings.httpTimeout;

  constructor(@Inject(Http) private http) { 
    this.mapper = new HealthCheckMapper();
    this.parser = new HealthChecksResponseParser();
  }

  getUnHealthChecks(environment: Environment): Observable<CombinedHealthCheck[]> {
    const applications: Application[] = environment.applications;

    return Observable.from(applications)
            .flatMap(application => this.getHealthChecksResponse(application))
            .flatMap(response => response.getUnHealthyChecks())
            .toArray()
            .map(healthChecks => this.mapper.combine(healthChecks))
            .share();
  }

  private getHealthChecksResponse(application: Application): Observable<HealthChecksResponse> {
    const healthCheckUrl: string = application.healthCheckUrl;

    return this.http.get(healthCheckUrl)
      .timeout(this.httpTimeout)
      .flatMap(response => this.toHealthChecksResponse(response, application))
      .catch(error => this.toHealthChecksResponse(error, application));
  }

  private toHealthChecksResponse(response: any, application: Application): Observable<HealthChecksResponse> {
    return Observable.of(
      this.parser.parseResponse(response, application)
    );
  }
}
