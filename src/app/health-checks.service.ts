import { timeout } from 'rxjs/operator/timeout';
import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import { AppSettings } from './app.settings'
import { Application } from './domain/application';
import { Environment } from './domain/environment'
import { HealthStatus } from './domain/health-status'
import { HealthChecksResponse, HealthChecksResponseParser } from './domain/response/health-checks-response';
import { HealthCheck, CombinedHealthCheck, HealthCheckCombiner } from './domain/health-check'

import 'rxjs';

@Injectable()
export class HealthChecksService {

  private timeout: Number = AppSettings.httpTimeout;
  private combiner: HealthCheckCombiner = new HealthCheckCombiner();

  constructor(@Inject(Http) private http) { }

  public getUnHealthyChecks(environment: Environment): Observable<CombinedHealthCheck[]> {
    const applications: Application[] = environment.applications;

    return Observable.from(applications)
            .flatMap((application: Application) => this.getHealthChecksResponse(application))
            .flatMap((response: HealthChecksResponse) => response.getUnHealthyChecks())
            .toArray()
            .map((healthChecks: HealthCheck[]) => this.combiner.combine(healthChecks))
            .share();
  }

  private getHealthChecksResponse(application: Application): Observable<HealthChecksResponse> {
    const parser = new HealthChecksResponseParser(application);
    const healthCheckUrl: string = application.healthCheckUrl;

    return this.http.get(healthCheckUrl)
      .timeout(this.timeout)
      .flatMap((response: Response) => Observable.of(parser.parseResponse(response)))
      .catch((response: Response) => Observable.of(parser.parseResponse(response)));
  }

}
