import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Application } from './models/application'
import { Environment } from './models/environment'
import { HealthStatus, toHealthStatus } from './models/health-status'
import { HealthCheck, CombinedHealthCheck, HealthChecksResponse, parseHealthChecksResponse } from './models/health-check'

import 'rxjs';

@Injectable()
export class HealthChecksService {

  constructor(
    @Inject(Http) private http,
  ) { }

  getHealthChecks(environment: Environment) : Observable<Array<CombinedHealthCheck>> {
    return new Observable<Array<CombinedHealthCheck>>(observer => {
        let healthChecks : Map<string, Array<HealthCheck>> = new Map();

        Observable.from(environment.applications)
          .flatMap(
            (application) => this.getHealthChecksFromApplication(application))
          .finally(
            () => observer.next(combineHealthChecks()))
          .subscribe(
            (healthChecks) => healthChecks.forEach(healthCheck => registerHealthCheck(healthCheck)));

        function registerHealthCheck(healthCheck : HealthCheck) {
            let name = healthCheck.name;
            
            if (!healthChecks.has(name)) {
              healthChecks.set(name, []);
            } 
            healthChecks.get(name).push(healthCheck);
        }

        function combineHealthChecks() : Array<CombinedHealthCheck> {
          let names : Array<string> = Array.from(healthChecks.keys());

          return names.map(name => {
            let checks = healthChecks.get(name);
            let applications = checks.map(check => check.application);

            return {
              name: name,
              applications: applications,
              status: checks[0].status
            };
          });
        }
    });
  }

  private getHealthChecksFromApplication(application: Application) : Observable<Array<HealthCheck>> {
    return this.http.get(application.healthCheckUrl)
      .map(res => res.json())
      .map(res => this.mapToUnhealthy(application, res))
      .catch(err => this.mapToUnhealthyOrUnreachable(application, err));
  }

  private mapToUnhealthyOrUnreachable(application: Application, error: any) : Observable<Array<HealthCheck>> {
      try {        
        let body : HealthChecksResponse = parseHealthChecksResponse(error.json());
        return Observable.of(this.mapToUnhealthy(application, body));
      } catch(e) {
        return Observable.of(this.mapToUnreachable(application));
      }
  }

  private mapToUnhealthy(application: Application, healthChecksResponse: HealthChecksResponse) : Array<HealthCheck> {
    let healthCheckNames : Array<string> = Object.keys(healthChecksResponse);

    return healthCheckNames
              .filter(name => !healthChecksResponse[name]['healthy'])
              .map(name => this.createHealthCheck(application, name, HealthStatus.Unhealthy));
  }

  private mapToUnreachable(application: Application) :  Array<HealthCheck> {
    let healthCheck : HealthCheck = this.createHealthCheck(application, "unreachable", HealthStatus.UnReachable);
    return new Array<HealthCheck>(healthCheck);
  }

  private createHealthCheck(application: Application, name: string, status: HealthStatus) : HealthCheck {
    return { name: name, application: application, status: status };
  }
}
