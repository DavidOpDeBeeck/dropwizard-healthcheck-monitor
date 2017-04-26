import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Environment, EnvironmentResponse } from './models/environment'
import { Application } from './models/application'
import { HealthStatus } from './models/health-status'

import 'rxjs';

@Injectable()
export class EnvironmentsService {

  constructor(
    @Inject(Http) private http,
  ) { }

  getEnvironments() : Observable<Environment[]> {
    return this.http.get("./assets/environments.json")
      .map(res => res.json())
      .map(res => this.mapToEnvironment(res))
      .catch(err => Observable.of([]))
      .share();
  }

  private mapToEnvironment(response: EnvironmentResponse): Environment[] {
    let names : string[] = Object.keys(response);
    return names.map(name => this.createEnvironment(name, response[name]));
  }

  private createEnvironment(name: string, applications: Application[]): Environment {
    return { name: name, applications: applications };
  }
}
