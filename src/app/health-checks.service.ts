import { timeout } from 'rxjs/operator/timeout';
import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AppSettings } from './app.settings'
import { Application } from './domain/application'
import { Environment } from './domain/environment'
import { HealthStatus } from './domain/health-status'
import { HealthChecksResponse, HealthChecksResponseParser } from './domain/response/health-checks-response'
import { HealthCheck, CombinedHealthCheck, HealthCheckCombiner } from './domain/health-check'

import 'rxjs';

@Injectable()
export class HealthChecksService {

  private combiner: HealthCheckCombiner;
  private parser: HealthChecksResponseParser;

  private httpTimeout: Number = AppSettings.httpTimeout;

  constructor(@Inject(Http) private http) { 
    this.combiner = new HealthCheckCombiner();
    this.parser = new HealthChecksResponseParser();
  }

  getUnHealthyChecks(environment: Environment): Observable<CombinedHealthCheck[]> {
    const applications: Application[] = environment.applications;

    return Observable.from(applications)
            .flatMap((application: Application) => this.getHealthChecksResponse(application))
            .flatMap((response: HealthChecksResponse) => response.getUnHealthyChecks())
            .toArray()
            .map((healthChecks: HealthCheck[]) => this.combiner.combine(healthChecks))
            .share();
  }

  private getHealthChecksResponse(application: Application): Observable<HealthChecksResponse> {
    const healthCheckUrl: string = application.healthCheckUrl;

    return this.http.get(healthCheckUrl)
      .timeout(this.httpTimeout)
      .flatMap((response: Response) => this.parseResponse(response, application))
      .catch((error: Response) => this.parseResponse(error, application));
  }

  private parseResponse(response: Response, application: Application): Observable<HealthChecksResponse> {
    return Observable.of(
      this.parser.parseResponse(response, application)
    );
  }
}
