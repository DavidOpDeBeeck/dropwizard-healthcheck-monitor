import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Environment, EnvironmentResponse } from './models/environment'
import { Application } from './models/application'
import { HealthStatus } from './models/health-status'

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class EnvironmentsService {

  constructor(
    @Inject(Http) private http,
  ) { }

  getEnvironments() : Observable<Array<Environment>> {
    return this.http.get("./assets/environments.json")
      .map(res => res.json())
      .map(res => this.mapToEnvironment(res))
      .catch(err => new Array());
  }

  private mapToEnvironment(environmentResponse: EnvironmentResponse): Array<Environment> {
    return Object.keys(environmentResponse)
              .map(name => this.createEnvironment(name, environmentResponse[name]));
  }

  private createEnvironment(name: string, applications: Application[]): Environment {
    return {
      name: name,
      applications: applications
    };
  }

}
