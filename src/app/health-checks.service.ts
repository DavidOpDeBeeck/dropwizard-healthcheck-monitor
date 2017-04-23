import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Application } from './models/application'
import { Environment } from './models/environment'
import { HealthStatus, toHealthStatus } from './models/health-status'
import { HealthCheck, CombinedHealthCheck, HealthChecksResponse } from './models/health-check'

import 'rxjs';

@Injectable()
export class HealthChecksService {

  constructor(
    @Inject(Http) private http,
  ) { }

  getHealthChecks(environment: Environment) : Observable<Array<CombinedHealthCheck>> {
    return new Observable<Array<CombinedHealthCheck>>(observer => {
        let environmentHealthChecks : Map<string, Array<HealthCheck>> = new Map();

        Observable.from(environment.applications)
          .concatMap(
            (application) => this.getHealthChecksFromApplication(application))
          .finally(
            () => observer.next(combineEnvironmentHealthChecks()))
          .subscribe(
            (healthChecks: Array<HealthCheck>) => registerApplicationHealthChecks(healthChecks));

        function registerApplicationHealthChecks(healthChecks: Array<HealthCheck>) {
          healthChecks.forEach(check => registerApplicationHealthCheck(check));
        }

        function registerApplicationHealthCheck(healthCheck : HealthCheck) {
            if (! environmentHealthChecks.has(healthCheck.name)) {
              environmentHealthChecks.set(healthCheck.name, []);
            } 
            environmentHealthChecks.get(healthCheck.name).push(healthCheck);
        }

        function combineEnvironmentHealthChecks() : Array<CombinedHealthCheck> {
            let combinedHealthChecks: Array<CombinedHealthCheck> = new Array();
            environmentHealthChecks.forEach((healthChecks, name) => {
              combinedHealthChecks.push({
                name: name,
                applications: healthChecks.map((healthCheck) => healthCheck.application),
                status: healthChecks[0].status
              });
            });
            return combinedHealthChecks;
        }
      });
  }

  private getHealthChecksFromApplication(application: Application) : Observable<Array<HealthCheck>> {
    return this.http.get(application.healthCheckUrl)
      .map(res => res.json())
      .map(res => this.mapToUnhealthyChecks(application, res))
      .catch(err => this.mapToUnreachableHealthChecks(application));
  }

  private mapToUnhealthyChecks(application: Application, healthChecksResponse: HealthChecksResponse) : Array<HealthCheck> {
    let healthCheckNames : Array<string> = Object.keys(healthChecksResponse);

    return healthCheckNames
              .filter(name => ! healthChecksResponse[name]['healthy'])
              .map(name => this.createHealthCheck(application, name, HealthStatus.Unhealthy));
  }

  private mapToUnreachableHealthChecks(application: Application) :  Array<Array<HealthCheck>> {
    let healthCheck : HealthCheck = this.createHealthCheck(application, "unreachable", HealthStatus.UnReachable);
    return new Array<Array<HealthCheck>>([healthCheck]);
  }

  private createHealthCheck(application: Application, name: string, status: HealthStatus) : HealthCheck {
    return { application: application, name: name, status: status };
  }
}
