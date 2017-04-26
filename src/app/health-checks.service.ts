import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Subscriber } from 'rxjs';

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

  getHealthChecks(environment: Environment) : Observable<CombinedHealthCheck[]> {
    return new Observable<CombinedHealthCheck[]>(observer => {
      let healthChecks : Map<string, HealthCheck[]> = new Map();

      Observable.from(environment.applications)
        .flatMap(
          (application) => this.getHealthChecksFromApplication(application))
        .finally(
          () => observer.next(combineHealthChecks()))
        .subscribe(
          (healthChecks) => healthChecks.forEach(healthCheck => registerHealthCheck(healthCheck)));
      
      function registerHealthCheck(healthCheck : HealthCheck) : void {
        let name = healthCheck.name;
        if (!healthChecks.has(name))
          healthChecks.set(name, []);
        healthChecks.get(name).push(healthCheck);
      }

      function combineHealthChecks() : CombinedHealthCheck[] {
        let names : string[] = Array.from(healthChecks.keys());

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
      .catch(err => this.mapToUnhealthyOrUnreachable(application, err))
      .share();
  }

  private mapToUnhealthyOrUnreachable(application: Application, error: any) : Observable<Array<HealthCheck>> {
      try {        
        let body : HealthChecksResponse = parseHealthChecksResponse(error.json());
        return Observable.of(this.mapToUnhealthy(application, body));
      } catch(e) {
        return Observable.of(this.mapToUnreachable(application));
      }
  }

  private mapToUnhealthy(application: Application, response: HealthChecksResponse) : HealthCheck[] {
    let names : string[] = Object.keys(response);

    return names
              .filter(name => !response[name]['healthy'])
              .map(name => this.createHealthCheck(application, name, HealthStatus.Unhealthy));
  }

  private mapToUnreachable(application: Application) : HealthCheck[] {
    let healthCheck : HealthCheck = this.createHealthCheck(application, "unreachable", HealthStatus.UnReachable);
    return [healthCheck];
  }

  private createHealthCheck(application: Application, name: string, status: HealthStatus) : HealthCheck {
    return { name: name, application: application, status: status };
  }
}
